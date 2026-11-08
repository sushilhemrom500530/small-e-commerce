<?php

namespace App\Support;

class ClientDetector
{
    /**
     * Parse a user agent string to detect client software, device, and platform.
     *
     * @return array{browser: string, platform: string, device: string, display: string}
     */
    public static function detect(?string $userAgent): array
    {
        if (empty($userAgent)) {
            return [
                'browser' => 'Unknown',
                'platform' => 'Unknown',
                'device' => 'Unknown',
                'display' => 'Unknown Client',
            ];
        }

        $platform = self::detectPlatform($userAgent);
        $device = self::detectDevice($userAgent);
        $browser = self::detectBrowser($userAgent);

        $display = self::buildDisplayString($browser, $platform, $device);

        return [
            'browser' => $browser,
            'platform' => $platform,
            'device' => $device,
            'display' => $display,
        ];
    }

    /**
     * Detect the operating system or environment platform.
     */
    protected static function detectPlatform(string $userAgent): string
    {
        if (stripos($userAgent, 'iPhone') !== false || stripos($userAgent, 'iPad') !== false || stripos($userAgent, 'iPod') !== false) {
            return 'iOS';
        }

        if (stripos($userAgent, 'Android') !== false) {
            return 'Android';
        }

        if (stripos($userAgent, 'Windows') !== false) {
            return 'Windows';
        }

        if (stripos($userAgent, 'Macintosh') !== false || stripos($userAgent, 'Mac OS') !== false) {
            return 'macOS';
        }

        if (stripos($userAgent, 'Linux') !== false) {
            return 'Linux';
        }

        return 'Unknown';
    }

    /**
     * Detect the physical hardware or form-factor device.
     */
    protected static function detectDevice(string $userAgent): string
    {
        if (stripos($userAgent, 'iPhone') !== false) {
            return 'iPhone';
        }

        if (stripos($userAgent, 'iPad') !== false) {
            return 'iPad';
        }

        if (stripos($userAgent, 'Android') !== false) {
            return stripos($userAgent, 'Mobile') !== false ? 'Android Mobile' : 'Android Tablet';
        }

        return 'Desktop';
    }

    /**
     * Detect the browser or HTTP client application.
     */
    protected static function detectBrowser(string $userAgent): string
    {
        if (stripos($userAgent, 'PostmanRuntime') !== false) {
            return 'Postman';
        }

        if (stripos($userAgent, 'insomnia') !== false) {
            return 'Insomnia';
        }

        if (stripos($userAgent, 'Thunder Client') !== false) {
            return 'Thunder Client';
        }

        if (stripos($userAgent, 'curl') !== false) {
            return 'cURL';
        }

        if (stripos($userAgent, 'HTTPie') !== false) {
            return 'HTTPie';
        }

        if (stripos($userAgent, 'Edg/') !== false || stripos($userAgent, 'Edge/') !== false) {
            return 'Edge';
        }

        if (stripos($userAgent, 'OPR/') !== false || stripos($userAgent, 'Opera') !== false) {
            return 'Opera';
        }

        if (stripos($userAgent, 'Brave') !== false) {
            return 'Brave';
        }

        if (stripos($userAgent, 'Chrome') !== false || stripos($userAgent, 'CriOS') !== false) {
            return 'Chrome';
        }

        if (stripos($userAgent, 'Safari') !== false && stripos($userAgent, 'Chrome') === false && stripos($userAgent, 'CriOS') === false) {
            return 'Safari';
        }

        if (stripos($userAgent, 'Firefox') !== false || stripos($userAgent, 'FxiOS') !== false) {
            return 'Firefox';
        }

        return 'Unknown';
    }

    /**
     * Build a concise and readable client display badge.
     */
    protected static function buildDisplayString(string $browser, string $platform, string $device): string
    {
        if (in_array($browser, ['Postman', 'Insomnia', 'Thunder Client', 'cURL', 'HTTPie'], true)) {
            return $browser;
        }

        $targetPlatform = in_array($device, ['iPhone', 'iPad'], true) ? $device : $platform;

        if ($browser !== 'Unknown' && $targetPlatform !== 'Unknown') {
            return "{$browser} • {$targetPlatform}";
        }

        if ($browser !== 'Unknown') {
            return $browser;
        }

        if ($targetPlatform !== 'Unknown') {
            return $targetPlatform;
        }

        return 'Unknown Client';
    }
}
