<?php $path = current_path(); ?>
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e($title ?? 'FarmCare') ?> — FarmCare</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="/assets/css/app.css" rel="stylesheet">
</head>
<body>
<div class="app-shell">
    <aside class="sidebar">
        <div class="brand">
            FarmCare
            <small>Operasional Peternakan</small>
        </div>
        <nav class="nav flex-column pb-3">
            <?php foreach (menu_items() as $item): ?>
                <?php
                $target = menu_path($item['id']);
                $active = $item['id'] === 'dashboard'
                    ? ($path === '/' || $path === '')
                    : ($path === $target || str_starts_with($path, $target . '/'));
                ?>
                <a class="nav-link<?= $active ? ' active' : '' ?>" href="<?= e($target) ?>">
                    <span class="icon"><?= $item['icon'] ?></span>
                    <span><?= e($item['label']) ?></span>
                </a>
            <?php endforeach; ?>
        </nav>
    </aside>

    <div class="main">
        <header class="topbar">
            <div class="fw-semibold"><?= e($title ?? 'FarmCare') ?></div>
            <div class="d-flex align-items-center gap-3">
                <span class="who">Masuk sebagai <strong><?= e($auth_user ?? 'admin') ?></strong></span>
                <form method="post" action="/logout" class="m-0">
                    <?= App\Core\Csrf::field() ?>
                    <button type="submit" class="btn btn-sm btn-outline-secondary">Keluar</button>
                </form>
            </div>
        </header>

        <main class="content w-100">
            <?php $flash = $flash ?? []; require BASE_PATH . '/app/Views/partials/flash.php'; ?>
            <?= $content ?>
        </main>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="/assets/js/app.js"></script>
</body>
</html>
