<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Audit;
use App\Core\Controller;
use App\Models\Setting;

class SettingsController extends Controller
{
    public function save(): void
    {
        $this->requireAuth();
        $this->csrfVerify();

        $populasi = filter_var($_POST['populasi'] ?? '', FILTER_VALIDATE_INT);

        if ($populasi === false || $populasi < 0) {
            $_SESSION['_flash_error'] = 'Populasi harus bilangan bulat dan tidak negatif.';
        } else {
            Setting::savePopulasi($populasi);
            Audit::log('update', 'settings#populasi');
            $_SESSION['_flash_success'] = 'Populasi ayam diperbarui.';
        }

        $this->redirect('/');
    }
}
