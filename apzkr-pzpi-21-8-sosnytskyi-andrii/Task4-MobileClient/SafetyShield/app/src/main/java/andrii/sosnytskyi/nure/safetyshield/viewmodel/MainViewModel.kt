package andrii.sosnytskyi.nure.safetyshield.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import andrii.sosnytskyi.nure.safetyshield.RetrofitClient
import andrii.sosnytskyi.nure.safetyshield.model.Organization
import andrii.sosnytskyi.nure.safetyshield.model.OrganizationResponse
import android.util.Log


class MainViewModel : ViewModel() {
    private val _organizations = MutableLiveData<List<Organization>>()
    val organizations: LiveData<List<Organization>> = _organizations

    private lateinit var token: String

    fun setToken(token: String?) {
        this.token = token ?: ""
    }

    fun fetchOrganizations() {
        val token = getSavedToken()
        if (token.isNullOrEmpty()) {
            Log.d("MainViewModel", "Token is null or empty")
            return
        }

        viewModelScope.launch {
            try {
                val response = RetrofitClient.instance.getOrganizations("Bearer $token")

                if (response.isSuccessful) {
                    val organizationResponse = response.body() as OrganizationResponse
                    _organizations.postValue(organizationResponse.organizations)
                } else {
                    Log.e("MainViewModel", "Error: ${response.errorBody()?.string()}")
                }
            } catch (e: Exception) {
                Log.e("MainViewModel", "Failure: ${e.message}")
            }
        }
    }

    fun getSavedToken(): String? {
        return "your_saved_token"
    }
}
