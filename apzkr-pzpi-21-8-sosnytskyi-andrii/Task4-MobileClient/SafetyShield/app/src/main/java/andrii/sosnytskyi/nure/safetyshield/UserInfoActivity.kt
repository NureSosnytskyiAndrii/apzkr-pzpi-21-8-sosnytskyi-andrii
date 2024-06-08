package andrii.sosnytskyi.nure.safetyshield

import andrii.sosnytskyi.nure.safetyshield.adapters.UserInfoAdapter
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
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.*

class UserInfoActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: UserInfoAdapter
    private lateinit var addStateButton: Button
    private lateinit var addHealthReading: Button
    private lateinit var getHealthReading: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_info)

        recyclerView = findViewById(R.id.recyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)
        adapter = UserInfoAdapter()
        recyclerView.adapter = adapter

        addStateButton = findViewById(R.id.addStateButton)
        addHealthReading = findViewById(R.id.addPhysicalStateButton)
        getHealthReading = findViewById(R.id.getPhysicalStateButton)

        addStateButton.setOnClickListener {
            val intent = Intent(this, AddStateActivity::class.java)
            startActivity(intent)
        }

        addHealthReading.setOnClickListener {
            val intent = Intent(this, AddPhysicalStateActivity::class.java)
            startActivity(intent)
        }

        getHealthReading.setOnClickListener {
            val intent = Intent(this, ConditionInfoActivity::class.java)
            startActivity(intent)
        }

        getData()
    }

    fun getSavedToken(context: Context): String? {
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
                Log.e("AuthViewModel", "Token file does not exist.")
            }
        } catch (e: IOException) {
            Log.e("AuthViewModel", "Error reading token from file: ${e.message}")
        }
        return token
    }


    private fun getData() {
        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:8000/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val apiService = retrofit.create(ApiService::class.java)

        CoroutineScope(Dispatchers.IO).launch {
            try {

                val accessToken = getSavedToken(applicationContext)
                    Log.d("-----", "$accessToken");

                if (!accessToken.isNullOrEmpty()) {
                     val userInfoResponse = apiService.getUserInfo("Bearer $accessToken")


                    if (userInfoResponse.isSuccessful) {
                        val userInfo = userInfoResponse.body()
                        userInfo?.let {

                            CoroutineScope(Dispatchers.Main).launch {
                                adapter.setUser(userInfo)
                            }
                        }
                    } else {
                        Log.e("UserInfoActivity", "Error: ${userInfoResponse.errorBody()?.string()}")
                    }
                } else {
                    Log.e("UserInfoActivity", "Access token is empty or null.")
                }
            } catch (e: Exception) {
                Log.e("UserInfoActivity", "Failure: ${e.message}")
            }
        }

    }
}
