<?php

namespace App\Console\Commands;

use App\Support\HttpConsoleLog;
use Illuminate\Foundation\Console\ServeCommand as BaseServeCommand;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Formatter\OutputFormatter;

/**
 * Enhanced `php artisan serve` with decorated, colored HTTP request logging.
 */
#[AsCommand(name: 'serve', description: 'Serve the application on the PHP development server with decorated colored logs')]
class ServeCommand extends BaseServeCommand
{
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Serve the application on the PHP development server with decorated colored logs';

    private ?string $lastPrintedId = null;

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // 1. Force terminal color support across Windows & Symfony console
        putenv('FORCE_COLOR=1');
        $_ENV['FORCE_COLOR'] = '1';
        $_SERVER['FORCE_COLOR'] = '1';

        // 2. Enable Windows VT100 virtual terminal processing for native ANSI color rendering
        if (function_exists('sapi_windows_vt100_support')) {
            @sapi_windows_vt100_support(STDOUT, true);
            @sapi_windows_vt100_support(STDERR, true);
        }

        // 3. Ensure console output is set to decorated mode
        if ($this->output) {
            $this->output->setDecorated(true);
            if (method_exists($this->output, 'getOutput')) {
                $this->output->getOutput()->setDecorated(true);
            }
        }

        $workers = max(
            1,
            (int) env('SERVE_WORKERS', env('PHP_CLI_SERVER_WORKERS', 1))
        );

        if ($workers > 1 && function_exists('pcntl_fork')) {
            putenv('PHP_CLI_SERVER_WORKERS='.$workers);
            $_ENV['PHP_CLI_SERVER_WORKERS'] = (string) $workers;
            $_SERVER['PHP_CLI_SERVER_WORKERS'] = (string) $workers;
            $this->components->info("Starting PHP CLI server with {$workers} workers (pcntl).");
        }

        $environmentFile = $this->option('env')
            ? base_path('.env').'.'.$this->option('env')
            : base_path('.env');

        $hasEnvironment = file_exists($environmentFile);

        $environmentLastModified = $hasEnvironment
            ? filemtime($environmentFile)
            : now()->addDays(30)->getTimestamp();

        $process = $this->startProcess($hasEnvironment);

        while ($process->isRunning()) {
            if ($hasEnvironment) {
                clearstatcache(false, $environmentFile);
            }

            if (
                ! $this->option('no-reload') &&
                $hasEnvironment &&
                filemtime($environmentFile) > $environmentLastModified
            ) {
                $environmentLastModified = filemtime($environmentFile);

                $this->newLine();
                $this->components->info('Environment modified. Restarting server...');
                $process->stop(5);
                $this->serverRunningHasBeenDisplayed = false;
                $process = $this->startProcess($hasEnvironment);
            }

            $this->drainBridgeLogs();
            usleep(100 * 1000);
        }

        $status = $process->getExitCode();
        if ($status !== 0) {
            $this->components->error('Server failed to start.');
        }

