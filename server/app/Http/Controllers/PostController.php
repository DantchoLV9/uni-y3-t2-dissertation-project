<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Post;
use Ramsey\Uuid\Uuid;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function createPost(Request $request) {
        $user = $request->user();
        $uuid = Uuid::uuid4();

        // Validate user input
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,jpg,png|max:10240'
        ]);

        // Craft a name for the image to be saved with
        $imageName = time().'_'.$user->slug.'.'.$request->image->extension();

        
        // Store post in database
        $post = Post::create([
            'title' => $request->title,
            'image' => $imageName,
            'slug' => Str::of($uuid)->slug('-'),
            'created_by' => $user->id
        ]);

        // Save the image in the public/user_uploads folder (Important: Done after storing the post in the database)
        $request->image->move(public_path('user_uploads'), $imageName);

        // Update user posts amount
        $user->posts_amount++;
        $user->save();

        return $post;
    }
}
