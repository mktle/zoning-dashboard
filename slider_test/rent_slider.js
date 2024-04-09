// Import libraries (replace with actual import statements)
const Papa = require('papaparse');
const Chart = require('chart.js');
const noUiSlider = require('nouislider');

// Function to read CSV data
function readCSVData(dataFile) {
    return new Promise((resolve, reject) => {
	Papa.parse(dataFile, {
	    header: true,
	    complete: (results) => resolve(results.data),
	    error: (error) => reject(error),
	});
    });
}

// Function to create the histogram
function createHistogram(rentPrices) {
    const ctx = document.getElementById('rent-distribution').getContext('2d');
    const bins = createBins(rentPrices, 30);

    const histogramData = {
	labels: bins.map(bin => bin.label),
	datasets: [{
	    label: '',
	    data: bins.map(bin => bin.count),
	    backgroundColor: 'rgba(255, 99, 132, 0.2)',
	    borderColor: 'rgba(255, 99, 132, 1)',
	    borderWidth: 1,
	}],
    };
    
    const myChart = new Chart(ctx, {
	type: 'histogram',
	data: histogramData,
	options: {
	    scales: {
		yAxes: [{
		    ticks: {
			beginAtZero: true,
		    },
		}],
	    },
	},
    });
}

// // Function to update histogram based on slider value
// function updateHistogram(minPrice, maxPrice) {
//   // Filter data based on min and max price
//   const filteredPrices = ... // Implement filtering logic
//   // Update chart data with filtered prices
//   myChart.data.datasets[0].data = filteredPrices;
//   myChart.update();
// }

// Read CSV data
const rentColName = 'avg_per_bed'
readCSVData('data/rent_data/Rent_averages_BHA.csv')
  .then((data) => {
    // Extract rent prices from data
    const rentPrices = data.map(row => row[rentColName]); // Assuming rent price is in second column
    
    // Create the histogram
    createHistogram(rentPrices);

    // Initialize the slider with min and max rent prices
    noUiSlider.create(document.getElementById('rent-slider'), {
      start: [Math.min(...rentPrices), Math.max(...rentPrices)],
      connect: true,
      range: {
        min: [Math.min(...rentPrices)],
        max: [Math.max(...rentPrices)],
      },
    });
