//var TestFile = null;
var cliente;
var moneda;
var Ev;
var EvDigital;
var EvFisica;
//var idpendienteenviar;
var table;
var subtotal = 0, Tiva=0, TRetencion=0, total=0;
$(document).ready(function() {
//Tabla Pendientes de enviar
formatDataTable();

//on click select row checkbox
        $(document).on( 'change', 'input[name="checkPE"]', function () {
          var input = 'input[name="checkPE"]';
          var btnSubir = '#BtnSubirFacturaPendietnesEnviar';
          if($(this).is(':checked'))
          {
            FiltroCheckboxCliente();
            adddatos();
          var a =  ContadorCheck(input, btnSubir);
          (a != 1) ? $('input[name="Fragmentada"]').prop('disabled', true) : $('input[name="Fragmentada"]').prop('disabled', false);
          }
          else
          {
            adddatos();
           var a = ContadorCheck(input, btnSubir);
           (a != 1) ? $('input[name="Fragmentada"]').prop('disabled', true) : $('input[name="Fragmentada"]').prop('disabled', false);
         }
       });

$('input[name="Fragmentada"]').on("change", function()
{
  document.querySelector('#divFragmentada').innerHTML +=
  `<div class="kt-portlet__body"><div class"kt-uppy" id="Fragmentada"><div class="kt-uppy__dashboard"><div class="kt-uppy__progress"></div></div></div></div>`
  var divID = "#Fragmentada";
  if($(this).is(':checked'))
  {
    $('#see').show();
    $('#seeAlert').show();
    $('#seeFolioAndComen').show();

    var verEv = ".uploaded-files-fragmentadas";
        KTUppyEvidencias.init(divID, verEv);
  }
  else
  {
    $(divID).remove();
    $('#see').hide();
    $('#seeAlert').hide();
    $('#seeFolioAndComen').hide();
  }
});

//on click para el boton del modal subir factura
$(document).on('click', '#BtnSubirFacturaPendietnesEnviar',getDatos);

$('#BtnAplicarFiltro').on('click', fnGetPendientesEnviar);

$('#btnGuardarFactura').on('click', function(){
  if($('#kt_uppy_1').data("rutaarchivoPDF") != undefined && $('#kt_uppy_1').data("rutaarchivoXML") != undefined)
  {
    if($('#txtFolioFactura').val() != "")
    {
      WaitMe_Show('#WaitModalPE');
      saveFactura();
    }
    else
    {
      alertToastError("El folio no puede estar vacio");
    }

  }
  else
  {
    alertToastError("Son necesarios los complementos PDF y XML");

  }
});


//ocultar columnas tabla pendientes enviar
$('input[name="Fecha Descarga"]').on('change', function(e){
 e.preventDefault();
 var column = table.column(3);
 column.visible( ! column.visible() );
});
$('input[name="Subtotal"]').on('change', function(e){
  e.preventDefault();
  var column = table.column(4);
  column.visible( ! column.visible() );
});

$('input[name="IVA"]').on('change', function(e){
 e.preventDefault();
 var column = table.column(5);
 column.visible( ! column.visible() );
});
$('input[name="Retencion"]').on('change', function(e){
 e.preventDefault();
 var column = table.column(6);
 column.visible( ! column.visible() );
});
$('input[name="Total"]').on('change', function(e){
 e.preventDefault();
 var column = table.column(7);
 column.visible( ! column.visible() );
});


//Filtro Rango fecha
$('input[name="FiltroFecha"]').daterangepicker({
 autoUpdateInput: false
});

$('input[name="FiltroFecha"]').on('apply.daterangepicker', function(ev, picker) {
  $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
});

// Filtro select cliente
$("#kt_select2_3").select2({
  placeholder: "Cliente"
});


//Fechas modal
$('#kt_modal_2').on('shown.bs.modal', function(){
  $('#FechaFactura').datepicker({
    format: 'yyyy/mm/dd',
    todayHighlight: true
  });
  $("#FechaFactura").datepicker('setDate', 'today' );
  $('#FechaRevision').datepicker({
    format: 'yyyy/mm/dd',
    todayHighlight: true,
  });
  $("#FechaRevision").datepicker('setDate', 'today' );

  $('#FechaVencimiento').datepicker({
   format: 'yyyy/mm/dd',
   todayHighlight: true
 });
  $("#FechaVencimiento").datepicker('setDate', 'today' );
  $('#FechaVencimiento').prop('disabled', true);
				//KTUppy.init()
      });

//limpiar modal
$('#kt_modal_2').on('hidden.bs.modal', function(){
  LimpiarModalSF();
  KTUppy.init()
});

$('input[name="TipoCambio"]').on('change', function(){
  getDatos();
});




//FUNCIONES PARA PENDIENTES DE ENVIAR


//validacion mismo cliente en los checkbox
function FiltroCheckboxCliente(){
  var checked = $("input[name='checkPE']:checked");
  $("input[name=checkPE]:checked").each(function () {
   var check = table.row($(this).parents('tr')).data();
   if(checked.length > 1)
   {
     if (check[2] != cliente || check[8] != moneda) {
      $(this).prop('checked', false);
      alertToastError("El cliente y la moneda deben ser iguales");
    }
    else
    {
      console.log("ok");
    }
  }
  else
  {
    cliente = check[2];
    moneda = check[8];
  }
});
}

//funcion limpiar modal subir facturas de pendientes de enviar
function LimpiarModalSF()
{
  $('input[name="FolioFactura"]').val("");
  $('input[name="Comentarios"]').val("");
  $('input[name="TipoCambio"]').val(1);
  TestFile = null;
  $('.uploaded-files ol').remove();
  $('#Fragmentada').remove();
  $('input[name="Fragmentada"]').prop('checked', false);
  $('#see').hide();
  $('#seeAlert').hide();
  //ids = [];
}



// plugin para subir los archivos de las facturas en Modal Pendientes de enviar
"use strict";

		// Class definition
		var KTUppy = function () {
			const Tus = Uppy.Tus;
			const ProgressBar = Uppy.ProgressBar;
			const StatusBar = Uppy.StatusBar;
			const FileInput = Uppy.FileInput;
			const Informer = Uppy.Informer;
			const XHRUpload = Uppy.XHRUpload;


			// to get uppy companions working, please refer to the official documentation here: https://uppy.io/docs/companion/
			const Dashboard = Uppy.Dashboard;
			const GoogleDrive = Uppy.GoogleDrive;

			// Private functions
			var initUppy1 = function(){
				var id = '#kt_uppy_1';

				var options = {
					proudlyDisplayPoweredByUppy: false,
					target: id,
					inline: true,
					height: 260,
					replaceTargetContent: true,
					showProgressDetails: true,
					note: 'Logisti-k',

					/*metaFields: [
						{ id: 'name', name: 'Name', placeholder: 'file name' },
						{ id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' }
           ],*/
           browserBackButtonClose: true,

         }

         var uppyDashboard = Uppy.Core({
           autoProceed: false,
           restrictions: {
						maxFileSize: 5000000, // 5mb
						maxNumberOfFiles: 2,
						minNumberOfFiles: 2,
           allowedFileTypes:['.pdf', '.xml']
         },
         locale: Uppy.locales.es_ES,
         onBeforeFileAdded: (currentFile, file) => {
           //if($('.uppy-DashboardContent-title').length == 0)
           if(Object.values(file)[0] === undefined)
           {
             console.log("+1")
           }
           else
           {
             if((currentFile.type === Object.values(file)[0].meta.type))
             {
               uppyDashboard.info(`Los archivos deben ser diferentes`, 'error', 500)
               return false
             }
             else
             {
               console.log("ok")
             }
           }

         }
       });


         uppyDashboard.use(Dashboard, options);
         uppyDashboard.use(XHRUpload, { endpoint: 'https://api-bkg-test.logistikgo.com/api/Viaje/SaveevidenciaTest', method: 'post'});
				//uppyDashboard.use(XHRUpload, { endpoint: 'http://localhost:63510/api/Viaje/SaveevidenciaTest', method: 'post'});
				uppyDashboard.use(GoogleDrive, { target: Dashboard, companionUrl: 'https://companion.uppy.io' });
        uppyDashboard.on('upload-success', (file, response) => {
          const fileName = file.name
          if (file.extension === 'pdf')
          {
           const urlPDF = response.body
           $('#kt_uppy_1').data("rutaarchivoPDF", urlPDF)
           document.querySelector('.uploaded-files').innerHTML +=
           `<ol><li id="listaArchivos"><a href="${urlPDF}" target="_blank" name="url" id="RutaPDF">${fileName}</a></li></ol>`
                 //  console.log($('#kt_uppy_1').data("rutaarchivoPDF"))
               }
               else
               {
                 const urlXMLCheck = response.body
                 var to = leerxml(urlXMLCheck)
                 if(to != total)
                 {
                   $("#btnGuardarFactura").prop("disabled", true)
                   alertToastError("El total de la factura no coincide con el total calculado del sistema")
                    //uppyDashboard.reset()
                    uppyDashboard.cancelAll()

                  }
                  else
                  {
                   $("#btnGuardarFactura").prop("disabled", false)
                   const urlPDF = response.body
                   $('#kt_uppy_1').data("rutaarchivoXML", urlPDF)
                   document.querySelector('.uploaded-files').innerHTML +=
                   `<ol><li id="listaArchivos"><a href="${urlPDF}" target="_blank" name="url" id="RutaXML">${fileName}</a></li></ol>`
                 }

                   //console.log($('#kt_uppy_1').data("rutaarchivoXML"))
                 }
                 //$("#btnGuardarFactura").prop("disabled", false)
                 //const url = response.body
   // `<embed src="${url}">`
 });

      }
      return {
				// public functions
				init: function() {
					initUppy1();

				}
			};
		}();

		KTUtil.ready(function() {
			KTUppy.init();
		});

  });

