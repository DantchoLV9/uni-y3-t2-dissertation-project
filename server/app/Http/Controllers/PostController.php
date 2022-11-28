<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Post;
use Ramsey\Uuid\Uuid;
use Illuminate\Support\Str;
use Image;
use File;

class PostController extends Controller
{
    public function createPost(Request $request) {
        $user = $request->user();
        $uuid = Uuid::uuid4();
        $image = $request->image;

        // Validate user input
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,jpg,png|max:10240'
        ]);

        // Craft a name for the image to be saved with
        $imageName = time().'_'.$user->slug.'.webp';
        $thumbnailName = time().'_'.$user->slug.'_thumbnail'.'.webp';

        // Optimise image
        $optimisedImage = Image::make($image)->orientate()->encode('webp');
        
        // Store post in database
        $post = Post::create([
            'title' => $request->title,
            'image' => $imageName,
            'thumbnail' => $thumbnailName,
            'slug' => Str::of($uuid)->slug('-'),
            'created_by' => $user->id
        ]);

        // Make sure that user_uploads folder exists
        File::ensureDirectoryExists('user_uploads/');

        // Save the image in the public/user_uploads folder (Important: Done after storing the post in the database)
        $optimisedImage->save("user_uploads/" . $imageName);

        // Create thumbnail
        $imageHeight = $optimisedImage->height();
        $imageWidth = $optimisedImage->width();
        $smallestSide = min([$imageHeight, $imageWidth]);
        $optimisedImage->crop($smallestSide,$smallestSide);
        $optimisedImage->resize(512,512);

        // Save the thumbnail in the public/user_uploads folder
        $optimisedImage->save("user_uploads/" . $thumbnailName);

        // Update user posts amount
        $user->posts_amount++;
        $user->save();

        return $post;
    }

    public function getPostsByUserId(Request $request) {
        $userId = $request["id"];
        //$userPosts = Post::where('created_by', $userId)->orderBy('created_at', 'desc')->paginate();
        $userPosts = Post::where('created_by', $userId)->orderBy('created_at', 'desc')->get();
        return $userPosts;
    }
}
