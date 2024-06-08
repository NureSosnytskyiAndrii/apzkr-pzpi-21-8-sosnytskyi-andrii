package andrii.sosnytskyi.nure.safetyshield.interfaces

import andrii.sosnytskyi.nure.safetyshield.model.*
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST

interface ApiService {

    @GET("api/organizations")
    suspend fun getOrganizations(@Header("Authorization") token: String): Response<List<Organization>>

    @GET("api/user_info")
    suspend fun getUserInfo(@Header("Authorization") token: String): Response<UserInfo>

    @GET("api/user_condition")
    suspend fun getConditionForCurrentUser(@Header("Authorization") token: String): Response<ConditionResponse>

    @GET("api/get_sensor_data")
    suspend fun getSensorData(@Header("Authorization") token: String): Response<SensorDataResponse>

    @POST("api/current_condition")
    fun saveState(
        @Header("Authorization") token: String,
        @Body saveStateRequest: SaveStateRequest
    ): Call<StateResponse>

    @POST("api/health_reading")
    fun insertHealthData(
        @Header("Authorization") token: String,
        @Body healthDataRequest: HealthDataRequest
    ): Call<HealthDataResponse>

}
