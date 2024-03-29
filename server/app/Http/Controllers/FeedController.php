<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\User;
use App\Models\PostReaction;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use Config;

class FeedController extends Controller
{
    public function getPosts(Request $request) {
        $user = $request->user();
        $posts = Post::orderBy('created_at', 'desc')->paginate(10);
        $postController = new PostController();

        foreach($posts as $post) {
            // Get post owner
            $targetUser = $postController->getPostOwner($post);

            // Get current post owner level
            $userController = new UserController();
            $currentLevel = $userController->getUserLevel($targetUser);

            $post['created_by'] = $targetUser;
            $post['creator_level'] = $currentLevel;
            $post['reacted'] = $postController->isPostLiked($user, $post);
        }
        return $posts;
    }

    private function calculateDateDifference($date) {
        $today = date("Y-m-d");
        $origin = new DateTimeImmutable($date);
        $target = new DateTimeImmutable($today);
        $interval = $origin->diff($target);
        return $interval;
    }
}
