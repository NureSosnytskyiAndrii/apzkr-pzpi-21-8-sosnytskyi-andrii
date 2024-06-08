package andrii.sosnytskyi.nure.safetyshield

import andrii.sosnytskyi.nure.safetyshield.viewmodel.MainViewModel
import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.lifecycle.ViewModelProvider
import android.view.View
import android.widget.Button
import androidx.lifecycle.Observer

private lateinit var viewModel: MainViewModel

class MainActivity : AppCompatActivity() {

    private lateinit var viewModel: MainViewModel
    private lateinit var loginButton: Button
    private lateinit var registerButton: Button
    private lateinit var viewOrganizationsButton: Button
    private lateinit var viewUserInfoButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        viewModel = ViewModelProvider(this).get(MainViewModel::class.java)

        loginButton = findViewById(R.id.loginButton)
        registerButton = findViewById(R.id.registerButton)

        viewOrganizationsButton = findViewById(R.id.viewOrganizationsButton)
        viewUserInfoButton = findViewById(R.id.getUserInfoButton)

        loginButton.setOnClickListener {
            onLoginButtonClick()
        }

        registerButton.setOnClickListener {
           onRegisterButtonClick()
        }

        viewOrganizationsButton.setOnClickListener {
            onViewOrganizationsButtonClick()
        }
        viewUserInfoButton.setOnClickListener {
            onViewUserInfoButtonClick()
        }


    }

    private fun onLoginButtonClick() {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
    }

    private fun onRegisterButtonClick() {
        val intent = Intent(this, RegisterActivity::class.java)
        startActivity(intent)
    }

    private fun onViewOrganizationsButtonClick() {
        val intent = Intent(this, OrganizationActivity::class.java)
        startActivity(intent)
    }

    private fun onViewUserInfoButtonClick() {
        val intent = Intent(this, UserInfoActivity::class.java)
        startActivity(intent)
    }

}
