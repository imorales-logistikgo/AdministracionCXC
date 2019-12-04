var PrecioTotal = "";
var CostoTotal = "";
var MOPTotal = "";
var IsAdministrador = false;

//IsAdministrador = (($('#HFIDTransportista_LOG').val() === '0') && ($('#HFIDCliente_LOG').val() === '0') && ($('#HFIDOPL_LOG').val() === '0')) ? true : false;
//$('#HFIsAdimistrador').val(Boolean(IsAdministrador));

var arrTipo = ['T0', 'T1', 'CUSTODIA', 'RECOLECCION', 'T2'];

var arrOptionsFecha = [
    { value: "FechaAlta", text: "Entry date" },
    { value: "FechaCitaCarga", text: "Appointment loading date" },
    { value: "FechaCarga", text: "Loading date" },
    { value: "FechaCargaReal", text: "Real loading date" },
    { value: "FechaCitaDescarga", text: "Appointment downloading date" },
    { value: "FechaDescarga", text: "Downloading date" },
    { value: "ETA", text: "ETA" },
    { value: "FechaCitaCarga", text: "Appointment loading date" },
    { value: "FechaRecEviFisicas", text: "Physical evidence delivered date" },
];

var enum_cbo_types = {
    transportistas: {
        text: 'NombreComercial',
        value: 'IDTransportista',
        fnGet: getTransportistas,
    },
    clientes_fiscales: {
        text: 'NombreComercial',
        value: 'IDCliente',
        fnGet: getClientesFiscales,
        datas: [
            {
                nombre: 'gpm',
                source: 'GPM'
            },
        ]
    },
    shipper: {
        text: 'NombreComercial',
        value: 'IDCliente',
        fnGet: getClientesShipper,
        datas: [
            {
                nombre: 'municipioestado',
                source: 'MunicipioEstado'
            },
        ]
    },
    opl: {
        text: 'Nombre',
        value: 'IDUsuario',
        fnGet: getOPLs,
    },
    unidades_medida: {
        text: 'Nombre',
        value: 'IDTipoEmbalaje',
        fnGet: getUnidadesMedida,
    },
    clasificaciones: {
        text: 'Nombre',
        value: 'IDClasificacion',
        fnGet: getClasificaciones,
    },
    Descripcionxclasificaciones: {
        text: 'Nombre',
        value: 'IDDescripcionxClasificacion',
        fnGet: getDescxClasificacion,
    },
    tipos_unidades_transporte: {
        text: 'Nombre',
        value: 'IDTipoUnidad',
        fnGet: getTipoUnidadesTransporte,
    },
    foliosT0: {
        text: 'Especificaciones',
        value: 'IDBro_Viaje',
        fnGet: getFoliosT0,
    },
    remolques: {
        text: 'Nombre_Remolque',
        value: 'IDRemolque',
        fnGet: getRemolques,
    },
    operadores: {
        text: 'OperadorNombre',
        value: 'IDOperador',
        fnGet: getOperadores,
    },
    tractos: {
        text: 'Descripcion',
        value: 'IDTracto',
        fnGet: getTractos
    },
    unidades_sencillas: {
        text: 'UnidadSencilla',
        value: 'IDUnidadTransportista',
        fnGet: getUnidadesSencillas,
    },
    foliosT1: {
        text: 'Especificaciones',
        value: 'IDBro_Viaje',
        fnGet: obtenerFoliosT1
    }
};

var typeTableViajesReportes = {
    Seguimiento: {
        rowId: 'IDBro_Viaje',
        "scrollX": true,
        responsive: true,
        columns: [
            {
                className: "dt-head-center  dt-body-center",
                mRender: function (data, type, full) {
                    return '<a id="btnDetallesViaje"><strong>' + full.Folio + '<strong/></a>';
                },
                width: "100px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "UsuarioAlta",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-center",
                data: "FechaAlta",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "OrdenCompra",
                mRender: function (data, type, full) {
                    return (data != '' && data != null ? data.substring(0, 9) : 'N/A');
                },
                width: "100px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "ClienteOrigen",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "CiudadOrigen",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                mRender: function (data, type, full) {
                    if ($('#HFTipoViaje').val() == 'T0') { return full.ClienteDestino; }
                    else { return full.ClienteConsigne; }
                }, width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                mRender: function (data, type, full) {
                    if ($('#HFTipoViaje').val() == 'T0') { return full.CiudadDestino; }
                    else { return full.CiudadConsigne; }
                }, width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                mRender: function (data, type, full) {
                    if ($('#HFIDCliente').val() == 2599) {
                        return 'Logisti k De México'
                    }
                    else {
                        return full.Transportista
                    }
                }, width: "120px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "Remolque",
                width: "120px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "Tracto",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "FechaIniciado", // INICIADO
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "FechaLlegadaOrigen",  // LLEGADA ORIGEN
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "FechaCarga",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "FechaRuta",//RUTA                  
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left", // LLEGADA TRANSFER
                data: "FechaIntercambio",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "FechaCruce",// CRUCE
                width: "150px",
            },
            //{
            //    className: "dt-head-center  dt-body-left",
            //    data: "strFechaDescarga",
            //    width: "150px",
            //},
            //{
            //    className: "dt-head-center  dt-body-left",
            //    data: "FechaCarga",  // CARGA
            //    width: "150px",
            //},
            {
                className: "dt-head-center  dt-body-left",
                data: "FechaLlegadaDestino",// DESTINO
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "FechaDescarga",// DESCARGA
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "FechaFinalizado",// FINALIZADO
                width: "150px",
            },
            //{
            //    className: "dt-head-center  dt-body-left",
            //    mRender: function (data, type, full) {
            //        if ($('#HFTipoViaje').val() == 'T0') { return full.FechaLlegadaDestino; } // LLEGADADESTINO
            //        else { return full.FechaIntercambio; }
            //    },
            //    width: "150px",
            //},
            //{
            //    className: "dt-head-center  dt-body-left",
            //    mRender: function (data, type, full) {
            //        if ($('#HFTipoViaje').val() == 'T0') { return full.FechaDescarga; } // DESCARGA
            //        else { return full.FechaCruce; }
            //    },
            //    width: "150px",
            //},
            //{
            //    className: "dt-head-center  dt-body-left",
            //    mRender: function (data, type, full) {
            //        if ($('#HFTipoViaje').val() == 'T0') { return full.FechaFinalizado; } // FINALIZADO
            //        else { return full.FechaLlegadaDestino; }
            //    },
            //    width: "150px",
            //},
        ]
    },
    Movimientos: {
        rowId: 'IDBro_Viaje',
        "scrollX": true,
        responsive: true,
        columns: [
            {
                className: "dt-head-center  dt-body-center",
                width: "120px",
                mRender: function (data, type, full) {
                    return '<a id="btnDetallesViaje"><strong>' + full.Folio + '<strong/></a>';
                },
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "UsuarioAlta",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "FechaAlta",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "ClienteOrigen",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "CiudadOrigen",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                mRender: function (data, type, full) {
                    if ($('#HFTipoViaje').val() == 'T0') {

                        return full.ClienteDestino;
                    }
                    else {
                        return full.ClienteConsigne;
                    }
                },
                width: "130px",
            },
            {
                className: "dt-head-center  dt-body-left",
                mRender: function (data, type, full) {
                    if ($('#HFTipoViaje').val() == 'T0') {
                        return full.CiudadDestino;
                    }
                    else {
                        return full.CiudadConsigne;
                    }
                },
                width: "130px",
            },
            {
                className: "dt-head-center  dt-body-left",
                name: "statusProceso",
                data: "StatusProceso",
                width: "100px",
            },
            {
                className: "dt-head-center  dt-body-center",
                data: "FechaIniciado",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "UsuarioInicia",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-center",
                data: "FechaLlegadaOrigen",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "UsuarioLlegadaOrigen",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-center",
                data: "FechaCarga",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "UsuarioCarga",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-center",
                data: "FechaRuta",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "UsuarioRuta",
                width: "150px",
            },
            {
                visible: ($('#HFTipoViaje').val() == 'T0'),
                className: "dt-head-center  dt-body-center",
                data: "FechaIntercambio",
                width: "150px",
            },
            {
                visible: ($('#HFTipoViaje').val() == 'T0'),
                className: "dt-head-center  dt-body-left",
                data: "UsuarioIntercambio",
                width: "150px",
            },
            {
                visible: ($('#HFTipoViaje').val() == 'T0'),
                className: "dt-head-center  dt-body-center",
                data: "FechaCruce",
                width: "150px",
            },
            {
                visible: ($('#HFTipoViaje').val() == 'T0'),
                className: "dt-head-center  dt-body-left",
                data: "UsuarioCruce",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-center",
                data: "FechaLlegadaDestino",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "UsuarioLlegadaDestino",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-center",
                data: "FechaDescarga",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "UsuarioDescarga",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-center",
                data: "FechaFinalizado",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "UsuarioFinaliza",
                width: "150px",
            },
        ]
    },
    Cancelados: {
        rowId: 'IDBro_Viaje',
        "scrollX": true,
        responsive: true,
        columns: [
            {
                className: "dt-head-center  dt-body-center",
                width: "150px",
                mRender: function (data, type, full) {
                    return '<a id="btnDetallesViaje"><strong>' + full.Folio + '<strong/></a>';
                },
            },
            {
                className: "dt-head-center  dt-body-left",
                width: "130px",
                data: "Tipo",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "ClienteOrigen",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "CiudadOrigen",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                mRender: function (data, type, full) {
                    if (full.Tipo == 'T0') {
                        return full.ClienteDestino;
                    }
                    else {
                        return full.ClienteConsigne;
                    }
                }, width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                mRender: function (data, type, full) {
                    if (full.Tipo == 'T0') {
                        return full.CiudadDestino;
                    }
                    else {
                        return full.CiudadConsigne;
                    }
                }, width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                mRender: function (data, type, full) {
                    if (full.IDBillToCustomer == 2599) {
                        return 'Logisti k De México'
                    }
                    else {
                        return full.Transportista
                    }
                }, width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "Remolque",
                width: "100px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "Tracto",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "UsuarioCancela",
                width: "150px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "FechaCancelacion",
                width: "170px",
            },
            {
                className: "dt-head-center  dt-body-left",
                data: "FechaAlta",
                width: "150px",
            },
            {
                //visible: ($('#HFTipoViaje').val() == 'T1' ? true : false),
                mRender: function (data, type, full) {
                    return '<span data-toggle="tooltip" data-placement="left" title="Doc"><div class="row text-center"><div class="btn-group">' +
                        '<button type="button" class="btn btn-xs btn-transparent dropdown-toggle" data-toggle="dropdown"> <img src="img/PDF.PNG" class="img-edit-delete"> </button>' +
                        '<ul class="dropdown-menu" role="menu"> <li><a href="' + full.RutaCartaPorte + '" target="_blank">Bill of lading</a></li> <li><a href="' + full.RutaCartaInstrucciones + '" target="_blank">Instructions</a></li> </ul>' +
                        '</div></div></span>'
                },
                width: "50px",
            }
        ]
    },
    Finalizados: {
        
        scrollX: true,
        responsive: true,
        rowId: 'IDBro_Viaje',
        agregateDefaultOptions: false,
        columnDefs: [
            {
                targets: 0,
                checkboxes: {
                    'selectRow': true
                }
            }
        ],
        select: {
            style: 'multi'
        },
        columns: [
            {
                className: "dt-head-center",
                mRender: function (data, type, full) {
                    return (full.IsDatosFactura == true && full.IsDatosRemision == true /*&& (!full.IsRequiereEvFisicaFactura && !full.IsEvidenciasFisicas || full.IsRequiereEvFisicaFactura && full.IsEvidenciasFisicas)*/) ? `<input type="checkbox" name="chkViajes" value="${full.IDBro_Viaje}"/>` : "";
                }, width: "10px",
            },
            {
                className: "dt-head-center dt-body-center",
                mRender: function (data, type, full) {
                    return '<a id="btnDetallesViaje" class="' + ((full.IsEvidenciasDigitales == false || full.IsEvidenciasFisicas == false) ? 'text-danger' : (full.IsEvidenciasFisicas == true && full.IsEvidenciasDigitales == true && full.IsDatosRemision == false && full.IsDatosFactura == false) ? 'text-warning-completed' : (full.IsDatosFactura == false && full.IsDatosRemision == true) ? 'text-warning-light-completed ' : (full.IsDatosFactura == true && full.IsDatosRemision == true) ? 'text-success-completed' : 'text-primary') + '"><strong>' + full.Folio + '<strong/></a>';

                }, width: "100px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "UsuarioAlta",
                width: "150px",
            },
            {
                className: "dt-head-center dt-body-center",
                data: "strFechaAlta",
                width: "150px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "Remisiones",
                width: "150px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "UsuarioOPL",
                width: "150px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "ClienteOrigen",
                width: "150px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "CiudadOrigen",
                width: "150px",
            },
            {
                className: "dt-head-center dt-body-left",
                mRender: function (data, type, full) {
                    return (full.Tipo == 'T0' ? full.ClienteDestino : full.ClienteConsigne);
                }, width: "150px",
            },
            {
                className: "dt-head-center dt-body-left",
                mRender: function (data, type, full) {
                    return (full.Tipo == 'T0' ? full.CiudadDestino : full.CiudadConsigne);
                }, width: "150px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "Tipo",
                width: "80px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "TipoUnidad",
                width: "150px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "OrdenCompra",
                mRender: function (data, type, full) {
                    return (data != '' ? data.substring(0, 20) : 'N/A');
                }, width: "100px",
            },
            {
                className: "dt-head-center dt-body-left",
                mRender: function (data, type, full) {
                    return full.Tipo == 2599 ? 'Logisti k De México' : full.Transportista;
                }, width: "150px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "Remolque",
                width: "100px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "Tracto",
                width: "100px",
            },
            {
                className: "dt-head-center dt-body-center",
                data: "strFechaCarga",
                width: "100px",
            },
            {
                className: "dt-head-center dt-body-center",
                data: "strFechaETA",
                width: "100px",
            },
            {
                className: "dt-head-center dt-body-center",
                data: "strFechaDescarga",
                width: "100px",
            },
            {
                //visible: $('#HFIsAdimistrador').val(),
                className: "dt-head-center dt-body-right",
                name: "costoSubtotal",
                data: "CostoSubtotal",
                mRender: function (data, type, full) {
                  // return "<a id='btnCostosxViaje' class='text-danger' visib><strong>" + (data) + "</strong></a>";
                    return "<strong class='text-danger'>" + (data) + "</strong >";
                },
                width: "100px",
            },
            {
                //visible: _IsAdministrador,
                className: "dt-head-center dt-body-right",
                name: "precioSubtotal",
                data: "PrecioSubtotal",
                mRender: function (data, type, full) {
                    return "<strong class='text-info'>" + (data) + "</strong>";
                },
                width: "100px",
            },
            {
                className: "dt-head-center dt-body-right",
                //visible: _IsAdministrador,
                name: "mopCantidad",
                data: "MOPCantidad",
                mRender: function (data, type, full) {
                    return "<strong class='text-success' >" + data + "</strong>";
                },
                width: "150px",
            },
            {
                className: "dt-head-center dt-body-right",
                //visible: _IsAdministrador,
                name: "mopPorcentaje",
                data: "MOP",
                mRender: function (data, type, full) {
                    if (data < "0") data = 0;
                    return `<strong class='text-primary'>${(data)}</strong>`;
                }, width: "150px",
            },
            {
                className: "dt-head-center dt-body-center",
                visible: ($('#HFTipoViaje').val() == 'T1'),
                mRender: function (data, type, full) {
                    return '<div class="row text-center"><div class="btn-group">' +
                        '<button type="button" class="btn btn-xs btn-warning dropdown-toggle" data-toggle="dropdown"><img src="img/PDF.PNG" class="img-edit-delete"></button>' +
                        '<ul class="dropdown-menu" role="menu"> <li><a href="' + full.RutaCartaPorte + '" target="_blank">Bill of lading</a></li> <li><a href="' + full.RutaCartaInstrucciones + '" target="_blank">Instructions</a></li> </ul>' +
                        '</div></div>'
                }, width: "50px",
            },
            {
                className: "dt-head-center dt-body-center",
                mRender: function (data, type, full) {
                    return '<a data-toggle="tooltip" data-placement="left" title="Evidences history"> <button data-placement="right" type="button" class="btn btn-xs  btn-transparent btn-evidencia" data-idbroviaje=' + full.IDBro_Viaje + ' /><img src="' + (full.IsEvidenciasDigitales == true ? 'img/Evidencia_check.PNG' : 'img/Evidencia_close.PNG') + '" class="img-edit-delete"></button></a>';
                }, width: "50px",
            },
            {
                className: "dt-head-center dt-body-center",
                mRender: function (data, type, full) {
                    return '<a data-toggle="tooltip"  data-toggle="modal" data-target="#mdEvidenciasTab" data-placement="left" title="Physical evidences"> <button data-placement="center" ' + (full.IsEvidenciasFisicas == true ? 'disabled="disabled"' : '') + 'value="false" type="button" class="btn btn-xs btn-transparent evidencias-fisicas btnEnviarEvidenciasFisicas" data-toggle="modal" data-target="#mdEvidenciasFisicas" /><img src="' + (full.IsEvidenciasFisicas == true ? 'img/Evidencia_check.PNG' : 'img/Evidencia_close.PNG') + '" class="img-edit-delete"></button></a>';
                }, width: "50px",
            },
            {
                className: "dt-head-center dt-body-center",
                mRender: function (data, type, full) {
                    return '<a data-toggle="tooltip" data-placement="left" title="Status history"> <button data-placement="right"   type="button" class="btn btn-xs btn-transparent btnStatusHistory" data-toggle="modal" data-target="#mdStatusViaje" data-idbroviaje=' + full.IDBro_Viaje + '/><img src="img/Historial.png" class="img-start"></span></button></a>';
                }, width: "50px",
            },
            //{
            //    mRender: function (data, type, full) {
            //        return '<a data-toggle="tooltip" data-placement="left" title="Receivable account" id="btnCuentasxCobrarViaje"> <button data-placement="right" ' + (full.IsEvidenciasFisicas == true && full.IsEvidenciasDigitales == true ? 'disabled="disabled"' : '') + '  type="button" class="btn btn-xs btn-transparent"/><img src="img/cxcobrar.png" class="img-start"></span></button></a>';
            //    }, width: "1%",
            //},
            {
                visible: false,
                name: "evidenciasDigitalesFinalizados",
                mRender: function (data, type, full) {
                    return full.IsEvidenciasDigitales ? '1' : '0';
                },
                data: "IsEvidenciasDigitales"
            },
            {
                visible: false,
                name: "evidenciasFisicasFinalizados",
                mRender: function (data, type, full) {
                    return full.IsEvidenciasFisicas ? '1' : '0';
                },
                data: "IsEvidenciasFisicas"
            },
            {
                visible: false,
                mRender: function (data, type, full) {
                    return '0';
                },
            },
            {
                className: "dt-head-center dt-body-left",
                mRender: function (data, type, full) {
                    return ((full.IsEvidenciasDigitales == false || full.IsEvidenciasFisicas == false) ? 'INCOMPLETE' :
                        (full.IsEvidenciasFisicas == true && full.IsEvidenciasDigitales == true && full.IsDatosRemision == false && full.IsDatosFactura == false) ? 'ACCOUNT RECEIVABLE' :
                            (full.IsDatosFactura == false && full.IsDatosRemision == true) ? 'ACCOUNT PAYABLE' :
                                (full.IsDatosFactura == true && full.IsDatosRemision == true) ? 'COMPLETED' :
                                    'NOT AVAILABLE');
                },
                width: "150px",
                data: "HoldPoolStatus",
                name: "holdpoolStatus"
            },
            {
                className: "dt-head-center dt-body-center",
                data: "strFechaPrimerEvidenciaDigital",
                width: "150px"
            }
        ],
        footerCallback: function (row, data, start, end, display) {
            var api = this.api();
            var intVal = function (i) {
                return typeof i === 'string' ?//(/[\$,]/g, '')*1 
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            if (!IsAdministrador) {
                $("#tableViajesFinalizados").DataTable().columns([19, 20, 21, 22]).visible(false, false);
            } else {
                let $tableFinalizados = $('#tableViajesFinalizados').DataTable();
                let indexPrecio = $tableFinalizados.column("precioSubtotal:name").index();
                let indexCosto = $tableFinalizados.column("costoSubtotal:name").index();
                let indexMop = $tableFinalizados.column("mopCantidad:name").index();

                // Obetener totales por columnas quitandoles el formato 
                var _TotalPrecio = GetTotalColumna(indexPrecio, api);
                var _TotalCosto = GetTotalColumna(indexCosto, api);
                var _TotalMOP = GetTotalColumna(indexMop, api);

                // Convertir a montos los totales
                PrecioTotal = ConvertirMontos(_TotalPrecio, 3);
                CostoTotal = ConvertirMontos(_TotalCosto, 3);
                MOPTotal = ConvertirMontos(_TotalMOP, 3);
                var PorcPrecio = (_TotalPrecio != '' ? '100' : '0');
                var PorcCosto = (_TotalPrecio != '' && _TotalCosto != '' ? ((_TotalCosto / _TotalPrecio) * 100).toFixed(0) : '0');
                var PorMOP = (_TotalPrecio != '' && _TotalCosto != '' ? (100 - ((_TotalCosto / _TotalPrecio) * 100)).toFixed(0) : '0');

                $('#lblTituloPrecio').html(`<div class="row text-center contadores-header">
                                                <p class="bold">Price</p>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-7 col-lg-7 padding-10-both">
                                                    <span class="text-info">$${(PrecioTotal)}</span >
                                                </div>
                                                <div class="col-md-5 col-lg-5 padding-10-both">
                                                    <span class="text-info">${PorcPrecio}%</span>
                                                </div>
                                            </div>`);
                $('#lblTituloCosto').html(`<div class="row text-center contadores-header">
                                                <p class="bold">Cost</p>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-7 col-lg-7 padding-10-both">
                                                    <span class="text-danger">$${(CostoTotal)}</span>
                                                </div>
                                                <div class="col-md-5 col-lg-5 padding-10-both">
                                                    <span class="text-danger">${PorcCosto}%</span>
                                                </div>
                                            </div>`);
                $('#lblTituloMOP').html(`<div class="row text-center contadores-header">
                                                <p class="bold">MOP</p>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-7 col-lg-7 padding-10-both">
                                                    <span class="text-success">$${(MOPTotal)}</span>
                                                </div>
                                                <div class="col-md-5 col-lg-5 padding-10-both">
                                                    <span class="text-success">${PorMOP}%</span>
                                                </div>
                                            </div>`);

                convertCurrency();
            }
        },
    },
    FacturasPendientes: {
        columns: [
            {
                className: "dt-head-center",
                mRender: function (data, type, full) {
                    return (full.IsDatosFactura == true && full.IsDatosRemision == true && full.IsEvidenciasFisicas == true) ? `<input type="checkbox" name="chkViajes" value="${full.IDBro_Viaje}"/>` : "";
                }, width: "10px",
            },
            {
                className: "dt-head-center dt-body-center",
                mRender: function (data, type, full) {
                    return '<a id="btnDetallesViaje" class="' + ((full.IsEvidenciasDigitales == false || full.IsEvidenciasFisicas == false) ? 'text-danger' : (full.IsEvidenciasFisicas == true && full.IsEvidenciasDigitales == true && full.IsDatosRemision == false && full.IsDatosFactura == false) ? 'text-warning-completed' : (full.IsDatosFactura == false && full.IsDatosRemision == true) ? 'text-warning-light-completed ' : (full.IsDatosFactura == true && full.IsDatosRemision == true) ? 'text-success-completed' : 'text-primary') + '"><strong>' + full.Folio + '<strong/></a>';

                }, width: "100px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "UsuarioAlta",
                width: "150px",
            },
            {
                className: "dt-head-center dt-body-center",
                data: "strFechaAlta",
                width: "150px",
            },
            //{
            //    className: "dt-head-center dt-body-left",
            //    data: "Remisiones",
            //    width: "150px",
            //},
            {
                className: "dt-head-center dt-body-left",
                data: "UsuarioOPL",
                width: "150px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "ClienteOrigen",
                width: "150px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "CiudadOrigen",
                width: "150px",
            },
            {
                className: "dt-head-center dt-body-left",
                mRender: function (data, type, full) {
                    return (full.Tipo == 'T0' ? full.ClienteDestino : full.ClienteConsigne);
                }, width: "150px",
            },
            {
                className: "dt-head-center dt-body-left",
                mRender: function (data, type, full) {
                    return (full.Tipo == 'T0' ? full.CiudadDestino : full.CiudadConsigne);
                }, width: "150px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "Tipo",
                width: "80px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "TipoUnidad",
                width: "150px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "OrdenCompra",
                mRender: function (data, type, full) {
                    return (data != '' ? data.substring(0, 20) : 'N/A');
                }, width: "100px",
            },
            {
                className: "dt-head-center dt-body-left",
                mRender: function (data, type, full) {
                    return full.Tipo == 2599 ? 'Logisti k De México' : full.Transportista;
                }, width: "150px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "Remolque",
                width: "100px",
            },
            {
                className: "dt-head-center dt-body-left",
                data: "Tracto",
                width: "100px",
            },
            {
                className: "dt-head-center dt-body-center",
                data: "strFechaCarga",
                width: "100px",
            },
            {
                className: "dt-head-center dt-body-center",
                data: "strFechaETA",
                width: "100px",
            },
            {
                className: "dt-head-center dt-body-center",
                data: "strFechaDescarga",
                width: "100px",
            },
            {
                className: "dt-head-center dt-body-right",
                name: "costoSubtotal",
                data: "CostoSubtotal",
                mRender: function (data, type, full) {
                    return "<a id='btnCostosxViaje' class='text-danger' visib><strong>" + (data) + "</strong></a>";
                },
                width: "100px",
            },
            {
                className: "dt-head-center dt-body-right",
                name: "precioSubtotal",
                data: "PrecioSubtotal",
                mRender: function (data, type, full) {
                    return "<strong class='text-info'>" + (data) + "</strong>";
                },
                width: "100px",
            },
            {
                className: "dt-head-center dt-body-right",
                name: "mopCantidad",
                data: "MOPCantidad",
                mRender: function (data, type, full) {
                    return "<strong class='text-success' >" + data + "</strong>";
                },
                width: "150px",
            },
            {
                className: "dt-head-center dt-body-right",
                name: "mopPorcentaje",
                data: "MOP",
                mRender: function (data, type, full) {
                    if (data < "0") data = 0;
                    return `<strong class='text-primary'>${(data)}</strong>`;
                }, width: "150px",
            }
            //{
            //    className: "dt-head-center dt-body-center",
            //    visible: ($('#HFTipoViaje').val() == 'T1'),
            //    mRender: function (data, type, full) {
            //        return '<div class="row text-center"><div class="btn-group">' +
            //            '<button type="button" class="btn btn-xs btn-warning dropdown-toggle" data-toggle="dropdown"><img src="img/PDF.PNG" class="img-edit-delete"></button>' +
            //            '<ul class="dropdown-menu" role="menu"> <li><a href="' + full.RutaCartaPorte + '" target="_blank">Bill of lading</a></li> <li><a href="' + full.RutaCartaInstrucciones + '" target="_blank">Instructions</a></li> </ul>' +
            //            '</div></div>'
            //    }, width: "50px",
            //},
            //{
            //    className: "dt-head-center dt-body-center",
            //    mRender: function (data, type, full) {
            //        return '<a data-toggle="tooltip" data-placement="left" title="Evidences history"> <button data-placement="right" type="button" class="btn btn-xs  btn-transparent btn-evidencia" data-idbroviaje=' + full.IDBro_Viaje + ' /><img src="' + (full.IsEvidenciasDigitales == true ? 'img/Evidencia_check.PNG' : 'img/Evidencia_close.PNG') + '" class="img-edit-delete"></button></a>';
            //    }, width: "50px",
            //},
            //{
            //    className: "dt-head-center dt-body-center",
            //    mRender: function (data, type, full) {
            //        return '<a data-toggle="tooltip"  data-toggle="modal" data-target="#mdEvidenciasTab" data-placement="left" title="Physical evidences"> <button data-placement="center" ' + (full.IsEvidenciasFisicas == true ? 'disabled="disabled"' : '') + 'value="false" type="button" class="btn btn-xs btn-transparent evidencias-fisicas btnEnviarEvidenciasFisicas" data-toggle="modal" data-target="#mdEvidenciasFisicas" /><img src="' + (full.IsEvidenciasFisicas == true ? 'img/Evidencia_check.PNG' : 'img/Evidencia_close.PNG') + '" class="img-edit-delete"></button></a>';
            //    }, width: "50px",
            //},
            //{
            //    className: "dt-head-center dt-body-center",
            //    mRender: function (data, type, full) {
            //        return '<a data-toggle="tooltip" data-placement="left" title="Status history"> <button data-placement="right"   type="button" class="btn btn-xs btn-transparent btnStatusHistory" data-toggle="modal" data-target="#mdStatusViaje" data-idbroviaje=' + full.IDBro_Viaje + '/><img src="img/Historial.png" class="img-start"></span></button></a>';
            //    }, width: "50px",
            //},
            //{
            //    visible: false,
            //    name: "evidenciasDigitalesFinalizados",
            //    mRender: function (data, type, full) {
            //        return full.IsEvidenciasDigitales ? '1' : '0';
            //    },
            //    data: "IsEvidenciasDigitales"
            //},
            //{
            //    visible: false,
            //    name: "evidenciasFisicasFinalizados",
            //    mRender: function (data, type, full) {
            //        return full.IsEvidenciasFisicas ? '1' : '0';
            //    },
            //    data: "IsEvidenciasFisicas"
            //},
            //{
            //    visible: false,
            //    mRender: function (data, type, full) {
            //        return '0';
            //    },
            //},
            //{
            //    className: "dt-head-center dt-body-left",
            //    mRender: function (data, type, full) {
            //        return ((full.IsEvidenciasDigitales == false || full.IsEvidenciasFisicas == false) ? 'INCOMPLETE' :
            //            (full.IsEvidenciasFisicas == true && full.IsEvidenciasDigitales == true && full.IsDatosRemision == false && full.IsDatosFactura == false) ? 'ACCOUNT RECEIVABLE' :
            //                (full.IsDatosFactura == false && full.IsDatosRemision == true) ? 'ACCOUNT PAYABLE' :
            //                    (full.IsDatosFactura == true && full.IsDatosRemision == true) ? 'COMPLETED' :
            //                        'NOT AVAILABLE');
            //    },
            //    width: "150px",
            //    data: "HoldPoolStatus",
            //    name: "holdpoolStatus"
            //},
            //{
            //    className: "dt-head-center dt-body-center",
            //    data: "strFechaPrimerEvidenciaDigital",
            //    width: "150px"
            //}
        ]
    },
    resumeTripsInvoice: {
        rowId: 'IDBro_Viaje',
        "scrollX": true,
        columns: [
            {
                className: "dt-head-center  dt-body-center",
                name: "Folio",
                data: "Folio",
                mRender: function (data, type, full) {
                    return '<a id="btnDetallesViaje"><strong>' + full.Folio + '<strong/></a>';
                },
                width: "40%",
            },
            {
                className: "dt-head-center dt-body-right",
                name: "PrecioSubtotal",
                data: "PrecioSubtotal",
                mRender: function (data, type, full) {
                    return "<strong class='text-info'>" + (data) + "</strong>";
                },
                //width: "15%",
            },
            {
                className: "dt-head-center dt-body-right",
                name: "PrecioIVA",
                data: "PrecioIVA",
                mRender: function (data, type, full) {
                    return "<strong class='text-success' >" + data + "</strong>";
                },
                //width: "15%",
            },
            {
                className: "dt-head-center dt-body-right",
                name: "PrecioRetencion",
                data: "PrecioRetencion",
                mRender: function (data, type, full) {
                    return `<strong class='text-primary'>${(data)}</strong>`;
                },
                //width: "15%",
            },
            {
                className: "dt-head-center dt-body-right",
                name: "PrecioTotal",
                data: "PrecioTotal",
                mRender: function (data, type, full) {
                    return `<strong class='text-primary'>${(data)}</strong>`;
                },
                //width: "15%",
            }
        ],
        footerCallback: function (row, data, start, end, display) {
            var api = this.api();

            let $table = $('#tableResumeViajes').DataTable();
            let indexPrecio = $table.column("PrecioSubtotal:name").index();
            let indexPrecioIVA = $table.column("PrecioIVA:name").index();
            let indexPrecioRetencion = $table.column("PrecioRetencion:name").index();
            let indexPrecioTotal = $table.column("PrecioTotal:name").index();

            var _TotalPrecio = GetTotalColumna(indexPrecio, api);
            var _TotalPrecioIVA = GetTotalColumna(indexPrecioIVA, api);
            var _TotalPrecioRetencion = GetTotalColumna(indexPrecioRetencion, api);
            var _TotalPrecioTotal = GetTotalColumna(indexPrecioTotal, api);

            $($table.column("PrecioSubtotal:name").footer()).html(`<strong class='text-info'>$${ConvertirMontos(_TotalPrecio.toFixed(2))}</strong>`);
            $($table.column("PrecioIVA:name").footer()).html(`<strong class='text-success' >$${ConvertirMontos(_TotalPrecioIVA.toFixed(2))}</strong>`);
            $($table.column("PrecioRetencion:name").footer()).html(`<strong class='text-primary'>$${ConvertirMontos(_TotalPrecioRetencion.toFixed(2))}</strong>`);
            $($table.column("PrecioTotal:name").footer()).html(`<strong class='text-primary'>$${ConvertirMontos(_TotalPrecioTotal.toFixed(2))}</strong>`);
            $('#titleTotalResumen').html(ConvertirMontos(_TotalPrecioTotal.toFixed(2)));
        }
    },
    resumenFacturaProveedor: {
        rowId: 'IDBro_Viaje',
        "scrollX": true,
        columns: [
            {
                className: "dt-head-center  dt-body-center",
                name: "Folio",
                data: "Folio",
                mRender: function (data, type, full) {
                    return '<a id="btnDetallesViaje"><strong>' + full.Folio + '<strong/></a>';
                },
                width: "40%",
            },
            {
                className: "dt-head-center dt-body-right",
                name: "CostoSubtotal",
                data: "CostoSubtotal",
                mRender: function (data, type, full) {
                    return "<strong class='text-info'>" + (data) + "</strong>";
                },
                //width: "15%",
            },
            {
                className: "dt-head-center dt-body-right",
                name: "CostoIVA",
                data: "CostoIVA",
                mRender: function (data, type, full) {
                    return "<strong class='text-success' >" + data + "</strong>";
                },
                //width: "15%",
            },
            {
                className: "dt-head-center dt-body-right",
                name: "CostoRetencion",
                data: "CostoRetencion",
                mRender: function (data, type, full) {
                    return `<strong class='text-primary'>${(data)}</strong>`;
                },
                //width: "15%",
            },
            {
                className: "dt-head-center dt-body-right",
                name: "CostoTotal",
                data: "CostoTotal",
                mRender: function (data, type, full) {
                    return `<strong class='text-primary'>${(data)}</strong>`;
                },
                //width: "15%",
            }
        ],
        footerCallback: function (row, data, start, end, display) {
            var api = this.api();

            let $table = $('#tableResumeViajes').DataTable();
            let indexPrecio = $table.column("CostoSubtotal:name").index();
            let indexPrecioIVA = $table.column("CostoIVA:name").index();
            let indexPrecioRetencion = $table.column("CostoRetencion:name").index();
            let indexPrecioTotal = $table.column("CostoTotal:name").index();

            var _TotalPrecio = GetTotalColumna(indexPrecio, api);
            var _TotalPrecioIVA = GetTotalColumna(indexPrecioIVA, api);
            var _TotalPrecioRetencion = GetTotalColumna(indexPrecioRetencion, api);
            var _TotalPrecioTotal = GetTotalColumna(indexPrecioTotal, api);

            $($table.column("CostoSubtotal:name").footer()).html(`<strong class='text-info'>$${ConvertirMontos(_TotalPrecio.toFixed(2))}</strong>`);
            $($table.column("CostoIVA:name").footer()).html(`<strong class='text-success' >$${ConvertirMontos(_TotalPrecioIVA.toFixed(2))}</strong>`);
            $($table.column("CostoRetencion:name").footer()).html(`<strong class='text-primary'>$${ConvertirMontos(_TotalPrecioRetencion.toFixed(2))}</strong>`);
            $($table.column("CostoTotal:name").footer()).html(`<strong class='text-primary'>$${ConvertirMontos(_TotalPrecioTotal.toFixed(2))}</strong>`);
            //$('#titleTotalResumen').html(ConvertirMontos(_TotalPrecioTotal.toFixed(2)));
        }
    }
};

