package com.example.mychat.models

import com.google.gson.annotations.SerializedName

data class LoginResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("user_id") val userId: String?,
    @SerializedName("message") val message: String?
)
