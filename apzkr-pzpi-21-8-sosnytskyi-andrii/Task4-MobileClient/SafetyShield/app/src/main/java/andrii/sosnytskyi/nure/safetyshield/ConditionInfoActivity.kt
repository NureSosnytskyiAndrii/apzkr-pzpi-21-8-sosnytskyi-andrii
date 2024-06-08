package andrii.sosnytskyi.nure.safetyshield

import andrii.sosnytskyi.nure.safetyshield.adapters.ConditionAdapter
import andrii.sosnytskyi.nure.safetyshield.interfaces.ApiService
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
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
import java.util.Collections.emptyList

class ConditionInfoActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: ConditionAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_condition_info)

        recyclerView = findViewById(R.id.recyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)
        adapter = ConditionAdapter()
        recyclerView.adapter = adapter

        val buttonToSensorData: Button = findViewById(R.id.buttonToSensorData)
        buttonToSensorData.setOnClickListener {
            val intent = Intent(this, SensorDataActivity::class.java)
            startActivity(intent)
        }

        getConditionData()
    }

    private fun getSavedToken(context: Context): String? {
        return try {
            val file = File(context.filesDir, "token.txt")
            if (file.exists()) {
                FileInputStream(file).bufferedReader().use { it.readLine() }
            } else {
                Log.e("ConditionInfoActivity", "Token file does not exist.")
                null
            }
        } catch (e: IOException) {
            Log.e("ConditionInfoActivity", "Error reading token from file: ${e.message}")
            null
        }
    }

    private fun getConditionData() {
        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:8000/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val apiService = retrofit.create(ApiService::class.java)

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val accessToken = getSavedToken(applicationContext)
                Log.d("AccessToken", accessToken ?: "Token is null or empty")

                if (!accessToken.isNullOrEmpty()) {
                    val conditionResponse = apiService.getConditionForCurrentUser("Bearer $accessToken")

                    if (conditionResponse.isSuccessful) {
                        val conditions = conditionResponse.body()?.conditionInfo?.conditions ?: emptyList()
                        withContext(Dispatchers.Main) {
                            adapter.setConditions(conditions)
                        }
                    } else {
                        Log.e("ConditionInfoActivity", "Error: ${conditionResponse.errorBody()?.string()}")
                    }
                } else {
                    Log.e("ConditionInfoActivity", "Access token is empty or null.")
                }
            } catch (e: Exception) {
                Log.e("ConditionInfoActivity", "Failure: ${e.message}")
            }
        }
    }
}

