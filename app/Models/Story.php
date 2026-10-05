<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'slug', 'category', 'author_name', 'excerpt', 'body_html', 'cover_image_url', 'cover_caption', 'pull_quote', 'quote_attribution', 'status', 'published_at'])]
class Story extends Model
{
    protected function casts(): array
    {
        return ['published_at' => 'datetime'];
    }

    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published')->whereNotNull('published_at')->where('published_at', '<=', now());
    }

    public function readingMinutes(): int
    {
        return max(1, (int) ceil(str_word_count(strip_tags($this->body_html)) / 200));
    }
}
