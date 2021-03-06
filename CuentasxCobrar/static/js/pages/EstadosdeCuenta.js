var table;
var cliente;
var idcliente;
var TBalance=0, total=0;
var fragmentada;
var tipoCambio = 0;
$(document).ready(function()
{
  var calculo =0;
  var evXML;
  var idfac;
  var totConv=0;
//tabla estados de cuenta


formatDataTableFacturas();

$('#selectNC').select2({
  placeholder: 'Selecciona una nota de credito'
});

$('#NotaCredito').on('click', function(){
    $('#NotaCredito').is(':checked') ? ($("#selectNota").css('display', 'block'), GetNotasCredito(idcliente)) : ($("#selectNota").css('display', 'none'), CleanNotaCredito())
});

$('#selectNC').on('change', function(){
   this.options[this.selectedIndex] != undefined ? $("#FolioCobro").val(this.options[this.selectedIndex].text) : ($("#FolioCobro").val(''), $("#FolioCobro").attr('disabled', false))
});

$(document).on('click', '.btnDetalleCobro', fnGetDetalleCobro);
//ejecuta varias funciones cada que el checkbox es seleccionado en la tabla estados de cuenta
$(document).on( 'change', 'input[name="checkEC"]', function () {
  var input = 'input[name="checkEC"]';
  var btnSubir = '#BtnSubirCobros';
  if($(this).is(':checked'))
  {
    ValidacionCheckboxCobros();
    Getdatos();
    ContadorCheck(input, btnSubir);
  }
  else
  {
    Getdatos();
    ContadorCheck(input, btnSubir);
  }
});

$('#btnRecalculo').click(function(){
  var tab =  $('#TableEstadosdeCuenta').DataTable();
  var folio = tab.row($(this).parents('tr')).data()[1]
  GetCantidadesRecalculo($(this).data('idfactu'))
  console.log(folio)
});

$('#BtnAplicarFiltro').on('click', fnGetFacturas);

$(document).on('click', '.btnDetalleFactura',getDetalleFactura);



//eliminar row de la tabla estados de cuenta
$(document).on( 'click', '.BtnEliminarFactura', function () {
 Swal.fire({
  title: '¿Estas Seguro?',
  text: "Estas a un click de eliminar algo importante",
  type: 'warning',
  input: 'text',
  inputAttributes: {
    required: true,
    placeholder: "Motivo de la eliminación",
    id: "motivoEliminacion"
  },
  validationMessage: 'Ingresa el motivo de la eliminación',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si'
}).then(function(result) {
  if(result.value)
    return fnCancelarFactura($(this).data('idfact'));
}.bind(this)
).then((result) => {
  if (result) {
    table.row($(this).parents('tr')).remove().draw();
    Swal.fire(
      'Eliminado!',
      'Eliminado con exito',
      'success'
      )
  }
})
});

//elementos a mostrar al abrirse el modeal de subir cobros
$('#modalSubirCobro').on('shown.bs.modal', function(){
  $('#FechaCobro').datepicker({
    format: 'yyyy/mm/dd',
    todayHighlight: true,
    language: 'es'
  });
  $("#FechaCobro").datepicker('setDate', 'today' );

});


//rago fecha para el Filtro
$('input[name="FiltroFechaCobros"]').daterangepicker({
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

$('input[name="FiltroFechaCobros"]').on('apply.daterangepicker', function(ev, picker) {
  $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
});


// cerrar modal de subir facturas
$('#modalSubirCobro').on('hidden.bs.modal', function(){
 CleanModal();
 CleanNotaCredito();
 KTUppy.init();
});

$('#RecalculoCXC').on('hidden.bs.modal', function(){
CleanModalRecalculo();
});


//muestra los datos para la tabla del modal subir cobros al hacer click en el boton de  subir cobro
$(document).on('click', '#BtnSubirCobros',showDatosObtenidos);

//validar el total del cobro por cada factura seleccionada -- en el modal subir cobros
$('#tableAddCobro').on("keyup change", 'input[name="totalCobro"]', function(){
  var table = $('#tableAddCobro').DataTable();
  var datosRow = table.row($(this).parents('tr')).data();
  if(datosRow[3] === 'MXN')
  {
    if(parseFloat($(this).val()) >= 0)
    {
    if(parseFloat($(this).val()) > datosRow[2].replace(/(\$)|(,)/g,''))
    {
      (datosRow[3] === 'MXN') ?  $(this).val(datosRow[2].replace(/(\$)|(,)/g,'')) : $(this).val(totConv)
    }
    }
    else
    {
      alertToastError("No se aceptan numero negativos o caracteres");
      $(this).val('');
    }
  }
  else
  {
    if(parseFloat($(this).val()) >= 0)
    {
    if(parseFloat($(this).val()) > datosRow[7])
    {
      (datosRow[3] === 'MXN') ?  $(this).val(datosRow[2].replace(/(\$)|(,)/g,'')) : $(this).val(datosRow[7])
    }
    }
    else
    {
      alertToastError("No se aceptan numero negativos o caracteres");
      $(this).val('');
    }
  }

  $('input#valCobro').each(function(){
   calculo = calculo + parseFloat($(this).val());
 });
  $('#AddCosto').val(truncarDecimales(calculo, 2));
  calculo = 0;
});


//validacion si tienes los archivos pdf y xml
$(document).on('click', '#btnSaveCobro', function(){
  //console.log($('input[name="TipoCambioCobro"]').val());
  if($('#ComplementosCobros').data("rutaarchivoPDF") != undefined && $('#ComplementosCobros').data("rutaarchivoXML") != undefined || $('#ComplementosCobros').data("rutaarchivoPDF") != null && $('#ComplementosCobros').data("rutaarchivoXML") != null)
  {
    if($('input[name="FolioCobro"]').val() != "" && $('input[name="totalCobro"]').val() != "" && $('input[name="TipoCambioCobro"]').val() != "")
    {
      //alert("puedes subir el pago");
      saveCobroxCliente();
    }
    else
    {
      alertToastError("El folio y el cobro no pueden estar vacios");
    }
  }
  else
  {
    alertToastError("Son necesarios los complementos PDF y XML");
  }
});


//ocultar o mostrar campos de la tabla
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

//inicia el modal de subir complementos
/*KTUtil.ready(function() {
  var id = '#ComplementosCobros';
  var verComp = '.uploaded-files-pagos';
  KTUppyEvidencias.init(id, verComp, total);
});*/


$('input[name="TipoCambioCobro"]').on('keyup change', function(){
  if($('input[name="TipoCambioCobro"]').val() >=1)
  {
    console.log($('#valCobro').val());
    showDatosObtenidos();
  }
  else
  {
    alertToastError("El tipo de cambio debe ser mayor a 0");
    $('input[name="TipoCambioCobro"]').val('');
  }

});


//FUNCIONES DE ESTADOS DE CUENTA

//funcion limpiar modal
function CleanModal()
{
 $('input[name="FolioCobro"]').val('');
 $('.uploaded-files-pagos ol').remove();
 $('#comentariosEC').val('');
 $('#TipoCambioCobro').val(1);
 $('#ComplementosCobros').data("rutaarchivoXML", null);
 $('#ComplementosCobros').data("rutaarchivoPDF", null);

 calculo = 0;
 totConv = 0;
}


//obtiene los datos de cada checkbox seleccionado
function Getdatos(){
  var arrSelect=[];
  $("input[name=checkEC]:checked").each(function () {
    var datosRow = table.row($(this).parents('tr')).data();
    var prueba = $(this).data("idfactu");
    arrSelect.push([datosRow[1],datosRow[7], datosRow[8], datosRow[9], datosRow[7], prueba, datosRow[2]]);
  });
  return arrSelect;
}


//funcion para obtener los datos de la tabla Estados de cuenta para mostrarlos en la tabla del modal subir pagos
function showDatosObtenidos(){
 var datos = Getdatos();
 TBalance=0, total=0;
 for (var i=0; i<datos.length; i++)
 {
   if(datos[i][3] == 'MXN')
   {
     var Balance = parseFloat(datos[i][2].replace(/(\$)|(,)/g,''));
     var tot = parseFloat(datos[i][1].replace(/(\$)|(,)/g,''));
     total = total + Balance;
   }
   if(datos[i][3] == 'USD')
   {
     tipoCambio = $('input[name="TipoCambioCobro"]').val();
     var Balance = parseFloat(datos[i][2].replace(/(\$)|(,)/g,'') * tipoCambio);
     var tot = parseFloat(datos[i][1].replace(/(\$)|(,)/g,''));
     totConv = Balance;
       datos[i].push(totConv);
      total = total + Balance;
    }

  }

  var h = [datos];
  $('#tableAddCobro').DataTable({
     "order": [1, 'asc'],
    "paging": false,
    "info":   false,
    destroy: true,
    data: h[0],
    columnDefs: [
    {
     "className": "text-center",
     "targets": 0,
   },
   {
     "className": "text-right",
     "targets": [1,2]
   },
   {
    "className": "text-center",
    "targets": 3
  },
  {
    "className": "dt-head-center dt-body-right",
    "targets": 4,
    "mRender": function (data, type, full) {
     return (full[3] === 'MXN' ? `$ <input class="col-6 text-right valCobro" type="number" data-idfact="${full[5]}" name="totalCobro" id="valCobro" value="${full[2]}">` : `<input type="number" class="valCobro" data-idfact="${full[5]}" name="totalCobro" id="valCobro" value="${full[7]}">`);
   }
 },

 ]
});

  $('#AddCosto').val(total.toFixed(2));
}


//validacion mismo cliente en los checkbox
function ValidacionCheckboxCobros(){
  var checked = $("input[name='checkEC']:checked");
  idcliente = $($(checked[0]).parents('tr')[0]).data("idcliente")
  $("input[name=checkEC]:checked").each(function () {
   var check = table.row($(this).parents('tr')).data();
   if(checked.length > 1)
   {
     if (check[2] != cliente /*|| check[8] != moneda*/) {
       $(this).prop('checked', false);
       alertToastError("El cliente debe ser el mismo");
     }
     else
     {
      console.log("ok");
    }
  }
  else
  {
    cliente = check[2];
   // moneda = check[8];
 }
});
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
				var id = '#ComplementosCobros';

				var options = {
					proudlyDisplayPoweredByUppy: false,
					target: id,
					inline: true,
					height: 260,
					replaceTargetContent: true,
					showProgressDetails: true,
					note: 'Logisti-k',

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
           $('#ComplementosCobros').data("rutaarchivoPDF", urlPDF)
           document.querySelector('.uploaded-files-pagos').innerHTML +=
           `<ol><li id="listaArchivos"><a href="${urlPDF}" target="_blank" name="url" id="RutaPDF">${fileName}</a></li></ol>`
                 //  console.log($('#kt_uppy_1').data("rutaarchivoPDF"))
               }
               else
               {
                   const urlPDF = response.body
                   $('#ComplementosCobros').data("rutaarchivoXML", urlPDF)
                   document.querySelector('.uploaded-files-pagos').innerHTML +=
                   `<ol><li id="listaArchivos"><a href="${urlPDF}" target="_blank" name="url" id="RutaXML">${fileName}</a></li></ol>`

                 }

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


//});

var fnGetFacturas = function () {
  startDate = ($('#cboFechaDescarga').data('daterangepicker').startDate._d).toLocaleDateString('en-US');
  endDate = ($('#cboFechaDescarga').data('daterangepicker').endDate._d).toLocaleDateString('en-US');
  arrStatus = $('#cboStatus').val();
  arrClientes = $('#cboCliente').val();
  strMoneda = [];
  $('#rdMXN').is(':checked') ? strMoneda.push('MXN') : null;
  $('#rdUSD').is(':checked') ? strMoneda.push('USD') : null;

  WaitMe_Show('#divTablaFacturas');
  fetch("/EstadosdeCuenta/FilterBy?FechaDescargaDesde="+ startDate +"&FechaDescargaHasta="+ endDate +"&Status="+ JSON.stringify(arrStatus) +"&Cliente="+ JSON.stringify(arrClientes) +"&Moneda="+ JSON.stringify(strMoneda), {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  }).then(function(response){
    return response.clone().json();
  }).then(function(data){
    WaitMe_Hide('#divTablaFacturas');
    $('#divTablaFacturas').html(data.htmlRes);
    formatDataTableFacturas();
  }).catch(function(ex){
    console.log("no success!");
  });
}

var fnCancelarFactura = async function (IDFactura) {
  var res = false;
  jParams = {
    IDFactura: IDFactura,
    MotivoEliminacion: $('#motivoEliminacion').val()
  }
  WaitMe_Show('#divTablaFacturas');
  await fetch("/EstadosdeCuenta/CancelarFactura", {
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
      res = true;
    }
    else if(response.status == 500 || response.status == 400)
    {
      res = false;
    }
  }).catch(function(ex){
    res = false;
  });
  WaitMe_Hide('#divTablaFacturas');
  return res;
}

function formatDataTableFacturas(){
  table = $('#TableEstadosdeCuenta').DataTable({
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
     }
    ],
    /*fixedColumns:   {
  leftColumns: 1
},
*/

    columnDefs: [ {
      orderable: false,
      targets:   0,
      "className": "text-center",
      "width": "1%",
      "mRender": function (data, type, full) {
        idfac = $('input[name="EvidenciaXML"]').data("facturaid");
        fragmentada = $('input[name="EvidenciaXML"]').data("isfragmentada");
        return (full[10] != 'cobrada'.toUpperCase() && full[10] != 'cancelada'.toUpperCase() ? '<input type="checkbox" name="checkEC" id="estiloCheckbox" data-idfactu="'+idfac+'"/>': '');
      }
    },
    {
      "name": "Status",
      "width": "5%",
      "className": "text-center bold",
      "targets": 1,
      "mRender": function (data, type, full) {
        idfac = $('input[name="EvidenciaXML"]').data("facturaid");
        return `<a  href="#detallesFactura" class="btnDetalleFactura" data-toggle="modal" data-backdrop="static" data-keyboard="false" id="foliofactura">${full[1]}</a>`;
      }
    },
    {
      "name": "Status",
      "width": "10%",
      "className": "text-center",
      "targets": [2,3]
    },
    {
      "width": "5%",
      "className": "text-center",
      "targets": [8,9, 10]

    },
    {
      "className": "text-right",
      'width' : '5%',
      "targets": [4,5,6,7]
    },
    {
      "width": "3%",
      "targets": 12,
      "mRender": function (data, type, full) {
        return full[12] == 'True' ? 'Si':'No';
      }
    },
    {
      "width": "3%",
      "className": "text-center",
      "targets": 13,
      "mRender": function (data, type, full) {
        evXML = $('input[name="EvidenciaXML"]').data("evidenciaxml");
        return '<a href="'+evXML+'" target="_blank" class="BtnVerXML btn btn-primary btn-elevate btn-pill btn-sm"><i class="flaticon2-file"></i></a>';
    }//mrender
    },
    {
      "width": "3%",
      "className": "text-center",
      "targets": 14,
      "mRender": function (data, type, full) {
       return (fragmentada != 'True' &&  full[10] == 'pendiente'.toUpperCase() ? '<button type ="button" class="BtnEliminarFactura btn btn-danger btn-elevate btn-pill btn-sm" data-idfact="'+idfac+'"><i class="flaticon-delete"></i></button>':'');
   }//mrender
   },
   {
      "width": "3%",
      "targets": 15,
      "mRender": function (data, type, full){
        return (full[7] != full[15] && full[15] != "None" ? '<button type="button" class="btn btn-dark btn-elevate btn-pill btn-sm" title="Editar" data-keyboard="false" data-backdrop="static" data-toggle="modal" data-target="#RecalculoCXC" id="btnRecalculo" data-idfactu="'+idfac+'"><i class="fa fa-edit"></i></button>' : "");
      }
   }
   ]
 });
}




function getDetalleFactura()
{
  var IDFactura = $(this).parents('tr').data('idfactura');
  WaitMe_Show('#divTableDetalles');

  fetch("/EstadosdeCuenta/GetDetallesFactura?IDFactura=" + IDFactura, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  }).then(function(response){
    return response.clone().json();
  }).then(function(data){
    WaitMe_Hide('#detallesFactura');
    $('#divTableDetalles').html(data.htmlRes);
  }).catch(function(ex){
    console.log(ex);
  });
}

function saveCobroxCliente()  {
  WaitMe_Show('#waiteSubirCobro');
   var arrCobros = [];
  $('.valCobro').each(function() {
    IDFactura = $(this).data('idfact');
    Total = $(this).val()/$('#TipoCambioCobro').val();
    arrCobros.push({'Total': Total, 'IDFactura': IDFactura});
  });
  jParams = {
    Folio: $('#FolioCobro').val(),
    Total:$('#AddCosto').val()/$('#TipoCambioCobro').val(),
    FechaCobro: $('#FechaCobro').val(),
    TipoCambio: $('#TipoCambioCobro').val(),
    Comentarios: $('#comentariosEC').val(),
    RutaXML: $('#ComplementosCobros').data("rutaarchivoXML"),
    RutaPDF: $('#ComplementosCobros').data("rutaarchivoPDF"),
    Cliente: cliente,
    IDCliente: idcliente,
    IDNotaCreditoSelect: $('#NotaCredito').is(':checked') ? $("#selectNC").val() : null,
    IsNotaCredito: $('#NotaCredito').is(':checked'),
    arrCobros: arrCobros
  }

  fetch("/EstadosdeCuenta/SaveCobroxCliente", {
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
      Swal.fire({
        type: 'success',
        title: 'El cobro fue guardado correctamente',
        showConfirmButton: false,
        timer: 2500
      })

       var rowID=[];
       var table = $('#TableEstadosdeCuenta').DataTable();
      $("input[name=checkEC]:checked").each(function (value) {
        //rowID.push($(this).closest('tr').index());
        rowID.push(table.row($(this).parents('tr')).index());
      });
        table.rows(rowID).remove().draw();
      $('#BtnSubirCobros').prop('disabled', true);
      WaitMe_Hide('#waiteSubirCobro');
      $("#modalSubirCobro").modal('hide');
    }
    else if(response.status == 500)
    {
      Swal.fire({
        type: 'error',
        title: 'El folio indicado ya existe en el sistema',
        showConfirmButton: false,
        timer: 2500
      })
      WaitMe_Hide('#waiteSubirCobro');
      return;
     // $("#modalSubirCobro").modal('hide');
    }

  }).catch(function(ex){
    console.log(ex);
    alertToastError("Ocurrio un error");
  });
}

