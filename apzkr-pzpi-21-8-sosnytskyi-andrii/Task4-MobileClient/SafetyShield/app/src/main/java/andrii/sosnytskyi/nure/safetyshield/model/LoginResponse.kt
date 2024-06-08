package andrii.sosnytskyi.nure.safetyshield.model

data class LoginResponse(val access_token: String, val user: User, val role: String)
