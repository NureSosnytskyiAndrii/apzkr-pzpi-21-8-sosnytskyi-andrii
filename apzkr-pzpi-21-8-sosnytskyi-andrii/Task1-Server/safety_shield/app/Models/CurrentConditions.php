<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CurrentConditions extends Model
{
    use HasFactory;
    protected $primaryKey = 'condition_id';

    protected $fillable = ['condition_id', 'status', 'notes', 'organization_id', 'employee_id', 'location_id'];
    protected $guarded = false;

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id','employee_id');
    }

    public function location()
    {
        return $this->belongsTo(CurrentLocation::class, 'location_id','location_id');
    }
}
