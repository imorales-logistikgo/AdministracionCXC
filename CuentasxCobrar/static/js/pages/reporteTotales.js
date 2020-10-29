$(function(){

formatTableReporteMasterCXCRT();
formatTableReporteMasterCXCRTModal();
$('input[name="FiltroFechaReporteTotales"]').daterangepicker({
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

$('input[name="FiltroFechaReporteTotales"]').on('apply.daterangepicker', function(ev, picker) {
  $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
});


$("#BtnAplicarFiltroRT").on('click',getDatabyFilters);

$("#reportTotal_").on('click',()=>{
  $("#modalReporteTotales").modal('show');
});



$("#modalReporteTotales").on('shown.bs.modal',function(){
  $('#FechaCorte').datepicker({
    format: 'yyyy-mm-dd',
    todayHighlight: true,
    endDate: '+0d',
    language: 'es'
  });
  $("#FechaCorte").datepicker('setDate', 'today' );

  getFactCorte();
  $("#FechaCorte").on('change',getFactCorte);
});
//

});




//Callbacks
function formatTableReporteMasterCXCRT()
{
  $('#TablaReporteTotales').DataTable({
    "scrollX": true,
    //"scrollY": "400px",
    "language": {
      "url": "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
    },
    "responsive": false,
    "paging": true,
    "dom": 'Bfrtip',
    "buttons": [
      {
        extend: 'excel',
        text: '<i class="fas fa-file-excel fa-lg"></i>',
      }
    ],
    columnDefs: [
      {
        "targets": 0,
        "width": "100%"
      },
      {
        "targets": [1,2,3,4],
        "className": "dt-head-center dt-body-center"
      },
      {
        "targets": 5,
        "className": "dt-head-center dt-body-center"
      },
      {
        "targets": 6,
        "className": "dt-head-center dt-body-center"
      },
      {
        "targets": 7,
        "className": "dt-head-center dt-body-center"
      },
      {
        "targets": [8,9],
        "className": "dt-head-center dt-body-center"
      }
    ]
    });
}

function getDatabyFilters(){

let  startDate = ($('#cboFechaDescargaTotales').data('daterangepicker').startDate._d).toLocaleDateString('en-US');
let  endDate = ($('#cboFechaDescargaTotales').data('daterangepicker').endDate._d).toLocaleDateString('en-US');
let StatusFactura=$("#cboStatusTotales").val().join(",");
let ClientesFiscales=$("#cboClienteTotales").val().join(",");
let monedaFactura=getRadioMoneda();
  WaitMe_Show('#TbPading');
let jsonParams={
fechaInicio:startDate,
fechaFin:endDate,
status:StatusFactura,
ClientesFiscales:ClientesFiscales,
monedaFactura:monedaFactura
};
fetch("/reporteTotales/getFacturasByFilters",{
  method: 'POST',
    body: JSON.stringify(jsonParams),
    headers:{
      "X-CSRFToken": getCookie("csrftoken"),
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
}).then((resp)=>{
return resp.clone().json();
}).then((jsonL)=>{
  $('#TbPading').html(jsonL.htmlRes);
  formatTableReporteMasterCXCRT();
  WaitMe_Hide('#TbPading');
}).catch((error)=>{
  console.log(error);
});
}

function getRadioMoneda(){
let arrayMoneda=[];
$('#rdMXNTotales').is(':checked') ? arrayMoneda.push('MXN') : null;
$('#rdUSDTotales').is(':checked') ? arrayMoneda.push('USD') : null;
let Moneda=arrayMoneda.join(",");
return Moneda;
}

function formatTableReporteMasterCXCRTModal()
{
  $('#TablaReporteTotalesModal').DataTable({
    "scrollX": true,
    //"scrollY": "400px",
    "language": {
      "url": "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
    },
    "responsive": false,
    "paging": true,
    "dom": 'Bfrtip',
    "buttons": [
      {
        extend: 'excel',
        text: '<i class="fas fa-file-excel fa-lg"></i>',
      }
    ],
    columnDefs: [
      {
        "targets": [0,1,2,3],
        "className": "dt-head-center dt-body-center"
      }
    ]
    });
}


var getFactCorte= ()=>{
   $("#FechaCorte").datepicker('hide');
  let jparams={
    fechaCorte:$("#FechaCorte").val()
  };
    WaitMe_Show('#modalbody');
    fetch("/reporteTotales/getReporteTotales",{
      method: 'POST',
        body: JSON.stringify(jparams),
        headers:{
          "X-CSRFToken": getCookie("csrftoken"),
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
    }).then((resp)=>{
    return resp.clone().json();
    }).then((jsonL)=>{
      $('#conD').html(jsonL.htmlRes);
      formatTableReporteMasterCXCRTModal();
      WaitMe_Hide('#modalbody');
    }).catch((error)=>{
      console.log(error);
    });
}
