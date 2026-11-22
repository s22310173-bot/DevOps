<?php
declare(strict_types=1);

namespace App\Core;

class Auth
{
    public static function check(): bool
    {
        return !empty($_SESSION['auth']);
    }

    public static function user(): ?string
    {
        return $_SESSION['auth']['username'] ?? null;
    }

    public static function attempt(string $username, string $password): bool
    {
        $expectedUser = (string) env('ADMIN_USER', 'admin');
        $hash = (string) env('ADMIN_PASSWORD_HASH', '');

        if ($hash === '' || !hash_equals($expectedUser, $username)) {
            return false;
        }
        if (!password_verify($password, $hash)) {
            return false;
        }

        session_regenerate_id(true);
        $_SESSION['auth'] = ['username' => $username];
        return true;
    }

    public static function logout(): void
    {
        unset($_SESSION['auth']);
        session_regenerate_id(true);
    }
}
