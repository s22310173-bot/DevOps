<?php
declare(strict_types=1);

namespace App\Core;

class Validator
{
    /**
     * @return array<string,string> errors keyed by field
     */
    public static function validate(array $data, array $rules, array $labels = []): array
    {
        $errors = [];

        foreach ($rules as $field => $ruleList) {
            $value = $data[$field] ?? null;
            $label = $labels[$field] ?? $field;

            foreach ($ruleList as $rule) {
                [$name, $arg] = array_pad(explode(':', (string) $rule, 2), 2, null);
                $message = null;

                switch ($name) {
                    case 'required':
                        if ($value === null || (is_string($value) && trim($value) === '')) {
                            $message = "{$label} wajib diisi";
                        }
                        break;
                    case 'date':
                        if ($value !== null && $value !== '' && !self::validDate((string) $value)) {
                            $message = 'Tanggal tidak valid';
                        }
                        break;
                    case 'number':
                        if ($value !== null && $value !== '' && !is_numeric($value)) {
                            $message = "{$label} harus berupa angka";
                        }
                        break;
                    case 'int':
                        if ($value !== null && $value !== '' && filter_var($value, FILTER_VALIDATE_INT) === false) {
                            $message = "{$label} harus bilangan bulat";
                        }
                        break;
                    case 'positive':
                        if ($value !== null && $value !== '' && is_numeric($value) && (float) $value <= 0) {
                            $message = "{$label} harus lebih dari 0";
                        }
                        break;
                    case 'min':
                        if ($value !== null && $value !== '' && is_numeric($value) && (float) $value < (float) $arg) {
                            $message = "{$label} tidak boleh kurang dari {$arg}";
                        }
                        break;
                    case 'maxlen':
                        if ($value !== null && mb_strlen((string) $value) > (int) $arg) {
                            $message = "{$label} maksimal {$arg} karakter";
                        }
                        break;
                }

                if ($message !== null) {
                    $errors[$field] = $message;
                    break;
                }
            }
        }

        return $errors;
    }

    private static function validDate(string $value): bool
    {
        $date = \DateTime::createFromFormat('Y-m-d', $value);
        return $date !== false && $date->format('Y-m-d') === $value;
    }
}
