<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentView extends Model
{
    protected $fillable = [
        'investor_document_id',
        'user_id',
        'room_visitor_id',
        'data_room_id',
        'session_token',
        'started_at',
        'ended_at',
        'total_duration_seconds',
        'total_pages_viewed',
        'user_agent',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'ended_at' => 'datetime',
        ];
    }

    public function document()
    {
        return $this->belongsTo(InvestorDocument::class, 'investor_document_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pageViews()
    {
        return $this->hasMany(DocumentPageView::class);
    }

    public function roomVisitor()
    {
        return $this->belongsTo(RoomVisitor::class);
    }

    public function dataRoom()
    {
        return $this->belongsTo(DataRoom::class);
    }
}