var enum_estatus_renta = {
    proceso: 'PENDIENTE',
    reporte: 'FINALIZADO'
};

//CBOS
function bindCbo(idCbo, cbo_type, jParams, initVal) {

    let $cbo = $(idCbo);
    $cbo.find('option').remove();

    //$cbo.append($('<option>').text('').attr('value', ''));

    var fnBeforeSend = () => { WaitMe_Show($cbo.parent('div')); }

    var fnSuccess = function (data) {
        var jsonData = JSON.parse(data.d);

        for (var itemData of jsonData) {
            let currentOption = $('<option>');

            currentOption.text(itemData[cbo_type.text]);
            currentOption.attr('value', itemData[cbo_type.value]);

            if (cbo_type.datas) {
                for (var item of cbo_type.datas) {
                    currentOption.data(item.nombre, itemData[item.source]);
                }
            }

            $cbo.append(currentOption);
        }

        if (initVal) {
            $cbo.val(initVal);
        }
        else {
            $cbo.trigger('change');
        }

        WaitMe_Hide($cbo.parent('div'));
    }
    cbo_type.fnGet(fnSuccess, fnBeforeSend, jParams);
}


function bindCboPromise(idCbo, cbo_type, jParams, initVal) {

    return new Promise(function (resolve, reject) {
        let $cbo = $(idCbo);
        $cbo.find('option').remove();

        //$cbo.append($('<option>').text('').attr('value', ''));

        var fnBeforeSend = () => { WaitMe_Show($cbo.parent('div')); }

        var fnSuccess = function (data) {
            var jsonData = JSON.parse(data.d);

            for (var itemData of jsonData) {
                let currentOption = $('<option>');

                currentOption.text(itemData[cbo_type.text]);
                currentOption.attr('value', itemData[cbo_type.value]);

                if (cbo_type.datas) {
                    for (var item of cbo_type.datas) {
                        currentOption.data(item.nombre, itemData[item.source]);
                    }
                }

                $cbo.append(currentOption);
            }

            if (initVal) {
                $cbo.val(initVal);
            }
            else {
                $cbo.trigger('change');
            }

            WaitMe_Hide($cbo.parent('div'));
            resolve();
        }
        cbo_type.fnGet(fnSuccess, fnBeforeSend, jParams);
    });


}

function bindCboDateTypes(idCbo = '#cboDateType') {
    let $cbo = $(idCbo);
    $cbo.find('option').remove();

    //$cbo.append($('<option>').text('ALL DATE TYPES').attr('value', ''));

    //var fnBeforeSend = () => { WaitMe_Show($cbo.parent('div')); }

    //var fnSuccess = function (data) {
    //    var jsonData = $.parseJSON(data.d);

    //    WaitMe_Hide($cbo.parent('div'));
    //}

    for (var itemData of arrOptionsFecha) {
        let currentOption = $('<option>');
        currentOption.text(itemData.text);
        currentOption.attr('value', itemData.value);

        $cbo.append(currentOption);
    }

    //getTipoFechas(fnSuccess, fnBeforeSend);
}

//function bindCboViajesT0(idCbo = '#cboT0Travel') {

//    let $cbo = $(idCbo);
//    $cbo.find('option').remove();

//    $cbo.append($('<option>').text('Select...').attr('value', ''));

//    var fnBeforeSend = () => { WaitMe_Show($cbo.parent('div')); }

//    var fnSuccess = function (data) {
//        var jsonData = JSON.parse(data.d);

//        for (var itemData of jsonData) {
//            let currentOption = $('<option>');
//            currentOption.text(itemData.Especificaciones);
//            currentOption.attr('value', itemData.IDBro_Viaje);

//            $cbo.append(currentOption);
//        }
//        WaitMe_Hide($cbo.parent('div'));
//    }

//    getFoliosT0(fnSuccess, fnBeforeSend);
//}

//CBOS

//TABLES
function bindtable_viajesTableroControl(statusProceso) {
    var params =
    {
        strTipo: $('#cboTipoViaje').val(),
        strStatusProceso: statusProceso,
        strIDCliente: $('#HFIDCliente_LOG').val(),
        // strIDTransportista: 0,
        strIDUsuarioOPL: $('#HFIDOPL_LOG').val(),
        strTipoViaje: $('#HFTipoEmbarque').val()
    }

    var fnBeforeSend = function () {
        WaitMe_Show("#divContadorEvidencias");
        WaitMe_Show('#divViajes');
    };

    var fnSuccess = function (data) {
        //var table = $('#tableBro_Viajes').DataTable();
        var dateRes;
        //table.destroy();
        $('#tableBro_Viajes').DataTable().destroy();
        $('#tableBro_Viajes').DataTable({
            rowId: 'IDBro_Viaje',
            dom: "<'col-md-3 col-lg-3 semiround-tittle'><'col-md-7 col-lg-7'frBl><'col-md-1 col-lg-1 button-right text-right'>tip",
            lengthMenu: [[25, 50, 100, -1], [25, 50, 100, "All"]],
            scrollY: "530px",
            language: {
                "url": "//cdn.datatables.net/plug-ins/1.10.12/i18n/English.json"
            },
            data: JSON.parse(data.d),
            scrollX: true,
            responsive: true,
            fixedColumns: true,
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: '<img src="img/excel.png" height="15px" weight="15px">',
                    className: 'excelButton',
                    titleAttr: 'Excel',
                    filename: 'Dashboard' + moment().format('DD-MM-YYYY'),
                }
            ],
            initComplete: function (settings, json) {

                /*Tooltip trigger*/
                $('[data-toggle=tooltip]').tooltip({
                    trigger: 'hover'
                });
                $("div.semiround-tittle").html('<h5 class="bold">Dashboard</h5>');

                let tablePosition = $('.dataTables_scrollBody').position().top;
                let footerPosition = $('footer').position().top;
                let contenetHeight = footerPosition - tablePosition;

                let navHeight = $('.navbar').outerHeight();
                let footerHeight = $('footer').outerHeight();
                let heightPaginacion = $('.pagination').outerHeight() + 20;
                let heightContadores = $('#divContadorEvidencias').outerHeight() + 10;

                let heightTable = contenetHeight - navHeight - footerHeight - heightPaginacion - heightContadores;
                $('.dataTables_scrollBody').css('height', heightTable);

                //new $.fn.dataTable.FixedColumns($("#tableBro_Viajes").DataTable(), {
                //    fixedColumns: true
                //});


                //valores y comportamientos de los contadores
                //STATUS DE LOS VIAJES
                var tablaTableroControl = $('#tableBro_Viajes').DataTable();
                var indexColumnStatus = tablaTableroControl.column("statusProceso:name").index();
                var columnaStatus = tablaTableroControl.columns(indexColumnStatus).data();

                var totalIniciados = columnaStatus[0].filter((item) => {
                    return item == "INICIADO";
                });

                var totalOrigen = columnaStatus[0].filter((item) => {
                    return item == "LLEGADAORIGEN";
                });

                var totalCarga = columnaStatus[0].filter((item) => {
                    return item == "CARGA";
                });

                var totalRuta = columnaStatus[0].filter((item) => {
                    return item == "RUTA";
                });

                var totalTransfer = columnaStatus[0].filter((item) => {
                    return item == "EXCHANGE";
                });

                var totalCruce = columnaStatus[0].filter((item) => {
                    return item == "CRUCE";
                });

                var totalDestino = columnaStatus[0].filter((item) => {
                    return item == "LLEGADADESTINO";
                });

                var totalDescarga = columnaStatus[0].filter((item) => {
                    return item == "DESCARGA";
                });

                var totalTodos = tablaTableroControl.data().length;

                $(".span-iniciado").text(totalIniciados.length);
                $(".span-origen").text(totalOrigen.length);
                $(".span-carga").text(totalCarga.length);
                $(".span-en-ruta").text(totalRuta.length);
                $(".span-transfer").text(totalTransfer.length);
                $(".span-cruce").text(totalCruce.length);
                $(".span-destino").text(totalDestino.length);
                $(".span-descarga").text(totalDescarga.length);
                $(".span-todos").text(totalTodos);

                //Contadores de los status
                let fnClickStatus = function () {
                    let strSearchValue = $(this).data("search-value");
                    let $tableTableroControl = $('#tableBro_Viajes').DataTable();
                    let indexColumn = $tableTableroControl.column("statusProceso:name").index();
                    $tableTableroControl.columns().search('').draw();
                    $tableTableroControl.columns(indexColumn).search(strSearchValue).draw();
                };

                // Filtros de las evidencias sobre la tabla
                $("[data-tipo='filtroStatus']").click(fnClickStatus);


                //Contadores de evidencias digitales
                //SUMA DE LAS EVIDENCIAS DIGITALES
                var indexColumnEvidencias = tablaTableroControl.column("evidenciasDigitales:name").index();
                var columnaEvidencias = tablaTableroControl.columns(indexColumnEvidencias).data();

                var totalEvidencias = columnaEvidencias[0].filter((item) => {
                    return item == true;
                });

                var totalNoEvidencias = columnaEvidencias[0].filter((item) => {
                    return item == false;
                });

                $(".span-entregado").text(totalEvidencias.length);
                $(".span-pendiente").text(totalNoEvidencias.length);

                let fnClick = function () {
                    let strSearchValue = $(this).data("search-value");
                    let $tableTableroControl = $('#tableBro_Viajes').DataTable();
                    let indexColumn = $tableTableroControl.column("evidenciasDigitales:name").index();
                    $tableTableroControl.columns().search('').draw();
                    $tableTableroControl.columns(indexColumn).search(strSearchValue).draw();
                };

                // Filtros de las evidencias sobre la tabla
                $("[data-tipo='filtroEvidencias']").click(fnClick);

                WaitMe_Hide("#divContadorEvidencias");
                WaitMe_Hide('#divViajes');
            },
            columns: [
                {
                    className: "dt-head-center dt-body-center",
                    mRender: function (data, type, full) {

                        //if (full.Folio != 'N/A') {
                        return '<a id="btnVerDatosViaje" ' + (full.IsIncidencias == true ? 'class="text-danger"' : 'class="text-primary"') + '><strong>' + full.Folio + '<strong/></a>';
                        //}
                    },
                    width: "120px",
                },
                {
                    className: "dt-head-center dt-body-left",
                    data: "UsuarioAlta",
                    width: "150px",
                },
                {
                    className: "dt-head-center dt-body-center",
                    data: "strFechaAlta",
                    width: "120px",
                },
                {
                    className: "dt-head-center dt-body-left",
                    data: "UsuarioOPL",
                    width: "100px",
                },
                {
                    className: "dt-head-center dt-body-left",
                    data: "ClienteBillToCustomer",
                    width: "100px",
                },
                {
                    className: "dt-head-center dt-body-left",
                    data: "ClienteOrigen",
                    width: "150px",
                },
                {
                    className: "dt-head-center dt-body-left",
                    data: "CiudadOrigen",
                    width: "100px",
                },
                {
                    className: "dt-head-center dt-body-left",
                    data: "ClienteDestino",
                    width: "150px",
                },
                {
                    className: "dt-head-center dt-body-left",
                    data: "CiudadDestino",
                    width: "100px",
                },
                {
                    className: "dt-head-center dt-body-center",
                    data: "Tipo",
                    width: "100px",
                },
                {
                    className: "dt-head-center dt-body-left",
                    data: "TipoUnidad",
                    width: "100px",
                },
                {
                    className: "dt-head-center dt-body-left",
                    data: "OrdenCompra",
                    mRender: function (data, type, full) {
                        return (data != '' ? data.substring(0, 10) : 'N/A');
                    }, width: "100px",
                },
                {
                    className: "dt-head-center dt-body-left",
                    data: "Transportista",
                    width: "100px",
                },
                {
                    className: "dt-head-center dt-body-left",
                    data: "Remolque",
                    width: "100px",
                },
                {
                    className: "dt-head-center dt-body-left",
                    data: "Tracto",
                    width: "120px",
                },
                {
                    className: "dt-head-center dt-body-center",
                    data: "strFechaCarga",
                    width: "120px",
                },
                {
                    className: "dt-head-center dt-body-center",
                    data: "strFechaETA",
                    width: "120px",
                },
                {
                    className: "dt-head-center dt-body-center",
                    data: "strFechaDescarga",
                    width: "120px",
                },
                {
                    className: "dt-head-center dt-body-center",
                    data: "StatusProceso",
                    mRender: function (data, type, full) {
                        return "<a data-toggle='tooltip' id='btnStatusProceso' data-placement='left'> <button data-placement='center' type='button' class='btn btn-xs btn-status' data-toggle='modal' data-target='#mdStatusProceso'/><span> " + NombresContadores(full.StatusProceso) + "</span></button></a>";
                    }, width: "100px",
                },
                {
                    className: "dt-head-center dt-body-center",
                    mRender: function (data, type, full) {
                        return '<a data-toggle="tooltip" data-placement="left" title="Trip evidences">  <button data-placement="center" title="Trip PODS"  type="button" class="btn btn-xs btn-transparent btn-evidencia" data-toggle="modal" data-target="#mdEvidenciasTab" ' + (full.Tipo != "RECOLECCION" ? 'disabled="disabled"' : '') + '/>' + (full.IsEvidenciasDigitales == false ? '<img src="img/Evidencia_close.PNG" class="img-edit-delete">' : '<img src="img/Evidencia_check.PNG" class="img-edit-delete">') + ' </button></a>';
                    }, width: "40px",
                },
                {

                    visible: false,
                    name: "evidenciasDigitales",
                    data: "IsEvidenciasDigitales",
                    mRender: function (data, type, full) {
                        //return full.IsEvidenciasDigitales == true ? '✓' : 'x';
                        return full.IsEvidenciasDigitales == true ? "1" : "0";
                    },
                    width: "40px"
                },
                {
                    className: "dt-head-center dt-body-center",
                    mRender: function (data, type, full) {
                        return '<a data-toggle="tooltip" data-placement="left" title="Cancel"> <button data-placement="right" type="button" class="btn btn-xs btn-transparent btn-cancelViaje" data-toggle="modal" data-target="#mdCancelaViaje"/><img src="img/Eliminar.png" class="img-edit-delete"></button></a>';
                    }, width: "40px",
                },
                {
                    name: "statusProceso",
                    data: "StatusProceso",
                    visible: false
                }
            ]
        });


    }

    getViajes_tableroControl(fnSuccess, params, fnBeforeSend);
}

