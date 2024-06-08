<?php

namespace App\Http\Controllers;

use App\Models\CurrentConditions;
use App\Models\Employee;
use App\Models\HealthReadings;
use App\Models\SensorData;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class SensorDataController extends Controller
{
    /**
     * Insert sensor data into the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function insertSensorData(Request $request)
    {
        $lastHealthReadingId = HealthReadings::latest('health_reading_id')->value('health_reading_id');

        $validator = Validator::make($request->all(), [
            'type' => 'required|string',
            'value' => 'required|string',
            'localization' => 'required|in:en,ua',
            'location_id' => 'nullable:integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $timezone = $request->localization === 'ua'
            ? 'Europe/Kiev'
            : 'Europe/London';

        $sensorData = SensorData::create([
            'reading_id' => $request->reading_id,
            'type' => $request->type,
            'value' => $request->value,
            'created' => Carbon::now()->locale($request->localization)->timezone($timezone),
            'health_reading_id' => $lastHealthReadingId,
        ]);

        $this->updateHealthReading($lastHealthReadingId, $request->type, $request->value, $request->location_id);

        return response()->json(['message' => 'Sensor data inserted successfully', 'sensor_data' => $sensorData], 201);
    }

    /**
     * Update health reading based on sensor data.
     *
     * @param  int  $healthReadingId
     * @param  string  $sensorType
     * @param  string  $value
     * @param  int|null  $locationId
     * @return \Illuminate\Http\Response
     */
    private function updateHealthReading($healthReadingId, $sensorType, $value, $locationId=null)
    {
        $healthReading = HealthReadings::find($healthReadingId);

        if (!$healthReading) {
            return response()->json(['error' => 'Health reading not found'], 404);
        }

        switch ($sensorType) {
            case 'temperature':
                $healthReading->temperature = $value;
                break;
            case 'heart_rate':
                $healthReading->heart_rate = $value;
                break;
            case 'blood_pressure':
                $bloodPressure = explode('/', $value);
                $healthReading->blood_pressure = $bloodPressure;
                break;
            default:
                return response()->json(['error' => 'Invalid sensor type'], 400);
        }
        $healthReading->save();

        if ($sensorType === 'heart_rate' && $value < 60) {
            $currentCondition = CurrentConditions::where('employee_id', $healthReading->employee_id)
                ->where('location_id', $locationId)
                ->get();
            foreach ($currentCondition as $condition) {
                $condition->update(['status' => 'Heart rate is low', 'notes' => 'Heart rate is too low']);
            }
        } else if ($sensorType === 'heart_rate' && $value > 60 && $value < 150) {
            $currentCondition = CurrentConditions::where('employee_id', $healthReading->employee_id)
                ->where('location_id', $locationId)
                ->get();
            foreach ($currentCondition as $condition) {
                $condition->update(['status' => 'Normal', 'notes' => '-']);
            }
        }

        if ($sensorType === 'blood_pressure') {
            $bloodPressure = explode('/', $value);
            $systolicPressure = $bloodPressure[0];
            $diastolicPressure = $bloodPressure[1];

            if ($systolicPressure > 140 || $diastolicPressure > 90) {
                $currentCondition = CurrentConditions::where('employee_id', $healthReading->employee_id)
                    ->where('location_id', $locationId)
                    ->get();
                foreach ($currentCondition as $condition)
                    $condition->update(['status' => 'High blood pressure', 'notes' => 'High blood pressure detected']);
            } else if (($systolicPressure < 140 && $systolicPressure > 110) || ($diastolicPressure < 90 && $diastolicPressure > 70)) {
                $currentCondition = CurrentConditions::where('employee_id', $healthReading->employee_id)
                    ->where('location_id', $locationId)
                    ->get();
                foreach ($currentCondition as $condition)
                    $condition->update(['status' => 'Normal', 'notes' => '-']);
            }
        }

        if ($sensorType === 'temperature' && $value > 37.5) {
            $currentConditions = CurrentConditions::where('employee_id', $healthReading->employee_id)
                ->where('location_id', $locationId)
                ->get();

            foreach ($currentConditions as $condition) {
                $condition->update(['status' => 'High temperature', 'notes' => 'High temperature detected']);
            }
        } else if ($sensorType === 'temperature' && $value < 37.5 && $value > 35.5) {
            $currentConditions = CurrentConditions::where('employee_id', $healthReading->employee_id)
                ->where('location_id', $locationId)
                ->get();

            foreach ($currentConditions as $condition) {
                $condition->update(['status' => 'High temperature', 'notes' => 'High temperature detected']);
            }
        }

        return response()->json(['message' => 'Health reading updated successfully', 'health_reading' => $healthReading]);
    }

    /**
     * Retrieve sensor data for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getSensorData(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $employee = Employee::where('user_id', $user->id)->first();
        $employeeId = $employee->employee_id;

        $healthReadingIds = HealthReadings::where('employee_id', $employeeId)->pluck('health_reading_id');

        $sensorData = SensorData::whereIn('health_reading_id', $healthReadingIds)->get();

        return response()->json(['sensor_data' => $sensorData]);
    }


}
