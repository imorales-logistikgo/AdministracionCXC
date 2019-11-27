$(document).ready(function(){

  formatDataTableCanceladas();


  //rago fecha para el Filtro
  $('input[name="FiltroFechaReporteCanceladas"]').daterangepicker({
   autoUpdateInput: false
  });

  $('input[name="FiltroFechaReporteCanceladas"]').on('apply.daterangepicker', function(ev, picker) {
    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
  });

  $('#BtnAplicarFiltro').on('click', getReportesByFilters);

});

function getReportesByFilters() {
  startDate = ($('#cboFechaDescarga').data('daterangepicker').startDate._d).toLocaleDateString('en-US');
  endDate = ($('#cboFechaDescarga').data('daterangepicker').endDate._d).toLocaleDateString('en-US');
  arrClientes = $('#cboCliente').val();
  strMoneda = $('#rdMXN').is(':checked') ? 'MXN' : 'USD';
  //WaitMe_Show('#divTablaFacturas');
  fetch("/ReporteCanceladas/FilterBy?FechaCobroDesde="+ startDate +"&FechaCobroHasta="+ endDate +"&Cliente="+ JSON.stringify(arrClientes) +"&Moneda="+ strMoneda, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  }).then(function(response){
    return response.clone().json();
  }).then(function(data){
    //WaitMe_Hide('#divTablaFacturas');
    $('#TbPading').html(data.htmlRes);
    formatDataTableCanceladas();
  }).catch(function(ex){
    console.log("no success!");
  });
}

function formatDataTableCanceladas() {
  $("#TableReporteCanceladas").DataTable({
    "language": {
      "url": "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
    },
    "responsive": true,
    "paging": true,
    "dom": 'Bfrtip',
    "buttons": [
    'excel'
    ],
    columnDefs: [
      {
          "targets": [0],
          "width": "10px",
          "className": "dt-head-center dt-body-center"
      },

      {
        "targets": [1,2, 3],
        "width": "15px",
        "className": "dt-head-center dt-body-center"
      },

      {
        "targets": [4,5],
        "width": "12px",
        "className": "dt-head-center dt-body-right"
      },
    ]
  });
}