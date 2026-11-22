<?php if (!empty($flash['success'])): ?>
    <div class="alert alert-success alert-auto" role="alert">
        <?= e($flash['success']) ?>
    </div>
<?php endif; ?>
<?php if (!empty($flash['error'])): ?>
    <div class="alert alert-danger alert-auto" role="alert">
        <?= e($flash['error']) ?>
    </div>
<?php endif; ?>
