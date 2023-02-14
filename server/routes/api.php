<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\CommentController;

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

Route::middleware(['auth:sanctum'])->get('/user', [UserController::class, 'getUser']);

// Get user profile details from slug
Route::middleware(['auth:sanctum'])->get('/user-profile-from-slug', [UserController::class, 'getUserProfileFromSlug']);

// Get user profile details from id
Route::middleware(['auth:sanctum'])->get('/user-profile-from-id', [UserController::class, 'getUserProfileFromId']);

// Get user posts from user id
Route::middleware(['auth:sanctum'])->get('/get-posts-by-user-id', [PostController::class, 'getPostsByUserId']);

// Create post
Route::middleware(['auth:sanctum'])->post('/create-post', [PostController::class, 'createPost']);

// Create post
Route::middleware(['auth:sanctum'])->get('/delete-post', [PostController::class, 'deletePost']);

// Get posts (feed)
Route::middleware(['auth:sanctum'])->get('/get-posts', [FeedController::class, 'getPosts']);

// Get post from slug
Route::middleware(['auth:sanctum'])->get('/get-post', [PostController::class, 'getPostBySlug']);

// Get post from id
Route::middleware(['auth:sanctum'])->get('/get-post-from-id', [PostController::class, 'getPostById']);

// Like post
Route::middleware(['auth:sanctum'])->get('/like-post', [PostController::class, 'likePost']);

// Unlike post
Route::middleware(['auth:sanctum'])->get('/unlike-post', [PostController::class, 'unlikePost']);

// Add comment
Route::middleware(['auth:sanctum'])->post('/create-comment', [CommentController::class, 'createComment']);

// Delete comment
Route::middleware(['auth:sanctum'])->get('/delete-comment', [CommentController::class, 'deleteComment']);

// Get post comments from post id
Route::middleware(['auth:sanctum'])->get('/get-post-comments-by-id', [CommentController::class, 'getAllCommentsOnPost']);

// Like comment
Route::middleware(['auth:sanctum'])->get('/like-comment', [CommentController::class, 'likeComment']);

// Unlike comment
Route::middleware(['auth:sanctum'])->get('/unlike-comment', [CommentController::class, 'unlikeComment']);