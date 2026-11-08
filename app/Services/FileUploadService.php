<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    public static function upload(UploadedFile|string|null $file, string $folder = 'uploads'): ?string
    {
        if (! $file) {
            return null;
        }

        $cloud = config('services.cloudinary.cloud_name');
        $key = config('services.cloudinary.api_key');
        $secret = config('services.cloudinary.api_secret');

        if (! app()->environment('testing') && $cloud && $key && $secret) {
            try {
                $timestamp = time();
                $signature = sha1("folder={$folder}&timestamp={$timestamp}{$secret}");
                $req = Http::timeout(20)->asMultipart();

                if ($file instanceof UploadedFile) {
                    $req->attach('file', fopen($file->getRealPath(), 'r'), $file->getClientOriginalName());
                } else {
                    $req->attach('file', fopen($file, 'r'), basename($file));
                }

                $res = $req->post("https://api.cloudinary.com/v1_1/{$cloud}/image/upload", [
                    'timestamp' => $timestamp,
                    'folder' => $folder,
                    'api_key' => $key,
                    'signature' => $signature,
                ]);

                if ($res->successful() && $res->json('secure_url')) {
                    return $res->json('secure_url');
                }

                Log::warning('Cloudinary upload unsuccessful: '.$res->body());
            } catch (\Throwable $e) {
                Log::warning('Cloudinary upload exception, falling back to local storage: '.$e->getMessage());
            }
        }

        return $file instanceof UploadedFile
            ? $file->store($folder, 'public')
            : Storage::disk('public')->putFile($folder, $file);
    }

    public static function delete(?string $pathOrUrl): bool
    {
        if (! $pathOrUrl) {
            return false;
        }

        if (str_contains($pathOrUrl, 'res.cloudinary.com')) {
            if (preg_match('/\/upload\/(?:v\d+\/)?([^\.]+)/', $pathOrUrl, $matches)) {
                $publicId = $matches[1];
                $timestamp = time();
                $cloud = config('services.cloudinary.cloud_name');
                $key = config('services.cloudinary.api_key');
                $secret = config('services.cloudinary.api_secret');
                $signature = sha1("public_id={$publicId}&timestamp={$timestamp}{$secret}");

                return Http::asForm()->post("https://api.cloudinary.com/v1_1/{$cloud}/image/destroy", [
                    'public_id' => $publicId,
                    'timestamp' => $timestamp,
                    'api_key' => $key,
                    'signature' => $signature,
                ])->successful();
            }

            return false;
        }

        return Storage::disk('public')->exists($pathOrUrl)
            ? Storage::disk('public')->delete($pathOrUrl)
            : false;
    }

    public static function replace(?string $oldPathOrUrl, UploadedFile|string|null $newFile, string $folder = 'uploads'): ?string
    {
        if (! $newFile) {
            return $oldPathOrUrl;
        }

        self::delete($oldPathOrUrl);

        return self::upload($newFile, $folder);
    }
}
