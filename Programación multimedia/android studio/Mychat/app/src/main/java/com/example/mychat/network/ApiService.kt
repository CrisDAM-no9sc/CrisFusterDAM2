package com.example.mychat.network

import com.example.mychat.models.LoginResponse
import retrofit2.Call
import retrofit2.http.*

interface ApiService {
    @FormUrlEncoded
    @POST("server.php") // ✅ Solo la ruta, Retrofit usa BASE_URL
    fun login(
        @Field("action") action: String,
        @Field("username") username: String,
        @Field("password") password: String
    ): Call<LoginResponse>
}
