<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\HealthReadings;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class HealthDataController extends Controller
{
    /**
     * Insert health data into the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function insertHealthData(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sensor_type' => 'required|string',
            'heart_rate' => 'nullable|numeric',
            'temperature' => 'nullable|numeric',
            'blood_pressure' => 'nullable|string',
            'localization' => 'required|in:en,ua',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'User is not found'], 400);
        }

        $employee = Employee::where('user_id', $user->id)->first();
        $employeeId = $employee->employee_id;

        $data = $validator->validated();

        if ($data['localization'] === 'ua') {
            $timestamp = Carbon::now()->locale('ua')->timezone('Europe/Kiev');
            $data['timestamp'] = $timestamp;
        }
        if ($data['localization'] === 'en') {
            $timestamp = Carbon::now()->locale('en')->timezone('Europe/London');
            $data['timestamp'] = $timestamp;
        }

        if ($data['sensor_type'] === 'temperature' && $data['localization'] === 'en') {
            $data['temperature'] = ($data['temperature'] * 9 / 5) + 32;
        }

        if ($data['sensor_type'] === 'blood_pressure') {
            $bloodPressure = explode('/', $data['blood_pressure']);
            $data['systolic_pressure'] = $bloodPressure[0];
            $data['diastolic_pressure'] = $bloodPressure[1];
            unset($data['blood_pressure']);
        }

        $data['employee_id'] = $employeeId;

        $healthReading = HealthReadings::create($data);

        return response()->json(['message' => 'Health reading inserted successfully', 'health_data' => $healthReading], 201);
    }

    /**
     * Retrieve health data for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getHealthData(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $employee = Employee::where('user_id', $user->id)->first();
        $employeeId = $employee->employee_id;

        $healthData = HealthReadings::where('employee_id', $employeeId)->get();

        return response()->json(['health_data' => $healthData]);
    }

    /**
     * Delete health data by ID.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteHealthData($id)
    {
        $healthData = HealthReadings::find($id);

        if (!$healthData) {
            return response()->json(['error' => 'Health data not found'], 404);
        }

        try {
            $healthData->sensorData()->delete();

            $healthData->delete();

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete health data'], 500);
        }

        return response()->json(['message' => 'Health data deleted successfully'], 200);
    }


}