//function SaveCobroxFactura(IDCobro)
//{
//  WaitMe_Show('#waiteSubirCobro');
//  var arrCobros = [];
//  $('.valCobro').each(function() {
//    IDFactura = $(this).data('idfact');
//    Total = $(this).val()/$('#TipoCambioCobro').val();
//    arrCobros.push({'Total': Total, 'IDFactura': IDFactura});
//  });
//
//  jParams = {
//    IDCobro: IDCobro,
//    arrCobros: arrCobros,
//  }
//
//  fetch("/EstadosdeCuenta/SaveCobroxFactura", {
//    method: "POST",
//    credentials: "same-origin",
//    headers: {
//      "X-CSRFToken": getCookie("csrftoken"),
//      "Accept": "application/json",
//      "Content-Type": "application/json"
//    },
//    body: JSON.stringify(jParams)
//  }).then(function(response){
//
//    if(response.status == 200)
//    {
//      Swal.fire({
//        type: 'success',
//        title: 'El cobro fue guardado correctamente',
//        showConfirmButton: false,
//        timer: 2500
//      })
//
//
//       var rowID=[];
//       var table = $('#TableEstadosdeCuenta').DataTable();
//      $("input[name=checkEC]:checked").each(function (value) {
//        //rowID.push($(this).closest('tr').index());
//        rowID.push(table.row($(this).parents('tr')).index());
//      });
//        table.rows(rowID).remove().draw();
//      $('#BtnSubirCobros').prop('disabled', true);
//      WaitMe_Hide('#waiteSubirCobro');
//      $("#modalSubirCobro").modal('hide');
//    }
//    else if(response.status == 500)
//    {
//      Swal.fire({
//        type: 'error',
//        title: 'El folio indicado ya existe en el sistema',
//        showConfirmButton: false,
//        timer: 2500
//      })
//      WaitMe_Hide('#waiteSubirCobro');
//      return;
//      $("#modalSubirCobro").modal('hide');
//    }
//
//  }).catch(function(ex){
//    console.log(ex);
//  });
//}