//funcion para obtener los datos de cada checkbox seleccionado en la tabla pendientes de enviar
function adddatos(){
  var arrSelect=[];
  $("input[name=checkPE]:checked").each(function () {
    var table = $('#TablePendientesEnviar').DataTable();
    var datosRow = table.row($(this).parents('tr')).data();
    arrSelect.push([datosRow[1], datosRow[4], datosRow[5], datosRow[6], datosRow[7], datosRow[8]]);
  });
  return arrSelect;
}


//funcion para obtener los datos de la tabla pendiente de enviar para mostrarlos en la tabla del modal subir facturas
function getDatos(){
 var datos = adddatos();
 var newData = [];
 subtotal = 0, Tiva=0, TRetencion=0, total=0, moneda, totalCambio=0;
 for (var i=0; i<datos.length; i++)
 {
  moneda = datos[i][5];
  if(datos[i][5] === "MXN")
  {
    var sub = parseFloat(datos[i][1]);
    var iva = parseFloat(datos[i][2]);
    var retencion = parseFloat(datos[i][3]);
    var tot = parseFloat(datos[i][4]);
    subtotal = subtotal + sub;
    Tiva = Tiva + iva;
    TRetencion = TRetencion + retencion;
    total = total + tot;
    datos[i].push("null");

  }
  if(datos[i][5] === "USD")
  {
    var tipoCambio = $('input[name="TipoCambio"]').val();

    var folio = datos[i][0];
    var sub = parseFloat(datos[i][1]);
    var iva = parseFloat(datos[i][2]);
    var retencion = parseFloat(datos[i][3]);
    var tot = parseFloat(datos[i][4]);
    var totCambio = (parseFloat(datos[i][4]) * tipoCambio);
    datos[i].push(totCambio);
        //newData.push([folio, sub, iva, retencion, tot]);
        subtotal = subtotal + sub;
        Tiva = Tiva + iva;
        TRetencion = TRetencion + retencion;
        total = total + tot;
        totalCambio = totalCambio + totCambio;

      }
    }

    var h = [datos];
    var table = $('#ResumTable').DataTable({
     destroy: true,
     data: h[0],
     columnDefs: [
     {
       "targets": 0,
       "className": "dt-head-center dt-body-center bold"
     },
     {
       "targets": [1,2,3,4],
       "className": "dt-head-center dt-body-right"
     },
     {
       "targets": 5,
       "className": "dt-head-center dt-body-center"
     },
     {
       "targets": 6,
       "width": "10%",
       "className": "dt-head-center dt-body-center"
     }
     ]

   });

    $('#sub').html('<strong>$'+subtotal+'</strong>');
    $('#iva').html('<strong>$'+Tiva+'</strong>');
    $('#retencion').html('<strong>$'+TRetencion+'</strong>');
    $('#total').html('<strong>$'+total+'</strong>');
    $('#Moneda').html('');
    $('#totalCambio').html('<strong>$'+truncarDecimales(totalCambio, 2)+'<strong>');
  }


  function saveFactura() {
    jParams = {
      FolioFactura: $('#txtFolioFactura').val(),
      Cliente: cliente,
      FechaFactura: $('#FechaFactura').val(),
      FechaRevision: $('#FechaRevision').val(),
      FechaVencimiento: $('#FechaVencimiento').val(),
      Moneda: moneda,
      SubTotal: subtotal,
      IVA: Tiva,
      Retencion: TRetencion,
      Total: total,
      RutaXML: $('#kt_uppy_1').data("rutaarchivoXML"),
      RutaPDF: $('#kt_uppy_1').data("rutaarchivoPDF"),
      TipoCambio: $('#txtTipoCambio').val(),
      Comentarios: $('#txtComentarios').val(),
    }

    fetch("/PendientesEnviar/SaveFactura", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(jParams)
    }).then(function(response){

      if(response.status == 200)
      {
        $('#BtnSubirFacturaPendietnesEnviar').prop("disabled", true);
    //  console.log(ids);
    return response.clone().json();
  }
  else if(response.status == 500)
  {
    Swal.fire({
      type: 'error',
      title: 'El folio indicado ya existe en el sistema',
      showConfirmButton: false,
      timer: 2500
    })
    WaitMe_Hide('#WaitModalPE');
      //console.log("El folio indicado ya existe en el sistema");
    }

  }).then(function(IDFactura){
    SavePartidasxFactura(IDFactura);
  }).catch(function(ex){
    console.log("no success!");
  });
}