function bindTrailerRental(idTable) {

    let $idTable = $(idTable);

    var fnSuccess = (data) => {
        var jsonOptions = {
            rowId: 'IDBro_Viaje',
            data: JSON.parse(data.d),
            //columnDefs: [
            //    { className: "dt-head-center" },
            //    { className: "dt-head-center  dt-body-center", "targets": [0, 4, 5, 7, 8, 9, 10] },
            //    { className: "dt-head-center  dt-body-left", "targets": [1, 2, 3, 6, 7] },
            //],
            columns: [
                {
                    mRender: function (data, type, full) {
                        return '<a id="btnDetallesViaje" ' + full.IDBro_Viaje + '"><strong>' + full.Folio + '<strong/></a>';
                    },
                    width: "10%",
                },
                {
                    data: "UsuarioCaptura",
                    width: "15%",
                },
                {
                    data: "FechaAlta",
                    width: "15%",
                },
                {
                    data: "ClienteFiscal",
                    width: "10%",
                },
                {
                    data: "ClienteExpedidor",
                    width: "10%",
                },
                {
                    data: "ClienteConsignatario",
                    width: "10%",
                },
                {
                    data: "FechaInicio",
                    width: "8%",
                },
                {
                    data: "FechaFin",
                    width: "8%",
                },
                {
                    data: "Transportista",
                    width: "8%",
                },
                {
                    data: "Remolque",
                    width: "8%",
                },
                {
                    mRender: function (data, type, full) {
                        return "<a data-toggle='tooltip' data-placement='left'> <button data-placement='center' type='button' class='btn btn-xs btn-status' data-toggle='modal' data-target='#mdFinalizaRentaCaja' data-tipo='finalizar' /><span> FINISH RENTAL </span></button></a>";
                    }, width: "11%",
                },
                {
                    mRender: function (data, type, full) {
                        return '<a data-toggle="tooltip" data-placement="left" title="Cancel trip"><button data-placement="right" type="button" data-tipo="cancelar" class="btn btn-xs btn-transparent" data-toggle="modal" data-target="#mdCancelaRentaCaja"/><img src="img/Eliminar.png" class="img-edit-delete"></button></a>';
                    }, width: "3%",
                }
            ]
        }

        addDefaultsOptions(jsonOptions, "Trailer Rental", "Generate Rent", "btnGenerateTrip", "#mdNuevaRentaCaja");
        $($idTable).DataTable().destroy();
        $($idTable).DataTable(jsonOptions);
        WaitMe_Hide($idTable.parent('div'));

    };

    var jParams = {
        strIDCliente: $('#HFIDCliente_LOG').val(),
        strIDUsuarioOPL: $('#HFIDOPL_LOG').val(),
    };

    var fnBeforeSend = () => { WaitMe_Show($idTable.parent('div')); };

    getRentasCaja(fnSuccess, jParams, fnBeforeSend);
}

function bindTrailerRental_Report(idTable = '#tableReporteRentaTrailer') {
    let $idTable = $(idTable);

    var fnSuccess = (data) => {
        var jsonOptions = {
            rowId: 'IDBro_Viaje',
            data: JSON.parse(data.d),
            //columnDefs: [
            //    { className: "dt-head-center" },
            //    { className: "dt-head-center  dt-body-center", "targets": [0, 4, 5, 7, 8, 9, 10] },
            //    { className: "dt-head-center  dt-body-left", "targets": [1, 2, 3, 6, 7] },
            //],
            dom: "<'col-md-3 col-lg-3 semiround-tittle trailer-rental'><'col-md-7 col-lg-7'frBl><'col-md-1 col-lg-1 button-right text-right'>tip",
            "lengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]],
            "scrollY": "530px",
            language: {
                "url": "//cdn.datatables.net/plug-ins/1.10.12/i18n/English.json"
            },
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: '<img src="img/excel.png" height="15px" weight="15px">',
                    className: 'excelButton',
                    titleAttr: 'Excel',
                    filename: 'Trailer rental report' + moment().format('DD-MM-YYYY'),
                }
            ],
            "scrollX": true,
            responsive: true,
            columns: [
                {
                    mRender: function (data, type, full) {
                        return '<a data-tipo="detalles" ' + full.IDBro_Viaje + '"><strong>' + full.Folio + '<strong/></a>';
                    },
                    width: "10%",
                },
                {
                    data: "UsuarioCaptura",
                    width: "15%",
                },
                {
                    data: "UsuarioOPL",
                    width: "15%",
                },

                {
                    data: "FechaAlta",
                    width: "15%",
                },
                {
                    data: "ClienteFiscal",
                    width: "10%",
                },
                {
                    data: "ClienteExpedidor",
                    width: "10%",
                },
                {
                    data: "ClienteConsignatario",
                    width: "10%",
                },
                {
                    data: "FechaInicio",
                    width: "8%",
                },
                {
                    data: "FechaFin",
                    width: "8%",
                },
                {
                    data: "Transportista",
                    width: "8%",
                },
                {
                    data: "Remolque",
                    width: "8%",
                },
                {
                    //visible: (IsAdministrador == true ? true : false),
                    name: "costoRenta",
                    data: "CostoSubtotal",
                    mRender: function (data, type, full) {
                        return "<a id='btnCostosxViaje' class='text-danger'><strong>" + (data) + "</strong></a>";
                    },
                    //width: "4%",
                },
                {
                    //visible: (IsAdministrador != true ? false : true),
                    name: "precioRenta",
                    data: "PrecioSubtotal",
                    mRender: function (data, type, full) {
                        return "<strong class='text-info'>" + (data) + "</strong>";
                    },
                    //width: "4%",
                },
                {
                    //visible: (IsAdministrador != true ? false : true),
                    name: "mopCantidadRenta",
                    data: "MOPCantidad",
                    mRender: function (data, type, full) {
                        return "<strong class='text-success' >" + data + "</strong>";
                    },
                    //width: "4%",
                },
                {
                    //visible: (IsAdministrador != true ? false : true),
                    name: "mopPorcentajeRenta",
                    data: "MOP",
                    mRender: function (data, type, full) {
                        if (data < "0") data = 0;
                        return `<strong class='text-primary'>${(data)}</strong>`;
                    }, width: "3%",
                },
                {
                    //visible: (IsAdministrador != true ? false : true),
                    name: "monedaRenta",
                    data: "Moneda",
                    width: "3%",
                },
                {
                    //visible: (IsAdministrador != true ? false : true),
                    name: "statusRenta",
                    data: "StatusProceso",
                    width: "3%",
                }
            ],
            initComplete: function (settings, json) {
                /*TOOLTIP TRIGGER*/
                $('[data-toggle=tooltip]').tooltip({
                    trigger: 'hover'
                });
                //TRAILER RENTAL TITLE
                $("div.trailer-rental").html('<h5 class="bold">Trailer rental report</h5>');

                //ADJUST TABLE DYNAMICALLY 
                let tablePosition = $('.dataTables_scrollBody').position().top;
                let footerPosition = $('footer').position().top;
                let contenetHeight = footerPosition - tablePosition;

                let navHeight = $('.navbar').outerHeight();
                let footerHeight = $('footer').outerHeight();
                let heightPaginacion = $('.pagination').outerHeight() + 20;
                let heightContadores = $('#divRateRadios').outerHeight() + 75;
                let heightTable = contenetHeight - navHeight - footerHeight - heightPaginacion - heightContadores;
                $('.dataTables_scrollBody').css('height', heightTable);
                GetCantidades();

            },
            footerCallback: function (row, data, start, end, display) {
                api = this.api();
                var data;
                var intVal = function (i) {
                    return typeof i === 'string' ?//(/[\$,]/g, '')*1 
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                            i : 0;
                };
            },
        }

        $($idTable).DataTable().destroy();
        $($idTable).DataTable(jsonOptions);
        WaitMe_Hide('.div-content-reporte');



    };

    var jParams = {
        arrIDClientes: GetArrClientes(),
        arrMeses: arrMesesRentas,
        strAno: $('#cboAnosRental').val(),
        strIDUsuarioOPL: $("#cboOPLRental").val(),
        strMoneda: $("#cboMonedasRental").val()
    };

    var fnBeforeSend = () => { WaitMe_Show('.div-content-reporte'); };

    getRentasCaja_Reporte(fnSuccess, jParams, fnBeforeSend);
}

function bindTableMasterReport(idTable = '#tableReporteMaster') {

    var fnSuccess = (data) => {

        var jsonData = JSON.parse(data.d);
        $('#tableReporteMaster').DataTable().destroy();

        $("#tableReporteMaster").DataTable(
            {
                rowId: 'IDBro_Viaje',
                dom: "<'col-md-3 col-lg-3 semiround-tittle'><'col-md-7 col-lg-7'frBl><'col-md-1 col-lg-1 button-right text-right'>tip",
                "lengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]],
                "scrollY": "530px",
                //language: {
                //    "url": "//cdn.datatables.net/plug-ins/1.10.12/i18n/English.json"
                //},
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<img src="img/excel.png" height="15px" weight="15px">',
                        className: 'excelButton',
                        titleAttr: 'Excel',
                        filename: 'Master Report' + moment().format('DD-MM-YYYY'),
                        exportOptions: {

                            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, $('#HFIDTipoUsuario').val() === '4' ? 34 : false , 35, 36, 37, 38, 39]
                        }
                    }
                ],
                data: jsonData,
                //fixedHeader: true,
                "scrollX": true,
                responsive: true,
                fixedColumns: true,
                //columnDefs: [
                //    { className: "dt-head-center" },
                //    {
                //        className: "dt-head-center  dt-body-center", "targets": [0]
                //    },
                //    {
                //        className: "dt-head-center  dt-body-left", "targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
                //    },
                //    {
                //        className: "dt-head-center  dt-body-right", "targets": []
                //    }
                //],
                columns: [
                    {
                        className: "dt-head-center  dt-body-center",
                        width: "100px",
                        mRender: function (data, type, full) {
                            return '<a id="btnVerDatosViaje"><strong>' + full.Folio + '<strong/></a>';
                        },
                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        width: "100px",
                        data: "UsuarioAlta",

                    },
                    {
                        className: "dt-head-center  dt-body-center",
                        width: "100px",
                        data: "strFechaAlta",

                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        width: "100px",
                        data: "UsuarioOPL",

                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        width: "100px",
                        data: "ClienteBillToCustomer",

                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        width: "100px",
                        data: "ClienteOrigen",

                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        width: "100px",
                        data: "CiudadOrigen",

                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        width: "100px",
                        data: "ClienteDestino",

                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        width: "100px",
                        data: "CiudadDestino",

                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        width: "100px",
                        data: "Tipo"
                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        width: "100px",
                        data: "TipoUnidad",

                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        width: "100px",
                        data: "OrdenCompra",

                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        width: "100px",
                        data: "Transportista",

                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        width: "100px",
                        data: "RazonSocial",

                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        width: "100px",
                        data: "Operador",

                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        width: "100px",
                        data: "Remolque",

                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        width: "100px",
                        data: "Tracto",

                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        width: "100px",
                        data: "Unidad",
                    },
                    {
                        className: "dt-head-center  dt-body-center",
                        width: "100px",
                        data: "strFechaCarga",

                    },
                    {
                        className: "dt-head-center  dt-body-center",
                        width: "100px",
                        data: "strFechaETA",

                    },
                    {
                        className: "dt-head-center  dt-body-right",
                        width: "100px",
                        name: "costoTrips",
                        data: "CostoSubtotal",
                        mRender: function (data, type, full) {

                            return "<strong class='text-danger' >" + data + "</strong>";
                        },
                    },
                    {
                        className: "dt-head-center  dt-body-right",
                        name: "precioTrips",
                        data: "PrecioSubtotal",
                        mRender: function (data, type, full) {

                            return "<strong class='text-info' >" + data + "</strong>";
                        },
                        width: "100px",
                    },
                    {
                        className: "dt-head-center  dt-body-right",
                        name: "mopCantidadTrips",
                        data: "MOPCantidad",
                        mRender: function (data, type, full) {

                            return "<strong class='text-success' >" + data + "</strong>";
                        },
                        width: "100px"
                    },
                    {
                        className: "dt-head-center  dt-body-right",
                        name: "mopPorcentajeTrips",
                        data: "MOP",
                        mRender: function (data, type, full) {
                            if (data < "0") data = 0;
                            //return "<strong class='text-primary'>" + (data) + "%</strong>";
                            return `<strong class='text-primary'>${data}</strong>`;
                        },
                        width: "100px"
                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        name: "monedaTrips",
                        data: "Moneda",
                        mRender: function (data, type, full) {

                            return data;
                        },
                        width: "100px"

                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        name: "statusTrips",
                        data: "StatusProceso",
                        width: "140px"
                    },
                    {
                        className: "dt-head-center  dt-body-center",
                        name: "strFechaFinalizacion",
                        data: "strFechaFinalizacion",
                        width: "140px"
                    },
                    {
                        className: "dt-head-center  dt-body-left",
                        data: "strFechaCapturaControlDesk",
                        width: "140px"
                    },
                    {
                        className: "dt-head-center  dt-body-center",
                        mRender: function (data, type, full) {
                            var colorEvidencia = (full.IsCapturaControlDesk == true) ? 'text-success-completed' : 'text-danger';
                            var txtEvidencia = (full.IsCapturaControlDesk == true) ? 'Yes' : 'No';

                            return `<a title="Control desk" class="${colorEvidencia}"><strong> ${txtEvidencia} <strong/></a>`;
                        },
                        data: 'IsCapturaControlDesk',
                        width: "100px",
                    },
                    {
                        className: "dt-head-center  dt-body-center",
                        name: 'evidenciasMasterReport',
                        mRender: function (data, type, full) {
                            var colorEvidencia = (full.IsEvidenciasDigitales == true) ? 'text-success-completed' : 'text-danger';
                            var txtEvidencia = (full.IsEvidenciasDigitales == true) ? 'Yes' : 'No';

                            return `<a data-tipo="evidencia" title="Digital evidences" class="${colorEvidencia}"><strong> ${txtEvidencia} <strong/></a>`;
                        },
                        data: 'IsEvidenciasDigitales',
                        width: "100px"
                    },
                    {
                        className: "dt-head-center  dt-body-center",
                        width: "100px",
                        data: "strFechaDescarga"
                    },
                    {
                        className: "dt-head-center  dt-body-center",
                        data: "strFechaPrimerEvidenciaDigital",
                        width: "150px"
                    },
                    {
                        className: "dt-head-center  dt-body-center",
                        data: "DifEvidenciaDigitalFechaDescarga",
                        width: "200px"
                    },
                    {
                        className: "dt-head-center  dt-body-center",
                        data: "DifEvidenciaDigitalFechaAlta",
                        width: "200px"
                    },
                    {
                        //El tipo de usuario 4 es para el departamento de finanzas, por lo que nadie puede ver la factura del proveedor excepto ID= 4
                        visible: $('#HFIDTipoUsuario').val() === '4',
                        className: "dt-head-center  dt-body-center",
                        data: "Folio_Fac_Transportista",
                        width: "200px",
                    },
                    {
                        className: "dt-head-center  dt-body-center",
                        data: "Folio_Fac_Cliente",
                        width: "200px"
                    },
                    {
                        className: "dt-head-center  dt-body-center",
                        data: "strFechaLlegadaEvFisicas",
                        width: "200px"
                    },
                    {
                        className: "dt-head-center  dt-body-center",
                        data: "strFechaFactura_Fac_Cliente",
                        width: "200px"
                    },
                    {
                        className: "dt-head-center  dt-body-center",
                        data: "strFechaRevision_Fact_Cliente",
                        width: "200px"
                    },
                    {
                        className: "dt-head-center dt-body-center",
                        mRender: function (data, type, full) {
                            return '<a data-toggle="tooltip"  data-toggle="modal" data-target="#mdEvidenciasTab" data-placement="left" title="Physical evidences"> <button data-placement="center" ' + (full.IsEvidenciasFisicas == true ? 'disabled="disabled"' : '') + 'value="false" type="button" class="btn btn-xs btn-transparent evidencias-fisicas btnEnviarEvidenciasFisicas" data-toggle="modal" data-target="#mdEvidenciasFisicas" /><img src="' + (full.IsEvidenciasFisicas == true ? 'img/Evidencia_check.PNG' : 'img/Evidencia_close.PNG') + '" class="img-edit-delete"></button></a>';
                        }, width: "50px",
                    }
                ],
                footerCallback: function (row, data, start, end, display) {
                    api = this.api();
                    var data;
                    var intVal = function (i) {
                        return typeof i === 'string' ?//(/[\$,]/g, '')*1 
                            i.replace(/[\$,]/g, '') * 1 :
                            typeof i === 'number' ?
                                i : 0;
                    };
                },
                initComplete: function (settings, json) {
                    /*TOOLTIP TRIGGER*/
                    $('[data-toggle=tooltip]').tooltip({
                        trigger: 'hover'
                    });
                    //MASTER REPORT TITLE
                    $("div.semiround-tittle").html('<h5 class="bold">Master Report</h5>');

                    //ADJUST TABLE DYNAMICALLY 
                    let tablePosition = $('.dataTables_scrollBody').position().top;
                    let footerPosition = $('footer').position().top;
                    let contenetHeight = footerPosition - tablePosition;

                    let navHeight = $('.navbar').outerHeight();
                    let footerHeight = $('footer').outerHeight();
                    let heightPaginacion = $('.pagination').outerHeight() + 20;
                    let heightContadores = $('#divRateRadios').outerHeight() + 75;

                    let heightTable = contenetHeight - navHeight - footerHeight - heightPaginacion - heightContadores;
                    $('.dataTables_scrollBody').css('height', heightTable);
                    //GetCantidades();

                    var tablaMasterReport = $("#tableReporteMaster").DataTable();
                    var indexColumnEvidencias = tablaMasterReport.column("evidenciasMasterReport:name").index();
                    var indexColumnStatus = tablaMasterReport.column("statusTrips:name").index();

                    var columnaEvidenciasTablaMasterReport = tablaMasterReport.columns(indexColumnEvidencias).data();
                    var columnaStatusTablaMasterReport = tablaMasterReport.columns(indexColumnStatus).data();

                    //Buscamos los indices de los viajes que son cancelados
                    var arrIndicesCancelados = [];

                    columnaStatusTablaMasterReport[0].filter((element, index) => {
                        if (element == "CANCELADO") {
                            arrIndicesCancelados.push(index);
                        }
                    });

                    for (var key in arrIndicesCancelados) {
                        columnaEvidenciasTablaMasterReport[0].splice(key, 1)
                    }

                    //Regresamos en un nuevo arreglo las evidencias que SI tienen evidencias digitales
                    var totalEvidenciasTrue = columnaEvidenciasTablaMasterReport[0].filter((item) => {
                        return item == true
                    });

                    //Regresamos en un nuevo arreglo las evidencias que NO tienen evidencias digitales
                    var totalEvidenciasFalse = columnaEvidenciasTablaMasterReport[0].filter((item) => {
                        return item == false
                    });


                    //Remplazamos el valor de los contadores por el número total de evidencias respectivamente
                    $('#lblEvidenciasDigitalesVal').text(totalEvidenciasTrue.length);
                    $('#lblNoEvidenciasDigitalesVal').text(totalEvidenciasFalse.length);


                    let fnClickDigitales = function () {
                        let strSearchValue = $(this).data("search-value");
                        var $tablaMasterReport = $("#tableReporteMaster").DataTable();
                        var indexColumn = $tablaMasterReport.column("evidenciasMasterReport:name").index();
                        $tablaMasterReport.columns().search('').draw();
                        $tablaMasterReport.columns(indexColumn).search(strSearchValue).draw();
                    };

                    //Filtro de evidencias digitales
                    $("[data-tipo='filtroEvidenciasDigitales']").click(fnClickDigitales);

                }
            }
        );

        WaitMe_Hide('.div-content-reporte');
    };

    var jParams = {

        //arrClientes: arrClientes,
        arrClientes: GetArrClientes(),
        //arrClientes: [],
        strAno: $("#cboAnos").val(),
        strMoneda: $("#cboMonedas").val(),
        strTipo: $("#cboTipoViajes").val(),
        arrMeses: arrMesesViajes,
        arrStatus: ($("#cboStatus").val()).split(","),
        strIsMaquila: $("#cboMaquilas").val()
    };

    var fnBeforeSend = () => { WaitMe_Show('.div-content-reporte') };

    getReporteViajes(fnSuccess, jParams, fnBeforeSend);
}

