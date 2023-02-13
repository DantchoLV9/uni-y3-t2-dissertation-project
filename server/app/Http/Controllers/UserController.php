<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Config;

class UserController extends Controller
{
    public function getUserProfileFromSlug(Request $request) {
        $slug = $request["slug"];
        $targetUser = User::firstWhere('slug', $slug);

        // Get last post timestamp
        $lastUpload = $targetUser->last_post;
        $timeSinceLastUpload = strtotime(now()) - strtotime($lastUpload);

        // Get streak mechanic data
        $levelsData = Config::get('constants.levels');

        // Reset user level if no upload for more than 24 hrs
        if ($lastUpload != null) {
            if ($timeSinceLastUpload > 86400) {
                $daysSinceLastUpload = floor($timeSinceLastUpload / 86400);
                
                for ($j = 0; $j < $daysSinceLastUpload; $j++) {
                    // Workout current level
                    $currentPoints = $targetUser->points;
                    $currentLevel = 1;
                    $currentLevelPoints = 100;
                    for ($i = count($levelsData); $i > 0; $i--) {
                        if ($currentPoints >= $levelsData[$i - 1]['points']) {
                            $currentLevel = $levelsData[$i - 1]['level'];
                            $currentLevelPoints = $levelsData[$i - 1]['points'];
                            break;
                        }
                    }
                    $newPoints = $currentPoints - ($currentPoints - ($currentLevelPoints * 0.99));
                    if ($newPoints < 0) {
                        $targetUser->points = 0;
                    }
                    else {
                        $targetUser->points = $newPoints;
                    }
                }
                
                $targetUser->last_post = now();
                $targetUser->save();
            }
        }
        
        // Get streak mechanic data
        $currentPoints = $targetUser->points;
        $rewardPoints = Config::get('constants.reward.points');
        $rewardPercentage = Config::get('constants.reward.percentage');
        $currentLevelPoints = 0;
        $nextLevelPoints = $levelsData[0]['points'];

        // Workout current level
        $currentLevel = 1;
        for ($i = count($levelsData); $i > 0; $i--) {
            if ($currentPoints >= $levelsData[$i - 1]['points']) {
                $currentLevel = $levelsData[$i - 1]['level'];
                $currentLevelPoints = $levelsData[$i - 1]['points'];
                if ($i != count($levelsData)) {
                    $nextLevelPoints = $levelsData[$i]['points'];
                }
                else {
                    $nextLevelPoints = 'maxLevel';
                }
                break;
            }
        }

        // Workout added points
        $rewardBonus = $currentLevel * ($rewardPercentage / 100);
        $hoursBeforeLastUpload = floor($timeSinceLastUpload / 3600);
        $addedPoints = ($rewardPoints + $rewardPoints * $rewardBonus) + ($hoursBeforeLastUpload - $hoursBeforeLastUpload * ($rewardPercentage / 100));

        $userProfile = [
            'id' => $targetUser["id"],
            'name' => $targetUser["name"],
            'posts_amount' => $targetUser['posts_amount'],
            'streak' => [
                'level' => $currentLevel,
                'current_points' => $currentPoints,
                'current_level_points' => $currentLevelPoints,
                'next_level_points' => $nextLevelPoints,
                'next_reward_points' => $lastUpload == null ? null : ($timeSinceLastUpload > 86400 ? 0 : floor($addedPoints)),
                'last_upload' => ($lastUpload == null) ? null : floor($timeSinceLastUpload / 3600)
            ]
        ];
        return $userProfile;
    }

    public function getUserProfileFromId(Request $request)
    {
        $id = $request["id"];
        $targetUser = User::firstWhere('id', $id);
        $userProfile = [
            'id' => $targetUser["id"],
            'name' => $targetUser["name"],
            'posts_amount' => $targetUser['posts_amount']
        ];
        return $userProfile;
    }

    // Returns the level of the passed user and checks/updates their streak status
    public function getUserLevel($user) {
        // Get last post timestamp
        $lastUpload = $user->last_post;
        $timeSinceLastUpload = strtotime(now()) - strtotime($lastUpload);

        // Get streak mechanic data
        $levelsData = Config::get('constants.levels');

        // Reset user level if no upload for more than 24 hrs
        if ($lastUpload != null) {
            if ($timeSinceLastUpload > 86400) {
                $daysSinceLastUpload = floor($timeSinceLastUpload / 86400);
                
                for ($j = 0; $j < $daysSinceLastUpload; $j++) {
                    // Workout current level
                    $currentPoints = $user->points;
                    $currentLevel = 1;
                    $currentLevelPoints = 100;
                    for ($i = count($levelsData); $i > 0; $i--) {
                        if ($currentPoints >= $levelsData[$i - 1]['points']) {
                            $currentLevel = $levelsData[$i - 1]['level'];
                            $currentLevelPoints = $levelsData[$i - 1]['points'];
                            break;
                        }
                    }
                    $newPoints = $currentPoints - ($currentPoints - ($currentLevelPoints * 0.99));
                    if ($newPoints < 0) {
                        $user->points = 0;
                    }
                    else {
                        $user->points = $newPoints;
                    }
                }
                
                $user->last_post = now();
                $user->save();
            }
        }

        // Code below works out the level again after a potential adjustment

        // Get streak mechanic data
        $currentPoints = $user->points;
        
        // Workout current level
        $currentLevel = 1;
        for ($i = count($levelsData); $i > 0; $i--) {
            if ($currentPoints >= $levelsData[$i - 1]['points']) {
                $currentLevel = $levelsData[$i - 1]['level'];
                break;
            }
        }
        return $currentLevel;
    }
}
