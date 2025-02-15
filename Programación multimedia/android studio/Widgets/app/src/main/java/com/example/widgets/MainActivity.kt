package com.example.widgets

import android.content.SharedPreferences
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        //////////////// CREAMOS UNA LISTA PARA HACERLA MUTABLE ///////////
        //le decimos que va a coontener una parej y que los datos van a ser de tipo string
        val lista = mutableListOf<Pair<String,String>>()
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
        /*
        /////////////////  PARA CONTROLES DE BOTON  ////////////////////////
        val texto:TextView = findViewById(R.id.texto)
        val boton:Button = findViewById(R.id.boton)

        boton.setOnClickListener {
            texto.text = "Has pulsado el boton"
        }
        */
        /*
        val boton:Button = findViewById(R.id.boton)
        val nombre:EditText = findViewById(R.id.nombre)
        val email:EditText = findViewById(R.id.email)
        boton.setOnClickListener{
            Toast.makeText(this,nombre.text, Toast.LENGTH_SHORT).show()
            Toast.makeText(this,email.text, Toast.LENGTH_SHORT).show()
            /*los añadimos a la lista mutable
            de esta manera si cerramos la aplciacion no se guarda en memoria*/
            lista.add(Pair(nombre.text.toString(),email.text.toString()))
            Toast.makeText(this,"Ahora tenemos "+lista.size.toString()+ "estos elementos", Toast.LENGTH_SHORT).show()
        }

        */
        ///////////////////// EJERCICIO DE PERSISTENCIA /////////////////////////////
        var preferencia: SharedPreferences = getSharedPreferences("preferencia", MODE_PRIVATE)
        /*
        ///_______________ PARA GUARDAR UN VALOR _________________///
        preferencia.edit().apply{
            putString("nombre", "Maria")
            apply()
        }
        ///_________________PARA RECUPERAR UN VALOR _______________///
        var mivalor = preferencia.getString("nombre","por defecto")
        Toast.makeText(this,mivalor.toString(),Toast.LENGTH_SHORT).show()
        */
        ///_________________PARA ELIMINAR UN VALOR _______________///
        preferencia.edit().apply{
            remove("nombre")
            apply()
        }
        ///_________________PARA ELIMINAR TODOS LOS VALORES _______________///
        preferencia.edit().apply{
            clear()
            apply()
        }
    }
}