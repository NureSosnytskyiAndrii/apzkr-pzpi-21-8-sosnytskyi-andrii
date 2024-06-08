<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CurrentLocation extends Model
{
    use HasFactory;

    protected $fillable = ['location_id', 'latitude', 'longitude', 'notes', 'timestamp', 'employee_id'];

    protected $guarded = false;

    public function employee()
    {
        return $this->belongsToMany(Employee::class, 'employee_location', 'employee_location_id');
    }
}
