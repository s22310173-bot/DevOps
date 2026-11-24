<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Audit;
use App\Core\Controller;
use App\Core\Validator;
use App\Models\EntityModel;

class EntityController extends Controller
{
    private function config(string $entity): array
    {
        $configs = entity_configs();
        if (!isset($configs[$entity])) {
            $this->notFound();
        }
        return $configs[$entity];
    }

    public function index(string $entity): void
    {
        $this->requireAuth();
        $config = $this->config($entity);

        $rows = (new EntityModel($config['table']))->all();
        $search = trim((string) ($_GET['q'] ?? ''));
        if ($search !== '') {
            $needle = mb_strtolower($search);
            $rows = array_values(array_filter($rows, static function (array $row) use ($needle): bool {
                foreach ($row as $value) {
                    if ($value !== null && mb_strpos(mb_strtolower((string) $value), $needle) !== false) {
                        return true;
                    }
                }
                return false;
            }));
        }

        $this->render($entity, $config, $rows, null, [], [], $search);
    }

    public function create(string $entity): void
    {
        $this->requireAuth();
        $config = $this->config($entity);

        $this->render($entity, $config, (new EntityModel($config['table']))->all(), [
            'mode' => 'create',
            'id' => null,
            'data' => ['tanggal' => today()],
        ], [], []);
    }

    public function edit(string $entity, string $id): void
    {
        $this->requireAuth();
        $config = $this->config($entity);

        $row = (new EntityModel($config['table']))->find((int) $id);
        if ($row === null) {
            $this->notFound();
        }

        $this->render($entity, $config, (new EntityModel($config['table']))->all(), [
            'mode' => 'edit',
            'id' => (int) $id,
            'data' => $row,
        ], [], []);
    }

    public function store(string $entity): void
    {
        $this->requireAuth();
        $this->csrfVerify();
        $config = $this->config($entity);

        [$data, $errors] = $this->prepare($config, $_POST, null);

        if ($errors !== []) {
            $this->render($entity, $config, (new EntityModel($config['table']))->all(), [
                'mode' => 'create',
                'id' => null,
                'data' => $_POST,
            ], $errors, $_POST);
            return;
        }

        $newId = (new EntityModel($config['table']))->create($data);
        Audit::log('create', $entity . '#' . $newId);
        $_SESSION['_flash_success'] = 'Data berhasil disimpan.';
        $this->redirect('/' . $entity);
    }

    public function update(string $entity, string $id): void
    {
        $this->requireAuth();
        $this->csrfVerify();
        $config = $this->config($entity);

        $model = new EntityModel($config['table']);
        $row = $model->find((int) $id);
        if ($row === null) {
            $this->notFound();
        }

        [$data, $errors] = $this->prepare($config, $_POST, (int) $id);

        if ($errors !== []) {
            $this->render($entity, $config, $model->all(), [
                'mode' => 'edit',
                'id' => (int) $id,
                'data' => $_POST,
            ], $errors, $_POST);
            return;
        }

        $model->update((int) $id, $data);
        Audit::log('update', $entity . '#' . (int) $id);
        $_SESSION['_flash_success'] = 'Data berhasil diperbarui.';
        $this->redirect('/' . $entity);
    }

    public function destroy(string $entity, string $id): void
    {
        $this->requireAuth();
        $this->csrfVerify();
        $config = $this->config($entity);

        $deleted = (new EntityModel($config['table']))->softDelete((int) $id);
        if ($deleted) {
            Audit::log('delete', $entity . '#' . (int) $id);
            $_SESSION['_flash_success'] = 'Data berhasil dihapus.';
        } else {
            $_SESSION['_flash_error'] = 'Data tidak ditemukan atau sudah dihapus.';
        }
        $this->redirect('/' . $entity);
    }

    private function prepare(array $config, array $input, ?int $id): array
    {
        $rules = [];
        $labels = [];
        foreach ($config['fields'] as $field) {
            $rules[$field['name']] = $field['rules'] ?? [];
            $labels[$field['name']] = $field['label'];
        }

        $errors = Validator::validate($input, $rules, $labels);

        if (($config['cross'] ?? null) === 'produksi' && !isset($errors['rusak'])) {
            $jumlah = (int) ($input['jumlah'] ?? 0);
            $rusak = (int) ($input['rusak'] ?? 0);
            if ($rusak > $jumlah) {
                $errors['rusak'] = 'Telur rusak tidak boleh melebihi total produksi';
            }
        }

        if (!empty($config['unique_date']) && !isset($errors['tanggal'])) {
            $date = (string) ($input['tanggal'] ?? '');
            if ((new EntityModel($config['table']))->existsDate($date, $id)) {
                $errors['tanggal'] = 'Produksi untuk tanggal ini sudah ada. Edit catatan tersebut.';
            }
        }

        $data = [];
        foreach ($config['fields'] as $field) {
            $name = $field['name'];
            $value = $input[$name] ?? null;
            if (is_string($value)) {
                $value = trim($value);
            }
            if ($value === '' || $value === null) {
                $data[$name] = !empty($field['nullable']) ? ($field['default'] ?? null) : null;
            } else {
                $data[$name] = $value;
            }
        }

        return [$data, $errors];
    }

    private function render(
        string $entity,
        array $config,
        array $rows,
        ?array $form,
        array $errors,
        array $old,
        string $search = ''
    ): void {
        $this->view('entities/index', [
            'title' => $config['title'],
            'description' => $config['description'],
            'entity' => $entity,
            'config' => $config,
            'rows' => $rows,
            'search' => $search,
            'form' => $form,
            'errors' => $errors,
            'old' => $old,
            'flash' => $this->takeFlash(),
        ]);
    }
}
