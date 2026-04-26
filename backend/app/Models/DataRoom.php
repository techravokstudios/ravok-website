<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class DataRoom extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'nda_text', 'created_by',
        'is_active', 'passcode', 'expires_at',
        'allow_download', 'notify_on_visit',
    ];

    protected $hidden = ['passcode'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'allow_download' => 'boolean',
            'notify_on_visit' => 'boolean',
            'expires_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (DataRoom $room) {
            if (empty($room->slug)) {
                do {
                    $slug = Str::random(12);
                } while (static::where('slug', $slug)->exists());
                $room->slug = $slug;
            }
        });
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function isAccessible(): bool
    {
        return $this->is_active && !$this->isExpired();
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function documents()
    {
        return $this->belongsToMany(InvestorDocument::class, 'data_room_documents')
            ->withPivot('sort_order')
            ->orderByPivot('sort_order');
    }

    public function visitors()
    {
        return $this->hasMany(RoomVisitor::class);
    }

    public function views()
    {
        return $this->hasMany(DocumentView::class, 'data_room_id');
    }
}
