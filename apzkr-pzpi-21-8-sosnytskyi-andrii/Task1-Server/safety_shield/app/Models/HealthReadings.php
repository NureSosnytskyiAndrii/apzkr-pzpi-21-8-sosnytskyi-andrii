<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HealthReadings extends Model
{
    use HasFactory;
    protected $primaryKey = 'health_reading_id';
    protected $fillable = ['health_reading_id', 'sensor_type', 'timestamp', 'heart_rate', 'temperature', 'blood_pressure', 'employee_id'];
    protected $guarded = false;

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'id');
    }

    public function sensorData(): HasMany
    {
        return $this->hasMany(SensorData::class, 'health_reading_id', 'health_reading_id');
    }
}
