<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\User;

class FeedController extends Controller
{
    public function getPosts() {
        $posts = Post::orderBy('created_at', 'desc')->get();
        foreach($posts as $post) {
            $post['created_by'] = User::firstWhere('id', $post->created_by);
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
