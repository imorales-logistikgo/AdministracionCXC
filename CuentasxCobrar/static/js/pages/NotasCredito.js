$(document).ready(function(){

    $('#TablaNotasCredito').DataTable();
    $("#ModalNotaCredito").on('shown.bs.modal', ComplementosNotaCredito);
    $("#ModalNotaCredito").on('hidden.bs.modal', LimpiarModal);
    $("#BtnSaveNotaCredito").on('click', PostNotaCredito);
    $("#ClienteToNotaCredito").select2({
        placeholder: 'Selecciona un Cliente',
        allowClear: true,
        width: '250px',
    });
});


function ComplementosNotaCredito()
{
  // plugin para subir los archivos del proveedor
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
        //const Webcam = Uppy.Webcam;
  			// Private functions
  			var initUppy1 = function(){
  				var id = '#FilesNotaCredito';
  				var options = {
  					proudlyDisplayPoweredByUppy: false,
  					target: id,
  					inline: true,
  					height: 265,
  					replaceTargetContent: true,
  					showProgressDetails: true,
  					showLinkToFileUploadResult: true,
  					note: 'Logisti-k',
           browserBackButtonClose: true,
         }
         var uppyDashboard = Uppy.Core({
           autoProceed: false,
           restrictions: {
  						maxFileSize: 22000000, // 22MB
  						maxNumberOfFiles: 2,
  						minNumberOfFiles: 2,
                        allowedFileTypes:['.pdf','.xml'],
           },
           locale: Uppy.locales.es_ES,
           onBeforeFileAdded: (currentFile, file) => {
                console.log(currentFile.data)
           }
         });
         uppyDashboard.use(Dashboard, options);
         uppyDashboard.use(XHRUpload, { endpoint: 'FilesNotasCredito', method: 'post', headers:{"X-CSRFToken": getCookie("csrftoken")}, metaFields: null, timeout: 0});
         uppyDashboard.use(GoogleDrive, { target: Dashboard, companionUrl: 'https://companion.uppy.io' });
         uppyDashboard.on('upload-error', (file, error, response) => {
            if (response.status == 500){
                alertToastError("Ocurrio un error, por favor intenta nuevamente")
                uppyDashboard.cancelAll()
            }
         });
         uppyDashboard.on('upload-success', (file, response) => {
         if (file.extension == 'xml'){
            $('#FolioNotaCredito').val(response.body.folio)
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


}


var LimpiarModal = function(){
    $('#FilesNotaCredito').empty();
    $('#FolioNotaCredito').val('');
    $('#ClienteToNotaCredito').val(null).trigger('change');
}


var PostNotaCredito = function(){
    WaitMe_Show('#NC');
  jParams = {
    IDCliente: $('#ClienteToNotaCredito').val()
  }

  fetch("/NotasCredito/SaveNotaCredito", {
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
        title: 'Se guardo la nota de credito correctamente',
        showConfirmButton: false,
        timer: 2500
      })
      $("#ModalNotaCredito").modal('hide')
      WaitMe_Hide("NC");
    }
    else if(response.status == 500)
    {
      Swal.fire({
        type: 'error',
        title: 'Ocurrio un error, por favor intenta de nuevo',
        showConfirmButton: false,
        timer: 2500
      })
      WaitMe_Hide("NC");
    }
  }).catch(function(ex){
    console.log(ex);
    alertToastError("Error")
    WaitMe_Hide("NC");
  });
}