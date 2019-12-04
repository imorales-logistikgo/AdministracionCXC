$(document).ready(function() {
	$('#TablePendientesEnviar').DataTable();

	
} );

var fnGetPendientesEnviar = function() {
	fetch("/PendientesEnviar/FilterBy?FechaDescargaDesde=19-mar-2019&FechaDescargaHasta=19-mar-2019&Status=Pendiente&Cliente=Eaton&Moneda=MXN", {
		method: "GET",
		credentials: "same-origin",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
			//body: JSON.stringify(jParams)
		}).then(function(response){
			return response.clone().json();
		}).then(function(data){
			console.log("success!");
		}).catch(function(ex){
			console.log("no success!");
		});
	}