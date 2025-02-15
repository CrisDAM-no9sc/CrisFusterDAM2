package com.example.mychat.network

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ApiClient {
    private const val BASE_URL =  "http://10.0.2.2/ChatForest/"

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val client = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .build()

    // ✅ Creamos una única instancia de Retrofit
    private val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL) // Asegúrate de que esta URL termina con '/'
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    // ✅ Exponemos una función para obtener una instancia del servicio API
    fun getApiService(): ApiService {
        return retrofit.create(ApiService::class.java)
    }
}

