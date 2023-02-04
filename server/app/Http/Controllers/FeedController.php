<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\User;
use App\Models\PostLike;
use App\Http\Controllers\PostController;

class FeedController extends Controller
{
    public function getPosts(Request $request) {
        $user = $request->user();
        $posts = Post::orderBy('created_at', 'desc')->paginate(10);
        $postController = new PostController();
        foreach($posts as $post) {
            $post['created_by'] = $postController->getPostOwner($post);
            $post['liked'] = $postController->isPostLiked($user, $post);
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
