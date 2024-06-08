package andrii.sosnytskyi.nure.safetyshield.interfaces

import andrii.sosnytskyi.nure.safetyshield.model.*
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.*


interface AuthService {
    @POST("api/auth/login")
    suspend fun login(@Body loginRequest: LoginRequest): Response<LoginResponse>

    @POST("api/auth/register")
    suspend fun register(@Body registerRequest: RegisterRequest): Response<RegisterResponse>

    @POST("api/auth/logout")
    suspend fun logout(@Header("Authorization") token: String): Response<Void>

    @GET("api/organizations")
    suspend fun getOrganizations(@Header("Authorization") token: String): Response<OrganizationResponse>

    @GET("api/user_info")
    suspend fun getUserInfo(@Header("Authorization") token: String): Response<UserInfo>

}


