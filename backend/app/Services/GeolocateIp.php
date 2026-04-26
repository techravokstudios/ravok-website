<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeolocateIp
{
    public static function resolve(string $ip): array
    {
        if (in_array($ip, ['127.0.0.1', '::1']) || str_starts_with($ip, '192.168.') || str_starts_with($ip, '10.')) {
            return ['city' => null, 'region' => null, 'country' => null];
        }

        try {
            $response = Http::timeout(3)->get("http://ip-api.com/json/{$ip}", [
                'fields' => 'status,city,regionName,country',
            ]);

            if ($response->successful() && $response->json('status') === 'success') {
                return [
                    'city' => $response->json('city'),
                    'region' => $response->json('regionName'),
                    'country' => $response->json('country'),
                ];
            }
        } catch (\Throwable $e) {
            Log::debug("IP geolocation failed for {$ip}: {$e->getMessage()}");
        }

        return ['city' => null, 'region' => null, 'country' => null];
    }
}