function SavePartidasxFactura(IDFactura) {
  var arrConceptos = [];
  var currentIDConcepto = 0;
  $("#TablePendientesEnviar input[name=checkPE]:checked").each(function () {
    currentIDConcepto = $($(this).parents('tr')[0]).data('idconcepto');
    if(!arrConceptos.includes(currentIDConcepto))
      arrConceptos.push(currentIDConcepto);
  });
  jParams = {
    IDFactura: IDFactura,
    arrConceptos: arrConceptos,
  }

  fetch("/PendientesEnviar/SavePartidasxFactura", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(jParams)
  }).then(function(response){
    if(response.status == 200)
    {
      WaitMe_Hide('#WaitModalPE');
      $("#kt_modal_2").modal('hide');
      var table = $('#TablePendientesEnviar').DataTable();
      $("#TablePendientesEnviar input[name=checkPE]:checked").each(function () {
        table.row($(this).parents('tr')).remove().draw();
      });

      Swal.fire({
        type: 'success',
        title: 'Factura guardada correctamente',
        showConfirmButton: false,
        timer: 1500
      })
      $('#divTablaPendientesEnviar').html(data.htmlRes)
      formatDataTable();
    }
    else if(response.status == 500)
    {
      alertToastError("Error al guardar la partida");
      //console.log("Error al guardar la partida");
    }
  }).catch(function(ex){
    console.log("no success!");
  });
}

