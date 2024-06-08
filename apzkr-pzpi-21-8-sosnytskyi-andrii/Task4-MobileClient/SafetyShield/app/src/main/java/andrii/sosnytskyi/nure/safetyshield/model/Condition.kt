package andrii.sosnytskyi.nure.safetyshield.model


data class ConditionResponse(
    val conditionInfo: ConditionInfo
)

data class ConditionInfo(
    val user_id: Int,
    val conditions: List<IndividualCondition>
)

data class IndividualCondition(
    val condition_id: Int,
    val status: String,
    val notes: String,
    val organization_id: Int,
    val employee_id: Int,
    val location_id: Int,
    val created_at: String,
    val updated_at: String
)



