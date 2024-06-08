<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\Backup\BackupController;
use App\Http\Controllers\CurrentConditionController;
use App\Http\Controllers\CurrentLocationController;
use App\Http\Controllers\HealthDataController;
use App\Http\Controllers\SensorDataController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::group(['middleware' => 'api', 'namespace' => 'App\Http\Controllers\Auth', 'prefix' => 'auth'], function(){
    Route::post('/register', 'AuthController@register');

    Route::post('/login', 'AuthController@login');
    Route::post('/logout', 'AuthController@logout');
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::prefix('admin')->group(function () {
        Route::get('/', [AdminController::class, 'index']);

        Route::get('/user/{id?}', [AdminController::class, 'getAllUsers']);
        Route::get('/organizations', [AdminController::class, 'getAllOrganizations']);
        Route::get('/organizations/{id}', [AdminController::class, 'getAllOrganizations']);
        Route::get('/employees', [AdminController::class, 'getAllEmployees']);
        Route::get('/employees/{id}', [AdminController::class, 'getAllEmployees']);

        Route::get('current_conditions/{id?}', [AdminController::class, 'getCurrentConditions']);
        Route::get('current_locations/{id?}', [AdminController::class, 'getCurrentLocations']);
        Route::get('health_readings/{id?}', [AdminController::class, 'getHealthReadings']);
        Route::get('sensor_data/{id?}', [AdminController::class, 'getSensorData']);

        Route::post('/organization', [AdminController::class, 'addOrganization']);
        Route::post('/employee', [AdminController::class, 'addEmployee']);

        Route::delete('/employees/{id}', [AdminController::class, 'deleteEmployee']);
        Route::delete('/organizations/{id}', [AdminController::class, 'deleteOrganization']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);

        Route::put('/employee/{id}', [AdminController::class, 'updateEmployee']);
        Route::put('/organization/{id}', [AdminController::class, 'updateOrganization']);



    });
});

Route::group(['namespace' => 'App\Http\Controllers', 'middleware' => 'jwt.auth'], function() {


    Route::get('/user_info', [\App\Http\Controllers\User\UserController::class, 'getUserInfo']);
    Route::get('/user_location', [\App\Http\Controllers\User\UserController::class, 'getLocationForCurrentUser']);
    Route::get('/user_condition', [\App\Http\Controllers\User\UserController::class, 'getConditionForCurrentUser']);
    Route::get('/get_health_reading', [HealthDataController::class, 'getHealthData']);
    Route::get('/get_sensor_data', [SensorDataController::class, 'getSensorData']);

    Route::post('/current_location', [CurrentLocationController::class, 'store']);
    Route::post('/current_condition', [CurrentConditionController::class, 'store']);
    Route::post('/health_reading', [HealthDataController::class, 'insertHealthData']);
    Route::post('/add_sensor_data', [SensorDataController::class, 'insertSensorData']);

    Route::delete('/delete_health_reading/{id}', [HealthDataController::class, 'deleteHealthData']);
    Route::delete('/delete_account/{id}', [\App\Http\Controllers\User\UserController::class, 'deleteAccount']);


});
