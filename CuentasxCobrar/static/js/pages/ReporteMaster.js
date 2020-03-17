$(document).ready(function(){

  formatTableReporteMasterCXC();

  //boton para aplicar filtros
  $('#BtnAplicarFiltro').on('click', getReportesByFilters);
  //Filtro Rango fecha
  $('input[name="FiltroFechaReporteMaster"]').daterangepicker({
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

  $('input[name="FiltroFechaReporteMaster"]').on('apply.daterangepicker', function(ev, picker) {
    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
  });

});

function formatTableReporteMasterCXC()
{
  $('#TablaReporteMasterC').DataTable({
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
        "className": "dt-head-center dt-body-center",
        "mRender": function(data, type, full) {
          return(full[5] == "True" ? "Si" : "No")
        }
      },
      {
        "targets": 6,
        "className": "dt-head-center dt-body-center",
        "mRender": function(data, type, full) {
          return(full[6] == "True" ? "Si" : "No")
        }
      },
      {
        "targets": [7,8],
        "className": "dt-head-center dt-body-center"
      },
      {
        "targets": [9,10,11,12],
        "className": "dt-head-center dt-body-left"
      },
      {
        "targets": 13,
        "className": "dt-head-center dt-body-center",
        "mRender": function (data, type, full) {
          return (full[13] == "True" ? "Si" : "No");
        }
      },
      {
        "targets": [14,15],
        "className": "dt-head-center dt-body-center"
      }
    ]
    });
}


function getReportesByFilters() {
  arrCliente = $('#cboCliente').val();
  arrStatus = $('#cboStatus').val();
  arrProyectos = $('#cboProyecto').val();
  strMoneda = [];
  $('#rdMXN').is(':checked') ? strMoneda.push('MXN') : null;
  $('#rdUSD').is(':checked') ? strMoneda.push('USD') : null;
  WaitMe_Show('#TbPading');
/*  if($('#chkMonthYear').is(':checked')){
    arrMonth = $('#filtroxMes').val();
    Year = $('#filtroxAno').val();
    getReportes("arrMonth="+ JSON.stringify(arrMonth) +"&Year="+ Year +"&Proveedor="+ JSON.stringify(arrProveedor) +"&Status="+ JSON.stringify(arrStatus) +"&Moneda="+ JSON.stringify(strMoneda)+ "&Proyecto="+ JSON.stringify(arrProyectos));
  }*/
//  else{
    startDate = ($('#cboFechaDescarga').data('daterangepicker').startDate._d).toLocaleDateString('en-US');
    endDate = ($('#cboFechaDescarga').data('daterangepicker').endDate._d).toLocaleDateString('en-US');
    getReportes("FechaFacturaDesde="+ startDate +"&FechaFacturaHasta="+ endDate +"&Cliente="+ JSON.stringify(arrCliente) +"&Status="+ JSON.stringify(arrStatus) +"&Moneda="+ JSON.stringify(strMoneda) + "&Proyecto="+ JSON.stringify(arrProyectos));
//  }
}

function getReportes(params) {
  fetch("/ReporteMaster/FilterBy?" + params, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  }).then(function(response){
    return response.clone().json();
  }).then(function(data){
    $('#TbPading').html(data.htmlRes);
    formatTableReporteMasterCXC();
    WaitMe_Hide('#TbPading');
  }).catch(function(ex){
    console.log("no success!");
  });
}