function bindTableSeguimiento(tipoTabla, arrTipo) {

    var fnBeforeSend = () => {
        WaitMe_Show('#divViajes');
    };

    var arrclientes = GetArrClientes();
    if (arrclientes.length == 0) {
        arrclientes.push(1308);
    }

    var jParams = {
        arrIDClientes: arrclientes,
        strAnio: $("#cboAno").val(),
        arrMeses: GetArrMesesContador(),
        strMoneda: $("#cboMoneda").val(),
        strTipoViaje: $("#cboTipoViaje").val(),
        strTipoEmbarque: $('#cboTipoEmbarque').val(),
        strIsMaquila: $("#cboMaquila").val()
    };

    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);

        var jsonOptions = tipoTabla;

        jsonOptions.data = jData;

        var jsonOptions = {
            rowId: tipoTabla.rowId,
            scrollX: true,
            data: jData,
            columns: tipoTabla.columns
        }

        if (tipoTabla.footerCallback) {
            jsonOptions.footerCallback = tipoTabla.footerCallback;
        }
        if (tipoTabla.columnDefs) {
            jsonOptions.columnDefs = tipoTabla.columnDefs;
        }

        addDefaultsOptions(jsonOptions, $("#HFTituloTable").val(), "", "", "");

        try {
            $('#tableViajesSeguimiento').DataTable().destroy();
            $('#tableViajesSeguimiento').DataTable(jsonOptions);
            //if (typeTableViajesReportes.Seguimiento && $('#HFTipoViaje').val() != 'T0') {
            //    let tableSeguimiento = $('#tableViajesSeguimiento').DataTable();
            //    for (var i = 15; i <= 16; i++) {
            //        tableSeguimiento.column(i).visible(false, false);
            //    }
            //}
        }
        catch (e) {
            console.log(e);
        }

        WaitMe_Hide('#divViajes');
    };

    obtenerReporteSeguimientoxViaje(fnSuccess, jParams, fnBeforeSend);
}

function bindTableMovimiento(tipoTabla, arrTipo) {

    var $table = $('#tableViajesMovimientos');

    var fnBeforeSend = () => {
        WaitMe_Show('#divViajes');
    }

    var jParams = {
        strTipo: $("#cboTipoViaje").val(),
        arrIDClientes: $('#HFIDCliente_LOG').val() != "0" ? [$('#HFIDCliente_LOG').val()] : GetArrClientes(),
        arrMeses: GetArrMesesContador(),
        strAnio: $('#cboAno').val(),
        strMoneda: $('#cboMoneda').val(),
        strTipoEmbarque: $("#cboTipoEmbarque").val(),
        strTipoViaje: $("#cboTipoViaje").val(),
        //----nuevos parametros con fechas---
        //$("#cboDateTypes").val(),
        //$("#initDates").val(),
        //$("#finishDates").val()
        // ---nuevos parametros con maquilas ---
        strIsMaquila: $("#cboMaquila").val()
    };

    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);

        var jsonOptions = tipoTabla;

        jsonOptions.data = jData;

        var jsonOptions = {
            rowId: tipoTabla.rowId,
            scrollX: true,
            data: jData,
            columns: tipoTabla.columns
        }

        if (tipoTabla.footerCallback) {
            jsonOptions.footerCallback = tipoTabla.footerCallback;
        }
        if (tipoTabla.columnDefs) {
            jsonOptions.columnDefs = tipoTabla.columnDefs;
        }

        addDefaultsOptions(jsonOptions, $('#HFTituloTable').val(), "", "", "");

        try {
            $('#' + $('#HFIDTabla').val() + '').DataTable().destroy();
            $('#' + $('#HFIDTabla').val() + '').DataTable(jsonOptions);
        }
        catch (e) {
            console.log(e);
        }

        WaitMe_Hide('#divViajes');
    }

    obtenerReporteMovimientos(fnSuccess, jParams, fnBeforeSend);
}

function bindTableCancelados(tipoTabla, arrTipo) {
    var fnBeforeSend = () => {
        WaitMe_Show('#divViajes');
    };

    var jParams = {
        arrIDClientes: GetArrClientes(),
        strIsCambioTarifa: $("#cboTipoCancelacion option:selected").data("iscambiotarifa"),
        strIsDevolucion: $("#cboTipoCancelacion option:selected").data("isdevolucion"),
        strIsIncidencia: $("#cboTipoCancelacion option:selected").data("isincidencia"),
        strAnio: $("#cboAno").val(),
        arrMeses: GetArrMesesContador(),
        strMoneda: $("#cboMoneda").val(),
        strTipoViaje: $("#cboTipoViaje").val(),
        strTipoEmbarque: $("#cboTipoEmbarque").val(),
        strIsMaquila: $("#cboMaquila").val()
    };

    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);

        var jsonOptions = tipoTabla;

        jsonOptions.data = jData;

        var jsonOptions = {
            rowId: tipoTabla.rowId,
            scrollX: true,
            data: jData,
            columns: tipoTabla.columns
        }

        if (tipoTabla.footerCallback) {
            jsonOptions.footerCallback = tipoTabla.footerCallback;
        }
        if (tipoTabla.columnDefs) {
            jsonOptions.columnDefs = tipoTabla.columnDefs;
        }

        addDefaultsOptions(jsonOptions, $("#HFTituloTable").val(), "", "", "");

        try {
            $('#tableViajesCancelados').DataTable().destroy();
            $('#tableViajesCancelados').DataTable(jsonOptions);
        }
        catch (e) {
            console.log(e);
        }
        WaitMe_Hide('#divViajes');
    };

    obtenerReporteCancelados(fnSuccess, jParams, fnBeforeSend);

}

function bindViajesxViaje(idDiv, data) {
    $(idDiv).html('');

    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);
        if (jData.length > 0) {

            var htmlDivTitle = `<div class="div-Folio-Bro bold margin-bottom-10 text-primary"><h6><a id="" data-toggle="collapse" data-target="#divDatosViajexViaje" class="bold margin-bottom-10">RELATIONSHIP WITH THE T0 TRIP </a></h6></div>`;

            $.each(jData, function (i, value) {
                var htmlDiv =
                    `<div id="divDatosViajexViaje" class="collapse"><div class="row">
                <div class="col-lg-6"> <label><strong>Sender:&nbsp;</strong></label><label class="text-right">${value.ClienteOrigen}</label><br /> </div>
                <div class="col-lg-6"> <label><strong>Origin city:&nbsp;</strong></label><label class="text-right">${value.CiudadOrigen}</label><br /> </div>
                <div class="col-lg-6"> <label><strong>Receiver:&nbsp;</strong></label><label class="text-right">${value.ClienteDestino}</label><br /> </div>
                <div class="col-lg-6"> <label><strong>Destination city:&nbsp;</strong></label><label class="text-right">${value.CiudadDestino}</label><br /> </div>
                </div>
                <br /><div class="div-Folio-Bro bold margin-bottom-10 text-primary"><h6 class="label-Folio">CARRIER DATA</h6></div>
                <div class="row">
                <div class="col-lg-3 col-md-3 text-left"><strong>Carrier:<strong/><label>${value.Transportista}</label></div>
                <div class="col-lg-3 col-md-3 text-left">Truck: <label>${value.Tracto}</label></div>
                <div class="col-lg-3 col-md-3 text-left">License Plate: <label>${value.PlacasTracto}</label></div>
                <div class="col-lg-3 col-md-3 text-left">Equipment type: <label>${value.TipoUnidad}</label></div>
                <div class="col-lg-3 col-md-3 text-left">Driver: <label>${value.Operador}</label></div>
                <div class="col-lg-3 col-md-3 text-left">Driver's phone: <label>${value.TelOperador}</label></div>
                <div class="col-lg-3 col-md-3 text-left">Trailer: <label>${value.Remolque}</label></div> 
                <div class="col-lg-3 col-md-3 text-left">License plate: <label>${value.PlacasRemolque}</label></div>
                <div class="col-lg-6 col-md-6 text-left">Start date:  <label>${value.FechaInicio}</label></div> 
                <div class="col-lg-6 col-md-6 text-left">Finish date:  <label>${value.FechaFinal}</label></div> 
                </div ></div>`;

                $(idDiv).html($(idDiv).html() + htmlDiv);
            });

            $(idDiv).html(htmlDivTitle + $(idDiv).html());
        }
        WaitMe_Hide(idDiv);
    };

    var jParams = { strIDBro_viaje: data.IDBro_Viaje };

    var fnBeforeSend = () => {
        WaitMe_Show(idDiv);
    };

    getViajesxViaje(fnSuccess, jParams, fnBeforeSend);

}

function bindServiciosxViaje(idDiv, data) {

    let $div = $(idDiv);

    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);

        $('#divCargaServicios').html('');
        $("#divCargaServiciosxViajeCollapse").html('');
        if (jData.length > 0) {
            var htmlDivTitle = '<div class=""> <strong>Description<strong/> </div >';
            var htmlDivHeader = `<table class="table table-condensed"> 
                                <thead>
                                    <th scope="col">Service</th>
                                    <th scope="col">Cost</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Usuario</th>
                                    <th scope="col">Fecha alta</th>
                                </thead>
                                <tbody>`;

            $.each(jData, function (i, value) {
                if (getParamValuesByURL() == '/Bro_Tablero_Control.aspx' || $('#HFTipoViaje').val() == 'T1' || $('#HFTipoViaje').val() == 'T0' || $('#HFTipoViaje').val() == 'CUSTODIA' || $('#HFTipoViaje').val() == 'RECOLECCION' || getParamValuesByURL() == '/Bro_ViajesT2.aspx' || getParamValuesByURL() == '/Bro_ViajesFinalizados.aspx' || getParamValuesByURL() == '/Bro_ReporteViajes.aspx') {

                    var htmlDiv = `<tr data-servicio="${(value.Servicio).split(' ')[0]}"> 
                                <td>
                                    <button class="btn-link" type="button" data-toggle="collapse" data-target="#divCollapseRazonIncidencias${(value.Servicio).split(' ')[0]}" aria-expanded="false" aria-controls="divCollapseRazonIncidencias${(value.Servicio).split(' ')[0]}"> ${(value.Servicio)} </button> 
                                    <br>
                                    <div class="row collapse" id="divCollapseRazonIncidencias${(value.Servicio).split(' ')[0]}">
                                        <div class="col-lg-10 col-md-10">
                                            <div class="form-group form-md-line-input form-md-floating-label">
                                                <input class="form-control" type="text" readonly value="${(value.Razon)}">
                                                <label>Reason</label>
                                            </div>
                                        </div>
                                        <div class="col-lg-1 col-md-1">
                                            <a class="btn btn-xs btn-${(value.RutaArchivo) ? "success" : "warning link-not-active"} btn-verEvidencia" data-href="${(value.RutaArchivo)}" data-toggle='tooltip' data-placement='right' title='View evidence'>
                                            <i class="fa fa-eye" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                </td>
                                <td class="text-right">
                                    <label> ${(value.Costo)}</label>
                                </td>
                                <td class="text-right">
                                    <label> ${(value.Precio)}</label>
                                </td>
                                <td class="text-right">
                                    <label> ${(value.Usuario)}</label>
                                </td>
                                <td class="text-right">
                                    <label> ${(value.FechaServicio)}</label>
                                </td>
                            </tr>`;
                    $('#divCargaServicios').html($('#divCargaServicios').html() + htmlDiv);
                } else {
                    var htmlDiv = '<label>' + value.Servicio + '</label> &nbsp;&nbsp; &nbsp;&nbsp;';
                    $('#divCargaServicios').html($('#divCargaServicios').html() + htmlDiv);
                }
            });
            var htmlDivFooter = "<tbody></table>";
            $('#divCargaServicios').html(htmlDivHeader + $('#divCargaServicios').html() + htmlDivFooter);
            $('#divCargaServicios').html($('#divCargaServicios').html());
            $("#divCargaServiciosxViajeCollapse").html($("#divCargaServiciosxViajeCollapse").html());

            $(".btn-verEvidencia").click(function (e) {
                $("#mdVerEvidencia").html(htmlModalVerEvidencia);
                $('#mdVerEvidencia').modal('show').css("z-index", "10080");
                $('#imgEvidenciaServicio').prop("src", $(this).data('href'));
            });

        }
        else {
            $('#divCargaServicios').html('<label> No Services data. </label>');
        }
        WaitMe_Hide(idDiv);
    };

    var jParams = { strIDBro_viaje: data.IDBro_Viaje };

    var fnBeforeSend = () => { WaitMe_Hide(idDiv); };

    getServiciosxViaje(fnSuccess, jParams, fnBeforeSend);
}

async function bindEventosxViaje(idDiv, data) {

    var jParams = { strIDBro_viaje: data.IDBro_Viaje };

    let fnSuccess = (data) => {
        let jData = JSON.parse(data.d);
        $('#divCargaEventosxViaje').html('');

        $.each(jData, function (i, value) {
            var htmlDiv = `<div class="row">
                                <div class="col-lg-10 col-md-10">
                                      <div class="form-group form-md-line-input form-md-floating-label">
                                          <label>Fecha: <strong> ${(value.FechaEvento)} </strong> </label>
                                             <p>Responsible user:  ${(value.Usuario)} </p>
                                             <p> ${(value.DescripcionEvento)} </p>
                                      </div>
                                 </div>
                           </div>`;


            $('#divCargaEventosxViaje').html($('#divCargaEventosxViaje').html() + htmlDiv);
        });
    }
    let jData = await getEventosxViaje(jParams);
    fnSuccess(jData);
}

function bindMercanciasxViaje(idDiv, data) {

    let $div = $(idDiv);


    // MERCANCIAS X VIAJE
    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);
        if (jData.length > 0) {

            $('#contenedorMercancias').html('');

            var htmlDivTitle =
                `<div class="row">
                <div class="col-lg-2 col-md-2 text-center">
                    <strong>Packaging</strong>
                </div>
                <div class="col-lg-2 col-md-2 text-center">
                    <strong>Classification</strong>
                </div>
                <div class="col-lg-2 col-md-2 text-center">
                    <strong>Description</strong>
                </div>
                <div class="col-lg-2 col-md-2 text-right">
                    <strong>Quantity</strong>
                </div>
                <div class="col-lg-2 col-md-2 text-right">
                    <strong>Weight</strong>
                </div>
                <div class="col-lg-2 col-md-2 text-right">
                    <strong>Volume</strong>
                </div> 
            </div >`;

            $.each(jData, function (i, value) {
                var htmlDiv =
                    `<div class="row">
                    <div class="col-lg-2 col-md-2 text-center">
                        <label>${value.Embalaje}</label>
                    </div>
                    <div class="col-lg-2 col-md-2 text-center">
                        <label>${value.Clasificacion}</label>
                    </div>
                    <div class="col-lg-2 col-md-2 text-center">
                        <label>${value.Descripcion}</label>
                    </div>
                    <div class="col-lg-2 col-md-2 text-right">
                        <label>${value.Cantidad}<label/>
                    </div>
                    <div class="col-lg-2 col-md-2 text-right">
                        <label>${value.UPeso}</label>
                    </div>
                    <div class="col-lg-2 col-md-2 text-right">
                        <label>${value.UVolumen}</label>
                    </div> 
                </div >`;

                $('#contenedorMercancias').html($('#contenedorMercancias').html() + htmlDiv);
            });

            $('#contenedorMercancias').html(htmlDivTitle + $('#contenedorMercancias').html());
        }
        else {
            $('#contenedorMercancias').html('<label> No goods data </label>');
        }
        WaitMe_Hide(idDiv);
    };

    var jParams = { strIDBro_viaje: data.IDBro_Viaje };

    var fnBeforeSend = () => { WaitMe_Hide(idDiv) };

    getMercanciasxViaje(fnSuccess, jParams, fnBeforeSend);
}

function bindMercanciasDevolucion(idDiv, data) {
    $('#divMercanciasDevoluciones').html('');
    var htmlDivTitle =
        `<div class="row">
                <div class="col-lg-1 col-md-1 text-left">
                    <strong>Packaging</strong>
                </div>
                <div class="col-lg-2 col-md-2 text-left">
                    <strong>Classification</strong>
                </div>
                <div class="col-lg-1 col-md-1 text-left">
                    <strong>Description</strong>
                </div>
                <div class="col-lg-1 col-md-1 text-right">
                    <strong>Quantity</strong>
                </div>
                <div class="col-lg-2 col-md-2 text-center">
                    <strong>Return</strong>
                </div>
                <div class="col-lg-1 col-md-1 text-center">
                    <strong>Remaining</strong>
                </div>
                <div class="col-lg-4 col-md-4 text-center">
                    <strong>Observations</strong>
                </div>
            </div >`;

    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);
        if (jData.length > 0) {

            $.each(jData, function (i, value) {

                var lblRestantes = 'lblRestantes_' + i;

                var htmlDiv = `<div class="row devoluciones">
                                <div class="col-lg-1 col-md-1 text-left">
                                    <br>
                                    <label id="lblDevolucion">${value.Embalaje}</label>
                                </div>
                                <div class="col-lg-2 col-md-2 text-left">
                                    <br>
                                    <label>${value.Clasificacion}</label>
                                </div>
                                <div class="col-lg-1 col-md-1 text-left">
                                    <br>
                                    <label>${value.Descripcion}</label>
                                </div>
                                <div class="col-lg-1 col-md-1 text-right">
                                    <br>
                                    <label class="text-primary">
                                        <strong>${value.Cantidad}</strong><label />
                                </div>
                                <div class="col-lg-2 col-md-2">
                                    <div class="form-group form-md-line-input form-md-floating-label">
                                        <input id="txtCantidadReturn" name="txtCantidadReturn" class="form-control text-danger devolucion edited" data-lblrestantes="${lblRestantes}" data-idbromercanciaxviaje="${value.IDBro_MercanciaxViaje}" data-idbroviaje="${value.IDBro_Viaje}" data-cantidad="${value.Cantidad}" type="number" data-min="0" data-max="${value.Cantidad}" max="${value.Cantidad}" min="0" value="0" data-tipocampo="devolucion" />
                                        <label>Return</label>
                                    </div>
                                </div>
                                <div class="col-lg-1 col-md-1 text-right text-warning">
                                    <br>
                                    <label class="lblRestantes" id="${lblRestantes}">
                                        <strong>${value.Cantidad}</strong><label />
                                </div>
                                <div class="col-lg-4 col-md-4">
                                    <div class="form-group form-md-line-input form-md-floating-label">
                                        <input id="txtMotivo" name="txtMotivo" maxlength="199" class="form-control edited" type="text" data-tipocampo="observacion" />
                                        <label>Observations</label>
                                    </div>
                                </div>
                            </div>`;

                $('#divMercanciasDevoluciones').html($('#divMercanciasDevoluciones').html() + htmlDiv);
            });

            $('#divMercanciasDevoluciones').html(htmlDivTitle + $('#divMercanciasDevoluciones').html());
        }
        else {
            $('#divMercanciasDevoluciones').html('<label> No goods data </label>');
        }
        WaitMe_Hide(idDiv);
    };

    var jParams = { strIDBro_viaje: data.IDBro_Viaje };

    var fnBeforeSend = () => { WaitMe_Show(idDiv) };

    getMercanciasxViaje(fnSuccess, jParams, fnBeforeSend);
}

function bindRepartosxViaje(idDiv, data) {
    $('#divTituloRepartos').html('');

    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);
        $(idDiv).html('');
        var htmlTitleDeals = '<div class="div-Folio-Bro bold margin-bottom-10 text-primary"><h6><a data-toggle="collapse" data-target="#divcontenedorRepartos" class="margin-bottom-10">PICKUPS <span class="fa fa-cube"></span></a></h6></div>';
        if (jData.length > 0) {
            var htmlDivTitleDeals =
                '<div class="row">' +
                '<div class="col-lg-3 col-md-3 text-left"><strong>Destination</strong></div> ' +
                '<div class="col-lg-2 col-md-2 text-left"><strong>Packaging<strong/></div>' +
                '<div class="col-lg-2 col-md-2 text-left"><strong>Classification<strong/></div>' +
                '<div class="col-lg-2 col-md-2 text-left">Description</div>' +
                '<div class="col-lg-1 col-md-1 text-left">Quantity</div>' +
                '<div class="col-lg-1 col-md-1 text-left">Weight</div>' +
                '<div class="col-lg-1 col-md-1 text-left"><strong>Volume</strong></div> ' +
                '</div >';

            $.each(jData, function (i, value) {
                var htmlDiv =
                    '<div class="row">' +
                    '<div class="col-lg-3 col-md-3 text-left"><label> <a class="text-danger" data-toggle="collapse" data-target="#divDatoReparto' + value.IDBro_Reparto + '">' + value.Cliente + '</a></label></div> ' +
                    '<div class="col-lg-2 col-md-2 text-left"><label>' + value.Embalaje + '</label></div>' +
                    '<div class="col-lg-2 col-md-2 text-left"><label>' + value.Clasificacion + '</label></div>' +
                    '<div class="col-lg-2 col-md-2 text-left"><label>' + value.Descripcion + '</label></div>' +
                    '<div class="col-lg-1 col-md-1 text-right"><label>' + value.Cantidad + '<label/></div>' +
                    '<div class="col-lg-1 col-md-1 text-right"><label>' + value.Peso + '</label></div>' +
                    '<div class="col-lg-1 col-md-1 text-right"><label>' + value.Volumen + '</label></div> ' +
                    '</div >' +
                    '<div class="row div-datos-viajexviaje collapse" id="divDatoReparto' + value.IDBro_Reparto + '">' +
                    '<div class="col-lg-1 col-md-1 text-left"><strong>Destination: </strong></div><div class="col-lg-2 col-md-2 text-rihgt"><label>' + value.CiudadDestino + '</label></div>' +
                    '<div class="col-lg-1 col-md-1 text-left"><strong>Street </strong></div><div class="col-lg-2 col-md-2 text-rihgt"><label>' + value.CalleDestino + ', ' + value.NExteriorDestino + ' ,' + value.NIntDestino + '</label></div>' +
                    '<div class="col-lg-1 col-md-1 text-left"><strong>Subdivision </strong></div><div class="col-lg-2 col-md-2 text-rihgt"><label>' + value.ColoniaDestino + '</label></div>' +
                    '<div class="col-lg-1 col-md-1 text-left"><strong>ZCode </strong></div><div class="col-lg-2 col-md-2 text-rihgt"><label>' + value.CPDestino + '</label></div>' +
                    '</div >';
                $(idDiv).html($(idDiv).html() + htmlDiv);
            });
            $('#divTituloRepartos').html(htmlTitleDeals);
            $(idDiv).html(htmlDivTitleDeals + $(idDiv).html());
        }
        else if (jData.length == 0 && jData.TipoViaje == 'REPARTO') {
            $(idDiv).html(DivTitleDeals + 'No deals data');
        }

        WaitMe_Hide(idDiv);
    };

    var jParams = { strIDBro_viaje: data.IDBro_Viaje };

    var fnBeforeSend = () => { WaitMe_Show(idDiv) };

    getRepartosxViaje(fnSuccess, jParams, fnBeforeSend);

}

function bindCustodiasxViaje(idDiv, data) {
    $(idDiv).html('');

    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);
        var DivTitleCustody = '<div class="div-Folio-Bro bold margin-bottom-10 text-primary"><h6> <a id="" data-toggle="collapse" data-target="#divDatosCustody" class="bold margin-bottom-10"> CUSTODIES <span class="fa fa-truck"></span> </a></h6> </div>';
        if (jData.length > 0) {
            var htmlDivTitleCustody =
                '<div class="row">' +
                '<div class="col-lg-3 col-md-3"><strong>Carrier</strong></div> ' +
                '<div class="col-lg-3 col-md-3"><strong>Driver<strong/></div>' +
                '<div class="col-lg-2 col-md-2"><strong>Driver`s phone<strong/></div>' +
                '<div class="col-lg-2 col-md-2"><strong>Unit type<strong/></div>' +
                '<div class="col-lg-2 col-md-2">Simple Unit</div>' +
                '</div >';
            $.each(jData, function (i, value) {
                var htmlDiv =
                    '<div id="divDatosCustody" class=""><div class="row">' +
                    '<div class="col-lg-3 col-md-3"> <label>' + value.Transportista + '</label></div>' +
                    '<div class="col-lg-3 col-md-3"> <label>' + value.Operador + '</label></div>' +
                    '<div class="col-lg-2 col-md-2"> <label>' + value.CelOperador + '</label></div>' +
                    '<div class="col-lg-2 col-md-2"> <label>' + value.TipoUnidad + '</label></div>' +
                    '<div class="col-lg-2 col-md-2"> <label>' + value.UnidadSencilla + '</label></div>';
                '</div ></div>';
                $(idDiv).html($(idDiv).html() + htmlDiv);
            });
            $(idDiv).html(DivTitleCustody + htmlDivTitleCustody + $(idDiv).html());
        }
        else if (jData.length == 0 && jData.TipoViaje == 'CUSTODIA') {
            $(idDiv).html(DivTitleCustody + 'No Custody data');
        }
        WaitMe_Hide(idDiv);
    };

    var jParams = { strIDBro_viaje: data.IDBro_Viaje };

    var fnBeforeSend = () => { WaitMe_Show(idDiv) };

    getCustodiasxViaje(fnSuccess, jParams, fnBeforeSend);
}

