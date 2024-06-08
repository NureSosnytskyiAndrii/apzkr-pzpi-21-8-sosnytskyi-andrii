package andrii.sosnytskyi.nure.safetyshield.model

data class HealthDataRequest(
    val sensor_type: String,
    val heart_rate: String,
    val temperature: String,
    val blood_pressure: String?,
    val localization: String
)

