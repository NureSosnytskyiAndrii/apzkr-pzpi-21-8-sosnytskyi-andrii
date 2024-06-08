package andrii.sosnytskyi.nure.safetyshield

import andrii.sosnytskyi.nure.safetyshield.interfaces.ApiService
import andrii.sosnytskyi.nure.safetyshield.model.HealthDataRequest
import andrii.sosnytskyi.nure.safetyshield.model.HealthDataResponse
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.BufferedReader
import java.io.File
import java.io.FileInputStream
import java.io.IOException
import java.io.InputStreamReader

class AddPhysicalStateActivity : AppCompatActivity() {

    private lateinit var sensorTypeEditText: EditText
    private lateinit var heartRateEditText: EditText
    private lateinit var temperatureEditText: EditText
    private lateinit var bloodPressureEditText: EditText
    private lateinit var localizationEditText: EditText
    private lateinit var savePhysicalStateButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_health_reading)

        sensorTypeEditText = findViewById(R.id.sensorTypeEditText)
        heartRateEditText = findViewById(R.id.heartRateEditText)
        temperatureEditText = findViewById(R.id.temperatureEditText)
        bloodPressureEditText = findViewById(R.id.bloodPressureEditText)
        localizationEditText = findViewById(R.id.localizationEditText)
        savePhysicalStateButton = findViewById(R.id.savePhysicalStateButton)

        savePhysicalStateButton.setOnClickListener {
            val sensorType = sensorTypeEditText.text.toString()
            val heartRate = heartRateEditText.text.toString()
            val temperature = temperatureEditText.text.toString()
            val bloodPressure = bloodPressureEditText.text.toString()
            val localization = localizationEditText.text.toString()

            if (sensorType.isEmpty() || localization.isEmpty()) {
                Toast.makeText(this, "Sensor type and localization are required", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            savePhysicalState(sensorType, heartRate, temperature, bloodPressure, localization)
        }
    }

    private fun savePhysicalState(sensorType: String, heartRate: String, temperature: String, bloodPressure: String, localization: String) {
        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:8000/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val apiService = retrofit.create(ApiService::class.java)
        val token = getSavedToken(applicationContext)

        if (token == null) {
            Toast.makeText(this, "Token not found", Toast.LENGTH_SHORT).show()
            return
        }

        val request = HealthDataRequest(sensorType, heartRate, temperature, bloodPressure, localization)
        val call = apiService.insertHealthData("Bearer $token", request)
        call.enqueue(object : Callback<HealthDataResponse> {
            override fun onResponse(call: Call<HealthDataResponse>, response: Response<HealthDataResponse>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@AddPhysicalStateActivity, "Physical state saved successfully", Toast.LENGTH_SHORT).show()
                    finish()
                } else {
                    Toast.makeText(this@AddPhysicalStateActivity, "Error: ${response.message()}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<HealthDataResponse>, t: Throwable) {
                Toast.makeText(this@AddPhysicalStateActivity, "Failure: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun getSavedToken(context: Context): String? {
        var token: String? = null
        try {
            val file = File(context.filesDir, "token.txt")
            if (file.exists()) {
                val fileInputStream = FileInputStream(file)
                val inputStreamReader = InputStreamReader(fileInputStream)
                val bufferedReader = BufferedReader(inputStreamReader)
                token = bufferedReader.readLine()
                fileInputStream.close()
            } else {
                Log.e("AddPhysicalStateActivity", "Token file does not exist.")
            }
        } catch (e: IOException) {
            Log.e("AddPhysicalStateActivity", "Error reading token from file: ${e.message}")
        }
        return token
    }
}
