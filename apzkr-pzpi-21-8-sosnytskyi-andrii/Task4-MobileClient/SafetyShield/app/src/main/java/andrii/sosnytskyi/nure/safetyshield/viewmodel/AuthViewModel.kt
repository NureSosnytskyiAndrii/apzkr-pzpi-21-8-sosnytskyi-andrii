package andrii.sosnytskyi.nure.safetyshield.viewmodel

import andrii.sosnytskyi.nure.safetyshield.RetrofitClient
import andrii.sosnytskyi.nure.safetyshield.model.LoginRequest
import andrii.sosnytskyi.nure.safetyshield.model.LoginResponse
import android.content.Context
import android.content.Context.MODE_PRIVATE
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import java.io.*

class AuthViewModel : ViewModel() {

    // LiveData to hold the result of the login request
    private val _loginResult = MutableLiveData<LoginResponse>()
    val loginResult: LiveData<LoginResponse> = _loginResult

    // LiveData to hold error messages
    private val _error = MutableLiveData<String>()
    val error: LiveData<String> = _error

    // LiveData to hold the user role
    private val _userRole = MutableLiveData<String>()
    val userRole: LiveData<String> = _userRole

    // Function to handle login, perform network request, and save token and role to file
    fun login(email: String, password: String, context: Context) {
        viewModelScope.launch {
            try {
                val response = RetrofitClient.instance.login(LoginRequest(email, password))
                if (response.isSuccessful) {
                    val loginResponse = response.body()
                    _loginResult.postValue(loginResponse)
                    loginResponse?.access_token?.let { saveTokenToFile(it, context) }
                    loginResponse?.role?.let { saveUserRole(it, context) }
                } else {
                    _error.postValue("Login failed: ${response.message()}")
                }
            } catch (e: Exception) {
                _error.postValue("Exception: ${e.message}")
            }
        }
    }

    // Function to save the token to a file
    private fun saveTokenToFile(token: String, context: Context) {
        deleteTokenFile(context)
        try {
            val fileOutputStream = context.openFileOutput("token.txt", MODE_PRIVATE)
            val outputStreamWriter = OutputStreamWriter(fileOutputStream)
            val bufferedWriter = BufferedWriter(outputStreamWriter)
            bufferedWriter.write(token)
            bufferedWriter.close()
        } catch (e: IOException) {
            Log.e("andrii.sosnytskyi.nure.safetyshield.viewmodel.AuthViewModel", "Error saving token to file: ${e.message}")
        }
    }

    // Function to delete the token file if it exists
    fun deleteTokenFile(context: Context) {
        val file = File(context.filesDir, "token.txt")
        if (file.exists()) {
            file.delete()
        }
    }

    // Function to save the user role to a file
    private fun saveUserRole(role: String, context: Context) {
        try {
            val fileOutputStream = context.openFileOutput("role.txt", MODE_PRIVATE)
            val outputStreamWriter = OutputStreamWriter(fileOutputStream)
            val bufferedWriter = BufferedWriter(outputStreamWriter)
            bufferedWriter.write(role)
            bufferedWriter.close()
        } catch (e: IOException) {
            Log.e("andrii.sosnytskyi.nure.safetyshield.viewmodel.AuthViewModel", "Error saving role to file: ${e.message}")
        }
    }

    // Function to retrieve the saved token from a file
    fun getSavedToken(context: Context): String? {
        var token: String? = null
        try {
            val fileInputStream = context.openFileInput("token.txt")
            val inputStreamReader = InputStreamReader(fileInputStream)
            val bufferedReader = BufferedReader(inputStreamReader)
            token = bufferedReader.readLine()
            fileInputStream.close()
        } catch (e: IOException) {
            Log.e("andrii.sosnytskyi.nure.safetyshield.viewmodel.AuthViewModel", "Error reading token from file: ${e.message}")
        }
        return token
    }

    // Function to retrieve the saved user role from a file
    fun getUserRole(context: Context): String? {
        var role: String? = null
        try {
            val fileInputStream = context.openFileInput("role.txt")
            val inputStreamReader = InputStreamReader(fileInputStream)
            val bufferedReader = BufferedReader(inputStreamReader)
            role = bufferedReader.readLine()
            fileInputStream.close()
        } catch (e: IOException) {
            Log.e("andrii.sosnytskyi.nure.safetyshield.viewmodel.AuthViewModel", "Error reading role from file: ${e.message}")
        }
        return role
    }
}

