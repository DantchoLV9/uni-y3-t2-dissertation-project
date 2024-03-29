<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostReaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'reacted_by',
        'reacted_post',
        'reaction_type',
    ];
}