        return $status ?? 0;
    }

    /**
     * Drain and print all buffered HTTP log entries in FIFO order.
     */
    private function drainBridgeLogs(): void
    {
        foreach (HttpConsoleLog::pullAll() as $record) {
            $this->printFromRecord($record);
        }
    }

    /**
     * Hook into the server process output stream.
     *
     * @return callable(string, string): void
     */
    protected function handleProcessOutput()
    {
        return fn ($type, $buffer) => str($buffer)->explode("\n")->each(function ($line) {
            $line = rtrim((string) $line);
            if ($line === '') {
                return;
            }

            if (str($line)->contains('Development Server (http')) {
                if ($this->serverRunningHasBeenDisplayed) {
                    return;
                }

                $host = $this->host();
                $displayHost = ($host === '0.0.0.0') ? '127.0.0.1' : $host;
                $this->components->info("Server running on [http://{$displayHost}:{$this->port()}].");
                $this->comment('  <fg=yellow;options=bold>Press Ctrl+C to stop the server</>');
                $this->newLine();
                $this->serverRunningHasBeenDisplayed = true;

                return;
            }

            if (str($line)->contains(' Accepted')) {
                try {
                    $requestPort = $this->getRequestPortFromLine($line);
                    $this->requestsPool[$requestPort] = [
                        $this->getDateFromLine($line),
                        true,
                    ];
                } catch (\Throwable) {
                    // ignore malformed Accepted lines
                }

                $this->drainBridgeLogs();

                return;
            }

            if (str($line)->contains(' Closing')) {
                try {
                    unset($this->requestsPool[$this->getRequestPortFromLine($line)]);
                } catch (\Throwable) {
                    // ignore
                }

                $this->drainBridgeLogs();

                return;
            }

            if (str($line)->contains(['Closed without sending a request', 'Failed to poll event', 'favicon.ico'])) {
                return;
            }

            $this->drainBridgeLogs();

            if (str_contains($line, '❌ ERROR')) {
                $this->output->writeln('  '.$line);
            }
        });
    }

    /**
     * Get the host for the command.
     *
     * @return string
     */
    protected function host()
    {
        return $this->option('host') ?? env('SERVER_HOST', '0.0.0.0');
    }

    /**
     * Get the port for the command.
     *
     * @return string
     */
    protected function port()
    {
        return $this->option('port') ?? (string) env('SERVER_PORT', '1100');
    }

    /**
     * Format and print a request log record with rich ANSI colors.
     *
     * @param  array<string, mixed>  $record
     */
    private function printFromRecord(array $record): void
    {
        $id = isset($record['id']) ? (string) $record['id'] : null;
        if ($id !== null && $id === $this->lastPrintedId) {
            return;
        }
        if ($id !== null) {
            $this->lastPrintedId = $id;
        }

        if (function_exists('sapi_windows_vt100_support')) {
            @sapi_windows_vt100_support(STDOUT, true);
            @sapi_windows_vt100_support(STDERR, true);
        }

        if ($this->output && ! $this->output->isDecorated()) {
            $this->output->setDecorated(true);
            if (method_exists($this->output, 'getOutput')) {
                $this->output->getOutput()->setDecorated(true);
            }
        }

        $format = config('request-logger.format', env('REQUEST_LOGGER_FORMAT', 'nestjs'));

        if ($format === 'badge') {
            $this->printBadgeRecord($record);
        } elseif ($format === 'both') {
            $this->printBadgeRecord($record);
            $this->printNestJsRecord($record, true);
        } else {
            // Default: 'nestjs' - Exactly matching the requested terminal colored reference
            $this->printNestJsRecord($record);
        }

        $this->printProblemDiagnostics($record);
    }

    /**
     * Print the modern decorated badge line.
     *
     * @param  array<string, mixed>  $record
     */
    private function printBadgeRecord(array $record): void
    {
        $date = (string) ($record['date'] ?? ($record['timestamp'] ?? now()->format('Y-m-d H:i:s')));
        $method = strtoupper((string) ($record['method'] ?? 'GET'));
        $path = (string) ($record['path'] ?? '/');
        $status = (int) ($record['status'] ?? 200);
        $statusText = strtoupper((string) ($record['status_text'] ?? 'OK'));
        $durationMs = (float) ($record['duration_ms'] ?? 0.0);
        $client = (string) ($record['client'] ?? 'Unknown Client');
        $ip = (string) ($record['ip'] ?? '127.0.0.1');
        $user = ! empty($record['user']) ? (string) $record['user'] : null;
        $msFormatted = number_format($durationMs, 2, '.', '');

        $noColor = (bool) (getenv('NO_COLOR') ?: ($_SERVER['NO_COLOR'] ?? false));
        $useColor = (bool) config('request-logger.colors', true) && ! $noColor;

        if (! $useColor) {
            $userPart = $user ? " ({$user})" : '';
            $this->output->writeln(" {$date}  {$method} {$path}  {$status} {$statusText}  ~ {$msFormatted}ms  [{$client}]  {$ip}{$userPart}");

            return;
        }

        // 1. Date: Dim/Gray
        $datePart = "<fg=gray>{$date}</>";

        // 2. HTTP Method Badge (padded to 8 chars: '  GET   ', '  POST  ', '  PUT   ', ' PATCH  ', ' DELETE ')
        $methodBadge = match ($method) {
            'GET' => '<fg=black;bg=cyan;options=bold>  GET   </>',
            'POST' => '<fg=black;bg=green;options=bold>  POST  </>',
            'PUT' => '<fg=black;bg=yellow;options=bold>  PUT   </>',
            'PATCH' => '<fg=black;bg=yellow;options=bold> PATCH  </>',
            'DELETE' => '<fg=white;bg=red;options=bold> DELETE </>',
            default => "<fg=white;bg=default;options=bold>  {$method}  </>",
        };

        // 3. Request Path: Bright White Bold
        $pathPart = '<fg=white;options=bold>'.OutputFormatter::escape($path).'</>';

        // 4. HTTP Status Badge
        $statusBadge = match (true) {
            $status >= 200 && $status < 300 => "<fg=black;bg=green;options=bold> {$status} {$statusText} </>",
            $status >= 300 && $status < 400 => "<fg=black;bg=cyan;options=bold> {$status} {$statusText} </>",
            $status >= 400 && $status < 500 => "<fg=black;bg=yellow;options=bold> {$status} {$statusText} </>",
            $status >= 500 => "<fg=white;bg=red;options=bold> {$status} {$statusText} </>",
            default => "<fg=white;bg=default;options=bold> {$status} {$statusText} </>",
        };

        // 5. Latency Badge
        $durationBadge = match (true) {
            $durationMs < 100 => "<fg=green;options=bold>~ {$msFormatted}ms</>",
            $durationMs < 500 => "<fg=yellow;options=bold>~ {$msFormatted}ms</>",
            default => "<fg=red;options=bold>~ {$msFormatted}ms</>",
        };

        // 6. Client User Agent Badge
        $clientBadge = '<fg=magenta;options=bold>['.OutputFormatter::escape($client).']</>';

        // 7. IP Address
        $ipBadge = "<fg=cyan>{$ip}</>";

        // 8. User (if authenticated)
        $userPart = $user ? ' <fg=blue;options=bold>('.OutputFormatter::escape($user).')</>' : '';

        $this->output->writeln(" {$datePart}  {$methodBadge} {$pathPart}  {$statusBadge}  {$durationBadge}  {$clientBadge}  {$ipBadge}{$userPart}");
    }

    /**
     * Print classic NestJS-style access or info line matching reference screenshot.
     *
     * @param  array<string, mixed>  $record
     */
    private function printNestJsRecord(array $record, bool $infoOnly = false): void
    {
        $method = strtoupper((string) ($record['method'] ?? 'REQ'));
        $path = (string) ($record['path'] ?? '/');
        $status = (int) ($record['status'] ?? 0);
        $durationMs = (float) ($record['duration_ms'] ?? 0.0);
        $ms = number_format($durationMs, 3, '.', '');
        $size = $record['size'] ?? 0;
        $timestamp = (string) ($record['timestamp'] ?? ($record['date'] ?? now()->format('Y-m-d H:i:s')));
        $statusLabel = $status > 0 ? (string) $status : '---';
        $client = (string) ($record['client'] ?? 'Unknown Client');
        $browser = (string) ($record['browser'] ?? '');
        $device = (string) ($record['device'] ?? '');
        $platform = (string) ($record['platform'] ?? '');
        $ip = (string) ($record['ip'] ?? '127.0.0.1');
        $user = ! empty($record['user']) ? (string) $record['user'] : null;

        $clientDisplay = $client;
        if (
            ! in_array($browser, ['Postman', 'Insomnia', 'Thunder Client', 'cURL', 'HTTPie'], true)
            && $device !== ''
            && $device !== 'Unknown'
            && ! str_contains($clientDisplay, $device)
        ) {
            $clientDisplay .= " • {$device}";
        }

        $noColor = (bool) (getenv('NO_COLOR') ?: ($_SERVER['NO_COLOR'] ?? false));
        $useColor = (bool) config('request-logger.colors', true) && ! $noColor;

        if (! $infoOnly) {
            $access = sprintf('%s %s %s %s ms - -', $method, $path, $statusLabel, $ms);
            if ($useColor) {
                $colorTag = match (true) {
                    $status >= 500 || ! empty($record['is_login_page']) => 'red',
                    $status >= 400 => 'yellow',
                    default => 'green',
                };
                $clientBadge = '<fg=magenta;options=bold>['.OutputFormatter::escape($clientDisplay).']</>';
                $ipBadge = "<fg=cyan>{$ip}</>";
                $userBadge = $user ? ' <fg=blue;options=bold>('.OutputFormatter::escape($user).')</>' : '';

                $this->output->writeln("  <fg={$colorTag}>".OutputFormatter::escape($access)."</>  {$clientBadge}  {$ipBadge}{$userBadge}");
            } else {
                $userPart = $user ? " ({$user})" : '';
                $this->output->writeln("  {$access}  [{$clientDisplay}]  {$ip}{$userPart}");
            }
        }

        $meta = [
            'ip' => $ip,
            'browser' => $browser ?: $client,
            'device' => $device ?: 'Desktop',
            'platform' => $platform ?: 'Unknown',
            'size' => $size,
            'timestamp' => $timestamp,
        ];
        if ($user) {
            $meta['user'] = $user;
        }

        $info = sprintf(
            'info: Incoming Request %s %s %s %d ms %s',
            $method,
            $statusLabel,
            $path,
            (int) round($durationMs),
            json_encode($meta, JSON_UNESCAPED_SLASHES)
        );

        if ($useColor) {
            $this->output->writeln('  <fg=gray>'.OutputFormatter::escape($info).'</>');
        } else {
            $this->output->writeln("  {$info}");
        }
    }

    /**
     * Print error diagnostics if request encountered an error or exception.
     *
     * @param  array<string, mixed>  $record
     */
    private function printProblemDiagnostics(array $record): void
    {
        $status = (int) ($record['status'] ?? 200);
        $statusText = strtoupper((string) ($record['status_text'] ?? 'ERROR'));
        $isProblem = $status >= 400
            || ! empty($record['is_login_page'])
            || ! empty($record['exception']);

        if (! $isProblem) {
            return;
        }

        $method = strtoupper((string) ($record['method'] ?? 'GET'));
        $path = (string) ($record['path'] ?? '/');
        $durationMs = (float) ($record['duration_ms'] ?? 0.0);

        $payload = [
            'name' => $record['exception'] ?? 'Error',
            'message' => $record['message'] ?? 'Request failed',
            'statusCode' => $status,
            'path' => parse_url($path, PHP_URL_PATH) ?: $path,
            'method' => $method,
            'duration_ms' => $durationMs,
        ];

        if (! empty($record['cause'])) {
            $payload['cause'] = $record['cause'];
        }
        if (! empty($record['sql'])) {
            $payload['sql'] = $record['sql'];
        }
        if (! empty($record['errors'])) {
            $payload['errors'] = $record['errors'];
        }
        if (! empty($record['is_login_page'])) {
            $payload['responseType'] = 'html-login-page';
        }
        if (! empty($record['stack'])) {
            $payload['stack'] = $record['stack'];
        }

        $noColor = (bool) (getenv('NO_COLOR') ?: ($_SERVER['NO_COLOR'] ?? false));
        $useColor = (bool) config('request-logger.colors', true) && ! $noColor;

        if ($useColor) {
            $this->output->writeln("  <fg=red;options=bold>❌ ERROR: {$status} {$statusText}</>");
        } else {
            $this->output->writeln("  ❌ ERROR: {$status} {$statusText}");
        }

        $jsonLines = explode("\n", json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) ?: '{}');
        foreach ($jsonLines as $jsonLine) {
            if ($useColor) {
                $this->output->writeln('  <fg=red>'.OutputFormatter::escape($jsonLine).'</>');
            } else {
                $this->output->writeln("  {$jsonLine}");
            }
        }
    }
}
