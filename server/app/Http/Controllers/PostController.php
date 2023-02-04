<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Post;
use App\Models\PostLike;
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
        $scrollFeedName = time().'_'.$user->slug.'_scrollFeed'.'.webp';
        $thumbnailName = time().'_'.$user->slug.'_thumbnail'.'.webp';

        // Optimise image
        $optimisedImage = Image::make($image)->orientate()->encode('webp');
        
        // Store post in database
        $post = Post::create([
            'title' => $request->title,
            'image' => $imageName,
            'scrollFeedImg' => $scrollFeedName,
            'thumbnail' => $thumbnailName,
            'slug' => Str::of($uuid)->slug('-'),
            'created_by' => $user->id
        ]);

        // Make sure that user_uploads folder exists
        File::ensureDirectoryExists('user_uploads/');

        // Save the image in the public/user_uploads folder (Important: Done after storing the post in the database)
        $optimisedImage->save("user_uploads/" . $imageName);

        // Create a scroll feed optimised image
        $optimisedImage->resize(1024, null, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });
        $optimisedImage->save("user_uploads/" . $scrollFeedName);

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

    public function deletePost(Request $request) {
        $user = $request->user();
        $postId = $request["id"];
        $targetPost = $this->getPostInstanceById($postId);
        $postOwner = $this->getPostOwner($targetPost);

        // Check if deleting own post
        if ($user->id != $postOwner->id) {
            return response("Forbidden", 403);
        }
        
        $targetPost->delete();
        $user->posts_amount--;
        $user->save();

        return true;
    }

    public function getPostsByUserId(Request $request) {
        $userId = $request["id"];
        //$userPosts = Post::where('created_by', $userId)->orderBy('created_at', 'desc')->paginate();
        $userPosts = Post::where('created_by', $userId)->orderBy('created_at', 'desc')->get();
        return $userPosts;
    }
    
    public function getPostBySlug(Request $request) {
        $user = $request->user();
        $slug = $request["slug"];
        $targetPost = Post::firstWhere('slug', $slug);
        $targetPost['created_by'] = $this->getPostOwner($targetPost);
        $targetPost['liked'] = $this->isPostLiked($user, $targetPost);
        return $targetPost;
    }

    public function getPostById(Request $request) {
        $user = $request->user();
        $id = $request["id"];
        $targetPost = Post::firstWhere('id', $id);
        $targetPost['created_by'] = $this->getPostOwner($targetPost);
        $targetPost['liked'] = $this->isPostLiked($user, $targetPost);
        return $targetPost;
    }

    public function likePost(Request $request) {
        $user = $request->user();
        $postId = $request["id"];
        $targetPost = Post::firstWhere('id', $postId);

        // Check if post is alredy liked
        if (!PostLike::where('liked_by', $user->id)->firstWhere('liked_post', $postId)) {
            PostLike::create([
                'liked_by' => $user->id,
                'liked_post' => $postId,
            ]);
            $targetPost->likes++;
            $targetPost->save();
        }
        $targetPost['created_by'] = $this->getPostOwner($targetPost);
        $targetPost['liked'] = $this->isPostLiked($user, $targetPost);
        
        return $targetPost;
    }

    public function unlikePost(Request $request) {
        $user = $request->user();
        $postId = $request["id"];
        $targetPost = Post::firstWhere('id', $postId);
        $targetPostLike = PostLike::where('liked_by', $user->id)->firstWhere('liked_post', $postId);

        // Check if post liked
        if ($targetPostLike) {
            $targetPostLike->delete();
            $targetPost->likes--;
            $targetPost->save();
        }
        $targetPost['created_by'] = $this->getPostOwner($targetPost);
        $targetPost['liked'] = $this->isPostLiked($user, $targetPost);
        
        return $targetPost;
    }

    public function isPostLiked($user, $post) {
        return $targetPost['liked'] = (PostLike::where('liked_by', $user->id)->firstWhere('liked_post', $post->id)) ? true : false;
    }

    public function getPostOwner($post) {
        return User::firstWhere('id', $post->created_by);
    }

    public function getPostInstanceById($id) {
        $targetPost = Post::firstWhere('id', $id);
        return $targetPost;
    }
}
