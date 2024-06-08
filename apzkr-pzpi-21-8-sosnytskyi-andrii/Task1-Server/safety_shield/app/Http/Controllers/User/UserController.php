<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\CurrentConditions;
use App\Models\CurrentLocation;
use App\Models\Employee;
use App\Models\EmployeeLocation;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{
    public function getUserInfo()
    {
        $user = Auth::user();

        if ($user) {
            $employee = Employee::where('user_id', $user->id)->first();

            $organization = $employee ? Organization::find($employee->organization_id) : null;

            return response()->json([
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'employee' => $employee ? [
                    'employee_id' => $employee->employee_id,
                    'position' => $employee->position,
                    'gender' => $employee->gender,
                    'organization_id' => $employee->organization_id,
                ] : null,
                'organization' => $organization ? [
                    'organization_id' => $organization->organization_id,
                    'organization_name' => $organization->organization_name,
                    'organization_activity' => $organization->organization_activity,
                    'address' => $organization->address,
                ] : null,
            ]);
        } else {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
    }

    public function getLocationForCurrentUser()
    {
        $user = Auth::user();

        $locationInfo = [
            'user_id' => $user->id,
            'location' => null
        ];

        $employee = Employee::where('user_id', $user->id)->first();

        if ($employee) {
            $employee_locations = EmployeeLocation::where('employee_id', $employee->employee_id)->get();

            if ($employee_locations->isNotEmpty()) {
                $locations = collect();

                foreach ($employee_locations as $employee_location) {
                    $location = CurrentLocation::where('location_id', $employee_location->location_id)->get();
                    $locations = $locations->concat($location);
                }

                $locationInfo['locations'] = $locations;
            }
        }

        return response()->json(['locationInfo' => $locationInfo]);
    }

    public function getConditionForCurrentUser()
    {
        $user = Auth::user();

        $conditionInfo = [
            'user_id' => $user->id,
            'conditions' => null
        ];

        $employee = Employee::where('user_id', $user->id)->first();

        if ($employee) {
            $conditions = CurrentConditions::where('organization_id', $employee->organization_id)
                ->where('employee_id', $employee->employee_id)
                ->get();
            if ($conditions->isNotEmpty()) {

                $conditionInfo['conditions'] = $conditions;
            }
        }

        return response()->json(['conditionInfo' => $conditionInfo]);

    }

    public function deleteAccount($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $authenticatedUser = Auth::user();
        if (!$authenticatedUser || $authenticatedUser->id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user->delete();

        return response()->json(['message' => 'Account deleted successfully'], 200);
    }
}
