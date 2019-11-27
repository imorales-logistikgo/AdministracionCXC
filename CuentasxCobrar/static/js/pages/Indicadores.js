$(document).ready(function(){

    google.charts.load('current', {'packages':['table']});
		google.charts.setOnLoadCallback(drawTable);
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    google.charts.setOnLoadCallback(withoutEvidencias);


		function drawTable() {
		  var data = new google.visualization.DataTable();
		  data.addColumn('string', 'Folio');
		  data.addColumn('string', 'Cliente');
		  data.addColumn('number', 'Total');
		  data.addColumn('boolean', 'evidencias');
		  data.addRows([
			['bkg0011',  {v: 'bkg001', f: 'em'}, 100.11, false],
			['bkg0011',  {v: 'bkg001', f: 'em'}, 100.11, false],
			['bkg0011',  {v: 'bkg001', f: 'em'}, 100.11, false],
			['bkg0011',  {v: 'bkg001', f: 'em'}, 100.11, false],

		  ]);

		  var table = new google.visualization.Table(document.getElementById('table_div'));

		  table.draw(data, {showRowNumber: false, width: '100%', height: '100%'});
		}



  	function drawChart() {
  	  var data = google.visualization.arrayToDataTable([
  		['Viajes', 'Con evidencias'],
  		['Eaton',     10],
  		['3M',     15],
  		['Rafael',     20],
  		['Amazon',     5],
  	  ]);

  	  var options = {
  		title: 'Folios Finalizados con evidencias',
  		is3D: true,
  	  };

  	  var chart = new google.visualization.PieChart(document.getElementById('conEvidencias'));

  	  chart.draw(data, options);
  	}


    function withoutEvidencias() {
	  var data = google.visualization.arrayToDataTable([
		['Viajes', 'Sin evidencias'],
		['Eaton',     1],
		['3M',     5],
		['Rafael',     2],
		['Amazon',     5],
		['Amazon',     6],
	  ]);

	  var options = {
		title: 'Folios Finalizados sin evidencias',
		is3D: true,
	  };

	  var chart = new google.visualization.PieChart(document.getElementById('sinEvidencias'));

	  chart.draw(data, options);
	}
});
