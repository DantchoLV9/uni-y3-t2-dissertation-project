<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;

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

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Get user profile details from slug
Route::middleware(['auth:sanctum'])->get('/user-profile-from-slug', [UserController::class, 'getUserProfileFromSlug']);

// Get user posts from user id
Route::middleware(['auth:sanctum'])->get('/get-posts-by-user-id', [PostController::class, 'getPostsByUserId']);

// Create post
Route::middleware(['auth:sanctum'])->post('/create-post', [PostController::class, 'createPost']);