<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Post;
use App\Models\PostReaction;
use Ramsey\Uuid\Uuid;
use Illuminate\Support\Str;
use App\Http\Controllers\UserController;
use Image;
use File;
use Config;

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

        // Give points for upload
        $lastUpload = $user->last_post;
        $currentPoints = $user->points;
        $timeSinceLastUpload = strtotime(now()) - strtotime($lastUpload);
        $rewardPoints = Config::get('constants.reward.points');
        $rewardPercentage = Config::get('constants.reward.percentage');
        $levelsData = Config::get('constants.levels');

        // Workout current level
        $currentLevel = 1;
        for ($i = count($levelsData); $i > 0; $i--) {
            if ($currentPoints >= $levelsData[$i - 1]['points']) {
                $currentLevel = $levelsData[$i - 1]['level'];
                break;
            }
        }

        // Workout added points
        $rewardBonus = $currentLevel * ($rewardPercentage / 100);
        $hoursBeforeLastUpload = floor($timeSinceLastUpload / 3600);
        $addedPoints = ($rewardPoints + $rewardPoints * $rewardBonus) + ($hoursBeforeLastUpload - $hoursBeforeLastUpload * ($rewardPercentage / 100));

        // Check if this is the user's first upload
        if ($lastUpload == NULL) {
            $user->points = $currentPoints + $rewardPoints;
        }
        else {
            $user->points = $currentPoints + $addedPoints;
        }

        // Set last upload timestamp to now
        $user->last_post = now();

        // Update user posts amount
        $user->posts_amount++;
        $user->save();

        // Add the reward points amount to the post
        if ($lastUpload == NULL) {
            $post->points_reward = $rewardPoints;
        }
        else {
            $post->points_reward = $addedPoints;
        }
        $post->save();

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

        // Delete post images
        File::delete("user_uploads/" . $targetPost->image, "user_uploads/" . $targetPost->scrollFeedImg, "user_uploads/" . $targetPost->thumbnail);

        // Remove points from user
        $currentUserPoints = $user->points;
        $newUserPoints = $currentUserPoints - $targetPost->points_reward;
        if ($newUserPoints < 0) {
            $user->points = 0;
        }
        else {
            $user->points = $newUserPoints;
        }
        
        // Delete post from database
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

        // Get post owner
        $targetUser = $this->getPostOwner($targetPost);

        // Get current post owner level
        $userController = new UserController();
        $currentLevel = $userController->getUserLevel($targetUser);
        
        $targetPost['created_by'] = $targetUser;
        $targetPost['creator_level'] = $currentLevel;
        $targetPost['reacted'] = $this->isPostLiked($user, $targetPost);
        return $targetPost;
    }

    public function getPostById(Request $request) {
        $user = $request->user();
        $id = $request["id"];
        $targetPost = Post::firstWhere('id', $id);

        // Get post owner
        $targetUser = $this->getPostOwner($targetPost);

        // Get current post owner level
        $userController = new UserController();
        $currentLevel = $userController->getUserLevel($targetUser);

        $targetPost['created_by'] = $targetUser;
        $targetPost['creator_level'] = $currentLevel;
        $targetPost['reacted'] = $this->isPostLiked($user, $targetPost);
        return $targetPost;
    }

    public function addPostReaction(Request $request) {
        $user = $request->user();
        $postId = $request["id"];
        $reactionType = $request["reaction"];
        $targetPost = Post::firstWhere('id', $postId);

        // TODO: Currently there is no check to make sure that user can create the type of reaction they requested

        // Get post owner
        $targetUser = $this->getPostOwner($targetPost);

        // Get current post owner level
        $userController = new UserController();
        $currentLevel = $userController->getUserLevel($targetUser);

        // Check if post is alredy liked
        if (!PostReaction::where('reacted_by', $user->id)->firstWhere('reacted_post', $postId)) {
            PostReaction::create([
                'reacted_by' => $user->id,
                'reacted_post' => $postId,
                'reaction_type' => $reactionType,
            ]);
            $targetPost->likes++;
            $targetPost->save();
        }
        $targetPost['created_by'] = $targetUser;
        $targetPost['creator_level'] = $currentLevel;
        $targetPost['reacted'] = $this->isPostLiked($user, $targetPost);
        
        return $targetPost;
    }

    public function removePostReaction(Request $request) {
        $user = $request->user();
        $postId = $request["id"];
        $targetPost = Post::firstWhere('id', $postId);
        $targetPostLike = PostReaction::where('reacted_by', $user->id)->firstWhere('reacted_post', $postId);

        // Get post owner
        $targetUser = $this->getPostOwner($targetPost);

        // Get current post owner level
        $userController = new UserController();
        $currentLevel = $userController->getUserLevel($targetUser);

        // Check if post liked
        if ($targetPostLike) {
            $targetPostLike->delete();
            $targetPost->likes--;
            $targetPost->save();
        }
        $targetPost['created_by'] = $targetUser;
        $targetPost['creator_level'] = $currentLevel;
        $targetPost['reacted'] = $this->isPostLiked($user, $targetPost);
        
        return $targetPost;
    }

    public function getReactionsList(Request $request) {
        $postId = $request["id"];
        $reactions = PostReaction::where('reacted_post', $postId)->get();

        $userController = new UserController();

        $reactionsList = [];

        foreach($reactions as $reaction) {
            $reactedBy = $this->getReactionOwner($reaction);
            array_push($reactionsList, [
                'user' => [
                    'name' => $reactedBy->name,
                    'slug' => $reactedBy->slug,
                    'level' => $userController->getUserLevel($reactedBy),
                ],
                'reaction_type' => $reaction['reaction_type']
            ]);
        }

        return $reactionsList;
    }

    public function isPostLiked($user, $post) {
        return $targetPost['reacted'] = (PostReaction::where('reacted_by', $user->id)->firstWhere('reacted_post', $post->id));
    }

    public function getPostOwner($post) {
        return User::firstWhere('id', $post->created_by);
    }

    public function getReactionOwner($reaction) {
        return User::firstWhere('id', $reaction->reacted_by);
    }

    public function getPostInstanceById($id) {
        $targetPost = Post::firstWhere('id', $id);
        return $targetPost;
    }
}
