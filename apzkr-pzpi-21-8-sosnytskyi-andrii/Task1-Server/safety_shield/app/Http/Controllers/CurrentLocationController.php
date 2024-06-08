<?php

namespace App\Http\Controllers;

use App\Models\CurrentLocation;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CurrentLocationController extends Controller
{
    /**
     * Store a newly created current location in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'latitude' => 'required',
            'longitude' => 'required',
            'office_latitude' => 'required',
            'office_longitude' => 'required',
            'notes' => 'nullable|string',
            'timestamp' => 'nullable|date',
        ]);

        $user = Auth::user();

        $distance = $this->calculateDistance($request->latitude, $request->longitude, $request->office_latitude, $request->office_longitude);

        $currentLocation = CurrentLocation::create([
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'notes' => 'Distance to office: ' . $distance,
            'timestamp' => $request->timestamp,
        ]);

        $employee = Employee::where('user_id', $user->id)->first();

        $employee->location()->attach($currentLocation->id);

        return response()->json(['message' => 'Current location created successfully', 'data' => $currentLocation], 201);
    }

    /**
     * Calculate the distance between two geographical coordinates.
     *
     * @param  float  $lat1  Latitude of the first point
     * @param  float  $lon1  Longitude of the first point
     * @param  float  $lat2  Latitude of the second point
     * @param  float  $lon2  Longitude of the second point
     * @return float  Distance between the two points in kilometers
     */
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371;

        $latFrom = deg2rad($lat1);
        $lonFrom = deg2rad($lon1);
        $latTo = deg2rad($lat2);
        $lonTo = deg2rad($lon2);

        $deltaLat = $latTo - $latFrom;
        $deltaLon = $lonTo - $lonFrom;
        $a = sin($deltaLat / 2) * sin($deltaLat / 2) + cos($latFrom) * cos($latTo) * sin($deltaLon / 2) * sin($deltaLon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        $distance = $earthRadius * $c;

        return $distance;
    }
}
