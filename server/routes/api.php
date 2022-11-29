<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\FeedController;

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

// Get user profile details from id
Route::middleware(['auth:sanctum'])->get('/user-profile-from-id', [UserController::class, 'getUserProfileFromId']);

// Get user posts from user id
Route::middleware(['auth:sanctum'])->get('/get-posts-by-user-id', [PostController::class, 'getPostsByUserId']);

// Create post
Route::middleware(['auth:sanctum'])->post('/create-post', [PostController::class, 'createPost']);

// Get posts (feed)
Route::middleware(['auth:sanctum'])->get('/get-posts', [FeedController::class, 'getPosts']);

// Get post from slug
Route::middleware(['auth:sanctum'])->get('/get-post', [PostController::class, 'getPostBySlug']);

// Like post
Route::middleware(['auth:sanctum'])->get('/like-post', [PostController::class, 'likePost']);

// Unlike post
Route::middleware(['auth:sanctum'])->get('/unlike-post', [PostController::class, 'unlikePost']);