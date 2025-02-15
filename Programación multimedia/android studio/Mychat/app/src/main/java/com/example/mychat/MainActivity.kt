package com.example.mychat

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.mychat.databinding.ActivityMainBinding
import com.example.mychat.models.LoginResponse
import com.example.mychat.network.ApiClient
import com.example.mychat.network.ApiService
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    // Instancia correcta de la API usando ApiClient
    private val apiService: ApiService by lazy {
        ApiClient.getApiService() // Se obtiene correctamente la API
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Manejar el clic del botón de login
        binding.btnLogin.setOnClickListener {
            val username = binding.etUsername.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()

            if (username.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Por favor, completa ambos campos", Toast.LENGTH_SHORT).show()
            } else {
                loginUser(username, password)
            }
        }
    }

    private fun loginUser(username: String, password: String) {
        apiService.login("login", username, password)
            .enqueue(object : Callback<LoginResponse> {
                override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                    if (response.isSuccessful) {
                        val loginRes = response.body()
                        if (loginRes != null) {
                            if (loginRes.success) {
                                // Inicio de sesión exitoso
                                Toast.makeText(this@LoginActivity, "Bienvenido, $username", Toast.LENGTH_LONG).show()
                            } else {
                                Toast.makeText(this@LoginActivity, loginRes.message, Toast.LENGTH_LONG).show()
                            }
                        } else {
                            Toast.makeText(this@LoginActivity, "Respuesta nula del servidor", Toast.LENGTH_LONG).show()
                        }
                    } else {
                        Toast.makeText(this@LoginActivity, "Error de conexión: ${response.code()}", Toast.LENGTH_LONG).show()
                    }
                }

                override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                    Toast.makeText(this@LoginActivity, "Fallo al conectar: ${t.message}", Toast.LENGTH_LONG).show()
                }
            })
    }
}