var fnGetPendientesEnviar = function () {
  startDate = ($('#cboFechaDescarga').data('daterangepicker').startDate._d).toLocaleDateString('en-US');
  endDate = ($('#cboFechaDescarga').data('daterangepicker').endDate._d).toLocaleDateString('en-US');
  arrStatus = $('#cboStatus').val();
  arrClientes = $('#cboCliente').val();
  strMoneda = $('#rdMXN').is(':checked') ? 'MXN' : 'USD';
  WaitMe_Show('#divTablaPendientesEnviar');
  fetch("/PendientesEnviar/FilterBy?FechaDescargaDesde="+ startDate +"&FechaDescargaHasta="+ endDate +"&Status="+ JSON.stringify(arrStatus) +"&Cliente="+ JSON.stringify(arrClientes) +"&Moneda="+ strMoneda, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  }).then(function(response){
    return response.clone().json();
  }).then(function(data){
    $('#divTablaPendientesEnviar').html(data.htmlRes);
    formatDataTable();
  }).catch(function(ex){
    console.log("no success!");
  });
}


function formatDataTable() {
  table = $('#TablePendientesEnviar').DataTable( {
 "language": {
   "url": "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
 },
 "responsive": true,
 "paging": false,
 "dom": 'Bfrtip',
 "buttons": [
 'excel'
 ],

 columnDefs: [ {
   orderable: false,
   targets:   0,
   "className": "dt-head-center dt-body-center",
   "width": "1%",
   "mRender": function (data, type, full) {
     EvDigital = $('input[name="isEvicencias"]').data("evidenciadigital");
     EvFisica = $('input[name="isEvicencias"]').data("evidenciafisica");
         //idpendienteenviar = $('input[name="isEvicencias"]').data("idpendienteenviar");
         return (EvDigital != 'False' && full[9] == 'Finalizado' && EvFisica != 'False' ? '<input type="checkbox" name="checkPE" id="estiloCheckbox" />': '');
       }
     },
     {
      "width": "5%",
      "className": "text-center bold",
      "targets": 1
    },
    {
      "width": "10%",
      "className": "dt-head-center dt-body-center",
      "targets": [2,3]
    },
    {
      "width": "5%",
      "className": "dt-head-center dt-body-center",
      "targets": [8,9]

    },
    {
      "className": "dt-head-center dt-body-right",
      'width' : '5%',
      "targets": [4,5,6,7]
    },
    {
      "width": "5%",
      "className": "dt-head-center dt-body-center",
      "targets": 10,
      "mRender": function (data, type, full) {
        return (EvDigital != 'False' && full[9] == 'Finalizado' && EvFisica != 'False' ? '<a class="kt-badge kt-badge--info kt-badge--inline text-white" data-toggle="modal" data-target="#ModalVerEvidencias" data-backdrop="static" data-keyboard="false"><i class="flaticon2-image-file"></i></a>':'');
      }
    }]
  } );
}
