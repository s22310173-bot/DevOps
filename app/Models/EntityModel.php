<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;

class EntityModel
{
    public function __construct(private string $table)
    {
    }

    public function all(): array
    {
        $sql = "SELECT * FROM {$this->table} WHERE deleted_at IS NULL ORDER BY tanggal DESC, id DESC";
        return Database::pdo()->query($sql)->fetchAll();
    }

    public function find(int $id): ?array
    {
        $stmt = Database::pdo()->prepare(
            "SELECT * FROM {$this->table} WHERE id = ? AND deleted_at IS NULL"
        );
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(array $data): int
    {
        $columns = array_keys($data);
        $placeholders = array_fill(0, count($columns), '?');
        $sql = "INSERT INTO {$this->table} (" . implode(', ', $columns) . ", created_at, updated_at)"
            . ' VALUES (' . implode(', ', $placeholders) . ', NOW(), NOW())';
        $pdo = Database::pdo();
        $pdo->prepare($sql)->execute(array_values($data));
        return (int) $pdo->lastInsertId();
    }

    public function update(int $id, array $data): void
    {
        $assignments = implode(', ', array_map(
            static fn (string $column): string => "{$column} = ?",
            array_keys($data)
        ));
        $sql = "UPDATE {$this->table} SET {$assignments}, updated_at = NOW()"
            . ' WHERE id = ? AND deleted_at IS NULL';
        $params = array_values($data);
        $params[] = $id;
        Database::pdo()->prepare($sql)->execute($params);
    }

    public function softDelete(int $id): bool
    {
        $stmt = Database::pdo()->prepare(
            "UPDATE {$this->table} SET deleted_at = NOW(), updated_at = NOW()"
            . ' WHERE id = ? AND deleted_at IS NULL'
        );
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    public function existsDate(string $date, ?int $exceptId = null): bool
    {
        $sql = "SELECT COUNT(*) FROM {$this->table} WHERE tanggal = ? AND deleted_at IS NULL";
        $params = [$date];
        if ($exceptId !== null) {
            $sql .= ' AND id <> ?';
            $params[] = $exceptId;
        }
        $stmt = Database::pdo()->prepare($sql);
        $stmt->execute($params);
        return (int) $stmt->fetchColumn() > 0;
    }
}
