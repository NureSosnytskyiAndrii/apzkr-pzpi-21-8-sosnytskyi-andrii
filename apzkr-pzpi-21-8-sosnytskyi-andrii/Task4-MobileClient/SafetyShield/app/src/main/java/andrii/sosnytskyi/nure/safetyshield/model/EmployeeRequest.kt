package andrii.sosnytskyi.nure.safetyshield.model

data class EmployeeRequest(
    val employeeId: Int,
    val position: String,
    val gender: String,
    val organizationId: Int
)
