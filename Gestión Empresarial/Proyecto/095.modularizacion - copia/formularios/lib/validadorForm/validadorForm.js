
// Seleccionamos todos los elementos <input> del documento
const entradas = document.querySelectorAll('input');

// Filtramos los inputs que tienen el atributo 'validadorForm', ya que solo esos necesitan validación
const validadores = Array.from(entradas).filter(input => input.getAttribute('validadorForm') !== null);
validadores.forEach(function(validador){
    validador.onblur = function(){
        switch(this.getAttribute('validadorForm')){
            case "dni":
                validar(/^[0-9]{8}[A-Z]$/,this,this.value);
                break;
			case "iban":
                validar(/^ES\d{22}$/,this,this.value);
                break;
			case "cp":
                validar(/^\d{5}$/,this,this.value);
                break;
			case "tarjetacredito":
                validar(/^\d{13,19}$/,this,this.value);
                break;
            case "tel": // Aquí es donde añadimos el validador de teléfono
                validar(/^\+?[0-9]{10,15}$/, this, this.value); // Expresión regular para teléfono
                break;
            case "email":
                validar(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, this, this.value); // Expresión regular para email
                break;
            case "texto":
                validar(/^.{2,}$/, this, this.value); // Expresión regular para cualquier texto
                break;
		}
    }
});

// Función que verifica si el valor del input cumple con la expresión regular
function validar(miregex, elemento, valor) {
    const regex = miregex;
    if (regex.test(valor)) { // Si el valor coincide con la expresión regular
        elemento.classList.remove("ko"); // Quitamos la clase 'ko' (indicador de error)
        elemento.classList.add("ok"); // Agregamos la clase 'ok' (indicador de éxito)
    } else { // Si el valor no es válido
        elemento.classList.remove("ok"); // Quitamos la clase 'ok'
        elemento.classList.add("ko"); // Agregamos la clase 'ko'
    }
}
