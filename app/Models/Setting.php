<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;

class Setting
{
    public static function populasi(): int
    {
        $stmt = Database::pdo()->query('SELECT populasi FROM pengaturan WHERE id = 1');
        $value = $stmt->fetchColumn();
        return $value === false ? 0 : (int) $value;
    }

    public static function savePopulasi(int $value): void
    {
        $pdo = Database::pdo();
        $exists = (int) $pdo->query('SELECT COUNT(*) FROM pengaturan WHERE id = 1')->fetchColumn();
        if ($exists > 0) {
            $pdo->prepare('UPDATE pengaturan SET populasi = ?, updated_at = NOW() WHERE id = 1')
                ->execute([$value]);
        } else {
            $pdo->prepare('INSERT INTO pengaturan (id, populasi, updated_at) VALUES (1, ?, NOW())')
                ->execute([$value]);
        }
    }
}
