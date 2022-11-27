<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function getUserProfileFromSlug(Request $request) {
        $slug = $request["slug"];
        $targetUser = User::firstWhere('slug', $slug);
        $userProfile = [
            'id' => $targetUser["id"],
            'name' => $targetUser["name"],
            'posts_amount' => $targetUser['posts_amount']
        ];
        return $userProfile;
    }
}
