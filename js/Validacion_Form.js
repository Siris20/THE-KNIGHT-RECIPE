// Declaraciones de variables a nivel de script (pueden ser 'let' o 'const' si no se reasignan)
let form;
let nombreInput, apellidosInput, emailInput, telInput, telOpcionalInput,
    n_invitadosInput, t_eventoSelect, cpInput, costoEstimadoDisplay, resultadosDiv;

let Barra_bebidas_checkbox, Charcuteria_checkbox, Mesa_postres_checkbox,
    Cordinacion_evento_checkbox, Equipo_meseros_checkbox, Personalizado_checkbox;

// Constantes de precios 
const PRECIOS_BASE = {
    'Boda': 5000,
    'Fiesta': 4000,
    'Evento Corporativo': 3000
};
const PRECIO_POR_INVITADO = 150;
const PRECIOS_SERVICIOS_EXTRA = {
    'barra_de_bebidas': 2500,
    'charcuteria': 1200,
    'mesa_de_postres': 1400,
    'cordinacion_de_evento': 3000,
    'equipo_de_meseros': 4500,
    'personalizado': 4000
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telPattern = /^\d{10}$/;
const noNumerosPattern = /^\D*$/;
const cpPattern = /^\d{5}$/;

// CODIGO DOM
document.addEventListener('DOMContentLoaded', function() {
    // Asignación de referencias a los elementos del DOM.
    // Esto se hace *después* de que el DOM esté completamente cargado.
    form = document.getElementById('cotizacionForm');
    nombreInput = document.getElementById('nombre');
    apellidosInput = document.getElementById('apellidos');
    emailInput = document.getElementById('email');
    telInput = document.getElementById('tel');
    telOpcionalInput = document.getElementById('tel_opcional');
    n_invitadosInput = document.getElementById('n_invitados');
    t_eventoSelect = document.getElementById('t_evento');
    cpInput = document.getElementById('cp');
    costoEstimadoDisplay = document.getElementById('costoEstimado');
    resultadosDiv = document.querySelector('.resultados');

    Barra_bebidas_checkbox = document.getElementById('Barra_Bebidas');
    Charcuteria_checkbox = document.getElementById('Charcuteria');
    Mesa_postres_checkbox = document.getElementById('Mesa_Postres');
    Cordinacion_evento_checkbox = document.getElementById('Cordinacion_Evento');
    Equipo_meseros_checkbox = document.getElementById('Equipo_Meseros');
    Personalizado_checkbox = document.getElementById('Personalizado');

    // Listener para el envío del formulario
    form.addEventListener('submit', valida_envia);

    // Adición de listeners para el cálculo en tiempo real
    n_invitadosInput.addEventListener('input', () => calcularEstimadoInmediate());
    t_eventoSelect.addEventListener('change', () => calcularEstimadoInmediate());
    Barra_bebidas_checkbox.addEventListener('change', () => calcularEstimadoInmediate());
    Charcuteria_checkbox.addEventListener('change', () => calcularEstimadoInmediate());
    Mesa_postres_checkbox.addEventListener('change', () => calcularEstimadoInmediate());
    Cordinacion_evento_checkbox.addEventListener('change', () => calcularEstimadoInmediate());
    Equipo_meseros_checkbox.addEventListener('change', () => calcularEstimadoInmediate());
    Personalizado_checkbox.addEventListener('change', () => calcularEstimadoInmediate());


    
    function limpiarMensajes() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        if (resultadosDiv) {
            resultadosDiv.innerHTML = '';
            resultadosDiv.style.backgroundColor = 'transparent';
        }
        document.querySelectorAll('.form-control, .form-select').forEach(input => {
            input.style.borderColor = '';
        });
    }

    function mostrarMensajeParaCampo(inputElement, message) {
        let errorMessage = inputElement.nextElementSibling;
        if (!errorMessage || !errorMessage.classList.contains('error-message')) {
            errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message');
            inputElement.parentNode.insertBefore(errorMessage, inputElement.nextSibling);
        }
        errorMessage.textContent = message;
        inputElement.style.borderColor = 'red';
    }

    function mostrarMensajeGeneral(message, type = 'error') {
        if (resultadosDiv) {
            resultadosDiv.innerHTML = message;
            resultadosDiv.style.backgroundColor = type === 'error' ? 'red' : 'green';
            resultadosDiv.style.color = 'white';
            resultadosDiv.style.padding = '10px';
            resultadosDiv.style.marginTop = '10px';
            resultadosDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Función de validación del formulario (se mantiene casi igual)
    function valida_envia(event) {
        event.preventDefault();
        limpiarMensajes();

        let isValid = true;

        // Validaciones de campos obligatorios
        if (
            nombreInput.value.trim() === "" ||
            apellidosInput.value.trim() === "" ||
            emailInput.value.trim() === "" ||
            telInput.value.trim() === "" ||
            n_invitadosInput.value.trim() === "" ||
            t_eventoSelect.value === "" ||
            cpInput.value.trim() === ""
        ) {
            isValid = false;
            mostrarMensajeGeneral("Por favor, llene todos los campos obligatorios (*).", 'error');
            if (nombreInput.value.trim() === "") mostrarMensajeParaCampo(nombreInput, 'El nombre es obligatorio.');
            if (apellidosInput.value.trim() === "") mostrarMensajeParaCampo(apellidosInput, 'Los apellidos son obligatorios.');
            if (emailInput.value.trim() === "") mostrarMensajeParaCampo(emailInput, 'El correo es obligatorio.');
            if (telInput.value.trim() === "") mostrarMensajeParaCampo(telInput, 'El teléfono es obligatorio.');
            if (n_invitadosInput.value.trim() === "") mostrarMensajeParaCampo(n_invitadosInput, 'El número de invitados es obligatorio.');
            if (t_eventoSelect.value === "") mostrarMensajeParaCampo(t_eventoSelect, 'El tipo de evento es obligatorio.');
            if (cpInput.value.trim() === "") mostrarMensajeParaCampo(cpInput, 'El Código Postal es obligatorio.');
            return;
        }

        // Validaciones de formato
        if (!emailPattern.test(emailInput.value.trim())) {
            isValid = false;
            mostrarMensajeParaCampo(emailInput, "Por favor, ingrese un correo electrónico válido.");
        }
        if (isValid && !telPattern.test(telInput.value.trim())) {
            isValid = false;
            mostrarMensajeParaCampo(telInput, "El teléfono principal debe contener 10 dígitos numéricos.");
        }
        if (isValid && !noNumerosPattern.test(nombreInput.value.trim())) {
            isValid = false;
            mostrarMensajeParaCampo(nombreInput, "El nombre no debe contener números.");
        }
        if (isValid && !noNumerosPattern.test(apellidosInput.value.trim())) {
            isValid = false;
            mostrarMensajeParaCampo(apellidosInput, "Los apellidos no deben contener números.");
        }
        if (isValid && !cpPattern.test(cpInput.value.trim())) {
            isValid = false;
            mostrarMensajeParaCampo(cpInput, "El Código Postal debe contener exactamente 5 dígitos numéricos.");
        }

        let numInvitadosVal = parseInt(n_invitadosInput.value);
        if (isValid && (isNaN(numInvitadosVal) || numInvitadosVal < 1 || numInvitadosVal > 1000)) {
            isValid = false;
            mostrarMensajeParaCampo(n_invitadosInput, "El número de invitados debe ser un número entre 1 y 1000.");
        }

        if (isValid) {
            calcularEstimadoInmediate(); 
            mostrarMensajeGeneral("¡Formulario enviado y estimado calculado con éxito!", 'success');
        } else {
            const firstErrorField = document.querySelector('.form-control[style*="border-color: red"], .form-select[style*="border-color: red"]');
            if (firstErrorField) {
                firstErrorField.focus();
            }
        }
    }

    function calcularEstimadoInmediate() {
        calcularEstimado(
            n_invitadosInput,
            t_eventoSelect,
            costoEstimadoDisplay,
            Barra_bebidas_checkbox,
            Charcuteria_checkbox,
            Mesa_postres_checkbox,
            Cordinacion_evento_checkbox,
            Equipo_meseros_checkbox,
            Personalizado_checkbox,
            PRECIOS_BASE,
            PRECIO_POR_INVITADO,
            PRECIOS_SERVICIOS_EXTRA
        );
    }
});