<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $primaryKey = 'employee_id';
    protected $fillable = ['employee_id', 'position', 'gender', 'user_id', 'organization_id'];
    protected $guarded = false;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id','user_id');
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class, 'organization_id', 'organization_id');
    }

    public function location()
    {
        return $this->belongsToMany(CurrentLocation::class, 'employee_location', 'employee_id', 'location_id');
    }
}
