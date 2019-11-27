var DATA_COUNT = 50;
    	var MIN_XY = -125;
    	var MAX_XY = 95;

    	var utils = Samples.utils;
    	var ctx = $('#animate-chart');

    	utils.srand(110);

    	function colorize(opaque, context) {
    		return 'rgba(' + (Math.random() * (254 - 50) + 50) + ',' + 
            (Math.random() * (254 - 50) + 50) + ',' + (Math.random() * (254 - 50) + 50) + ',' + .7 + ')';
    	}

    	function generateData() {
    		var data = [];
    		var i;

    		for (i = 0; i < DATA_COUNT; ++i) {
    			data.push({
    				x: utils.rand(MIN_XY, MAX_XY),
    				y: utils.rand(MIN_XY, MAX_XY),
    				v: utils.rand(0, 1000)
    			});
    		}

    		return data;
    	}

    	var data = {
    		datasets: [{
    			data: generateData()
    		}, {
    			data: generateData()
    		}]
    	};

    	var options = {
    		maintainAspectRatio: false,
    		responsive: false,
    		legend: false,
    		tooltips: false,
    		scales: {
    			xAxes: [{
    				display: false
    			}],
    			yAxes: [{
    				display: false
    			}],
    		},

    		elements: {
    			point: {
    				backgroundColor: colorize.bind(null, false),

    				borderColor: 'rgba(255,255,255,0)',

    				radius: function(context) {
    					var value = context.dataset.data[context.dataIndex];
    					var size = context.chart.width;
    					var base = Math.abs(value.v) / 1000;
    					return (size / 24) * base;
    				}
    			}
    		}
    	};

    	var chart = new Chart(ctx, {
    		type: 'bubble',
    		data: data,
    		options: options
    	});

		// eslint-disable-next-line no-unused-vars
		function randomize() {
			chart.data.datasets.forEach(function(dataset) {
				dataset.data = generateData();
			});
			chart.update();
		}

		// eslint-disable-next-line no-unused-vars
		function addDataset() {
			chart.data.datasets.push({
				data: generateData()
			});
			chart.update();
		}

		// eslint-disable-next-line no-unused-vars
		function removeDataset() {
			chart.data.datasets.shift();
			chart.update();
		}

		setInterval(randomize, 2000);