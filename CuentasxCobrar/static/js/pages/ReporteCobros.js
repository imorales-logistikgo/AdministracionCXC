$(document).ready(function(){


  formatTableCobros();

  $(document).on('click', '.btnDetalleCobro', fnGetDetalleCobro);

  //rago fecha para el Filtro
  $('input[name="FiltroFechaReporteCobros"]').daterangepicker({
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

  $('input[name="FiltroFechaReporteCobros"]').on('apply.daterangepicker', function(ev, picker) {
    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
  });

  $('#BtnAplicarFiltro').on('click', getReportesByFilters);

});

function getReportesByFilters() {
  startDate = ($('#cboFechaDescarga').data('daterangepicker').startDate._d).toLocaleDateString('en-US');
  endDate = ($('#cboFechaDescarga').data('daterangepicker').endDate._d).toLocaleDateString('en-US');
  arrClientes = $('#cboCliente').val();
  strMoneda = [];
  $('#rdMXN').is(':checked') ? strMoneda.push('MXN') : null;
  $('#rdUSD').is(':checked') ? strMoneda.push('USD') : null;
  //WaitMe_Show('#TbPading');
  fetch("/ReporteCobros/FilterBy?FechaCobroDesde="+ startDate +"&FechaCobroHasta="+ endDate +"&Cliente="+ JSON.stringify(arrClientes) +"&Moneda="+ JSON.stringify(strMoneda), {
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
    //WaitMe_Hide('#TbPading');
    formatTableCobros();
  }).catch(function(ex){
    console.log("no success!");
  });
}

function formatTableCobros() {
  $("#TableReporteCobros").DataTable({
    "language": {
      "url": "https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
    },
    "responsive": true,
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
      "targets": [0],
      "width": "10px",
      "className": "dt-head-center dt-body-center"
    },

    {
      "targets": [1,2],
      "width": "15px",
      "className": "dt-head-center dt-body-center"
    },

    {
      "targets": [3,4],
      "width": "12px",
      "className": "dt-head-center dt-body-right"
    },
    ]
  });
}


var fnGetDetalleCobro = function () {
  var IDCobro = $(this).parents('tr').data('idcobro');
  //WaitMe_Show('#divTableDetallesCobro');

  fetch("/ReporteCobros/GetDetallesCobro?IDCobro=" + IDCobro, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
  }).then(function(response){
    return response.clone().json();
  }).then(function(data){
    //WaitMe_Hide('#divTableDetallesCobro');
    $('#divTableDetallesCobro').html(data.htmlRes);
  }).catch(function(ex){
    console.log("no success!");
  });
}