var fnGetDetalleCobro = function () {
  var IDFactura = $(this).parents('tr').data('idfactura');
  WaitMe_Show('#divTableDetallesCobro');

  fetch("/EstadosdeCuenta/GetDetallesCobro?IDFactura=" + IDFactura, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  }).then(function(response){
    return response.clone().json();
  }).then(function(data){
    WaitMe_Hide('#divTableDetallesCobro');
    $('#divTableDetallesCobro').html(data.htmlRes);
  }).catch(function(ex){
    console.log("no success!");
  });
}



var GetNotasCredito = function(CLiente){
  WaitMe_ShowInput('#selectNota');
  fetch(`/EstadosdeCuenta/GetNotaCreditoByCliente?IDCliente=${CLiente}`, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  }).then(function(response){
    return response.clone().json();
  }).then(function(data){
  var newOption = new Option('Selecciona una nota de credito', null, false, false);
  $('#selectNC').append(newOption).trigger('change');
    $.each(data.GetNotas, function (i, item) {
        var newOption = new Option(item.Folio, item.IDNotaCredito, false, false);
        $('#selectNC').append(newOption).trigger('change');
    });
  $('#FolioCobro').attr('disabled', true);
  $('#FolioCobro').val('');
    WaitMe_HideInput('#selectNota');
  }).catch(function(ex){
    console.log(ex);
  });
}
//}

