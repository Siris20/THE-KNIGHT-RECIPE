function calcularEstimado(
    n_invitadosInputRef,
    t_eventoSelectRef,
    costoEstimadoDisplayRef,
    barraDeBebidasCheckboxRef,
    charcuteriaCheckboxRef,
    mesaPostresCheckboxRef,
    cordinacionEventoCheckboxRef,
    equipoMeserosCheckboxRef,
    personalizadoCheckboxRef,
    preciosBaseObj,
    precioPorInvitadoVal,
    preciosServiciosExtraObj
) {
    let costoTotal = 0;

    let numInvitados = parseInt(n_invitadosInputRef.value);
    let tipoEvento = t_eventoSelectRef.value;

    if (isNaN(numInvitados) || numInvitados <= 0 || tipoEvento === "") {
        costoEstimadoDisplayRef.textContent = "--"; // isNaN = is Not a Number
        return;
    }

    // Costo Base por Tipo de Evento
    if (preciosBaseObj[tipoEvento]) {
        costoTotal += preciosBaseObj[tipoEvento];
    } else {
        costoEstimadoDisplayRef.textContent = "--";
        return;
    }

    // Costo por Número de Invitados
    costoTotal += numInvitados * precioPorInvitadoVal;

    // Costo por Servicios Extra
    if (barraDeBebidasCheckboxRef && barraDeBebidasCheckboxRef.checked) {
        costoTotal += preciosServiciosExtraObj.barra_de_bebidas;
    }
    if (charcuteriaCheckboxRef && charcuteriaCheckboxRef.checked) {
        costoTotal += preciosServiciosExtraObj.charcuteria;
    }
    if (mesaPostresCheckboxRef && mesaPostresCheckboxRef.checked) {
        costoTotal += preciosServiciosExtraObj.mesa_de_postres;
    }
    if (cordinacionEventoCheckboxRef && cordinacionEventoCheckboxRef.checked) {
        costoTotal += preciosServiciosExtraObj.cordinacion_de_evento;
    }
    if (equipoMeserosCheckboxRef && equipoMeserosCheckboxRef.checked) {
        costoTotal += preciosServiciosExtraObj.equipo_de_meseros;
    }
    if (personalizadoCheckboxRef && personalizadoCheckboxRef.checked) {
        costoTotal += preciosServiciosExtraObj.personalizado;
    }

    // Mostrar el Resultado
    costoEstimadoDisplayRef.textContent = `$${costoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}