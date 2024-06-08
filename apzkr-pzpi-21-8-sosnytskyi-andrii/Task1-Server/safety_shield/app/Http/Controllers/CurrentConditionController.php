<?php

namespace App\Http\Controllers;

use App\Models\CurrentConditions;
use App\Models\CurrentLocation;
use App\Models\Employee;
use App\Models\EmployeeLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CurrentConditionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'status' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $user = Auth::user();

        $employee = Employee::where('user_id', $user->id)->first();

        $locationIds = EmployeeLocation::where('employee_id', $employee->employee_id)->pluck('location_id');

        $locations = CurrentLocation::whereIn('location_id', $locationIds)->get();
        $location = $locations->first();

        $currentCondition = CurrentConditions::create([
            'condition_id' => $request->condition_id,
            'status' => $request->status,
            'notes' => $request->notes,
            'organization_id' => $employee->organization_id,
            'employee_id' => $employee->employee_id,
            'location_id' => $location->location_id,
        ]);

        return response()->json(['message' => 'Current condition created successfully', 'data' => $currentCondition], 201);
    }
}
