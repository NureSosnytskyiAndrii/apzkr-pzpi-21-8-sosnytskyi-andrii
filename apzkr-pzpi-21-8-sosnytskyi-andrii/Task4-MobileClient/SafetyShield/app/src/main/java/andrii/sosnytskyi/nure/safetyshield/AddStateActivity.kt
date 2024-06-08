package andrii.sosnytskyi.nure.safetyshield

import andrii.sosnytskyi.nure.safetyshield.interfaces.ApiService
import andrii.sosnytskyi.nure.safetyshield.model.SaveStateRequest
import andrii.sosnytskyi.nure.safetyshield.model.StateResponse
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

class AddStateActivity : AppCompatActivity() {

    private lateinit var statusEditText: EditText
    private lateinit var notesEditText: EditText
    private lateinit var saveStateButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_add_state)

        statusEditText = findViewById(R.id.statusEditText)
        notesEditText = findViewById(R.id.notesEditText)
        saveStateButton = findViewById(R.id.saveStateButton)

        saveStateButton.setOnClickListener {
            val status = statusEditText.text.toString()
            val notes = notesEditText.text.toString()

            if (status.isEmpty()) {
                Toast.makeText(this, "Status is required", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            saveState(status, notes)
        }
    }

    private fun saveState(status: String, notes: String) {
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

        val saveStateRequest = SaveStateRequest(status, notes)
        val call = apiService.saveState("Bearer $token", saveStateRequest)
        call.enqueue(object : Callback<StateResponse> {
            override fun onResponse(call: Call<StateResponse>, response: Response<StateResponse>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@AddStateActivity, "State saved successfully", Toast.LENGTH_SHORT).show()
                    finish()
                } else {
                    Toast.makeText(this@AddStateActivity, "Error: ${response.message()}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<StateResponse>, t: Throwable) {
                Toast.makeText(this@AddStateActivity, "Failure: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
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
                Log.e("AddStateActivity", "Token file does not exist.")
            }
        } catch (e: IOException) {
            Log.e("AddStateActivity", "Error reading token from file: ${e.message}")
        }
        return token
    }
}
