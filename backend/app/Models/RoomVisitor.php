<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class RoomVisitor extends Model
{
    protected $fillable = [
        'data_room_id', 'email', 'name', 'access_token',
        'verified_at', 'last_accessed_at', 'ip_address', 'user_agent',
        'city', 'region', 'country',
    ];

    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
            'last_accessed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (RoomVisitor $visitor) {
            if (empty($visitor->access_token)) {
                $visitor->access_token = Str::random(64);
            }
        });
    }

    public function room()
    {
        return $this->belongsTo(DataRoom::class, 'data_room_id');
    }

    public function documentViews()
    {
        return $this->hasMany(DocumentView::class, 'room_visitor_id');
    }
}
