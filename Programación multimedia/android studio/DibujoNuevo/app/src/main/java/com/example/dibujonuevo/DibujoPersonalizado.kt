package com.example.dibujonuevo

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.util.AttributeSet
import android.view.SurfaceHolder
import android.view.SurfaceView

class DibujoPersonalizado(context: Context, attrs: AttributeSet? = null) : SurfaceView(context, attrs), SurfaceHolder.Callback {


    /// configuracion de pain para el dibujo
    private val paintaguamarina = Paint().apply {
        color = Color.rgb(102, 205, 170)
        style = Paint.Style.STROKE
        strokeWidth = 8f
    }
    private val paintcyan = Paint().apply {
        color = Color.rgb(0, 139, 139)
        style = Paint.Style.STROKE
        strokeWidth = 8f
    }

    init {
        holder.addCallback(this)
    }

    override fun surfaceCreated(holder: SurfaceHolder) {
        Thread {
            while (true) {
                val canvas = holder.lockCanvas()
                canvas?.let {
                    // Genera un color aleatorio
                    val randomColor = (Math.random() * 0xFFFFFF).toInt() or 0xFF000000.toInt()
                    paintcyan.color = randomColor // Aplica el color al Paint
                    //dibuja las formas con el nuevo color
                    dibujamos(it)
                    //liberamos el canvas
                    holder.unlockCanvasAndPost(it)
                }
                // Pausa de 500 ms antes de volver a dibujar
                Thread.sleep(500)
            }
        }.start()
    }

    private fun dibujamos(canvas: Canvas) {
        // Fondo blanco
        canvas.drawColor(Color.WHITE)

        // Configuración inicial para círculos concéntricos
        val centerX = width / 2f
        val centerY = height / 2f
        val maxRadius = Math.min(width, height) / 2f
        val step = 20f // Incremento de radio entre círculos

        // Dibujar círculos concéntricos
        for (radius in step.toInt()..maxRadius.toInt() step step.toInt()) {
            paintaguamarina.strokeWidth = 5f
            canvas.drawCircle(centerX, centerY, radius.toFloat(), paintaguamarina)
        }

        // Configuración inicial para líneas repetitivas
        val lineSpacing = 30f // Espacio entre líneas horizontales y verticales

        // Dibujar líneas horizontales
        for (y in 0..height step lineSpacing.toInt()) {
            canvas.drawLine(0f, y.toFloat(), width.toFloat(), y.toFloat(), paintcyan)
        }

        // Dibujar líneas verticales
        for (x in 0..width step lineSpacing.toInt()) {
            canvas.drawLine(x.toFloat(), 0f, x.toFloat(), height.toFloat(), paintcyan)
        }
    }


    override fun surfaceChanged(holder: SurfaceHolder, format: Int, width: Int, height: Int) {}

    override fun surfaceDestroyed(holder: SurfaceHolder) {}
}
