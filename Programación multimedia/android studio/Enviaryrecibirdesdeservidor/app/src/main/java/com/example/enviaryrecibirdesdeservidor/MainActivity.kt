package com.example.enviaryrecibirdesdeservidor

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Cambiar la URL al formato correcto para el emulador
        val url = URL("http://10.0.2.2/MyAppWeb/public/")
        val datos = """{"nombre":"Hola desde Android"}"""

        val conexion = url.openConnection() as HttpURLConnection

        try {
            println("Conectando a la URL...")
            conexion.requestMethod = "POST"
            conexion.setRequestProperty("Content-Type", "application/json;utf-8")
            conexion.setRequestProperty("Accept", "application/json")
            println("Conexión establecida. Enviando datos...")

            conexion.outputStream.use { outputStream ->
                OutputStreamWriter(outputStream).use { writer ->
                    writer.write(datos)
                    writer.flush()
                }
            }

            conexion.inputStream.bufferedReader().use { reader ->
                val respuesta = reader.readText()
                println("Respuesta del servidor: $respuesta")
            }
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            conexion.disconnect()
        }
    }
}