function bindTransportistasxViaje(idDiv, data) {
    $(idDiv).html('');

    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);
        var htmlTitleCarriers = '<br/><div class="div-Folio-Bro bold margin-bottom-10 text-primary"><h6> <a id="" data-toggle="collapse" data-target="#divDatosTransportistasxViaje" class="bold margin-bottom-10"> CARRIERS PER TRIP<span class="fa fa-truck"></span> </a></h6> </div>';
        if (jData.length > 0) {
            $.each(jData, function (i, value) {

                var htmlCarriers =
                    '<div class="divDatosTransportistasxViaje" >' +
                    '<div class="row">' +
                    '<div class="col-lg-3 col-md-3"><strong> Carrier: </strong> <label>' + value.Transportista + '</label></div>' +
                    '<div class="col-lg-3 col-md-3"><strong> Truck: </strong> <label>' + value.Tracto + '</label></div>' +
                    '<div class="col-lg-3 col-md-3"><strong> Truck license plate: </strong> <label>' + value.PlacasTracto + '</label></div> ' +
                    '<div class="col-lg-3 col-md-3"><strong> Equipment type: </strong> <label>' + value.TipoUnidad + '</label></div> ' +
                    '</div>' +
                    '<div class="row">' +
                    '<div class="col-lg-3 col-md-3"><strong> Driver: </strong> <label>' + value.Operador + '</label></div> ' +
                    '<div class="col-lg-3 col-md-3"><strong> Driver`s phone: </strong> <label>' + value.TelOperador + '</label></div> ' +
                    //'<div class="col-lg-3 col-md-3"><strong> Trailer: </strong>  <label>' +  + '</label></div> ' +
                    '<div class="col-lg-3 col-md-3"><strong>  Trailer license plate: </strong> <label>' + value.PlacasRemolque + '</label></div> ' +
                    '</div >' +
                    '</div >';
                $(idDiv).html($(idDiv).html() + htmlCarriers);
            });
            $(idDiv).html(htmlTitleCarriers + $(idDiv).html());
        }

        WaitMe_Hide(idDiv);
    };

    var jParams = { strIDBro_viaje: data.IDBro_Viaje };

    var fnBeforeSend = () => { WaitMe_Show(idDiv) };

    getTransportistasxViaje(fnSuccess, jParams, fnBeforeSend);
}

function bindDevolucionesxViaje(idDiv, data) {
    $('#divcontenedorDevoluciones').html('');
    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);

        var DivTitleReturns = `<div class="div-Folio-Bro bold margin-bottom-10 text-primary">
                            <h6> <a data-toggle="collapse" data-target="#divDatosReturns" class="bold margin-bottom-10"> RETURNS </a></h6>
                           </div>`;

        if (jData.length > 0) {
            var htmlDivTitleReturns =
                `<div class="row">
                <div class="col-lg-1 col-md-1 text-center">
                    <strong>Initial Quantity<strong/>
                </div>
                <div class="col-lg-1 col-md-1 text-center">
                    <strong>Finally Quantity<strong/>
                </div>
                <div class="col-lg-1 col-md-1 text-center">
                    <strong>Leftover<strong/>
                </div>
                <div class="col-lg-2 col-md-2 text-center">
                    <strong>Packaging<strong/>
                </div>
                <div class="col-lg-2 col-md-2 text-center">
                    <strong>Classification<strong/>
                </div>
                <div class="col-lg-2 col-md-2 text-center">
                    <strong>Description<strong/>
                </div>
                <div class="col-lg-1 col-md-1 text-center">
                    <strong>Date</strong>
                </div>
            </div >`;

            $.each(jData, function (i, value) {

                var htmlDiv =
                    `<div id="divDatosReturns" class=""><div class="row">
                <div class="col-lg-1 col-md-1"> <label>${value.CantidadInicial}</label></div>
                <div class="col-lg-1 col-md-1"> <label>${value.CantidadDevuela}</label></div>
                <div class="col-lg-1 col-md-1"> <label>${value.CantidadRestante}</label></div>
                <div class="col-lg-2 col-md-2"> <label>${value.TipoEmbalaje}</label></div>
                <div class="col-lg-2 col-md-2"> <label>${value.Clasificacion}</label></div>
                <div class="col-lg-2 col-md-2"> <label>${value.Descripcion}</label></div>
                <div class="col-lg-1 col-md-1"> <label>${value.Fecha}</label></div>
                <div class="col-lg-2 col-md-2"> <label>${value.Observaciones}</label></div>
                </div ></div>`;

                $(idDiv).html($(idDiv).html() + htmlDiv);
            });

            $(idDiv).html(DivTitleReturns + htmlDivTitleReturns + $(idDiv).html());
        }
        else if (jData.length == 0 && jData.IsDevolucion == true) {
            $(idDiv).html(DivTitleReturns + 'No returns data');
        }
    };

    var jParams = { strIDBro_viaje: data.IDBro_Viaje };

    var fnBeforeSend = () => { WaitMe_Show(idDiv) };

    getDevolucionesxViaje(fnSuccess, jParams, fnBeforeSend);

}

function bindIncidenciasxViaje(data) {
    $('#divcontenedorIncidencias').html('');
    var DivTitleIncidences = '<div class="div-Folio-Bro bold margin-bottom-10 text-primary"><h6> <a id="" data-toggle="collapse" data-target="#divDatosIncidences" class="bold margin-bottom-10"> INCIDENCES </a></h6> </div>';
    if (data.length > 0) {
        var htmlDivTitle = '<div class="div-Folio-Bro bold margin-bottom-10 text-primary"><h6><a id="" data-toggle="collapse" data-target="#divDatosViajexViaje" class="bold margin-bottom-10">RELATIONSHIP WITH THE T0 TRIP </a></h6></div>';
        $.each(data, function (i, value) {
            var htmlDiv =
                '<div id="divDatosViajexViaje" class="collapse"><div class="row">' +
                '<div class="col-lg-6"> <label><strong>Sender:&nbsp;</strong></label><label class="text-right">' + value.ClienteOrigen + '</label><br /> </div>' +
                '<div class="col-lg-6"> <label><strong>Origin city:&nbsp;</strong></label><label class="text-right">' + value.CiudadOrigen + '</label><br /> </div>' +
                '<div class="col-lg-6"> <label><strong>Receiver:&nbsp;</strong></label><label class="text-right">' + value.ClienteDestino + '</label><br /> </div>' +
                '<div class="col-lg-6"> <label><strong>Destination city:&nbsp;</strong></label><label class="text-right">' + value.CiudadDestino + '</label><br /> </div>' +
                '</div>' +
                '<br /><div class="div-Folio-Bro bold margin-bottom-10 text-primary"><h6 class="label-Folio">CARRIER DATA</h6></div>' +
                '<div class="row">' +
                '<div class="col-lg-3 col-md-3 text-left"><strong>Carrier:<strong/><label>' + value.Transportista + '</label></div>' +
                '<div class="col-lg-3 col-md-3 text-left">Truck: <label>' + value.Tracto + '</label></div>' +
                '<div class="col-lg-3 col-md-3 text-left">License Plate: <label>' + value.PlacasTracto + '</label></div>' +
                '<div class="col-lg-3 col-md-3 text-left">Equipment type: <label>' + value.TipoUnidad + '</label></div>' +
                '<div class="col-lg-3 col-md-3 text-left">Driver: <label>' + value.Operador + '</label></div>' +
                '<div class="col-lg-3 col-md-3 text-left">Driver`s phone: <label>' + value.TelOperador + '</label></div> ' +
                '<div class="col-lg-3 col-md-3 text-left">Trailer: <label>' + value.Remolque + '</label></div> ' +
                '<div class="col-lg-3 col-md-3 text-left">License plate: <label>' + value.PlacasRemolque + '</label></div> ' +
                '<div class="col-lg-6 col-md-6 text-left">Start date:  <label>' + value.FechaInicio + ' </label></div> ' +
                '<div class="col-lg-6 col-md-6 text-left">Finish date:  <label>' + value.FechaFinal + ' </label></div> ' +
                '</div ></div>';
            $('#divViajesxViaje').html($('#divViajesxViaje').html() + htmlDiv);
        });
        $('#divViajesxViaje').html(htmlDivTitle + $('#divViajesxViaje').html());
    }
}

function bindCambioTarifaxViaje(idDiv, data) {
    $(idDiv).html('');

    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);
        var DivTitleRates = '<div class="div-Folio-Bro bold margin-bottom-10 text-primary"><h6> <a data-toggle="collapse" data-target="#divDatosReturns" class="bold margin-bottom-10"> CHANGE TRIP RATES </a></h6> </div>';
        if (jData.length > 0) {
            var htmlDivTitleRates =
                '<div class="row">' +
                '<div class="col-lg-1 col-md-1 text-right"><strong>Old cost<strong/></div>' +
                '<div class="col-lg-1 col-md-1 text-right"><strong>New cost<strong/></div>' +
                '<div class="col-lg-1 col-md-1 text-right"><strong>Old rev<strong/></div>' +
                '<div class="col-lg-1 col-md-1 text-right"><strong>New rev<strong/></div>' +
                '<div class="col-lg-3 col-md-3 text-center"><strong>Observations<strong/></div>' +
                '<div class="col-lg-2 col-md-2 text-center"><strong>Request date<strong/></div>' +
                '<div class="col-lg-2 col-md-2 text-center"><strong>Decline date</strong></div> ' +
                '</div >';
            $.each(jData, function (i, value) {
                var htmlDiv =
                    '<div id="divDatosReturns" class=""><div class="row">' +
                    '<div class="col-lg-1 col-md-1 text-right"> <label>' + (IsAdministrador ? value.CostoAnterior : '-') + '</label></div>' +
                    '<div class="col-lg-1 col-md-1 text-right"> <label>' + (IsAdministrador ? value.CostoNuevo : '-') + '</label></div>' +
                    '<div class="col-lg-1 col-md-1 text-right"> <label>' + (IsAdministrador ? value.PrecioAnterior : '-') + '</label></div>' +
                    '<div class="col-lg-1 col-md-1 text-right"> <label>' + (IsAdministrador ? value.PrecioNuevo : '-') + '</label></div>' +
                    '<div class="col-lg-3 col-md-3 text-center"> <label>' + value.MotivoSolicitud + '</label></div>' +
                    '<div class="col-lg-2 col-md-2 text-center"> <label>' + value.FechaSolicitud + '</label></div>';
                '<div class="col-lg-2 col-md-2 text-center"> <label>' + value.FechaValidacion + '</label></div>' +
                    '</div ></div>';
                $(idDiv).html($(idDiv).html() + htmlDiv);
            });
            $(idDiv).html(DivTitleRates + htmlDivTitleRates + $(idDiv).html());
        }
        else if (jData.length == 0 && jData.IsCambioTarifa == true) {
            $(idDiv).html(DivTitleRates + 'No change trip rates data');
        }

        WaitMe_Hide(idDiv);
    };

    var jParams = { strIDBro_viaje: data.IDBro_Viaje };

    var fnBeforeSend = () => { WaitMe_Show(idDiv) };

    getCambioTarifaxViaje(fnSuccess, jParams, fnBeforeSend);

}

function bindContadoresTablero(idDiv) {

    let $div = $(idDiv);


    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);
        $('#divCargaContadores').html('');
        var arrColores = ['iniciado', 'origen', 'carga', 'en-ruta', 'transfer', 'cruce', 'destino', 'descarga']; //btn - ' + arrColores[i % arrColores.length] + '
        var sumTotalEviDigitales = 0;
        var sumTotalNoEviDigitales = 0;
        var sumTotalEviFisicas = 0;
        var sumTotalNoEviFisicas = 0;
        var sumTotalStatus = 0
        $.each(jData, function (i, value) {
            sumTotalStatus += value.Total;
            sumTotalEviDigitales += value.TotalEvidenciasDigitales;
            sumTotalNoEviDigitales += value.TotalNoEvidenciasDigitales;
            sumTotalEviFisicas += value.TotalEvidenciasFisicas;
            sumTotalNoEviFisicas += value.TotalNoEvidenciasFisicas;
            var htmlDiv =
                '<div class="col-lg-1 col-md-1 ContadoresStatusFiltro">' +
                '<button type= "button" name="contador" data-totalevidenciasdigitales="' + value.TotalEvidenciasDigitales + '" data-totalnoevidenciasdigitales="' + value.TotalNoEvidenciasDigitales + '" data-totalevidenciasfisicas="' + value.TotalEvidenciasFisicas + '" data-totalnoevidenciasfisicas="' + value.TotalNoEvidenciasFisicas + '" class="btn btn-xs btn-status-rectangle circle btn-' +
                arrColores[i % arrColores.length] + '" value=' + value.NombreStatus + ' ><span class="span-' + arrColores[i % arrColores.length] + ' numStatus">' + value.Total + '</span>' +
                NombresContadores(value.NombreStatus) +
                '</button>' +
                '</div>';
            $('#divCargaContadores').html($('#divCargaContadores').html() + htmlDiv);
        });

        $('#divCargaContadores').html($('#divCargaContadores').html() + htmlbtnTodos);
        $('#btnTodos').html('<span class="span-todos numStatus" >' + sumTotalStatus + '</span> ALL');

        setSpanEvidencias(sumTotalEviDigitales, sumTotalNoEviDigitales, sumTotalEviFisicas, sumTotalNoEviFisicas);

        $("button[name='contador']").click(function () {
            $("button[name='contador']").removeClass("btn-StatusActivo");
            StatusAnterior == $(this).val() ? contadorViajes++ : contadorViajes = 0;
            $(this).addClass("btn-StatusActivo");
            //GetViajesTablero([$('#HFTipoViaje').val()], $(this).val());
            bindtable_viajesTableroControl($(this).val());
            setSpanEvidencias($(this).data("totalevidenciasdigitales"), $(this).data("totalnoevidenciasdigitales"), $(this).data("totalevidenciasfisicas"), $(this).data("totalnoevidenciasfisicas"));
            StatusAnterior = $(this).val();
        });

        $('#btnTodos').click(function () {
            $("button[name='contador']").removeClass("btn-StatusActivo");
            $(this).addClass("btn-StatusActivo");
            setSpanEvidencias(sumTotalEviDigitales, sumTotalNoEviDigitales, sumTotalEviFisicas, sumTotalNoEviFisicas);
            //GetViajesTablero($('#HFTipoViaje').val(), '');
            //bindtable_viajesTableroControl('');
        });
        WaitMe_Hide('#divContadorEvidencias');
    };

    var jParams = {
        strtipo: $('#HFTipoViaje').val(),
        strIDCliente: $('#HFIDCliente_LOG').val(),
        strIDTransportista: $('#HFIDTransportista_LOG').val(),
        strIDUsuarioOPL: $('#HFIDOPL_LOG').val(),
        strTipoConsulta: '',
        strAnio: /*$('#cboAno').val()*/year.getFullYear(),
        arrIDClientes: $('#HFIDCliente_LOG').val() != "0" ? [$('#HFIDCliente_LOG').val()] : GetArrClientes(),
        arrMeses: [],
        strTipoViaje: $('#HFTipoEmbarque').val(),
        strMoneda: '',
        strIDBillToCustomer: $('#HFIDBillToCustomer').val(),
    };

    var fnBeforeSend = () => {
        WaitMe_Show($div);
    };

    getContadores_Tablero(fnSuccess, jParams, fnBeforeSend);

}

function bindContadoresEvidencias(idDiv) {

    let $div = $(idDiv);

    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);

        $.each(jData, function (i, value) {
            $('#lblEvidenciasDigitalesVal').html(value.TotalEvidenciasDigitales);
            $('#lblNoEvidenciasDigitalesVal').html(value.TotalNoEvidenciasDigitales);
            $('#lblEvidenciasFisicasVal').html(value.TotalEvidenciasFisicas);
            $('#lblNoEvidenciasFisicasVal').html(value.TotalNoEvidenciasFisicas);
            $('#totalEvidencias').html(value.TotalEvidenciasDigitales + value.TotalNoEvidenciasDigitales);
            //console.log( "VALOR NOMBRE: "+value.NombreStatus+" SI DIGITALES: " + value.TotalEvidenciasDigitales + " NO DIGITALES: " + value.TotalNoEvidenciasDigitales + " SI FISICAS: " + value.TotalEvidenciasFisicas + " NO FISICAS: " + value.TotalNoEvidenciasFisicas+" TOTAL: "+value.Total + " TOTAL VIAJES: "+value.TotalViajes);
        });

        var table = $('#tableViajesFinalizados').DataTable();

        setSpanEvidenciasFinalizados();


        WaitMe_Hide(idDiv);
    };

    var jParams =
    {
        strtipo: $('#cboTipoViaje').val(),
        strIDCliente: $('#HFIDCliente_LOG').val(),
        strIDTransportista: $('#HFIDTransportista_LOG').val(),
        strIDUsuarioOPL: $('#HFIDOPL_LOG').val(),
        strTipoConsulta: 'FINALIZADO',
        arrIDClientes: $('#HFIDCliente_LOG').val() != "0" ? [$('#HFIDCliente_LOG').val()] : GetArrClientes(),
        arrMeses: GetArrMesesContador(),
        strTipoViaje: $('#HFTipoEmbarque').val(),
        strMoneda: $('#HFMoneda').val(),
        strIDBillToCustomer: $('#HFIDBillToCustomer').val(),
        strAnio: $('#cboAno').val()
    };

    var fnBeforeSend = () => { WaitMe_Show(idDiv); };


    getContadores_Tablero(fnSuccess, jParams, fnBeforeSend);
}

function bindClientesFiscales_Filtro(idDiv) {

    let $div = $(idDiv);

    var fnBeforeSend = () => { WaitMe_Show($div.parent('div')); }

    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);
        var HtmlClientes = "";
        $.each(jData, function (i, value) {
            HtmlClientes = '<input class="form-control icheck chkClientes" type="checkbox" name="chkClientes" value="' + value.IDCliente + '" />' + value.NombreComercial + '<br />'
            $(idDiv).html($(idDiv).html() + HtmlClientes);

        });
        $('input.chkClientes').iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_square-blue'
        });

        // Combos que se llenan para la edicion en Viajes T0 y T1 y Catalogo de Clientes
        //$('#cboBilltoCustomer').val($('#HFIDCustomerBillViaje').val());
        //$('#cboClientesOrigen').val($('#HFIDClienteOrigen_').val());


        //if ($('#HFIDCliente_LOG').val() > 0) {
        //    $('#cboClienteFiscalKpis').val($('#HFIDCliente_LOG').val());
        //    $('#cboBilltoCustomer').val($('#HFIDCliente_LOG').val());
        //    $('#cboCteBillToCustomer').val($('#HFIDCliente_LOG').val());
        //    $('#cboBilltoCustomer').attr('disabled', 'disabled');
        //    $('#cboCteBillToCustomer').attr('disabled', 'disabled');
        //    $('#cboClienteFiscalKpis').attr('disabled', 'disabled');
        //    $('#txtCustomerBillCity').addClass('edited');
        //}
        WaitMe_Hide($div.parent('div'));
    };

    getClientesFiscales(fnSuccess, fnBeforeSend);
}

function bindTransportistas_Filtro(idDiv) {

    let $div = $(idDiv);
    var fnBeforeSend = () => { WaitMe_Show($div.parent('div')); };

    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);
        var HtmlTransportistas = "";
        $.each(jData, function (i, value) {
            HtmlTransportistas = '<input class="form-control icheck chkTransportistas" type="checkbox" name="chkTransportistas" value="' + value.IDTransportista + '" />' + value.NombreComercial + '<br />'
            $(idDiv).html($(idDiv).html() + HtmlTransportistas);

        });
        $('input.chkTransportistas').iCheck({
            checkboxClass: 'icheckbox_flat-blue',
            radioClass: 'iradio_square-blue'
        });

        WaitMe_Hide($div.parent('div'));
    };
    getTransportistas(fnSuccess, fnBeforeSend);
}


function bindClientesFiscales_KPIS(idCbo) {
    let $idCbo = $(idCbo);

    var fnSuccess = (data) => {
        var jsonData = JSON.parse(data.d);

        $.each(jsonData, function (i, value) {
            $('#cboClienteFiscalKpis').append($('<option>').text(value.NombreComercial).attr('value', value.IDCliente));
        });

        if ($('#HFIDClienteFiscal').val() != '') {
            $('#cboClienteFiscalKpis').val($('#HFIDClienteFiscal').val());
        }

        //$('#cboClienteFiscalKpis').select2();
        $(".cboSelect").select2();

        WaitMe_Hide($idCbo.parent('div'));
    };

    var jParams = {
        strIsFiscal: 'true'
    };

    var fnBeforeSend = () => { WaitMe_Show($idCbo.parent('div')) };

    getClientesFiscalesKPIS(fnSuccess, jParams, fnBeforeSend);
}

