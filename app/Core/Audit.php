<?php
declare(strict_types=1);

namespace App\Core;

class Audit
{
    public static function log(string $action, string $resource, ?string $userId = null): void
    {
        $entry = [
            'timestamp' => date('c'),
            'action' => $action,
            'resource' => $resource,
            'user_id' => $userId ?? (Auth::user() ?? 'anonymous'),
            'ip' => $_SERVER['REMOTE_ADDR'] ?? '-',
        ];

        $line = json_encode($entry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($line === false) {
            return;
        }

        $dir = (string) env('LOG_DIR', BASE_PATH . '/storage/logs');
        if (!is_dir($dir)) {
            @mkdir($dir, 0750, true);
        }

        @file_put_contents($dir . '/audit.log', $line . PHP_EOL, FILE_APPEND | LOCK_EX);
    }
}
