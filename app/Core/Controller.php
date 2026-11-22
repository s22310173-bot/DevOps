<?php
declare(strict_types=1);

namespace App\Core;

class Controller
{
    protected function view(string $template, array $data = [], string $layout = 'app'): void
    {
        $data['auth_user'] = Auth::user();
        extract($data, EXTR_SKIP);

        ob_start();
        require BASE_PATH . '/app/Views/' . $template . '.php';
        $content = ob_get_clean();

        require BASE_PATH . '/app/Views/layouts/' . $layout . '.php';
    }

    protected function redirect(string $path): never
    {
        header('Location: ' . $path);
        exit;
    }

    protected function requireAuth(): void
    {
        if (!Auth::check()) {
            $this->redirect('/login');
        }
    }

    protected function csrfVerify(): void
    {
        if (!Csrf::verify($_POST['_token'] ?? null)) {
            http_response_code(419);
            exit('Sesi kedaluwarsa. Silakan muat ulang halaman lalu coba lagi.');
        }
    }

    protected function takeFlash(): array
    {
        $flash = [];
        if (!empty($_SESSION['_flash_success'])) {
            $flash['success'] = $_SESSION['_flash_success'];
            unset($_SESSION['_flash_success']);
        }
        if (!empty($_SESSION['_flash_error'])) {
            $flash['error'] = $_SESSION['_flash_error'];
            unset($_SESSION['_flash_error']);
        }
        return $flash;
    }

    protected function notFound(): never
    {
        http_response_code(404);
        exit('Data tidak ditemukan.');
    }
}