function bindTable_CuentasxCobrar(data) {
    $('#tableCuentasxCobrar').DataTable().destroy();
    $("#tableCuentasxCobrar").DataTable(
        {
            dom: "<'col-md-3 col-lg-3 semiround-tittle'><'col-md-7 col-lg-7'frBl><'col-md-1 col-lg-1 button-right text-right'>tip",
            "lengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]],
            "scrollY": "530px",
            "scrollX": true,
            fixedColumns: {
                leftColumns: 1
            },
            language: {
                "url": "//cdn.datatables.net/plug-ins/1.10.12/i18n/English.json"
            },
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: '<img src="img/excel.png" height="15px" weight="15px">',
                    className: 'excelButton',
                    titleAttr: 'Excel',
                    filename: 'Accounts receivable' + moment().format('DD-MM-YYYY'),
                }
            ],
            rowId: 'IDBro_Viaje',
            data: data,
            responsive: true,
            //columnDefs: [
            //    { className: "dt-head-center" },
            //    {
            //        className: "dt-head-center  dt-body-center", "targets": [0]
            //    },
            //    {
            //        className: "dt-head-center  dt-body-left", "targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 21, 22]
            //    },
            //    {
            //        className: "dt-head-center  dt-body-right", "targets": [17, 18, 19, 20]
            //    }
            //],
            columns: [
                {
                    className: "dt-head-center dt-body-center",
                    width: "120px",
                    mRender: function (data, type, full) {
                        //return '<a id="btnVerDatosViaje"><strong>' + full.Folio + '<strong/></a>';
                        return '<a id="btnVerDatosViaje" class="' + ((full.IsDisponibleFacturacion == true) ? 'text-success-completed' : 'text-danger') + '"><strong>' + full.Folio + '<strong/></a>';

                    },
                },
                {
                    className: "dt-head-center dt-body-left",
                    width: "150px",
                    data: "UsuarioAlta",

                },
                {
                    className: "dt-head-center dt-body-center",
                    width: "150px",
                    data: "strFechaAlta",

                },
                {
                    //Currency
                    className: "dt-head-center dt-body-center",
                    width: "150px",
                    data: "Moneda",
                },
                {
                    //Commodity value
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    data: "ValorMercancia",
                },
                {
                    //Freight
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    data: "PrecioViaje",
                },
                {
                    //Loading maneuvers
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    //mRender: function (data, type, full) {
                    //    var precioManeuver = "$0";
                    //    $.each(full.jsonServicios, function (i, value) {

                    //        if (value.Servicio == "Loading maneuvers") {

                    //            precioManeuver = (value.Precio != null) ? value.Precio : "$0";
                    //        }
                    //    });
                    //    return precioManeuver;
                    //},
                    data: "PrecioManiobraCarga"
                },
                {
                    //Unloading maneuvers
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    //mRender: function (data, type, full) {
                    //    var precioManeuver = "$0";
                    //    $.each(full.jsonServicios, function (i, value) {

                    //        if (value.Servicio == "Loading maneuvers") {

                    //            precioManeuver = (value.Precio != null) ? value.Precio : "$0";
                    //        }
                    //    });
                    //    return precioManeuver;
                    //},
                    data: "PrecioManiobraDescarga"
                },
                {
                    //Delay
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    //mRender: function (data, type, full) {
                    //    var precioDelay = "$0";
                    //    $.each(full.jsonServicios, function (i, value) {

                    //        if (value.Servicio == "Delays") {

                    //            precioDelay = (value.Precio != null) ? value.Precio : "$0";
                    //        }
                    //    });
                    //    return precioDelay;
                    //},
                    data: "PrecioRetardo"
                },
                {
                    //Stays
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    //mRender: function (data, type, full) {
                    //    var precioDelay = "$0";
                    //    $.each(full.jsonServicios, function (i, value) {

                    //        if (value.Servicio == "Delays") {

                    //            precioDelay = (value.Precio != null) ? value.Precio : "$0";
                    //        }
                    //    });
                    //    return precioDelay;
                    //},
                    data: "PrecioEstadias"
                },
                {
                    //Tollbooth
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    //mRender: function (data, type, full) {
                    //    var precioToll = "$0";
                    //    $.each(full.jsonServicios, function (i, value) {

                    //        if (value.Servicio == "Toll Booths") {

                    //            precioToll = (value.Precio != null) ? value.Precio : "$0";
                    //        }
                    //    });
                    //    return precioToll;
                    //},
                    data: "PrecioCabinaPeaje"
                },
                {
                    //Fuel adjustment charge
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    //mRender: function (data, type, full) {
                    //    var precioFuel = "$0";
                    //    $.each(full.jsonServicios, function (i, value) {

                    //        if (value.Servicio == "Fuel adjustment charge") {

                    //            precioFuel = (value.Precio != null) ? value.Precio : "$0";
                    //        }
                    //    });
                    //    return precioFuel;
                    //},
                    data: "PrecioAjusteCombustible"
                },
                {
                    //Storage
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    //mRender: function (data, type, full) {
                    //    var precioStorage = "$0";
                    //    $.each(full.jsonServicios, function (i, value) {

                    //        if (value.Servicio == "Storage") {

                    //            precioStorage = (value.Precio != null) ? value.Precio : "$0";
                    //        }
                    //    });
                    //    return precioStorage;
                    //},
                    data: "PrecioAlmacenamiento"
                },
                {
                    //Local trip
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    //mRender: function (data, type, full) {
                    //    var precioLocal = "$0";
                    //    $.each(full.jsonServicios, function (i, value) {

                    //        if (value.Servicio == "Local trip") {

                    //            precioLocal = (value.Precio != null) ? value.Precio : "$0";
                    //        }
                    //    });
                    //    return precioLocal;
                    //},
                    data: "PrecioViajeLocal"
                },
                {
                    //Others
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    //mRender: function (data, type, full) {
                    //    var precioOthers = "$0";
                    //    $.each(full.jsonServicios, function (i, value) {

                    //        if (value.Servicio == "Others") {

                    //            precioOthers = (value.Precio != null) ? value.Precio : "$0";
                    //        }
                    //    });
                    //    return precioOthers;
                    //},
                    data: "PrecioOtros"
                },
                {
                    //Escort (custodia)
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    data: "PrecioCustodias",
                },
                {
                    //Deliveries
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    data: "PrecioRepartos",
                },
                {
                    //Pickup
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    data: "PrecioRecoleccion",
                },
                {
                    //lay days
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    //mRender: function (data, type, full) {
                    //    var precioLay = "$0";
                    //    $.each(full.jsonServicios, function (i, value) {

                    //        if (value.Servicio == "Stays") {

                    //            precioLay = (value.Precio != null) ? value.Precio : "$0";
                    //        }
                    //    });
                    //    return precioLay;
                    //},
                    data: "PrecioTarifaEscala"
                },
                {
                    //manager
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    data: "GestorX",
                },
                {
                    //Indexation (CPAC)
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    data: "IndexacionCPAC",
                },
                {
                    //Second delivery
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    data: "SegundaEntrega",
                },
                {
                    //Other charges
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    data: "OtrosCobros",
                },
                {
                    //Subtotal
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    name: "precioSubtotalCol",
                    data: "PrecioSubtotal",
                    mRender: function (data, type, full) {
                        return "<strong class='text-info' >" + data + "</strong>";
                    },
                },
                {
                    //Taxes
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    data: "PrecioIVA",
                },
                {
                    //Retention
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    data: "PrecioRetencion",
                },
                {
                    //Total
                    className: "dt-head-center dt-body-right",
                    width: "150px",
                    data: "PrecioTotal",
                },
                {
                    //Collection type
                    className: "dt-head-center dt-body-left",
                    width: "150px",
                    data: "TipoViaje",

                },
                {
                    //Carrier DC
                    className: "dt-head-center dt-body-left",
                    width: "150px",
                    data: "CedisTrasnportista",

                },
                {
                    //Review date
                    className: "dt-head-center dt-body-center",
                    width: "200px",
                    data: "FechaFactura",

                },
                {
                    //Vendor number
                    className: "dt-head-center dt-body-left",
                    width: "200px",
                    data: "NumeroVendor",

                },
                {
                    //Shipment date
                    className: "dt-head-center dt-body-center",
                    width: "200px",
                    data: "FechaEmbarque",

                },
                {
                    //Delivery date
                    className: "dt-head-center dt-body-center",
                    width: "200px",
                    data: "FechaEntrega",

                },
                {
                    //Delivery date
                    className: "dt-head-center dt-body-center",
                    width: "200px",
                    data: "strFechaDescarga",

                },
                {
                    //Carrier bill
                    className: "dt-head-center dt-body-left",
                    width: "200px",
                    data: "FacturaTransportista",

                },
                {
                    //Orden / Referencia
                    className: "dt-head-center dt-body-left",
                    width: "150px",
                    data: "Referencia",

                },
                {
                    //Transport service
                    className: "dt-head-center dt-body-left",
                    width: "150px",
                    data: "ServicioTransporte",

                },
                {
                    //Bill of lading
                    className: "dt-head-center dt-body-left",
                    width: "150px",
                    data: "CartaPorte",

                },
                {
                    //referral
                    className: "dt-head-center dt-body-left",
                    width: "150px",
                    data: "Remisiones",

                },
                {
                    //bill
                    className: "dt-head-center dt-body-left",
                    width: "150px",
                    data: "Factura",

                },
                {
                    //City origin
                    className: "dt-head-center dt-body-left",
                    width: "150px",
                    data: "ClienteOrigen",

                },
                {
                    //City origin
                    className: "dt-head-center dt-body-left",
                    width: "150px",
                    data: "CiudadOrigen",

                },
                {
                    //Customer name
                    className: "dt-head-center dt-body-left",
                    width: "180px",
                    data: "ClienteDestino",

                },
                {
                    //Destination city
                    className: "dt-head-center dt-body-left",
                    width: "150px",
                    data: "CiudadDestino",

                },
                {
                    //Unit type
                    className: "dt-head-center dt-body-left",
                    width: "150px",
                    data: "TipoUnidad",
                },
                {
                    //Commentaries
                    className: "dt-head-center dt-body-left",
                    width: "170px",
                    data: "Observaciones",
                },
                {
                    //Trailer
                    className: "dt-head-center dt-body-left",
                    width: "150px",
                    data: "Remolque",
                },
                {
                    //Pallets
                    className: "dt-head-center dt-body-left",
                    width: "150px",
                    data: "TotalEmbalaje",
                },
                {
                    //Account / Subaccount
                    className: "dt-head-center dt-body-left",
                    width: "180px",
                    data: "SubCuenta",
                },
                {
                    //Complaint number
                    className: "dt-head-center dt-body-left",
                    width: "150px",
                    data: "NumeroComplaint",
                },
                {
                    //Percentage of use of the unit
                    className: "dt-head-center dt-body-right",
                    width: "200px",
                    mRender: function (data, type, full) {
                        return '<strong class="text-success">' + full.PorcentajeUsoUnidad + '%<strong/>';
                    },
                },
            ]
            , footerCallback: function (row, data, start, end, display) {
                api = this.api();
                var data;
                var intVal = function (i) {
                    return typeof i === 'string' ?//(/[\$,]/g, '')*1 
                        i.replace(/[\$,]/g, '') * 1 :
                        typeof i === 'number' ?
                            i : 0;
                };
                let $tableCuentasxCobrar = $("#tableCuentasxCobrar").DataTable();
                let indexColumn = $tableCuentasxCobrar.column("precioSubtotalCol:name");

                var _SubTotal = GetTotalColumna(indexColumn, api);
                var Subtotal = ConvertirMontos(_SubTotal);
                var PorcSubtotal = (_SubTotal != '' ? '100' : '0');
                $('#divTituloSubtotal').html('<div class="row text-center contadores-header"><p class="bold">Subtotal </p></div>     <div class="row text-right"><div class="col-md-6 col-lg-6"><span class="text-info">$' + (Subtotal) + '</span></div><div class="col-md-6 col-lg-6"><span class="text-info">' + PorcSubtotal + "%" + '</span></div></div>');
            },
            initComplete: function (settings, json) {
                /*TOOLTIP TRIGGER*/
                $('[data-toggle=tooltip]').tooltip({
                    trigger: 'hover'
                });
                //ACCOUNTS RECEIVABLE TITLE
                $("div.semiround-tittle").html('<h5 class="bold">Accounts receivable</h5>');


                //ADJUST TABLE DYNAMICALLY 
                let tablePosition = $('.dataTables_scrollBody').position().top;
                let footerPosition = $('footer').position().top;
                let contenetHeight = footerPosition - tablePosition;

                let navHeight = $('.navbar').outerHeight();
                let footerHeight = $('footer').outerHeight();
                let heightPaginacion = $('.pagination').outerHeight() + 20;
                let heightContadores = $('#divRateRadios').outerHeight() + 75;

                let heightTable = contenetHeight - navHeight - footerHeight - heightPaginacion - heightContadores;
                $('.dataTables_scrollBody').css('height', heightTable);
            }
        }
    );

    WaitMe_Hide('.div-content-reporte');
}

function bindViajesxCobrar() {
    getReporteCuentasxCobrar((data) => {    //INIT TABLE
        bindTable_CuentasxCobrar(JSON.parse(data.d))
    },
        {
            arrIDClientes: GetArrClientes(),
            arrTipo: ($("#cboTipo").val() != "" ? [$("#cboTipo").val()] : []),
            //strAno: $("#cboAnos").val(),
            //arrMeses: arrMesesViajes,
            TipoFecha: $('#cboDateType').val(),
            strStatusProceso: 'FINALIZADO',
            strTipoViaje: $('#cboTipoEmbarques').val(),
            strMoneda: $("#cboMonedas").val(),
            strDateInicio: $("#initDate").val(),
            strDateFinal: $("#finishDate").val(),
            strIsMaquila: $('#cboMaquila').val()
        },
        () => { WaitMe_Show('.div-content-reporte'); }
    );
}

function bindDatosRentaCajas(data) {
    $('#mdDatosRentaCajas').modal('show');
    $("#lblFolio").text(data.Folio);
    $("#lblMoneda").text(data.Moneda); //falta del back
    $("#lblExpedidor").text(data.ClienteExpedidor);
    $("#lblConsignatario").text(data.ClienteConsignatario);
    $("#lblClienteFiscal").text(data.ClienteFiscal);
    $("#lblTransportista").text(data.Transportista);
    $("#lblRemolque").text(data.ClienteExpedidor);
    $("#lblTipoUnidad").text(data.TipoUnidad);//falta del back
    $("#lblFechaInicio").text(data.FechaInicio);//falta del back
    $("#lblHoraInicio").text(data.HoraInicio);//falta del back
    $("#lblFechaFin").text(data.FechaFin);//falta del back
    $("#lblHoraFin").text(data.HoraFin);//falta del back
    $("#lblObservaciones").text(data.Observaciones);//falta del back
    $("#lblCartaPorte").text(data.CartaPorte);//falta del back
    $("#lblCartaInstrucciones").text(data.CartaInstrucciones);//falta del back
    $("#lblAdicionales").text(data.Adicionales);//falta del back
    $("#lblFactura").text(data.Factura);//falta del back
    $("#lblRemisiones").text(data.Remisiones);//falta del back

}

function bindPDFReporteDescarga(idBro_Viaje) {

    let $btn = $('#btnPDFDescarga');

    var fnBeforeSend = () => { WaitMe_Show($btn.parent('div')); };

    var jParams = {
        strIDBro_Viaje: idBro_Viaje
    };

    var fnSuccess = (data) => {
        $btn.attr('href', data.d).attr('target', '_blank');
        $btn.removeClass('disabled').addClass('btn-success');
        WaitMe_Hide($btn.parent('div'));
    };

    getPDFDescarga(fnSuccess, jParams, fnBeforeSend);

}

function bindContadores_Movimientos() {
    var fnSuccess = (data) => {
        var jdata = $.parseJSON(data.d);
        $('#divCargaContadores').html('');
        var arrColores = ['iniciado', 'origen', 'carga', 'en-ruta', 'transfer', 'cruce', 'destino', 'descarga']; //btn - ' + arrColores[i % arrColores.length] + '
        var sumTotalStatus = 0;
        var contadorViajes = 0;
        var StatusAnterior = '';

        $.each(jdata, function (i, value) {
            sumTotalStatus += value.Total;
            var htmlDiv =
                '<div class="col-lg-1 col-md-1 ContadoresStatusFiltro">' +
                '<button type= "button" name="contador" data-search-value="' + value.NombreStatus + '" data-tipo="filtroStatusProceso" data-totalevidenciasdigitales="' + value.TotalEvidenciasDigitales + '" data-totalnoevidenciasdigitales="' + value.TotalNoEvidenciasDigitales + '" data-totalevidenciasfisicas="' + value.TotalEvidenciasFisicas + '" data-totalnoevidenciasfisicas="' + value.TotalNoEvidenciasFisicas + '" class="btn btn-xs btn-status-rectangle circle btn-' +
                arrColores[i % arrColores.length] + '" value=' + value.NombreStatus + ' ><span class="span-' + arrColores[i % arrColores.length] + ' numStatus"></span>' +
                NombresContadores(value.NombreStatus) +
                '</button>' +
                '</div>';
            $('#divCargaContadores').html($('#divCargaContadores').html() + htmlDiv);
        });

        $('#btnTodos').html('<span class="span-todos numStatus" >' + sumTotalStatus + '</span> ALL');

        //$("button[name='contador']").click(function () {
        //    $('#HFStatusProceso').val($(this).val());
        //    $("button[name='contador']").removeClass("btn-StatusActivo");
        //    StatusAnterior == $(this).val() ? contadorViajes++ : contadorViajes = 0;
        //    $(this).addClass("btn-StatusActivo");
        //    bindTableViajes_Reporte(TipoTable);
        //    StatusAnterior = $(this).val();
        //});

        //$('#btnTodos').click(function () {
        //    $('#HFStatusProceso').val('');
        //    $("button[name='contador']").removeClass("btn-StatusActivo");
        //    $(this).addClass("btn-StatusActivo");
        //    bindTableViajes_Reporte(TipoTable);
        //});

        WaitMe_Hide('#divContadores');
    };

    var jParams = {
        strtipo: $('#HFTipoViaje').val(),
        strAnio: obtenerAnioActual(),
        strIDCliente: $('#HFIDCliente_LOG').val(),
        arrIDClientes: $('#HFIDCliente_LOG').val() != "0" ? [$('#HFIDCliente_LOG').val()] : GetArrClientes(),
        strIDTransportista: $('#HFIDTransportista_LOG').val(),
        strIDUsuarioOPL: $('#HFIDOPL_LOG').val(),
        strTipoConsulta: 'PENDIENTE',
        arrMeses: GetArrMesesContador(),
        strTipoViaje: $('#HFTipoEmbarque').val(),
        strMoneda: $('#HFMoneda').val(),
        strIDBillToCustomer: $('#HFIDBillToCustomer').val(),
    };

    var fnBeforeSend = () => {
        WaitMe_Show('#divContadores');
    };

    obtenerContadoresMovimientos(fnSuccess, jParams, fnBeforeSend);
}

function bindTableRemolques(strIDTransportista, idTable = '#tableTrailers') {
    var $table = $(idTable);

    var fnBeforeSend = () => {
        WaitMe_Show($table.parents('div')[3]);
    }
    var fnSuccess = (data) => {
        var jsonOptions = {
            data: JSON.parse(data.d),
            columns: [
                {
                    mRender: function (data, type, full) {

                        return "<a id= 'btnDetallesRemolque' class='btnDatos'  type='button' data-toggle='modal' data-target='#mdDatosTrailer'><strong>" + full.NumeroRemolque + '</strong></a>';
                    },
                    className: "dt-head-center dt-body-center",
                    width: "13%",
                },
                {
                    data: "NumTarCirculacion",
                    className: "dt-head-center dt-body-left",
                    width: "15%",
                },
                {
                    data: "DateCaducidadCirculacion",
                    className: "dt-head-center dt-body-center",
                    width: "10%",
                },
                {
                    data: "TipoUnidad",
                    className: "dt-head-center dt-body-left",
                    width: "10%",
                },
                {
                    data: "Placas",
                    className: "dt-head-center dt-body-left",
                    width: "15%",
                },
                {
                    data: "Marca",
                    className: "dt-head-center dt-body-left",
                    width: "15%",
                },
                {
                    data: "Modelo",
                    className: "dt-head-center dt-body-left",
                    width: "8%",
                },
                {
                    data: "Ano",
                    className: "dt-head-center dt-body-center",
                    width: "8%",
                },
                //{
                //    data: "UsuarioAlta",
                //    width: "15%",
                //},
                //{
                //    data: "strFechaAlta",
                //    width: "15%",
                //},
                {
                    mRender: function (data, type, full) {
                        return `<a data-toggle='tooltip' data-placement='left' title='Edit trailer'> <button type='button' class='btn btn-xs btn-transparent btnEditar' data-toggle='modal' data-target='#mdAltaEdicion' data-command='EDITAR'/><img src='img/Editar.png' class='img-edit-delete'></button></a>`
                    },
                    className: "dt-head-center dt-body-center",
                    width: "3%"
                },
                {
                    mRender: function (data, type, full) {
                        return `<button data-toggle="tooltip" data-placement="left" title="Delete trailer" type="button" class="btn btn-xs btn-transparent" onclick="deleteRemolque(${full.IDRemolque})"/><img src="img/Eliminar.png" class="img-edit-delete"></button>`
                    },
                    className: "dt-head-center dt-body-center",
                    width: "3%",
                },
            ]
        }
        addDefaultsOptions(jsonOptions, "Trailers", "ADD TRAILER", "btnAddTrailer", "");
        $table.DataTable().destroy();
        $table.DataTable(jsonOptions);
    }
    var _IDTransportista = (($('#HFIDTransportistaActivo').val() != 0 && $('#HFIDTransportistaActivo').val() != undefined) ? $('#HFIDTransportistaActivo').val() : strIDTransportista);

    var params = {
        strIDTransportista: _IDTransportista,
        strIDTipoUnidad: ''
    };
    _getRemolques(params, fnBeforeSend, fnSuccess);
}

function bindTableUnidadesTransporta(strIDTransportista, idTabla = '#tableUnidadesTransportista') {
    var $table = $(idTabla);

    var fnBeforeSend = () => {
        WaitMe_Show($table.parents('div')[3]);
    }

    var fnSuccess = (data) => {
        var jsonOptions = {
            data: JSON.parse(data.d),
            columnDefs: [
                {
                    className: "dt-center",
                    "targets": "_all"
                }],
            columns: [
                {
                    data: "NumeroUnidad",
                    width: "10%",
                },
                {
                    data: "Marca",
                    width: "15%",
                },
                {
                    data: "Modelo",
                    width: "15%",
                },
                {
                    data: "Ano",
                    width: "10%",
                },
                {
                    data: "Placas",
                    width: "15%",
                },

                {
                    data: "NumeroSerie",
                    width: "15%",
                },
                {
                    data: "UsuarioAlta",
                    //width: "15%",
                },
                {
                    data: "FechaAlta",
                    //width: "15%",
                },

                {
                    mRender: function (data, type, full) {
                        //return `<a data-toggle='tooltip' data-placement='left' title='Edit unit'> <button data-placement='right' type='button' class='btn btn-xs btn-transparent btnEditar' data-toggle='modal' data-target='#mdAltaEdicion' data-command='EDITAR' data-placement='top' data-idunidadtransportista=${full.IDUnidadTransportista}/><img src='img/Editar.png' class='img-edit-delete'></button></a>`;
                        return `<a data-toggle='tooltip' data-placement='left' title='Edit trailer'> <button type='button' class='btn btn-xs btn-transparent btnEditar' data-toggle='modal' data-target='#mdAltaEdicion' data-command='EDITAR'/><img src='img/Editar.png' class='img-edit-delete'></button></a>`

                    },
                    className: "dt-body-center",
                    width: "3%",
                },
                {
                    mRender: function (data, type, full) {
                        return `<a data-toggle='tooltip' data-placement='left' title='Delete unit'> <button data-placement="right" type="button"  class="btn btn-xs btn-transparent" onclick="deleteUnidadTransportista(${full.IDUnidadTransportista})"/><img src="img/Eliminar.png" class="img-edit-delete"></button></a>`;
                    },
                    className: "dt-body-center",
                    width: "3%",
                }
            ]
        };
        addDefaultsOptions(jsonOptions, "Simple units", "Add unit", "btnNuevo", "");
        $table.DataTable().destroy();
        $table.DataTable(jsonOptions);
    }

    var _IDTransportista = (($('#HFIDTransportistaActivo').val() != 0 && $('#HFIDTransportistaActivo').val() != undefined) ? $('#HFIDTransportistaActivo').val() : strIDTransportista);
    var params = {
        strIDTransportista: _IDTransportista,
        strIDTipoUnidad: ''
    };
    getUnidadesTransporta(params, fnBeforeSend, fnSuccess);
}


function bindTableUnidadesTransporte(idTable = '#tableUnidades') {
    var $table = $(idTable);

    var fnBeforeSend = () => {
        WaitMe_Show($table.parent('div'));
    }

    var fnSuccess = (data) => {
        var jsonOptions = {
            data: JSON.parse(data.d),
            columnDefs: [
                { className: "dt-head-center dt-body-center", "targets": [0, 1, 7, 8] },
                { className: "dt-head-center dt-body-right", "targets": [2, 3, 4, 5, 6] },
            ],
            columns: [
                {
                    mRender: function (data, type, full) {
                        return (full.Nombre);
                    },

                    width: "22%",
                },
                {
                    mRender: function (data, type, full) {
                        return (full.TipoCombustible);
                    },
                    width: "22%",
                },
                {
                    data: "RendimientoxUnidad",
                    width: "10%",
                },
                {
                    data: "VolumenMax",
                    width: "10%",
                },
                {
                    data: "PesoMax",
                    width: "10%",
                },
                {
                    data: "Largo",
                    width: "10%",
                },
                {
                    data: "Ancho",
                    width: "10%",
                },
                //{
                //    data: "UsuarioAlta",
                //    width: "10%",
                //},
                //{
                //    data: "strFechaAlta",
                //    width: "10%",
                //},
                {
                    width: "3%",
                    mRender: function (data, type, full) {
                        return "<a data-toggle='tooltip' data-placement='left' title='Edit transport unit'> <button data-placement='right' type='button' class='btn btn-xs btn-transparent btnEditar' data-toggle='modal' data-target='#mdAltaEdicion' data-command='EDITAR' data-placement='top' data-idtipounidad=" + full.IDTipoUnidad + "/><img src='img/Editar.png' class='img-edit-delete'></button></a>";
                    },
                },
                {
                    width: "3%",
                    mRender: function (data, type, full) {
                        return '<a data-toggle="tooltip" data-placement="left" title="Delete transport unit"> <button data-placement="right" title="Eliminar"  type="button" class="btn btn-xs btn-transparent" onclick="deleteUnidadTrans(' + full.IDTipoUnidad + ')"/><img src="img/Eliminar.png" class="img-edit-delete"></button></a>';
                    },
                }
            ]
        };

        addDefaultsOptions(jsonOptions, "Unit types", "add unit type", "btnAgregarUnidad", "#mdAltaEdicion");

        $table.DataTable().destroy();
        $table.DataTable(jsonOptions);
    }

    getUnidadesTransporte(fnBeforeSend, fnSuccess);
}

