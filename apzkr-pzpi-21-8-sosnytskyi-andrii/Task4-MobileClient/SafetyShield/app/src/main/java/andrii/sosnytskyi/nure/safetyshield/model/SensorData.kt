package andrii.sosnytskyi.nure.safetyshield.model

data class SensorDataResponse(
    val sensor_data: List<SensorData>
)

data class SensorData(
    val reading_id: Int,
    val type: String,
    val value: String,
    val created: String,
    val health_reading_id: Int,
    val created_at: String,
    val updated_at: String
)

