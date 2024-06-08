<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CurrentConditions;
use App\Models\CurrentLocation;
use App\Models\Employee;
use App\Models\Organization;
use App\Models\HealthReadings;
use App\Models\SensorData;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function index()
    {
        return response()->json(['message' => 'Welcome to Admin Panel!']);
    }

    public function getAllUsers($id = null)
    {
        if ($id !== null) {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            return response()->json(['user' => $user]);

        } else {
            $users = User::all();

            $userData = $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'surname' => $user->surname,
                    'email' => $user->email,
                    'role' => $user->role,
                ];
            });

            return response()->json(['users' => $userData]);
        }
    }

    public function addOrganization(Request $request)
    {
        $request->validate([
            'organization_name' => 'required|string',
            'organization_activity' => 'required|string',
            'address' => 'required|string'
        ]);

        $organization = Organization::create([
            'organization_name' => $request->organization_name,
            'organization_activity' => $request->organization_activity,
            'address' => $request->address
        ]);

        return response()->json(['message' => 'Organization added successfully', 'organization' => $organization], 201);
    }

    public function updateOrganization(Request $request, $id)
    {
        $request->validate([
            'organization_name' => 'string',
            'organization_activity' => 'string',
            'address' => 'string'
        ]);

        $organization = Organization::find($id);

        if (!$organization) {
            return response()->json(['error' => 'Organization not found'], 404);
        }

        $organization->fill($request->all());
        $organization->save();

        return response()->json(['message' => 'Organization updated successfully', 'organization' => $organization]);
    }

    public function getAllOrganizations($id = null)
    {
        if ($id !== null) {
            $organization = Organization::find($id);

            if (!$organization) {
                return response()->json(['error' => 'Organization not found'], 404);
            }

            return response()->json(['organization' => $organization]);

        } else {
            $organizations = Organization::all();

            return response()->json(['organizations' => $organizations]);
        }
    }

    public function deleteOrganization($id)
    {
        $organization = Organization::find($id);

        if (!$organization) {
            return response()->json(['error' => 'Organization not found'], 404);
        }

        $organization->delete();

        return response()->json(['message' => 'Organization deleted successfully']);
    }

    public function addEmployee(Request $request)
    {
        $request->validate([
            'employee_id' => 'integer',
            'position' => 'required|string|max:255',
            'gender' => 'required|string|max:255',
            'user_id' => 'required|integer',
            'organization_id' => 'required|integer',
        ]);

        $employee = Employee::create([
            'employee_id' => $request->employee_id,
            'position' => $request->position,
            'gender' => $request->gender,
            'user_id' => $request->user_id,
            'organization_id' => $request->organization_id
        ]);

        return response()->json(['message' => 'Employee added successfully', 'employee' => $employee], 201);
    }

    public function getAllEmployees($id = null)
    {
        if ($id !== null) {
            $employee = Employee::find($id);

            if (!$employee) {
                return response()->json(['error' => 'Employee not found'], 404);
            }

            return response()->json(['employee' => $employee]);

        } else {
            $employees = Employee::all();

            return response()->json(['employees' => $employees]);
        }
    }
    public function deleteEmployee($id)
    {
        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['error' => 'Employee not found'], 404);
        }

        $employee->delete();

        return response()->json(['message' => 'Employee deleted successfully']);
    }

    public function updateEmployee(Request $request, $id)
    {
        $request->validate([
            'employee_id' => 'integer',
            'position' => 'string|max:255',
            'gender' => 'string|max:255',
            'user_id' => 'integer',
            'organization_id' => 'integer',
        ]);

        $employee = Employee::find($id);

        if (!$employee) {
            return response()->json(['error' => 'Employee not found'], 404);
        }

        $employee->fill($request->all());
        $employee->save();

        return response()->json(['message' => 'Employee updated successfully', 'employee' => $employee]);
    }

    public function deleteUser($userId)
    {
        DB::beginTransaction();

        try {
            $user = User::find($userId);

            if (!$user) {
                throw new \Exception('User not found');
            }

            $user->delete();

            DB::commit();

            return response()->json(['message' => 'User deleted successfully'], 200);

        } catch (\Exception $e) {

            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getCurrentConditions($id = null)
    {
        $query = CurrentConditions::query();
        if ($id !== null) {
            $query->where('condition_id', $id);
        }
        $conditions = $query->get();
        return response()->json(['current_conditions' => $conditions]);
    }


    public function getCurrentLocations($id = null)
    {
        $query = CurrentLocation::query();
        if ($id !== null) {
            $query->where('location_id', $id);
        }
        $locations = $query->get();
        return response()->json(['current_locations' => $locations]);
    }

    public function getHealthReadings($id = null)
    {
        $query = HealthReadings::query();
        if ($id !== null) {
            $query->where('health_reading_id', $id);
        }
        $readings = $query->get();
        return response()->json(['health_readings' => $readings]);
    }

    public function getSensorData($id = null)
    {
        $query = SensorData::query();
        if ($id !== null) {
            $query->where('id', $id);
        }
        $sensorData = $query->get();
        return response()->json(['sensor_data' => $sensorData]);
    }
}