function bindTableTransportistas(idTable = "#tableTransportistas") {
    var $table = $(idTable);

    var fnBeforeSend = () => {
        WaitMe_Show($table.parents("div")[3]);
    }

    var fnSuccess = (data) => {
        var columnsBro = [
            {
                width: "160px",
                data: "UsuarioAlta",
            },
            {
                width: "100px",
                data: "FechaAlta",
            },
            {
                width: "280px",
                data: "NombreComercial"
            },
            {
                width: "345px",
                data: "RazonSocial"
            },
            {
                data: "RFC",
                width: "245px",
            },
            {
                mRender: function (data, type, full) {
                    var content = "-";

                    if (full.RutaConvenio) {
                        content = `<a href="${full.RutaConvenio}" target="_blank">See contract</a>`;
                    }

                    return content;
                }, width: "90px",
            },
            {
                data: "Correo",
                width: "285px",
            },
                
            {
                data: "FacturacionTelefono",
                width: "150px",
            },
            {
                data: "Estado",
                width: "168px",
            },
            {
                data: "Municipio",
                width: "170px",
            },
            {
                data: "CodigoPostal",
                width: "105px",
            },
            {
                mRender: function (data, type, full) {
                    return (full.FacturacionCalle + " " + full.FacturacionNumeroInt + " " + full.FacturacionNumeroExt + " " + full.FacturacionColonia);
                },
                width: "330px",
            },
            {
                data: "FacturacionEstado",
                width: "125px",
            },
            {
                data: "FacturacionMunicipio",
                width: "140",
            },
            {
                data: "FacturacionCodigoPostal",
                width: "135px",

            },
            {
                data: "FacturacionPais",
                width: "145px",
            },
            {
                data: "FacturacionBanco",
                width: "135px",
            },
            {
                data: "FacturacionBeneficiario",
                width: "135px",
            },
            {
                data: "FacturacionCuenta",
                width: "135px",
            },
            {
                data: "FacturacionClabeInterbancaria",
                width: "145px",
            },
            {
                data: "FacturacionDiasCredito",
                width: "135px",
            },
            {
                mRender: function (data, type, full) {
                    return ("<a data-toggle='tooltip' data-placement='left' title='Edit carrier'> <button  id='btnEditar' type='button' data-toggle='modal' data-target='#mdAltaEdicion' class='btn btn-xs btn-transparent' data-command='EDITAR'/><img src='img/Editar.png' class='img-edit-delete'></button></a>")
                }, width: "3%",
            },
            {
                mRender: function (data, type, full) {
                    return ('<button data-toggle="tooltip" data-placement="left" title="Delete carrier" data-idusert="' + full.IDUsuario + '" type="button" class="btn btn-xs btn-transparent" onclick="deleteTransportista(' + full.IDTransportista + ')"/><img src="img/Eliminar.png" class="img-edit-delete"></button>')
                }, width: "3%",
            }
        ]
        var jsonOptions = {
            data: JSON.parse(data.d),
            columnDefs: [
                { className: "dt-head-center dt-body-left", targets: [1, 2, 3, 4, 5] },
                { className: "dt-head-center dt-body-center", targets: [6, 7, 8, 9] },
            ],
            columns: columnsBro,
            "scrollX": true,
            responsive: true,
            fixedColumns: true,
        }

        addDefaultsOptions(jsonOptions, "Carriers", "ADD CARRIER", "btnNuevo", "#mdAltaEdicion");

        $table.DataTable().destroy();
        $table.DataTable(jsonOptions);

        WaitMe_Hide($table.parents("div")[3]);
    }

    getTransportistas(fnSuccess, fnBeforeSend);
}

function bindTableViajesT2() {
    var fnSuccess = (data) => {
        let resData = JSON.parse(data.d);
        $("#tableViajesT2").DataTable().destroy();
        $("#tableViajesT2").DataTable({
            data: resData,
            columns: [
                {
                    mRender: function (data, type, full) {
                        return `<a id="btnVerDatosViaje"><strong>${full.Folio}</strong></a>`
                    },
                    className: "dt-head-center dt-body-center",
                    width: "150px"
                },
                {

                    className: "dt-head-center dt-body-left",
                    data: "ClienteBillToCustomer",
                    width: "150px",
                },
                {

                    className: "dt-head-center dt-body-left",
                    data: "ClienteShipper",
                    width: "150px"
                },
                {

                    className: "dt-head-center dt-body-left",
                    data: "ClienteConsigne",
                    width: "150px"
                },
                {

                    className: "dt-head-center dt-body-center",
                    data: "strFechaCita",
                    width: "150px"
                },
                {

                    className: "dt-head-center dt-body-center",
                    data: "strFechaETA",
                    width: "150px"
                },
                {

                    className: "dt-head-center dt-body-left",
                    data: "Transportista",
                    width: "150px"
                },
                {

                    className: "dt-head-center dt-body-left",
                    data: "UsuarioAlta",
                    width: "150px"
                },
                {

                    className: "dt-head-center dt-body-center",
                    data: "strFechaAlta",
                    width: "150px"
                },
                {

                    mRender: function (data, type, full) {
                        return '<span data-toggle="tooltip" data-placement="left" title="Get report"><div class="row text-center"><div class="btn-group">' +
                            '<button type="button" class="btn btn-xs btn-transparent dropdown-togglee" data-toggle="dropdown"><img src="img/PDF.PNG" class="img-edit-delete"></button>' +
                            '<ul class="dropdown-menu" role="menu"> <li><a href="' + full.RutaCartaPorte + '" target="_blank">Bill of lading</a></li> <li><a href="' + full.RutaCartaInstrucciones + '" target="_blank">Instructions</a></li><li><a href="' + full.RutaHojaLiberacion + '" alt="' + full.NombreHojaLiberacion + '" target="_blank">Release sheet</a></li> </ul>' +
                            '</div></div></span>'
                    }, width: "3%",
                },
                {
                    className: "dt-head-center dt-body-center",
                    mRender: function (data, type, full) {
                        return '<a data-toggle="tooltip" data-placement="left" title="Edit trip"><button data-placement="right" data-tipo="editar" type="button" class="btn btn-xs btn-transparent" data-toggle="modal" data-target="#mdNuevoViaje" data-idbro_viaje="' + full.IDBro_Viaje + '"  data-command="CONSULTA"/><img src="img/Editar.png" class="img-edit-delete"></button></a>';
                    }, width: "3%",
                },
                {
                    className: "dt-head-center dt-body-center",
                    mRender: function (data, type, full) {
                        return '<a data-toggle="tooltip" data-placement="left" title="Start trip"><button data-placement="right" data-botontabla="btnIniciarViaje" type="button" class="btn btn-xs btn-transparent" /><img src="img/Iniciar.png" class="img-start"></span></button></a>';
                    }, width: "3%",
                },
                {
                    className: "dt-head-center dt-body-center",
                    mRender: function (data, type, full) {
                        return '<a data-toggle="tooltip" data-placement="left" title="Cancel trip"><button data-placement="right" type="button" data-botontabla="btnCancelarViaje" class="btn btn-xs btn-transparent" data-toggle="modal" data-target="#mdCancelaViaje"/><img src="img/Eliminar.png" class="img-edit-delete"></button></a>';
                    }, width: "3%",
                }
            ],
            rowId: 'IDBro_Viaje',
            dom: "<'col-md-3 col-lg-3 semiround-tittle'><'col-md-5 col-lg-5'frBl><'col-md-4 col-lg-4 button-right text-right'>tip",
            "lengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]],
            "scrollY": "530px",
            language: {
                "url": "//cdn.datatables.net/plug-ins/1.10.12/i18n/English.json"
            },
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: '<img src="img/excel.png" height="15px" weight="15px">',
                    className: 'excelButton',
                    titleAttr: 'Excel',
                    filename: 'T2 trips' + moment().format('DD-MM-YYYY'),
                }
            ],
            initComplete: function (settings, json) {

                /*TOOLTIP TRIGGER*/
                $('[data-toggle=tooltip]').tooltip({
                    trigger: 'hover'
                });

                //T2 TRIPS TITLE
                $("div.semiround-tittle").html('<h5 class="bold">T2 trips</h5>');
                $("div.button-right").html('<button id="btnAltaT2"  data-tipo="alta" class="btn btn-xs btn-add-round" type="button" data-toggle="modal" data-target="#mdNuevoViaje" data-command="ALTA">Generate T2</button>');

                //ADJUST TABLE DYNAMICALLY 
                let tablePosition = $('.dataTables_scrollBody').position().top;
                let footerPosition = $('footer').position().top;
                let contenetHeight = footerPosition - tablePosition;

                let navHeight = $('.navbar').outerHeight();
                let footerHeight = $('footer').outerHeight();
                let heightPaginacion = $('.pagination').outerHeight() + 40;
                let heightTable = contenetHeight - navHeight - footerHeight - heightPaginacion;
                $('.dataTables_scrollBody').css('height', heightTable);


            }
        });

    };

    var jParams = {
        strIDUsuarioOPL: $('#HFIDOPL_LOG').val(),
        strTipoViaje: 'T2',
        strIDCliente: $('#HFIDCliente_LOG').val(),
    };

    var fnBeforeSend = () => {
        WaitMe_Show($("#divViajes"));
    };

    var fnError = () => {
        WaitMe_Hide($("#divViajes"));
    };

    obtenerViajesT2(fnSuccess, jParams, fnBeforeSend, fnError);
}

function bindCboTransportistas(idCbo = '#cboTransportista') {
    var $cbo = $(idCbo)

    var fnBeforeSend = () => {
        WaitMe_Show($cbo.parent('div'));
    }

    var fnSuccess = (data) => {
        var jdata = $.parseJSON(data.d);
        $.each(jdata, function (i, value) {
            $cbo.append($('<option>')
                .text(value.NombreComercial)
                .attr('value', value.IDTransportista));
        });
        $(idCbo).select2();

        WaitMe_Hide($cbo.parent('div'));
    };

    _getTransportistas(fnBeforeSend, fnSuccess);
}

//BINDS

function consultaRemisionCartaPorte(divInput, strCadena, strTipo) {
    var fnSuccess = (data) => {
        let mensajeRemisionCartaPorte = (strTipo == "remisiones") ? "Remission" : (strTipo == "PO") ? "PO" : (strTipo == "facturas") ? "Bill" : (strTipo == "cartaporte") ? "Bill of lading" : "";
        snackbar({
            type: enum_type_snackbar.success,
            text: `${mensajeRemisionCartaPorte} entered correctly`
        });
        WaitMe_Hide(divInput.parent());
    };

    var jParams = {
        strCadena: strCadena,
        strTipo: strTipo
    };

    var fnBeforeSend = () => {
        WaitMe_Show(divInput.parent());
    };

    var fnError = (data) => {
        var jData = $.parseJSON(data.responseText);
        let alert_message = ` ${jData.Message}`;

        snackbar({
            type: enum_type_snackbar.error,
            text: alert_message
        });
        divInput.val('');
        WaitMe_Hide(divInput.parent());
    };

    obtenerConsultaRemisionCartaPorte(fnSuccess, jParams, fnBeforeSend, fnError);
}

function obtenerDatosViaje(strIDBro_Viaje) {

    var currentPromise = new Promise((resolve, reject) => {
        var fnSuccess = (data) => {
            var jData = $.parseJSON(data.d);
            GetDatosViaje(jData[0]);
            WaitMe_Hide($("#mdDatosViaje .modal-body"));

            resolve();
        };

        var jParams = {
            strIDBro_Viaje: strIDBro_Viaje
        };

        var fnBeforeSend = () => {
            WaitMe_Show($("#mdDatosViaje .modal-body"));
        };

        var fnError = (data) => {
            var dataError = $.parseJSON(data.responseText);
            snackbar({
                type: enum_type_snackbar.error,
                text: `System error. Consult your manager:  ${dataError.Message}`
            });
        };

        obtenerDatosModalViaje(fnSuccess, jParams, fnBeforeSend, fnError);
    });

    return currentPromise;
};

//CONSULTAS

function consultarApiCorreo(strCorreoUsuario) {
    var fnSuccess = (data) => {
        snackbar({
            type: enum_type_snackbar.success,
            text: `si funciona:  ${data}`
        });

        WaitMe_Hide($("#txtCorreo").parent('div'));
    };

    var jParams = {
        strCorreo: strCorreoUsuario
    };

    var fnBeforeSend = () => {
        WaitMe_Show($("#txtCorreo").parent('div'));
    };

    var fnError = (data) => {
        snackbar({
            type: enum_type_snackbar.error,
            text: `no funciona:  ${data}`
        });
    };

    obtenerApiCorreo(fnSuccess, jParams, fnBeforeSend, fnError);
}

////////////////////////////////

function bindViajesT0() {
    WaitMe_Show('#divViajesT0');

    var params =
    {
        arrTipo: ['T0'],
        strStatusProceso: 'PENDIENTE',
        strIDCliente: $('#HFIDCliente_LOG').val(),
        strIDTransportista: $('#HFIDTransportista_LOG').val(),
        strIDUsuarioOPL: $('#HFIDOPL_LOG').val(),
        strTipoViaje: '',
        strIsCambioTarifa: '',
        strStatusCambioTarifa: '',
        strIsMaquila: $('#HFIsMaquila').val(),
    }

    var paramJSon = JSON.stringify(params);
    $.ajax({
        url: "Bro_ViajesT0.aspx/GetViajesCreate",
        data: paramJSon,
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var jsonOptions = {
                data: JSON.parse(data.d),
                rowId: 'IDBro_Viaje',
                //columnDefs: [
                //    { className: "dt-head-center  dt-body-center", "targets": [0, 3, 4, 8, 9] },
                //    { className: "dt-head-center  dt-body-left", "targets": [1, 2, 5, 6, 7] }
                //],
                columns: [
                    {
                        width: "10%",
                        mRender: function (data, type, full) {
                            return '<a id="btnDetallesViaje" ' + full.IDBro_Viaje + '"><strong>' + full.Folio + '<strong/></a>';
                        },
                    },
                    {
                        mRender: function (data, type, full) {
                            return (full.ClienteOrigen).substring(0, 28);
                        }, width: "17%",
                    },
                    {
                        mRender: function (data, type, full) {
                            return (full.ClienteDestino).substring(0, 28);
                        }, width: "17%",
                    },
                    {
                        data: "strFechaCarga",
                        width: "7%",
                    },
                    {
                        data: "strFechaDescarga",
                        width: "7%",
                    },
                    {
                        data: "Transportista",
                        width: "15%",
                    },
                    {
                        mRender: function (data, type, full) {
                            return (full.Tracto).substring(0, 28);
                        }, width: "18%",
                    },
                    {
                        data: "UsuarioAlta",
                        width: "15%",
                    },
                    {
                        data: "strFechaAlta",
                        width: "20%",
                    },
                    {
                        mRender: function (data, type, full) {
                            return '<a data-toggle="tooltip" data-placement="left" title="Edit trip"><button data-placement="right" type="button" class="btn btn-xs btn-transparent" data-toggle="modal" data-target="#mdNuevoViaje" data-tipo="editar" data-idbro_viaje="' + full.IDBro_Viaje + '"  data-command="CONSULTA"/><img src="img/Editar.png" class="img-edit-delete"></button></a>';
                        }, width: "5%",
                    },
                    {
                        mRender: function (data, type, full) {
                            return '<a data-toggle="tooltip" data-placement="left" title="Start trip"><button data-tipo="iniciar" ' + (full.TipoViaje != "DIRECTO" ? 'disabled="disabled"' : '') + ' type="button" class="btn btn-xs btn-transparent" /><img src="img/Iniciar.png" class="img-start"></span></button></a>';
                        }, width: "5%",
                    },
                    {
                        mRender: function (data, type, full) {
                            return '<span data-toggle="tooltip" data-placement="left" title="Get report"><div class="row text-center"><div class="btn-group">' +
                                '<button type="button" class="btn btn-xs btn-transparent dropdown-togglee" data-toggle="dropdown"><img src="img/PDF.PNG" class="img-edit-delete"></button>' +
                                '<ul class="dropdown-menu" role="menu"> <li><a href="' + full.RutaCartaPorte + '" target="_blank">Bill of lading</a></li> <li><a href="' + full.RutaCartaInstrucciones + '" target="_blank">Instructions</a></li></ul>' +
                                '</div></div></span>'
                        }, width: "10%",
                    },
                    {
                        mRender: function (data, type, full) {
                            return '<a data-toggle="tooltip" data-placement="left" title="Cancel trip"><button data-placement="right" data-tipo="cancelar"  type="button" class="btn btn-xs btn-transparent" data-toggle="modal" data-target="#mdCancelaViaje"/><img src="img/Eliminar.png" class="img-edit-delete"></button></a>';
                        }, width: "10%",
                    }
                ]
            }
            addDefaultsOptions(jsonOptions, "T0 trips", "GENERATE TRIP", "btnNuevoViaje", "#mdNuevoViaje");
            var table = $('#tableViajesT0').DataTable().destroy();
            $('#tableViajesT0').DataTable(jsonOptions);
            WaitMe_Hide('#divViajesT0');
        },
    });
}

function bindViajesT1() {
    WaitMe_Show('#divViajes');

    var params =
    {
        arrTipo: [$('#HFTipoViaje').val()],
        strStatusProceso: 'PENDIENTE',
        strIDCliente: $('#HFIDCliente_LOG').val(),
        strIDTransportista: $('#HFIDTransportista_LOG').val(),
        strIDUsuarioOPL: $('#HFIDOPL_LOG').val(),
        strTipoViaje: "",
        strIsCambioTarifa: '',
        strStatusCambioTarifa: '',
        strIsMaquila: $('#HFIsMaquila').val(),
    }

    var paramJSon = JSON.stringify(params);
    $.ajax({
        url: "Bro_ViajesT0.aspx/GetViajesCreate",
        data: paramJSon,
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var jsonOptions = {
                rowId: 'IDBro_Viaje',
                data: JSON.parse(data.d),
                columnDefs: [
                    { className: "dt-head-center" },
                    { className: "dt-head-center  dt-body-center", "targets": [0, 4, 5, 7, 8, 9, 10] },
                    { className: "dt-head-center  dt-body-left", "targets": [1, 2, 3, 6, 7] },
                ],
                columns: [
                    {
                        mRender: function (data, type, full) {
                            return '<a id="btnDetallesViaje" ' + full.IDBro_Viaje + '"><strong>' + full.Folio + '<strong/></a>';
                        },
                        width: "10%",
                    },
                    {
                        data: "ClienteBillToCustomer",
                        width: "10%",
                    },
                    {
                        data: "ClienteShipper",
                        width: "10%",
                    },
                    {
                        data: "ClienteConsigne",
                        width: "10%",
                    },
                    {
                        data: "strFechaCita",
                        width: "8%",
                    },
                    {
                        data: "strFechaETA",
                        width: "8%",
                    },
                    {
                        data: "Transportista",
                        width: "8%",
                    },
                    {
                        visible: (($('#HFTipoViaje').val() == "CUSTODIA") ? true : false),
                        data: "Unidad",
                        width: "8%",
                    },
                    {
                        data: "UsuarioAlta",
                        width: "15%",
                    },
                    {
                        data: "strFechaAlta",
                        width: "15%",
                    },
                    {
                        mRender: function (data, type, full) {
                            //<li><a href="' + full.RutaHojaLiberacion + '" alt="' + full.NombreHojaLiberacion + '" target="_blank">Release sheet</a></li>
                            return '<span data-toggle="tooltip" data-placement="left" title="Get report"><div class="row text-center"><div class="btn-group">' +
                                '<button type="button" class="btn btn-xs btn-transparent dropdown-togglee" data-toggle="dropdown"><img src="img/PDF.PNG" class="img-edit-delete"></button>' +
                                '<ul class="dropdown-menu" role="menu"> <li><a href="' + full.RutaCartaPorte + '" target="_blank">Bill of lading</a></li> <li><a href="' + full.RutaCartaInstrucciones + '" target="_blank">Instructions</a></li> </ul>' +
                                '</div></div></span>'
                        }, width: "3%",
                    },
                    {
                        //visible: (($('#HFTipoViaje').val() == "CUSTODIA" || $('#HFTipoViaje').val() == "RECOLECCION" ) ? false : true),
                        mRender: function (data, type, full) {
                            //return '<a data-toggle="tooltip" data-placement="left" title="Edit trip"><button data-placement="right" data-botontabla="btnEditarViajeT1"  ' + (full.TipoViaje != "DIRECTO" ? 'disabled="disabled"' : '') + ' ' + (full.Tipo == "CUSTODIA" ? 'disabled="disabled"' : '') + ' ' + (full.Tipo == "RECOLECCION" ? 'disabled="disabled"' : '') + ' type="button" class="btn btn-xs btn-transparent" data-toggle="modal" data-target="#mdNuevoViaje" data-idbro_viaje="' + full.IDBro_Viaje + '"  data-command="CONSULTA"/><img src="img/Editar.png" class="img-edit-delete"></button></a>';
                            //return '<a data-toggle="tooltip" data-placement="left" title="Edit trip"><button data-placement="right" data-tipo="editar"  ' + (full.TipoViaje != "DIRECTO" ? 'disabled="disabled"' : '') + ' ' + (full.Tipo == "CUSTODIA" ? 'disabled="disabled"' : '') + ' ' + (full.Tipo == "RECOLECCION" ? 'disabled="disabled"' : '') + ' type="button" class="btn btn-xs btn-transparent" data-toggle="modal" data-target="#mdNuevoViaje" data-idbro_viaje="' + full.IDBro_Viaje + '"  data-command="CONSULTA"/><img src="img/Editar.png" class="img-edit-delete"></button></a>';
                            //return '<a data-toggle="tooltip" data-placement="left" title="Edit trip"><button data-placement="right" data-tipo="editar"  ' + (full.TipoViaje != "DIRECTO" ? 'disabled="disabled"' : '') + ' type="button" class="btn btn-xs btn-transparent" data-toggle="modal" data-target="#mdNuevoViaje" data-idbro_viaje="' + full.IDBro_Viaje + '"  data-command="CONSULTA"/><img src="img/Editar.png" class="img-edit-delete"></button></a>';
                            return '<a data-toggle="tooltip" data-placement="left" title="Edit trip"><button data-placement="right" data-tipo="editar" type="button" class="btn btn-xs btn-transparent" data-toggle="modal" data-target="#mdNuevoViaje" data-idbro_viaje="' + full.IDBro_Viaje + '"  data-command="CONSULTA"/><img src="img/Editar.png" class="img-edit-delete"></button></a>';

                        }, width: "3%",
                    },
                    {
                        mRender: function (data, type, full) {
                            return '<a data-toggle="tooltip" data-placement="left" title="Start trip"><button data-placement="right" data-botontabla="btnIniciarViaje" type="button" class="btn btn-xs btn-transparent" /><img src="img/Iniciar.png" class="img-start"></span></button></a>';
                        }, width: "3%",
                    },
                    {
                        mRender: function (data, type, full) {
                            return '<a data-toggle="tooltip" data-placement="left" title="Cancel trip"><button data-placement="right" type="button" data-botontabla="btnCancelarViaje" class="btn btn-xs btn-transparent" data-toggle="modal" data-target="#mdCancelaViaje"/><img src="img/Eliminar.png" class="img-edit-delete"></button></a>';
                        }, width: "3%",
                    }
                ]
            }

            addDefaultsOptions(jsonOptions, $('#HFTipoViaje').val() == "CUSTODIA" ? "Custodies" : $('#HFTipoViaje').val() == "RECOLECCION" ? "Pickups" : "T1 trips", $('#HFTipoViaje').val() == "CUSTODIA" ? "GENERATE CUSTODY" : $('#HFTipoViaje').val() == "RECOLECCION" ? "GENERATE PICKUP" : "GENERATE TRIP", "btnGenerarViaje", "#mdNuevoViaje");
            $('#tableViajes').DataTable().destroy();
            $('#tableViajes').DataTable(jsonOptions);
            WaitMe_Hide('#divViajes');
        },
    });
}

