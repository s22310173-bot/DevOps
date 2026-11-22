<?php
$isEdit = ($form['mode'] ?? '') === 'edit';
$action = $isEdit ? '/' . $entity . '/' . (int) $form['id'] : '/' . $entity;
$dataFields = array_values(array_filter($config['fields'], static fn ($f) => $f['name'] !== 'tanggal'));
$columnFields = array_values(array_filter($config['fields'], static fn ($f) => $f['name'] !== 'tanggal'));
?>
<div class="page-heading d-flex flex-wrap justify-content-between align-items-start gap-3">
    <div>
        <h1><?= e($config['title']) ?></h1>
        <p><?= e($config['description']) ?></p>
    </div>
</div>

<?php if ($form !== null): ?>
    <div class="form-card">
        <h3 class="h5 fw-bold mb-3"><?= $isEdit ? 'Edit Data' : 'Tambah Data Baru' ?></h3>
        <form method="post" action="<?= e($action) ?>">
            <?= App\Core\Csrf::field() ?>
            <div class="row g-3">
                <?php foreach ($config['fields'] as $field): ?>
                    <?php
                    $name = $field['name'];
                    $value = $old[$name] ?? ($form['data'][$name] ?? '');
                    if ($value === null) {
                        $value = '';
                    }
                    $invalid = isset($errors[$name]);
                    $type = $field['type'] ?? 'text';
                    ?>
                    <div class="col-12 col-md-6">
                        <label class="form-label" for="f-<?= e($name) ?>"><?= e($field['label']) ?></label>
                        <input
                            class="form-control<?= $invalid ? ' is-invalid' : '' ?>"
                            type="<?= e($type) ?>"
                            id="f-<?= e($name) ?>"
                            name="<?= e($name) ?>"
                            value="<?= e($value) ?>"
                            placeholder="<?= e($field['placeholder'] ?? '') ?>"
                            <?= $type === 'number' ? 'step="' . e($field['step'] ?? 'any') . '" min="0"' : '' ?>
                            <?= !empty($field['nullable']) ? '' : 'required' ?>
                        >
                        <?php if ($invalid): ?>
                            <div class="invalid-feedback"><?= e($errors[$name]) ?></div>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
            <div class="d-flex gap-2 mt-4">
                <a class="btn btn-outline-secondary" href="/<?= e($entity) ?>">Batal</a>
                <button type="submit" class="btn btn-success">Simpan Data</button>
            </div>
        </form>
    </div>
<?php endif; ?>

<div class="panel">
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
            <h2>Daftar Data</h2>
            <p class="muted mb-0"><?= count($rows) ?> data ditemukan</p>
        </div>
        <div class="d-flex flex-wrap gap-2">
            <form method="get" action="/<?= e($entity) ?>" class="d-flex gap-2">
                <input class="form-control form-control-sm" type="search" name="q"
                       placeholder="Cari data..." value="<?= e($search) ?>">
                <button type="submit" class="btn btn-sm btn-outline-secondary">Cari</button>
            </form>
            <a class="btn btn-success btn-sm" href="/<?= e($entity) ?>/create">＋ Tambah Data</a>
        </div>
    </div>

    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead>
            <tr>
                <th>Tanggal</th>
                <?php foreach ($columnFields as $field): ?>
                    <th><?= e($field['label']) ?></th>
                <?php endforeach; ?>
                <th class="text-end">Aksi</th>
            </tr>
            </thead>
            <tbody>
            <?php if ($rows === []): ?>
                <tr>
                    <td colspan="<?= count($columnFields) + 2 ?>" class="empty-state">
                        Belum ada data. Klik “Tambah Data” untuk mulai mencatat.
                    </td>
                </tr>
            <?php else: ?>
                <?php foreach ($rows as $row): ?>
                    <tr>
                        <td><?= e($row['tanggal'] ?? '-') ?></td>
                        <?php foreach ($columnFields as $field): ?>
                            <?php $cell = $row[$field['name']] ?? null; ?>
                            <td>
                                <?php if (($field['format'] ?? '') === 'money'): ?>
                                    <?= e(money((float) $cell)) ?>
                                <?php else: ?>
                                    <?= e(number_if_numeric($cell)) ?>
                                <?php endif; ?>
                            </td>
                        <?php endforeach; ?>
                        <td class="text-end">
                            <div class="d-inline-flex gap-1">
                                <a class="btn btn-sm btn-outline-primary" href="/<?= e($entity) ?>/<?= (int) $row['id'] ?>/edit">Edit</a>
                                <form method="post" action="/<?= e($entity) ?>/<?= (int) $row['id'] ?>/delete"
                                      class="m-0" data-confirm="Yakin ingin menghapus data ini?">
                                    <?= App\Core\Csrf::field() ?>
                                    <button type="submit" class="btn btn-sm btn-outline-danger">Hapus</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
            </tbody>
        </table>
    </div>
    <div class="small text-muted mt-3">Data disimpan di database · <?= count($rows) ?> catatan</div>
</div>
