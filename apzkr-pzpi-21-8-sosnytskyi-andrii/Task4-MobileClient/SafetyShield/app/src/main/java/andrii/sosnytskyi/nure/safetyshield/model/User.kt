package andrii.sosnytskyi.nure.safetyshield.model

data class User(val id: Int, val name: String, val email: String, val role: String)

data class UserInfo(
    val userId: Int,
    val name: String,
    val email: String,
    val employee: EmployeeRequest,
    val organization: Organization
)
