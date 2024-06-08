package andrii.sosnytskyi.nure.safetyshield

import andrii.sosnytskyi.nure.safetyshield.adapters.SensorDataAdapter
import andrii.sosnytskyi.nure.safetyshield.interfaces.ApiService
import andrii.sosnytskyi.nure.safetyshield.model.SensorData
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.File
import java.io.FileInputStream
import java.io.IOException
import java.lang.Math.sqrt

class SensorDataActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: SensorDataAdapter
    private lateinit var textViewAverage: TextView
    private lateinit var textViewStdDeviation: TextView
    private lateinit var textViewMinHeartRate: TextView
    private lateinit var textViewMaxHeartRate: TextView
    private lateinit var textViewHealthIndex: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sensor_data)

        recyclerView = findViewById(R.id.recyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)
        adapter = SensorDataAdapter()
        recyclerView.adapter = adapter

        textViewAverage = findViewById(R.id.textViewAverage)
        textViewStdDeviation = findViewById(R.id.textViewStdDeviation)
        textViewMinHeartRate = findViewById(R.id.textViewMinHeartRate)
        textViewMaxHeartRate = findViewById(R.id.textViewMaxHeartRate)
        textViewHealthIndex = findViewById(R.id.textViewHealthIndex)

        getSensorData()
    }

    private fun getSavedToken(context: Context): String? {
        return try {
            val file = File(context.filesDir, "token.txt")
            if (file.exists()) {
            // Read the token from the file and return it
                FileInputStream(file).bufferedReader().use { it.readLine() }
            } else {
                Log.e("SensorDataActivity", "Token file does not exist.")
                null
            }
        } catch (e: IOException) {
            Log.e("SensorDataActivity", "Error reading token from file: ${e.message}")
            null
        }
    }

    private fun getSensorData() {

    // Create Retrofit instance for network calls
        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:8000/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val apiService = retrofit.create(ApiService::class.java)

    // Using Coroutines for asynchronous network request
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val accessToken = getSavedToken(applicationContext)
                Log.d("AccessToken", accessToken ?: "Token is null or empty")

                if (!accessToken.isNullOrEmpty()) {
                 // Perform network request to fetch sensor data
                    val sensorDataResponse = apiService.getSensorData("Bearer $accessToken")

                    if (sensorDataResponse.isSuccessful) {
                        val sensorData = sensorDataResponse.body()?.sensor_data ?: emptyList()
                        withContext(Dispatchers.Main) {
                            adapter.setSensorData(sensorData)
                            calculateAndDisplayHealthMetrics(sensorData)
                        }
                    } else {
                        Log.e("SensorDataActivity", "Error: ${sensorDataResponse.errorBody()?.string()}")
                    }
                } else {
                    Log.e("SensorDataActivity", "Access token is empty or null.")
                }
            } catch (e: Exception) {
                Log.e("SensorDataActivity", "Failure: ${e.message}")
            }
        }
    }

    private fun calculateAndDisplayHealthMetrics(sensorDataList: List<SensorData>) {
        val heartRateValues = sensorDataList.filter { it.type == "heart_rate" }.mapNotNull { it.value.toIntOrNull() }

        if (heartRateValues.isNotEmpty()) {
            val average = heartRateValues.average()
            val stdDeviation = sqrt(heartRateValues.map { (it - average) * (it - average) }.average())
            val minHeartRate = heartRateValues.minOrNull() ?: 0
            val maxHeartRate = heartRateValues.maxOrNull() ?: 0

            // Example of a "health index" formula
            val healthIndex = calculateHealthIndex(average, stdDeviation, minHeartRate, maxHeartRate)

            textViewAverage.text = "Average Heart Rate: %.2f".format(average)
            textViewStdDeviation.text = "Std Deviation: %.2f".format(stdDeviation)
            textViewMinHeartRate.text = "Min Heart Rate: $minHeartRate"
            textViewMaxHeartRate.text = "Max Heart Rate: $maxHeartRate"
            textViewHealthIndex.text = "Health Index: %.2f".format(healthIndex)
        } else {
            textViewAverage.text = "No heart rate data available"
            textViewStdDeviation.text = ""
            textViewMinHeartRate.text = ""
            textViewMaxHeartRate.text = ""
            textViewHealthIndex.text = ""
        }
    }

    private fun calculateHealthIndex(average: Double, stdDeviation: Double, minHeartRate: Int, maxHeartRate: Int): Double {
         return (average - stdDeviation + minHeartRate + maxHeartRate) / 4
    }
}
