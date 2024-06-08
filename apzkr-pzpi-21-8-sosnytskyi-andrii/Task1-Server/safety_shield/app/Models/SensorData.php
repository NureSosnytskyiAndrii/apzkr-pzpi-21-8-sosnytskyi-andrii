<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SensorData extends Model
{
    use HasFactory;

    protected $fillable = ['reading_id', 'type', 'value', 'created', 'health_reading_id'];
    protected $guarded = false;
}
