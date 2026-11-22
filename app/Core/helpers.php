<?php
declare(strict_types=1);

function env(string $key, mixed $default = null): mixed
{
    $value = $_ENV[$key] ?? getenv($key);
    if ($value === false || $value === null || $value === '') {
        return $default;
    }
    return $value;
}

function e(mixed $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function money(mixed $value): string
{
    return 'Rp ' . number_format((float) $value, 0, ',', '.');
}

function num(mixed $value): string
{
    $value = (float) $value;
    if (floor($value) === $value) {
        return number_format($value, 0, ',', '.');
    }
    return rtrim(rtrim(number_format($value, 2, ',', '.'), '0'), ',');
}

function number_if_numeric(mixed $value): string
{
    if ($value === null || $value === '') {
        return '-';
    }
    if (is_numeric($value)) {
        return num($value);
    }
    return (string) $value;
}

function today(): string
{
    return date('Y-m-d');
}

function current_month(): string
{
    return date('Y-m');
}

function entity_configs(): array
{
    static $configs = null;
    if ($configs === null) {
        $configs = require BASE_PATH . '/app/Config/entities.php';
    }
    return $configs;
}

function menu_items(): array
{
    return [
        ['id' => 'dashboard', 'label' => 'Dashboard', 'icon' => '▦'],
        ['id' => 'pakan', 'label' => 'Pengaturan Pakan', 'icon' => '◈'],
        ['id' => 'penggunaan', 'label' => 'Penggunaan Pakan', 'icon' => '↘'],
        ['id' => 'produksi', 'label' => 'Produksi Telur', 'icon' => '🥚'],
        ['id' => 'penjualan', 'label' => 'Penjualan Telur', 'icon' => '↗'],
        ['id' => 'pengeluaran', 'label' => 'Pengeluaran', 'icon' => '▤'],
        ['id' => 'laporan', 'label' => 'Laporan', 'icon' => '▥'],
    ];
}

function menu_path(string $id): string
{
    return $id === 'dashboard' ? '/' : '/' . $id;
}

function current_path(): string
{
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $path = rtrim($path, '/');
    return $path === '' ? '/' : $path;
}
