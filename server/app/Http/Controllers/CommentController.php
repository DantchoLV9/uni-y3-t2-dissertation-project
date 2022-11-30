<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\User;
use App\Models\Post;
use App\Models\CommentLike;

class CommentController extends Controller
{
    public function createComment(Request $request) {
        $user = $request->user();
        $comment = $request->comment;
        $parentPostId = $request->parent_post;
        $targetPost = Post::firstWhere('id', $parentPostId);

        // Validate user input
        $request->validate([
            'comment' => 'required|string|max:500',
        ]);

        Comment::create([
            'parent_post' => $parentPostId,
            'created_by' => $user->id,
            'text' => $comment,
        ]);

        $targetPost->comments++;
        $targetPost->save();
        
        return $comment;
    }

    public function deleteComment(Request $request) {
        $user = $request->user();
        $commentId = $request["id"];
        $targetComment = $this->getCommentInstanceById($commentId);
        $commentOwner = $this->getCommentOwner($targetComment);
        $commentParent = $this->getCommentParent($targetComment);

        // Check if deleting own post
        if ($user->id != $commentOwner->id) {
            return response("Forbidden", 403);
        }
        
        $targetComment->delete();
        $commentParent->comments--;
        $commentParent->save();

        return $commentParent;
    }

    public function getAllCommentsOnPost(Request $request) {
        $user = $request->user();
        $postId = $request->id;

        $comments = Comment::where('parent_post', $postId)->orderBy('created_at', 'desc')->get();
        foreach($comments as $comment) {
            $comment['created_by'] = $this->getCommentOwner($comment);
            $comment['liked'] = $this->isCommentLiked($user, $comment);
        }

        return $comments;
    }

    public function likeComment(Request $request) {
        $user = $request->user();
        $commentId = $request["id"];
        $targetComment = Comment::firstWhere('id', $commentId);

        // Check if post is alredy liked
        if (!CommentLike::where('liked_by', $user->id)->firstWhere('liked_comment', $commentId)) {
            CommentLike::create([
                'liked_by' => $user->id,
                'liked_comment' => $commentId,
            ]);
            $targetComment->likes++;
            $targetComment->save();
        }
        $targetComment['created_by'] = $this->getCommentOwner($targetComment);
        $targetComment['liked'] = $this->isCommentLiked($user, $targetComment);
        
        return $targetComment;
    }

    public function unlikeComment(Request $request) {
        $user = $request->user();
        $commentId = $request["id"];
        $targetComment = Comment::firstWhere('id', $commentId);
        $targetCommentLike = CommentLike::where('liked_by', $user->id)->firstWhere('liked_comment', $commentId);

        // Check if post liked
        if ($targetCommentLike) {
            $targetCommentLike->delete();
            $targetComment->likes--;
            $targetComment->save();
        }
        $targetComment['created_by'] = $this->getCommentOwner($targetComment);
        $targetComment['liked'] = $this->isCommentLiked($user, $targetComment);
        
        return $targetComment;
    }

    public function isCommentLiked($user, $comment) {
        return $targetComment['liked'] = (CommentLike::where('liked_by', $user->id)->firstWhere('liked_comment', $comment->id)) ? true : false;
    }

    public function getCommentInstanceById($id) {
        $targetComment = Comment::firstWhere('id', $id);
        return $targetComment;
    }

    public function getCommentOwner($comment) {
        return User::firstWhere('id', $comment->created_by);
    }

    public function getCommentParent($comment) {
        return Post::firstWhere('id', $comment->parent_post);
    }
}