function CleanNotaCredito (){
  $('#selectNC').empty().trigger('change');
  $('#FolioCobro').attr('disabled', false);
  $('#FolioCobro').val('');
  $('#NotaCredito').prop("checked",false);
  $("#selectNota").css('display', 'none');
}

var GetCantidadesRecalculo = function(factura){
    WaitMe_Show('#ModaWait');
    fetch("/EstadosdeCuenta/GetDatosReajuste?IDFactura=" + factura, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  }).then(function(response){
    return response.clone().json();
  }).then(function(data){
    $("#TotalViaje").val(data.data[0].Precio);
    $("#TotalRecoleccion").val(data.data[0].PrecioRecoleccion);
    $("#TotalAccesoriosPrecio").val(data.data[0].PrecioAccesorios);
    $("#TotalRepartosPrecio").val(data.data[0].PrecioRepartos);
    $("#SubtotalPrecio").val(data.data[0].PrecioSubtotal);
    $("#IVAPrecio").val(data.data[0].PrecioIVA);
    $("#RetencionPrecio").val(data.data[0].PrecioRetencion);
    $("#TotalPrecio").val(data.data[0].PrecioTotal);
    $("#TotalCliente").val(data.data[0].TotalCliente);

    WaitMe_Hide('#ModaWait');
  }).catch(function(ex){
    alertToastError("Ocurrio un error");
    $("#RecalculoCXC").modal('hide');
    console.log(ex);
    WaitMe_Hide('#ModaWait');
  });
}


var CleanModalRecalculo = function(){
    $("#TotalViaje").val('');
    $("#TotalRecoleccion").val('');
    $("#TotalAccesoriosPrecio").val('');
    $("#TotalRepartosPrecio").val('');
    $("#SubtotalPrecio").val('');
    $("#IVAPrecio").val('');
    $("#RetencionPrecio").val('');
    $("#TotalPrecio").val('');
    $("#ComentariosRecalculo").val('');
}