function bindDatosViajeProceso() {
    var param = { pIDBro_Viaje: $('#HFIDBro_Viaje').val() }
    var paramJson = JSON.stringify(param);
    $.ajax({
        type: 'POST',
        url: "Bro_Viaje_Origen.aspx/GetViaje",
        data: paramJson,
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var dataJson = JSON.parse(data.d);
            $('#HFLatOrigen').val(dataJson.LatOrigen);
            $('#HFLngOrigen').val(dataJson.LngOrigen);
            $('#HFLatDestino').val(dataJson.LatDestino);
            $('#HFLngDestino').val(dataJson.LngDestino);
            var strSigStatus = GetSigStatus(dataJson.StatusActual);
            $('#HFStatusActual').val(dataJson.StatusActual);
            $('#HFStatusSiguiente').val(dataJson.StatusSiguiente);
            $('#contentSigStatus').html(GetContenidoSigStatus(strSigStatus, dataJson.pIDViaje));
            $('#btnFolioViaje').html(dataJson.Folio);
            $('#HFTipoViaje').val(dataJson.Tipo);
            if ($('#HFStatusActual').val() != 'INICIADO') {
                $('#divMapRutaOrigen').hide();
                $('#divCurrentPosition').show();
                initMap();
            }
        },
        error: function (data) {
            alert(data);
        }
    });
}

function btnCambiaStatusViaje(IDBro_Viaje, strStatusProceso, strFechaCambio, strHoraCambio, bkeepCapturing, type) {

    var strIDViaje = IDBro_Viaje;
    var strRedirect = 'Bro_Viaje_Origen.aspx?IDBro_Viaje=' + strIDViaje;

    var params =
    {
        strIDBro_Viaje: IDBro_Viaje,
        coordLng: 0,
        coordLat: 0,
        strStatusProceso: strStatusProceso,
        strTipo: $('#HFTipoViajeStatus').val(),
        strObservaciones: "",
        strFechaCambio: strFechaCambio,
        strHoraCambio: strHoraCambio,
    }

    $.ajax({
        type: 'POST',
        // url: getRutaApi() + "api/Viaje/Bro_SetStatus",
        url: "Bro_Tablero_Control.aspx/SetStatusViaje",
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        beforeSend: () => { WaitMe_Show("#mdCambioStatus .modal-content"); },
        dataType: "json",
        success: function (data) {
            var jsonData = $.parseJSON(data.d);

            $('#txtObservaciones').val('');
            $('#txtAddress').val('');
            $('#txtObservaciones').removeClass('edited');
            $('#txtAddress').removeClass('edited');


            if (!bkeepCapturing || ($('#HFEstatusFinal').val() == 'FINALIZADO')) {
                $('#mdCambioStatus').modal('hide');
            }
            else {
                var currentStatus = NombresContadores(jsonData.currentStatus);
                var newStatus = NombresContadores(jsonData.newStatus);
                $('#HFEstatusFinal').val(jsonData.newStatus);
                $('#lbEstatusActual').html(currentStatus);
                $('#lbNuevoStatus').html(newStatus);
            }

            WaitMe_Hide("#mdCambioStatus .modal-content");

            let folioUpdated = $('#HFFolioViaje').val();
            let snackbarMessage = `Trip Status with folio: ${folioUpdated} updated correctly.`;
            hotsnackbar('hsdone', snackbarMessage);

            //GetViajesTablero(arrTipo, '');

            if (type == "create") {

                if ($('#HFTipoViaje').val() == 'T0') {
                    bindViajesT0();
                    //var currentRow = $("#tableViajesT0").DataTable().row(`#${IDBro_Viaje}`);
                    //currentRow.remove().draw();
                    //waitMe_Hide_Row(currentRow.node());
                }
                else {
                    //bindViajesT1();
                    var currentRow = $("#tableViajes").DataTable().row(`#${IDBro_Viaje}`);
                    currentRow.remove().draw();
                    waitMe_Hide_Row(currentRow.node());
                }
            }
            else if (type == 'T2') {
                let IDBro_ViajeT2 = $('#HFIDBro_Viaje').val();
                var currentRow = $("#tableViajesT2").DataTable().row(`#${IDBro_ViajeT2}`);
                currentRow.remove().draw();
                waitMe_Hide_Row(currentRow.node());
            }
            else if (type == "tablero-control") {

                //bindtable_viajesTableroControl();

                var currentRow = $("#tableBro_Viajes").DataTable().row(`#${IDBro_Viaje}`);


                getViaje_ByID(
                    function (data) {
                        let dataJSON = JSON.parse(data.d);

                        if (dataJSON.StatusProceso != 'FINALIZADO') {
                            currentRow.data(dataJSON).invalidate().draw();
                        }
                        else {
                            currentRow.remove().draw();
                        }

                        //calcular status de tablero
                        var tablaTableroControl = $('#tableBro_Viajes').DataTable();
                        var indexColumnStatus = tablaTableroControl.column("statusProceso:name").index();
                        var columnaStatus = tablaTableroControl.columns(indexColumnStatus).data();

                        var totalIniciados = columnaStatus[0].filter((item) => {
                            return item == "INICIADO";
                        });

                        var totalOrigen = columnaStatus[0].filter((item) => {
                            return item == "LLEGADAORIGEN";
                        });

                        var totalCarga = columnaStatus[0].filter((item) => {
                            return item == "CARGA";
                        });

                        var totalRuta = columnaStatus[0].filter((item) => {
                            return item == "RUTA";
                        });

                        var totalTransfer = columnaStatus[0].filter((item) => {
                            return item == "EXCHANGE";
                        });

                        var totalCruce = columnaStatus[0].filter((item) => {
                            return item == "CRUCE";
                        });

                        var totalDestino = columnaStatus[0].filter((item) => {
                            return item == "LLEGADADESTINO";
                        });

                        var totalDescarga = columnaStatus[0].filter((item) => {
                            return item == "DESCARGA";
                        });

                        var totalTodos = tablaTableroControl.data().length;

                        $(".span-iniciado").text(totalIniciados.length);
                        $(".span-origen").text(totalOrigen.length);
                        $(".span-carga").text(totalCarga.length);
                        $(".span-en-ruta").text(totalRuta.length);
                        $(".span-transfer").text(totalTransfer.length);
                        $(".span-cruce").text(totalCruce.length);
                        $(".span-destino").text(totalDestino.length);
                        $(".span-descarga").text(totalDescarga.length);
                        $(".span-todos").text(totalTodos);
                        //Contadores de los status
                        let fnClickStatus = function () {
                            let strSearchValue = $(this).data("search-value");
                            let $tableTableroControl = $('#tableBro_Viajes').DataTable();
                            let indexColumn = $tableTableroControl.column("statusProceso:name").index();
                            $tableTableroControl.columns().search('').draw();
                            $tableTableroControl.columns(indexColumn).search(strSearchValue).draw();
                        };

                        // Filtros de las evidencias sobre la tabla
                        $("[data-tipo='filtroStatus']").click(fnClickStatus);
                        WaitMe_Hide("#divContadorEvidencias");



                        waitMe_Hide_Row(currentRow.node());

                    }, { strIDViaje: IDBro_Viaje },
                    function () {
                        WaitMe_Show("#divContadorEvidencias");
                        waitMe_Show_Row(currentRow.node());
                    });

                //GetContadores_Tablero();

            }

        },
        error: function (data) {
            var dataError = $.parseJSON(data.responseText);
            WaitMe_Hide('#formCambioEstatus');
            swal({
                title: "Error",
                text: dataError.Message,
                type: "error",
                html: true,
                closeOnConfirm: true,
            });
        }
    });
    // });
}

function bindTableViajes_Reporte(tipoTabla, arrTipo, jConfigButton = {}) {
    var $table = $($('#HFIDTabla').val());

    var fnBeforeSend = () => {
        WaitMe_Show('#divViajes');
        WaitMe_Show($('#divFiltrosEvidencias').parent());
    }

    var params = {
        strTipo: $("#cboTipoViaje").val(),
        arrIDClientes: $('#HFIDCliente_LOG').val() != "0" ? [$('#HFIDCliente_LOG').val()] : GetArrClientes(),
        //strIDTransportista: $('#HFIDTransportista_LOG').val(),
        //strIDUsuarioOPL: $('#HFIDOPL_LOG').val(),
        //arrMeses: GetArrMesesContador(),
        //strAno: $('#cboAno').val(),
        strDateInicio: $("#fechaInicial").val(),
        strDateFinal: $('#fechaFinal').val(),
        strMoneda: $('#HFMoneda').val(),
        //strIDBillToCustomer: $('#HFIDBillToCustomer').val(),
        strTipoViaje: $('#HFTipoEmbarque').val(),
        //strStatus: $('#HFStatusProceso').val(),
        //strIscambioarifa: $('#HFIsCambioTarifaViaje').val(),
        //strIsIncidencias: $('#HFIsIncidenciaViaje').val(),
        //strIsDevoluciones: $('#HFIsDevolucionViaje').val()
        //----nuevos parametros con fechas---
        //$("#cboDateTypes").val(),
        //$("#initDates").val(),
        //$("#finishDates").val()
        // ---nuevos parametros con maquilas ---
        strIsMaquila: $("#cboMaquila").val(),
        strIsProcesoCliente: true
    };

    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);

        var jsonOptions = tipoTabla;

        jsonOptions.data = jData;

        var jsonOptions = {
            rowId: tipoTabla.rowId,
            scrollX: true,
            data: jData,
            columns: tipoTabla.columns
        };

        if (tipoTabla.footerCallback) {
            jsonOptions.footerCallback = tipoTabla.footerCallback;
        }
        if (tipoTabla.columnDefs) {
            jsonOptions.columnDefs = tipoTabla.columnDefs;
        }

        addDefaultsOptions(jsonOptions, $('#HFTituloTable').val(), jConfigButton.nameButton, jConfigButton.idButton, jConfigButton.targetModal);

        try {

            if ($('#HFIDCliente_LOG').val() !== "0" && $('#HFIDCliente_LOG').val() !== undefined) {
                $table.DataTable().columns([14, 15, 16, 17]).visible(false, false);
            }
            //.DataTable().columns([15, 16, 17, 18]).visible(false, false);
            $('#' + $('#HFIDTabla').val() + '').DataTable().destroy();
            $('#' + $('#HFIDTabla').val() + '').DataTable(jsonOptions);
            if (typeTableViajesReportes.Finalizados && !IsAdministrador) {
                let tableFinalizados = $('#tableViajesFinalizados').DataTable();
                for (var i = 11; i <= 14; i++) {
                    tableFinalizados.column(i).visible(false, false);
                }

            }
            else if (typeTableViajesReportes.Seguimiento && $('#HFTipoViaje').val() != 'T0') {
                let tableSeguimiento = $('#tableViajesSeguimiento').DataTable();
                for (var i = 15; i <= 16; i++) {
                    tableSeguimiento.column(i).visible(false, false);
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        WaitMe_Hide('#divViajes');
    };
    GetViajes_Reporte(params, fnBeforeSend, fnSuccess);
}


function bindTableViajes_FacturasPendientes(tipoTabla, arrTipo, jConfigButton = {}) {
    var $table = $('#tableViajesPendientesFactura');

    var fnBeforeSend = () => {
        WaitMe_Show('#divViajes');
        WaitMe_Show($('#divFiltrosEvidencias').parent());
    };

    var params = {
        arrIDTransportistas: GetArrTransportistas(),
        strTipo: $("#cboTipoViaje").val(),
        strDateInicio: $("#fechaInicial").val(),
        strDateFinal: $('#fechaFinal').val(),
        strMoneda: $('#HFMoneda').val(),
        strTipoViaje: $('#HFTipoEmbarque').val(),
        strIsMaquila: $("#cboMaquila").val(),
    };

    var fnSuccess = (data) => {
        var jData = JSON.parse(data.d);

        var jsonOptions = tipoTabla;

        jsonOptions.data = jData;

        var jsonOptions = {
            rowId: tipoTabla.rowId,
            scrollX: true,
            data: jData,
            columns: tipoTabla.columns
        };

        if (tipoTabla.footerCallback) {
            jsonOptions.footerCallback = tipoTabla.footerCallback;
        }
        if (tipoTabla.columnDefs) {
            jsonOptions.columnDefs = tipoTabla.columnDefs;
        }

        addDefaultsOptions(jsonOptions, $('#HFTituloTable').val(), jConfigButton.nameButton, jConfigButton.idButton, jConfigButton.targetModal);

        try {
            $table.DataTable().destroy();
            $table.DataTable(jsonOptions);
        }
        catch (e) {
            console.log(e);
        }

        WaitMe_Hide('#divViajes');
    };
    GetViajes_ViajesFacturaPendiente(params, fnBeforeSend, fnSuccess);
}

function bindTableFactura_Transportista(jParams, typeTable, idtable, jConfigButton = {}) {

    var $table = $(idtable);

    var fnBeforeSend = () => {
        WaitMe_Show($table.parent('div'));
    };

    var fnSucces = (data) => {
        var jData = JSON.parse(data.d);

        let jsonOptions = $.extend({}, typeTable);

        jsonOptions.data = jData;

        addDefaultsOptions(jsonOptions, 'Debts to pay', jConfigButton.nameButton, jConfigButton.idButton, jConfigButton.targetModal);

        $table.DataTable().destroy();

        $table.DataTable(jsonOptions);

        WaitMe_Hide($table.parent('div'));
        $("#btnAgregarPago").attr("disabled", true);


        $('#tableFacturas tbody').on('click', '.link-datos-factura', function () {
            var table = $('#tableFacturas').DataTable();
            var idFila = table.row($(this).parents('tr')).id();
            var jdata = table.row($(this).parents('tr')).data();

            $('#lblfolioFactura').text(jdata.strFolio);
            $('#lblTotalFactura').text(jdata.strCostoTotal);
            currentidfactura = jdata.IDFacturaxTransportista;
            $('#mdPartidasFactura').modal('show');
            loadPartidasFactura(idFila);
        });

        $('#tableFacturas tbody').on('click', '.btnCancelarFactura', function () {
            var table = $('#tableFacturas').DataTable();
            var idFila = table.row($(this).parents('tr')).id();
            var jdata = table.row($(this).parents('tr')).data();
            CancelarFactura(idFila);
        });

        //$('#tableFacturas tbody').on('click', '.link-datos-pago', function () {
        //    var table = $('#tableFacturas').DataTable();
        //    var idFila = table.row($(this).parents('tr')).id();

        //    $('#mdPagoFactura').modal('show');
        //    loadPagoProveedor($(this).data('idpago'), idFila);
        //});
    };
    typeTable.fnGet(jParams, fnBeforeSend, fnSucces);
}

function bindTableAdministracion(jParams, typeTable, idtable, jConfigButton = {}) {

    var $table = $(idtable);

    var fnBeforeSend = () => {
        WaitMe_Show($table.parent('div'));
    };

    var fnSucces = (data) => {
        var jData = JSON.parse(data.d);

        let jsonOptions = $.extend({}, typeTable);

        jsonOptions.data = jData;

        addDefaultsOptions(jsonOptions, 'Accounts receivable', jConfigButton.nameButton, jConfigButton.idButton, jConfigButton.targetModal);

        $table.DataTable().destroy();

        $table.DataTable(jsonOptions);

        WaitMe_Hide($table.parent('div'));
        $("#btnAgregarPago").attr("disabled", true)
        $('#tableFacturas tbody').on('click', '.link-datos-factura', function () {
            var table = $('#tableFacturas').DataTable();
            var idFila = table.row($(this).parents('tr')).id();
            var jdata = table.row($(this).parents('tr')).data();

            $('#lblfolioFactura').text(jdata.strFolio);
            $('#lblTotalFactura').text(jdata.strPrecioTotal);
            currentidfactura = jdata.IDFacturaxCliente;
            $('#mdPartidasFactura').modal('show');
            loadPartidasFactura(idFila);
        });

        $('#tableFacturas tbody').on('click', '.btnEliminarFactura', function () {
            var table = $('#tableFacturas').DataTable();
            var idFila = table.row($(this).parents('tr')).id();
            var jdata = table.row($(this).parents('tr')).data();
            EliminaFactura(idFila);

            //const choice = `la factura con el folio ${jdata.strFolio} se ah eliminado`;
            //const data = { os: choice, idfactura: idFila };

            //fetch("http://localhost:3001/api", {
            //    headers: {
            //        Accept: "application/json",
            //        "Content-Type": "application/json"
            //    },
            //    method: "POST",
            //    body: JSON.stringify(data)
            //})
            //    .then(res => res.json())
            //    .then(data => console.log(data))
            //    .catch(err => console.log(err));
        });

        $('#tableFacturas tbody').on('click', '.link-datos-cobro', function () {
            var table = $('#tableFacturas').DataTable();
            var idFila = table.row($(this).parents('tr')).id();

            $('#mdCobroFactura').modal('show');
            loadCobro($(this).data('idcobro'), idFila);
        });

    }

    typeTable.fnGet(jParams, fnBeforeSend, fnSucces);
}

function bindTableCuentasCobradas(jParams, typeTable, idtable) {

    var $table = $(idtable);

    var fnBeforeSend = () => {
        WaitMe_Show($table.parent('div'));
    };

    var fnSucces = (data) => {
        var jData = JSON.parse(data.d);

        let jsonOptions = $.extend({}, typeTable);

        jsonOptions.data = jData;

        addDefaultsOptions(jsonOptions, 'BALANCES RECORDS');

        $table.DataTable().destroy();

        $table.DataTable(jsonOptions);

        WaitMe_Hide($table.parent('div'));


    }

    typeTable.fnGet(jParams, fnBeforeSend, fnSucces);
}

function bindTableCuentasPagadas(jParams, typeTable, idtable) {

    var $table = $(idtable);

    var fnBeforeSend = () => {
        WaitMe_Show('#divCuentasPagadas');
    };

    var fnSucces = (data) => {

        var jData = JSON.parse(data.d);

        let jsonOptions = $.extend({}, typeTable);

        jsonOptions.data = jData;

        addDefaultsOptions(jsonOptions, 'Registration of payments');

        $table.DataTable().destroy();

        $table.DataTable(jsonOptions);

        WaitMe_Hide($table.parent('div'));

        $('#tableCuentasPagadas tbody').on('click', '.link-datos-pago', function () {
            var table = $('#tableCuentasPagadas').DataTable();
            var idFila = table.row($(this).parents('tr')).id();
            var jdata = table.row($(this).parents('tr')).data();
            $('#mdPartidasPago').modal('show');

            $('#lblFolioPago').text(jdata.Folio);
            $('#lblTotalPago').text(jdata.Total);
            currentidfactura = jdata.IDPago;
            loadPartidasPago(idFila);
        });

        $('#tableCuentasPagadas tbody').on('click', '.btnCancelarPago', function () {
            var table = $('#tableCuentasPagadas').DataTable();
            var idFila = table.row($(this).parents('tr')).id();
            var jdata = table.row($(this).parents('tr')).data();
            CancelarPagoTransportista(idFila);
        });

        $('#tableCuentasPagadas tbody').on('click', '.btnid', function () {
            var table = $('#tableCuentasPagadas').DataTable();
            var idFila = table.row($(this).parents('tr')).id();
            var jdata = table.row($(this).parents('tr')).data();
           
            $('#HFIDBro_Viaje').val(jdata.IDPago);
            $('#FolioFac').text(jdata.Facturas);
            $('#FolioPag').text(jdata.Folio);
           
          
         
            $('#mdComplementPago').modal('show');
            fnShowComplemento();
            getEvidenciasPago();
            $("#btnSavePagoComplement").on('click', function () {
                saveComplementPay();
                

            });
           
           // rowUpdate(link, $(this).attr("disabled", false));
        });

        
       
    };

    typeTable.fnGet(jParams, fnBeforeSend, fnSucces);                
}




function bindTablePartidasFactura(jParams, typeTable, idtable) {

    var $table = $(idtable);

    var fnSucces = (data) => {
        var jData = JSON.parse(data.d);
       // console.log(jData.length);
        let jsonOptions = $.extend({}, typeTable);

        jsonOptions.data = jData;

        $table.DataTable().destroy();

        $table.DataTable(jsonOptions);

        if (jData.length <= 1) {
            $('.btnEliminarPartida').hide();//prop("disabled", true);
        }
        else {
            $('#tablePartidasFactura tbody').on('click', '.btnEliminarPartida', function () {
                var table = $('#tablePartidasFactura').DataTable();
                var idFila = table.row($(this).parents('tr')).id();

                EliminaPartidaFactura(idFila);
            });
        }
        
    }
    typeTable.fnGet(jParams, fnSucces);


}

function bindTablePartidasPago(jParams, typeTable, idtable) {

    var $table = $(idtable);

    var fnSucces = (data) => {
        var jData = JSON.parse(data.d);

        let jsonOptions = $.extend({}, typeTable);

        jsonOptions.data = jData;

        $table.DataTable().destroy();

        $table.DataTable(jsonOptions);
    };
    typeTable.fnGet(jParams, fnSucces);
}


function bindTablePartidasFacturaProveedor(jParams, typeTable, idtable) {

    var $table = $(idtable);

    var fnSucces = (data) => {
        var jData = JSON.parse(data.d);

        let jsonOptions = $.extend({}, typeTable);;

        jsonOptions.data = jData;

        $table.DataTable().destroy();

        $table.DataTable(jsonOptions);
        //$('#tablePartidasFactura tbody').on('click', '.btnEliminarPartida', function () {
        //    var table = $('#tablePartidasFactura').DataTable();
        //    var idFila = table.row($(this).parents('tr')).id();

        //    EliminaPartidaFactura(idFila);
        //});
    }
    typeTable.fnGet(jParams, fnSucces);


}

function bindTableCobroFacturas(jParams, typeTable, idtable) {

    var $table = $(idtable);

    var fnSucces = (data) => {
        var jData = JSON.parse(data.d);

        let jsonOptions = $.extend({}, typeTable);

        jsonOptions.data = jData;

        $table.DataTable().destroy();
        $table.DataTable(jsonOptions);

        $('#lblfolioCobro').text(jData.Folio);
        $('#lblTotalCobro').text(jData.Total);
    };

    typeTable.fnGet(jParams, fnSucces);
}

function bindTablePagoProveedor(jParams, typeTable, idtable) {

    var $table = $(idtable);

    var fnSucces = (data) => {
        var jData = JSON.parse(data.d);

        let jsonOptions = $.extend({}, typeTable);

        jsonOptions.data = jData;

        $table.DataTable().destroy();
        $table.DataTable(jsonOptions);

        //$('#lblfolioCobro').text(jData.Folio);
        //$('#lblTotalCobro').text(jData.Total);
    };

    typeTable.fnGet(jParams, fnSucces);
}


function bindArrViajes(typeTable, jData, idTable) {
    let $table = $(idTable);
    let jsonOptions = $.extend({}, typeTable);

    jsonOptions.data = jData;
    $table.DataTable().destroy();

    $table.DataTable(jsonOptions);
}

function bindArrViajesFac_Proveeedor(typeTable, jData, idTable) {
    let $table = $(idTable);
    let jsonOptions = $.extend({}, typeTable);

    jsonOptions.data = jData;
    $table.DataTable().destroy();

    $table.DataTable(jsonOptions);
}


