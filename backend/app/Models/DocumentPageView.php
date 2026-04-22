<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentPageView extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'document_view_id',
        'page_number',
        'entered_at',
        'exited_at',
        'duration_ms',
    ];

    public function documentView()
    {
        return $this->belongsTo(DocumentView::class);
    }
}
