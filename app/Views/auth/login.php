<div class="login-wrap">
    <div class="login-card">
        <div class="text-center mb-4">
            <div class="stat-icon mx-auto mb-2">🐔</div>
            <h1 class="h4 fw-bold mb-1">FarmCare</h1>
            <p class="text-muted small mb-0">Masuk untuk mengelola data peternakan</p>
        </div>

        <?php if (!empty($error)): ?>
            <div class="alert alert-danger" role="alert"><?= e($error) ?></div>
        <?php endif; ?>

        <form method="post" action="/login">
            <?= App\Core\Csrf::field() ?>
            <div class="mb-3">
                <label class="form-label" for="username">Username</label>
                <input class="form-control" type="text" id="username" name="username" autocomplete="username" required autofocus>
            </div>
            <div class="mb-4">
                <label class="form-label" for="password">Password</label>
                <input class="form-control" type="password" id="password" name="password" autocomplete="current-password" required>
            </div>
            <button type="submit" class="btn btn-success w-100">Masuk</button>
        </form>
    </div>
</div>
