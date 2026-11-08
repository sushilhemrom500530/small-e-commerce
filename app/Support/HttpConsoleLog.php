<?php

namespace App\Support;

/**
 * Bridge between HTTP middleware and `php artisan serve` console output.
 * PHP's built-in server on Windows runs in a separate child process where stdout
 * can lose ANSI formatting. We persist rich request records here in a fast ndjson file
 * so the parent ServeCommand process can print them in full decorated terminal colors.
 */
class HttpConsoleLog
{
    public static function path(): string
    {
        return storage_path('logs/http-console.ndjson');
    }

    /**
     * Write a request log record.
     *
     * @param  array<string, mixed>  $record
     */
    public static function write(array $record): void
    {
        $dir = dirname(self::path());
        if (! is_dir($dir)) {
            @mkdir($dir, 0775, true);
        }

        $record['id'] = $record['id'] ?? (string) microtime(true);
        $line = json_encode($record, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        if ($line === false) {
            return;
        }

        @file_put_contents(self::path(), $line.PHP_EOL, FILE_APPEND | LOCK_EX);
    }

    /**
     * Pull all unread records in FIFO order and clear the file.
     *
     * @return array<int, array<string, mixed>>
     */
    public static function pullAll(): array
    {
        $path = self::path();
        if (! is_file($path)) {
            return [];
        }

        $handle = @fopen($path, 'c+');
        if (! $handle) {
            return [];
        }

        if (! @flock($handle, LOCK_EX)) {
            @fclose($handle);

            return [];
        }

        $content = stream_get_contents($handle);
        if ($content === false || trim($content) === '') {
            @flock($handle, LOCK_UN);
            @fclose($handle);

            return [];
        }

        ftruncate($handle, 0);
        rewind($handle);
        fflush($handle);
        @flock($handle, LOCK_UN);
        @fclose($handle);

        $records = [];
        $lines = explode(PHP_EOL, $content);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }
            $decoded = json_decode($line, true);
            if (is_array($decoded)) {
                $records[] = $decoded;
            }
        }

        return $records;
    }

    /**
     * Pop the oldest unread record (FIFO order).
     *
     * @return array<string, mixed>|null
     */
    public static function pullLatest(): ?array
    {
        $path = self::path();
        if (! is_file($path)) {
            return null;
        }

        $lines = @file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (! is_array($lines) || $lines === []) {
            return null;
        }

        $first = array_shift($lines);
        @file_put_contents($path, $lines === [] ? '' : implode(PHP_EOL, $lines).PHP_EOL, LOCK_EX);

        $decoded = json_decode((string) $first, true);

        return is_array($decoded) ? $decoded : null;
    }
}
