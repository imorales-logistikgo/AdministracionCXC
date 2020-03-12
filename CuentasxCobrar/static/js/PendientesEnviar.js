
//var TestFile = null;
var cliente;
var idcliente;
var Moneda;
var Ev;
var EvDigital;
var EvFisica;
var moneda;
var controlDesk;
var DiasCredito;
var Dcreditos;
var TipoConcepto;
var Total_;
var folio_ = [];
var totalReajuste_ =0;
var diferenciaRejuste = 0;
var diferenciaRejusteServ = 0;
var idFolioReajuste;
var totalReajusteServicios_;
var totalViaje;
var oldTotal;
var oldTotalViaje;
var oldTotalServ;
//var newTotalReajuste;
//var idpendienteenviar;
var table;
var subtotal = 0, Tiva=0, TRetencion=0, total=0, Tservicios = 0, viaje=0, IServicios=0, RServicios=0, SBServicios=0;
$(document).ready(function() {
//Tabla Pendientes de enviar
formatDataTable();

//obtener datos para el modal de reajustar cantidades viaje y servicios
//$(document).on('click', '#folioReajuste', getDatosModalreajuste);

$(document).on('change', '#TotalReajuste', function(){
  $('input[name="Fragmentada"]').is(':checked') ? $('#TotalReajusteServicios').prop('disabled', true) : "";
  var newTotalReajuste = $('#TotalReajuste').val();
  newTotalReajuste > (Number(totalReajuste_) + Number(1)) || newTotalReajuste < (Number(totalReajuste_) - Number(1)) ?  alertToastError("No se puede ajustar más o menos de $1") : recalculoAjuste(newTotalReajuste);
});

$(document).on('change', '#TotalReajusteServicios', function(){
  $('#TotalReajuste').prop('disabled', true)
    var newTotalReajusteServ = $('#TotalReajusteServicios').val();
    newTotalReajusteServ > (Number(totalReajusteServicios_) + Number(1)) || newTotalReajusteServ < (Number(totalReajusteServicios_) - Number(1)) ?  alertToastError("No se puede ajustar más o menos de $1") : recalculoAjusteServ(newTotalReajusteServ);
});

$(document).on('click', '#btnGuardarReajuste',function(){
  $(document).off('click','#folioReajuste');
  $('a[id = "folioReajuste"]').removeAttr("href");
  $('#chkFragmentada').prop('disabled', true);
  $('#ModalReajuste').modal('hide');
});

$(document).on('click', '#BtnCloseModalReajuste, #closeBtnModalR', function(){
  if($('input[name="Fragmentada"]').is(':checked'))
  {
    $('#TotalReajuste').prop('disabled', false);
    $('#TotalReajusteServicios').prop('disabled', false)
    viaje = oldTotalViaje;
    Tservicios = oldTotalServ;
    $('#totalViaje').html('<strong>$'+viaje.toFixed(2)+'</strong>');
    $('#totalServicios').html('<strong>$'+Tservicios.toFixed(2)+'</strong>');
  }
  else{
    total = oldTotal;
    $('#total').html('<strong>$'+total.toFixed(2)+'</strong>');
  }

});

/*$(document).on('click', "#TotalReajuste", function() {
  ('#TotalReajusteServicios').prop('disabled', true);
});*/

//on click select row checkbox XDDT1N150120ET000222
        $(document).on( 'change', 'input[name="checkPE"]', function () {
          var input = 'input[name="checkPE"]';
          var btnSubir = '#BtnSubirFacturaPendietnesEnviar';
          if($(this).is(':checked'))
          {
          //  var table = $('#TablePendientesEnviar').DataTable();
          //  var d= table.row($(this).parents('tr')).data()[15];
            Dcreditos = $(this).data("creditodias");
            //Dcreditos=d;
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
  $('#alertaViajeFragmentada').css("display", "block");
  viaje = total-Number(Tservicios);
  $('#totalViaje').html('<span>'+viaje.toFixed(2)+'</span>');
  sendDataModalServ();
});

//on click para el boton del modal subir factura
$(document).on('click', '#BtnSubirFacturaPendietnesEnviar', function(){
  getDatos();
  //mostrarTipoCambio();
});

//verificar si el folio ya existe en la base de datos
$('#txtFolioFactura').on('change', function() {
  var folioFac = $('#txtFolioFactura').val().replace(/ /g, "").trim().toUpperCase();
  fnCheckFolio(folioFac);
});

//verificar si el folio ya existe en la base de datos para la fragmentacion
$('#txtFolioServicios').on('change', function(){
  var folioFacServ = $('#txtFolioServicios').val().replace(/ /g, "").trim().toUpperCase();
  fnCheckFolio(folioFacServ);
});

$('#BtnAplicarFiltro').on('click', fnGetPendientesEnviar);

$('#btnGuardarFactura').on('click', function(){
  if($('input[name="Fragmentada"]').is(':checked'))
  {
    //validaicon si la factura sera fragmentada
    $('#txtFolioFactura').val() == $('#txtFolioServicios').val() ? $('#txtFolioServicios').val(''): '';
    if($('#Fragmentada').data("rutaarchivoPDF") != undefined && $('#Fragmentada').data("rutaarchivoXML") != undefined || $('#Fragmentada').data("rutaarchivoPDF") != null && $('#Fragmentada').data("rutaarchivoXML") != null)
    {
      if($('#kt_uppy_1').data("rutaarchivoPDF") != undefined && $('#kt_uppy_1').data("rutaarchivoXML") != undefined || $('#kt_uppy_1').data("rutaarchivoPDF") != null && $('#kt_uppy_1').data("rutaarchivoXML") != null)
      {
        if($('#txtFolioFactura').val() != "" && $('#txtFolioServicios').val() != "" && $('#FechaRevision').val() != "" && $('#FechaFactura').val() != "" && $('#FechaVencimiento').val() != "" && $('input[name="TipoCambio"]').val() != "")
        {
          WaitMe_Show('#WaitModalPE');
            checkHasFactura();
            //saveFacturaFragmentada();
        }
        else
        {
          alertToastError("Los folios deben ser diferentes y las fechas no pueden estar vacias");
        }
      }
      else
      {
        alertToastError("Son necesarios los complementos PDF y XML");
      }
    }
    else
    {
      alertToastError("Son necesarios los complementos PDF y XML de los servicios");
    }
  }
  //validacion si la factura no sera fragmentada
  else
  {
    if($('#kt_uppy_1').data("rutaarchivoPDF") != undefined && $('#kt_uppy_1').data("rutaarchivoXML") != undefined || $('#kt_uppy_1').data("rutaarchivoPDF") != null && $('#kt_uppy_1').data("rutaarchivoXML") != null)
    {
      if($('#txtFolioFactura').val() != "" && $('#FechaRevision').val() != "" && $('#FechaFactura').val() != "" && $('#FechaVencimiento').val() != "" && $('input[name="TipoCambio"]').val() != "")
      {
        WaitMe_Show('#WaitModalPE');
        checkHasFactura();
          //saveFactura();
      }
      else
      {
        alertToastError("El folio y las fechas no pueden estar vacias");
      }

    }
    else
    {
      alertToastError("Son necesarios los complementos PDF y XML");

    }
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
 autoUpdateInput: false,
 showDropdowns:true,
 autoApply:true,
 locale: {
        daysOfWeek: [
            "Do",
            "Lu",
            "Ma",
            "Mi",
            "Ju",
            "Vi",
            "Sa"
        ],
        monthNames: [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
        ],
    }
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
    $('#alertaViajeFragmentada').css("display", "none");
  $('#FechaFactura').datepicker({
    format: 'yyyy/mm/dd',
    todayHighlight: true,
    endDate: '+0d',
    language: 'es'
  });
  $("#FechaFactura").datepicker('setDate', 'today' );
  $('#FechaRevision').datepicker({
    format: 'yyyy/mm/dd',
    todayHighlight: true,
    language: 'es'
  });
  $("#FechaRevision").datepicker('setDate', 'today' );

  $('#FechaVencimiento').datepicker({
   format: 'yyyy/mm/dd',
   todayHighlight: true,
   language: 'es'
 });
//  $("#FechaVencimiento").datepicker('setDate', 'today' );

				//KTUppy.init()
        $(document).on('click', '#folioReajuste', getDatosModalreajuste);
      });

//limpiar modal
$('#kt_modal_2').on('hidden.bs.modal', function(){
  LimpiarModalSF();
  KTUppy.init()
});

$('input[name="TipoCambio"]').on('change', function(){
  getDatos();
});

$(document).on('change','#FechaRevision', function(){
  //var diasCredito = $('input[name="checkPE"]').data("creditodias");
  if($("#FechaRevision").val() < $("#FechaFactura").val())
  {
    alertToastError("La fecha de revision no puede ser antes que la fecha de factura");
  //  $("#FechaRevision").val($("#FechaFactura").val());
    $("#FechaRevision").datepicker('setDate', $("#FechaFactura").val() )
  }

  $('#FechaVencimiento').datepicker({
    format: 'yyyy/mm/dd',
    language: 'es'
  });
    $('#FechaVencimiento').prop('disabled', false);
  $("#FechaVencimiento").datepicker('setDate', calculoFechaVencimiento("#FechaRevision", Dcreditos) );
});


//FUNCIONES PARA PENDIENTES DE ENVIAR


//validacion mismo cliente en los checkbox
function FiltroCheckboxCliente(){
  var checked = $("input[name='checkPE']:checked");
  idcliente = $($(checked[0]).parents('tr')[0]).data("idcliente")
  $("input[name=checkPE]:checked").each(function () {
   var check = table.row($(this).parents('tr')).data();
   if(checked.length > 1)
   {
     if (check[2] != cliente || check[8] != Moneda) {
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
    Moneda = check[8];
  }
});
}

//funcion limpiar modal subir facturas de pendientes de enviar

//funcion para mostrar u ocultar el input del timpo de cambio
/*function mostrarTipoCambio()
{
  var found;
  var datos = adddatos();
  for(var i=0; i<datos.length; i++)
  {
    // datos[i][3].push(datos[i][3]);
    found = datos[i][9].includes('USD');
  }
  if(found != true)
  {
   $('#txtTipoCambio').hide();
   $('#labelTipoCambio').hide();
 }
 else
 {
   $('#txtTipoCambio').show();
   $('#labelTipoCambio').show();
 }
}
*/



function LimpiarModalSF()
{
  $('input[name="FolioFactura"]').val("");
  $('input[name="Comentarios"]').val("");
  $('input[name="TipoCambio"]').val(1);
  TestFile = null;
  $('.uploaded-files ol').remove();
  $('.uploaded-files-fragmentadas ol').remove();
  $('#Fragmentada').remove();
  $('input[name="Fragmentada"]').prop('checked', false);
  $('#see').hide();
  $('#seeAlert').hide();
  //ids = [];
  $('#kt_uppy_1').data("rutaarchivoXML", null);
  $('#kt_uppy_1').data("rutaarchivoPDF", null);
  $('#seeFolioAndComen').hide();
  $('#Fragmentada').data("rutaarchivoXML", null);
  $('#Fragmentada').data("rutaarchivoXML", null);
  $('#txtFolioServicios').val('');
  $('#txtComentariosServicios').val('');
  folio_ = [];
  diferenciaRejuste = 0;
  diferenciaRejusteServ = 0;
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
						maxFileSize: 4200000, // 5mb
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
         uppyDashboard.use(XHRUpload, { endpoint: 'https://api-bgk-debug.logistikgo.com/api/Viaje/SaveevidenciaTest', method: 'post'});
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
                 //Tservicios
                 if($('input[name="Fragmentada"]').is(':checked'))
                 {
                   if(to != viaje.toFixed(2))
                   {
                     $("#btnGuardarFactura").prop("disabled", true)
                     alertToastError("El total de la factura no coincide con el total calculado del sistema")
                      //uppyDashboard.reset()
                      uppyDashboard.cancelAll()
                        $('.uploaded-files ol').remove();

                    }
                    else
                    {
                     $("#btnGuardarFactura").prop("disabled", false)
                     const urlPDF = response.body
                     $('#kt_uppy_1').data("rutaarchivoXML", urlPDF)
                     document.querySelector('.uploaded-files').innerHTML +=
                     `<ol><li id="listaArchivos"><a href="${urlPDF}" target="_blank" name="url" id="RutaXML">${fileName}</a></li></ol>`
                     $('#chkFragmentada').prop('disabled', true);
                    }
                   }
                   else
                   {
                     if(to != total.toFixed(2))
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
                        $('#chkFragmentada').prop('disabled', true);
                      }
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
    arrSelect.push([datosRow[1], datosRow[4], datosRow[5], datosRow[6], datosRow[11] != "" ? datosRow[11]:0, datosRow[12] != "" ?datosRow[12]:0, datosRow[13] != "" ? datosRow[13]: 0, datosRow[14] != "" ? datosRow[14]:0, datosRow[7], datosRow[8], $($(this).parents('tr')[0]).data('idpendienteenviar')]);
  });
  return arrSelect;
}


//funcion para obtener los datos de la tabla pendiente de enviar para mostrarlos en la tabla del modal subir facturas
function getDatos(){
 var datos = adddatos();
 datos.length == 1 ? $('#chkFragmentada').prop('disabled', false):$('#chkFragmentada').prop('disabled', true);
 var newData = [];
 subtotal = 0, Tiva=0, TRetencion=0, total=0, moneda, totalCambio=0, Tservicios=0, totalViaje=0;
 for (var i=0; i<datos.length; i++)
 {
  folio_.push(datos[i][0]);
  moneda = datos[i][9];
  if(datos[i][9] === "MXN")
  {
    var sub = parseFloat(datos[i][1].replace(/(\$)|(,)/g,''));
    var iva = parseFloat(datos[i][2].replace(/(\$)|(,)/g,''));
    var retencion = parseFloat(datos[i][3].replace(/(\$)|(,)/g,''));
    var servicios = typeof(datos[i][4]) == "number" ? datos[i][4] : parseFloat(datos[i][4].replace(/(\$)|(,)/g,''));
    var SubServicios = typeof(datos[i][5]) == "number" ? datos[i][5] : parseFloat(datos[i][5].replace(/(\$)|(,)/g,''));
    var RetServicios = typeof(datos[i][6]) == "number" ? datos[i][6] : parseFloat(datos[i][6].replace(/(\$)|(,)/g,''));
    var IVServicios = typeof(datos[i][7]) == "number" ? datos[i][7] : parseFloat(datos[i][7].replace(/(\$)|(,)/g,''));
    subtotal = subtotal + sub;
    Tiva = Tiva + iva;
    TRetencion = TRetencion + retencion;
    total = total + tot;
    Tservicios = Tservicios + servicios;
    SBServicios = SubServicios;
    RServicios = RetServicios;
    IServicios = IVServicios;
    datos[i].push("n/a");

  /*  if($('input[name="Fragmentada"]').is(':checked'))
    {
      $('#alertaViajeFragmentada').css("display", "block");
       viaje = total-Number(Tservicios);
      $('#totalServicios').html('<span>$'+datos[i][4]+'</span>');
      $('#totalViaje').html('<span>'+viaje.toFixed(2)+'</span>');
    }*/
  }
  if(datos[i][9] === "USD")
  {
    var tipoCambio = $('input[name="TipoCambio"]').val();

    var folio = datos[i][0];
    var sub = parseFloat(datos[i][1].replace(/(\$)|(,)/g,''));
    var iva = parseFloat(datos[i][2].replace(/(\$)|(,)/g,''));
    var retencion = parseFloat(datos[i][3].replace(/(\$)|(,)/g,''));
    var servicios = parseFloat(datos[i][4].replace(/(\$)|(,)/g,''));
    var SubServicios = parseFloat(datos[i][5].replace(/(\$)|(,)/g,''));
    var RetServicios = parseFloat(datos[i][6].replace(/(\$)|(,)/g,''));
    var IVServicios = parseFloat(datos[i][7].replace(/(\$)|(,)/g,''));
    var tot = parseFloat(datos[i][8].replace(/(\$)|(,)/g,''));
    var totCambio = (parseFloat(datos[i][8].replace(/(\$)|(,)/g,'')) * tipoCambio);
    datos[i].push(totCambio);
        //newData.push([folio, sub, iva, retencion, tot]);
        subtotal = subtotal + sub;
        Tiva = Tiva + iva;
        TRetencion = TRetencion + retencion;
        total = total + tot;
        Tservicios = Tservicios + servicios;
        SBServicios = SubServicios;
        RServicios = RetServicios;
        IServicios = IVServicios;
        totalCambio = totalCambio + totCambio;

      /*  if($('input[name="Fragmentada"]').is(':checked'))
        {
          $('#alertaViajeFragmentada').css("display", "block");
           viaje = total-Tservicios;
          $('#totalServicios').html('<span>'+datos[i][4]+'</span>');
          $('#totalViaje').html('<span>'+viaje+'</span>');
        }*/

      }
    }

    var h = [datos];
    $('#ResumTable').DataTable({
     destroy: true,
    // scrollX: true,
     //scrollY: "300px",
     data: h[0],
     columnDefs: [
     {
       "targets": 0,
       "className": "dt-head-center dt-body-center bold",
       "mRender": function (data, type, full){
           return `<a href="#ModalReajuste" id="folioReajuste" data-toggle="modal" data-backdrop="static" data-keyboard="false">${full[0]}</a>`
         }
     },
     {
       "targets": [1,2,3],
       "className": "dt-head-center dt-body-right"
     },
     {
       "targets": [4,5,6,7],
       "className": "dt-head-center dt-body-center",
       "visible": false
     },
     {
       "targets": [8,9,11],
       "className": "dt-head-center dt-body-center"
     },
     {
       "targets": [10],
       "className": "dt-head-center dt-body-center",
       "visible": false
     },
     ]

   });

   subtotal *= 100; subtotal = Math.round(subtotal) / 100;
   Tiva *=100; Tiva = Math.round(Tiva) / 100;
   TRetencion*=100; TRetencion = Math.round(TRetencion) / 100;
   total = ((subtotal + Tiva)- (TRetencion));
   $('#sub').html('<strong>$'+subtotal.toFixed(2)+'</strong>');
   $('#iva').html('<strong>$'+Tiva.toFixed(2)+'</strong>');
   $('#retencion').html('<strong>$'+TRetencion.toFixed(2)+'</strong>');
   //$('#servicios').html('<strong>$'+Tservicios+'</strong>');
   $('#total').html('<strong>$'+total.toFixed(2)+'</strong>');
   $('#Moneda').html('');
   $('#totalCambio').html('<strong>$'+totalCambio.toFixed(2)+'<strong>');
  /*  subtotal *= 100; subtotal = Math.round(subtotal) / 100;
    Tiva *=100; Tiva = Math.round(Tiva) / 100;
    TRetencion*=100; TRetencion = Math.round(TRetencion) / 100;
    total = subtotal + Tiva + TRetencion;
    $('#sub').html('<strong>$'+subtotal.toFixed(2)+'</strong>');
    var IVA_=(subtotal*.16).toFixed(2);
    $('#iva').html('<strong>$'+IVA_+'</strong>');
    //$('#iva').html('<strong>$'+Tiva.toFixed(2)+'</strong>');
    //$('#retencion').html('<strong>$'+TRetencion.toFixed(2)+'</strong>');

    var Retencion_= TRetencion =! 0 ? TRetencion.toFixed(2) :  (subtotal*.04).toFixed(2);

    $('#retencion').html('<strong>$'+ Retencion_ +'</strong>');
    //$('#servicios').html('<strong>$'+Tservicios+'</strong>');
    Total_=((Number(subtotal)+Number(IVA_))- Number(Retencion_));
    $('#total').html('<strong>$'+Total_+'</strong>');
    $('#Moneda').html('');
    $('#totalCambio').html('<strong>$'+totalCambio.toFixed(2)+'<strong>');*/
  }

  function saveFacturaFragmentada() {
    var strFolioServicios = $('#txtFolioServicios').val().replace(/ /g, "").trim().toUpperCase();
    var strComentariosServicios = $('#txtComentariosServicios').val();
    var RutaXML = $('.uploaded-files-fragmentadas #RutaXML').attr('href');
    var RutaPDF = $('.uploaded-files-fragmentadas #RutaPDF').attr('href');
    var Total = Tservicios;
    var Subt = subtotal > Number(SBServicios) ? subtotal-Number(SBServicios) : Number(SBServicios)-subtotal;
    var IV = Tiva > Number(IServicios) ? Tiva-Number(IServicios) : Number(IServicios)-Tiva;
    var Ret = TRetencion > Number(RServicios) ? TRetencion-Number(RServicios) : Number(RServicios)-TRetencion;
    saveFactura(false, viaje, Subt, IV, Ret, Reajuste = diferenciaRejuste/*- Tservicios*/);
    saveFactura(true, Total, Subt= SBServicios, IV = IServicios,Ret= RServicios,  Reajuste = diferenciaRejusteServ, strFolioServicios, strComentariosServicios, RutaXML, RutaPDF);
  }


  function saveFactura(IsFacturaServicios = false, Total = total, Subt=subtotal, IV = Tiva, Ret = TRetencion, Reajuste = diferenciaRejuste, FolioFactura = $('#txtFolioFactura').val().replace(/ /g, "").trim().toUpperCase(), Comentarios = $('#txtComentarios').val(), RutaXML = $('.uploaded-files #RutaXML').attr('href'), RutaPDF = $('.uploaded-files #RutaPDF').attr('href')) {
    jParams = {
      FolioFactura: FolioFactura,
      Cliente: cliente,
      FechaFactura: $('#FechaFactura').val(),
      FechaRevision: $('#FechaRevision').val(),
      FechaVencimiento: $('#FechaVencimiento').val(),
      Moneda: moneda,
      SubTotal: Subt,
      IVA: IV,
      Retencion: Ret,
      Total: Total,
      RutaXML: RutaXML,
      RutaPDF: RutaPDF,
      TipoCambio: $('#txtTipoCambio').val(),
      Comentarios: Comentarios,
      IsFragmentada: $('#chkFragmentada').is(':checked'),
      IDCliente: idcliente,
      Reajuste: Reajuste,
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
    SavePartidasxFactura(IDFactura, IsFacturaServicios);
  }).catch(function(ex){
    console.log("no success!");
  });
}

function SavePartidasxFactura(IDFactura, IsFacturaServicios) {
  var arrPendientes = [];
  var currentIDConcepto = 0;
  $("#TablePendientesEnviar input[name=checkPE]:checked").each(function () {
    currentIDConcepto = $($(this).parents('tr')[0]).data('idpendienteenviar');
    if(!arrPendientes.includes(currentIDConcepto))
      arrPendientes.push(currentIDConcepto);
  });

  jParams = {
    IDFactura: IDFactura,
    arrPendientes: arrPendientes,
    IDFolioReajuste: idFolioReajuste == undefined ? 0 : idFolioReajuste,
    IsFacturaServicios: IsFacturaServicios,
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
      WaitMe_Hide('#WaitModalPE');
      $("#kt_modal_2").modal('hide');
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


var fnCheckFolio = function (fol) {
  WaitMe_ShowBtn('#btnGuardarFactura');
  $('#btnGuardarFactura').prop('disabled', true);
  fetch("/PendientesEnviar/CheckFolioDuplicado?Folio=" + fol, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  }).then(function(response){
    return response.clone().json();
  }).then(function(data){
    if(data.IsDuplicated) {
      Swal.fire({
        type: 'error',
        title: 'El folio indicado ya existe en el sistema',
        showConfirmButton: false,
        timer: 2500
      })
      $('#btnGuardarFactura').attr('disabled',true);
      WaitMe_HideBtn('#btnGuardarFactura');
    }
    else {
      $('#btnGuardarFactura').attr('disabled',false);
      WaitMe_HideBtn('#btnGuardarFactura');
    }
  }).catch(function(ex){
    console.log("no success!");
  });
}


var checkHasFactura = function () {
  //WaitMe_ShowBtn('#btnGuardarFactura')
  fetch("/PendientesEnviar/CheckHasFactura?Folio=" + JSON.stringify(folio_), {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  }).then(function(response){
    return response.clone().json();
  }).then(function(data){
    console.log(data);
    if(data.Resp) {
      Swal.fire({
        type: 'error',
        title: 'Algun viaje seleccionado ya tiene factura',
        showConfirmButton: false,
        timer: 2500
      })
      WaitMe_Hide('#WaitModalPE');
    }
    else {
      $('input[name="Fragmentada"]').is(':checked') ? saveFacturaFragmentada() : saveFactura();
    //  saveFactura();
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
  arrProyectos = $('#cboProyecto').val();
  WaitMe_Show('#divTablaPendientesEnviar');
  fetch("/PendientesEnviar/FilterBy?FechaDescargaDesde="+ startDate +"&FechaDescargaHasta="+ endDate +"&Status="+ JSON.stringify(arrStatus) +"&Cliente="+ JSON.stringify(arrClientes) +"&Moneda="+ strMoneda + "&Proyecto=" + JSON.stringify(arrProyectos), {
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
"scrollX": true,
"scrollY": "400px",
 "language": {
   "url": "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
 },
 "responsive": false,
 "paging": false,
 "dom": 'Bfrtip',
 "buttons": [
 {
   extend: 'excel',
   text: '<i class="fas fa-file-excel fa-lg"></i>',
   exportOptions: {
    columns: ':visible'
   }
 }
 ],

 columnDefs: [ {
   orderable: false,
   targets:   0,
   "className": "dt-head-center dt-body-center",
   "width": "1%",
   "mRender": function (data, type, full) {
     EvDigital = $('input[name="isEvicencias"]').data("evidenciadigital");
     EvFisica = $('input[name="isEvicencias"]').data("evidenciafisica");
     controlDesk = $('input[name="isEvicencias"]').data("iscontroldesk");
     DiasCredito = $('input[name="isEvicencias"]').data("diascredito");
     TipoConcepto = $('input[name="isEvicencias"]').data("tipoconcepto");
         //idpendienteenviar = $('input[name="isEvicencias"]').data("idpendienteenviar"); 2950
         if(full[2] != "Eaton")
         {
           return (full[9] == 'finalizado'.toUpperCase() || full[9] == 'completo'.toUpperCase() &&  EvDigital != 'False'  && EvFisica != 'False' && controlDesk != 'False' ? '<input type="checkbox" name="checkPE" data-creditodias="'+DiasCredito+'" id="estiloCheckbox"/>': '');
         }
         else
         {
           return ((full[9] == 'finalizado'.toUpperCase() || full[9] == 'completo'.toUpperCase() || full[9] == 'entregado'.toUpperCase()) &&  (EvDigital != 'False'  && controlDesk != 'False') ? '<input type="checkbox" name="checkPE" data-creditodias="'+DiasCredito+'" id="estiloCheckbox"/>': '');
         }

       }
     },
     {
      "width": "5%",
      "className": "text-center bold",
      "targets": 1
    },
    {
      "width": "15%",
      "className": "dt-head-center dt-body-center",
      "targets": [2,3]
    },
    {
      "className": "dt-head-center dt-body-right",
      'width' : '5%',
      "targets": [4,5,6,7]
    },
    {
      "width": "5%",
      "className": "dt-head-center dt-body-center",
      "targets": [8,9]

    },

    {
      "width": "5%",
      "className": "dt-head-center dt-body-center",
      "targets": 10,
      "mRender": function (data, type, full) {
        return (EvDigital != 'False' && EvFisica != 'False' ? 'Si':'No');
      }
    }]
  } );
}

function getDatosModalreajuste()
{
  if($('input[name="Fragmentada"]').is(':checked'))
  {
    $('#btnGuardarReajuste').prop('disabled', true);
    $('#h3Servicios').css('display', 'none');
    $('#reajusteServicios').css('display', 'none');
    tab = $('#ResumTable').DataTable();
    var dataReajuste = tab.row($(this).parents('tr')).data();
    idFolioReajuste = dataReajuste[10];
    $('#h3Servicios').css('display', 'block');
    $('#reajusteServicios').css('display', 'block');
    $('#SubtotalReajusteServicios').val(typeof(dataReajuste[5]) != "number" ? parseFloat(dataReajuste[5].replace(/(\$)|(,)/g,'')) : parseFloat(dataReajuste[5]));
    $('#IVAReajusteServicios').val(typeof(dataReajuste[7]) != "number" ? parseFloat(dataReajuste[7].replace(/(\$)|(,)/g,'')) : parseFloat(dataReajuste[7]));
    $('#RetencionReajusteServicios').val(typeof(dataReajuste[6]) != "number" ? parseFloat(dataReajuste[6].replace(/(\$)|(,)/g,'')) : parseFloat(dataReajuste[6]));
    var totReServ = $('#TotalReajusteServicios').val(typeof(dataReajuste[4]) != "number" ? parseFloat(dataReajuste[4].replace(/(\$)|(,)/g,'')) : parseFloat(dataReajuste[4]));
    totalReajusteServicios_ = $(totReServ).val();

    $('#folioReajuste_').html('<strong id="ajusteFolio">'+dataReajuste[0]+'</strong>')
    $('#SubtotalReajuste').val(parseFloat(dataReajuste[1].replace(/(\$)|(,)/g,'')));
    $('#IVAReajuste').val(parseFloat(dataReajuste[2].replace(/(\$)|(,)/g,'')));
    $('#RetencionReajuste').val(parseFloat(dataReajuste[3].replace(/(\$)|(,)/g,'')));
    var totRe = $('#TotalReajuste').val(parseFloat(dataReajuste[8].replace(/(\$)|(,)/g,'')) - totalReajusteServicios_);
    oldTotalViaje = viaje;
    oldTotalServ = Tservicios;
  }
  else
  {
    $('#btnGuardarReajuste').prop('disabled', true);
    $('#h3Servicios').css('display', 'none');
    $('#reajusteServicios').css('display', 'none');
    tab = $('#ResumTable').DataTable();
    var dataReajuste = tab.row($(this).parents('tr')).data();
    idFolioReajuste = dataReajuste[10];
    $('#folioReajuste_').html('<strong id="ajusteFolio">'+dataReajuste[0]+'</strong>')
    $('#SubtotalReajuste').val(parseFloat(dataReajuste[1].replace(/(\$)|(,)/g,'')));
    $('#IVAReajuste').val(parseFloat(dataReajuste[2].replace(/(\$)|(,)/g,'')));
    $('#RetencionReajuste').val(parseFloat(dataReajuste[3].replace(/(\$)|(,)/g,'')));
    var totRe = $('#TotalReajuste').val(parseFloat(dataReajuste[8].replace(/(\$)|(,)/g,'')));
    oldTotal = total;
  }


  totalReajuste_ = $(totRe).val();
}

function recalculoAjuste(newTotalReajuste_)
{
    if($('input[name="Fragmentada"]').is(':checked'))
    {
      $('#btnGuardarReajuste').prop('disabled', false)
      diferenciaRejuste = (Number(newTotalReajuste_) - Number(totalReajuste_)).toFixed(2);
      var calTotal = ((oldTotalViaje-totalReajuste_) + Number(newTotalReajuste_));
      viaje = calTotal;
      $('#totalViaje').html('<strong>$'+viaje.toFixed(2)+'</strong>');
    }
    else
    {
      $('#btnGuardarReajuste').prop('disabled', false)
      diferenciaRejuste = (Number(newTotalReajuste_) - Number(totalReajuste_)).toFixed(2);
      var calTotal = ((oldTotal-totalReajuste_) + Number(newTotalReajuste_));
      total = calTotal;
      $('#total').html('<strong>$'+total.toFixed(2)+'</strong>');
    }

}

function recalculoAjusteServ(newTotalReajusteServ_)
{
  $('#btnGuardarReajuste').prop('disabled', false)
  diferenciaRejusteServ = (Number(newTotalReajusteServ_) - Number(totalReajusteServicios_)).toFixed(2);
  var calTotal = ((oldTotalServ-totalReajusteServicios_) + Number(newTotalReajusteServ_));
  Tservicios = calTotal;
  $('#totalServicios').html('<strong>$'+Tservicios.toFixed(2)+'</strong>');
  sendDataModalServ();
}

function sendDataModalServ()
{
  document.querySelector('#divFragmentada').innerHTML +=
  `<div class="kt-portlet__body"><div class"kt-uppy" id="Fragmentada"><div class="kt-uppy__dashboard"><div class="kt-uppy__progress"></div></div></div></div>`
  var divID = "#Fragmentada";
  if($('input[name="Fragmentada"]').is(':checked'))
  {
    $('#totalServicios').html('<span>$'+Tservicios+'</span>');
    //getDatos();
    $('#see').show();
    $('#seeAlert').show();
    $('#seeFolioAndComen').show();

    var verEv = ".uploaded-files-fragmentadas";
    //var contenedor = "hola";
    KTUppyEvidencias.init(divID, verEv, Tservicios);
  }
  else
  {
    getDatos();
    $('#alertaViajeFragmentada').css("display", "none");
    $(divID).remove();
    $('#see').hide();
    $('#seeAlert').hide();
    $('#seeFolioAndComen').hide();
  }
}
//folioReajuste
