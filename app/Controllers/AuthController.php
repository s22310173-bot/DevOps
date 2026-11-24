<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Audit;
use App\Core\Auth;
use App\Core\Controller;

class AuthController extends Controller
{
    public function showLogin(): void
    {
        if (Auth::check()) {
            $this->redirect('/');
        }
        $error = $_SESSION['_flash_error'] ?? null;
        unset($_SESSION['_flash_error']);

        $this->view('auth/login', [
            'title' => 'Masuk',
            'error' => $error,
        ], 'auth');
    }

    public function login(): void
    {
        $this->csrfVerify();

        $username = trim((string) ($_POST['username'] ?? ''));
        $password = (string) ($_POST['password'] ?? '');

        if (Auth::attempt($username, $password)) {
            Audit::log('login', 'auth', $username);
            $this->redirect('/');
        }

        $safeUser = str_replace(["\r", "\n"], '', $username);
        error_log(sprintf(
            '[auth] login gagal username="%s" ip=%s waktu=%s',
            $safeUser,
            $_SERVER['REMOTE_ADDR'] ?? '-',
            date('c')
        ));
        Audit::log('login_failed', 'auth', $safeUser === '' ? 'unknown' : $safeUser);

        $_SESSION['_flash_error'] = 'Username atau password salah.';
        $this->redirect('/login');
    }

    public function logout(): void
    {
        $this->csrfVerify();
        Auth::logout();
        $this->redirect('/login');
    }
}
