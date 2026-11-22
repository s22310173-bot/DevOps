<?php
declare(strict_types=1);

use App\Controllers\AuthController;
use App\Controllers\DashboardController;
use App\Controllers\EntityController;
use App\Controllers\ReportController;
use App\Controllers\SettingsController;

/** @var App\Core\Router $router */
$router->get('/', [DashboardController::class, 'index']);
$router->get('/login', [AuthController::class, 'showLogin']);
$router->post('/login', [AuthController::class, 'login']);
$router->post('/logout', [AuthController::class, 'logout']);

$router->get('/laporan', [ReportController::class, 'index']);
$router->post('/pengaturan', [SettingsController::class, 'save']);

$router->get('/{entity}', [EntityController::class, 'index']);
$router->get('/{entity}/create', [EntityController::class, 'create']);
$router->post('/{entity}', [EntityController::class, 'store']);
$router->get('/{entity}/{id}/edit', [EntityController::class, 'edit']);
$router->post('/{entity}/{id}', [EntityController::class, 'update']);
$router->post('/{entity}/{id}/delete', [EntityController::class, 'destroy']);
