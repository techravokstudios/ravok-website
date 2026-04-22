<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvestorDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_category_id',
        'name',
        'original_name',
        'description',
        'file_path',
        'mime_type',
        'size_bytes',
        'uploaded_by',
        'group_key',
    ];

    public function category()
    {
        return $this->belongsTo(DocumentCategory::class, 'document_category_id');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function views()
    {
        return $this->hasMany(DocumentView::class, 'investor_document_id');
    }
}
