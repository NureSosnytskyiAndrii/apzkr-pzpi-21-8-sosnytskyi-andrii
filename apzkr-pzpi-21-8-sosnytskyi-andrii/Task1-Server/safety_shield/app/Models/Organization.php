<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $guarded = false;

    protected $primaryKey = 'organization_id';

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }
}
