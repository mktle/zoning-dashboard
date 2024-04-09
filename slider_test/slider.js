// Function to read CSV data
async function readCSVData(FilePath) {
    try {
	const response = await Papa.parse(FilePath, {
	    header: true, // Specify presence of a header row
	    delimiter: ',',
	});
	console.log("Successfully read data")
	console.log(response.data)
	return response.data;
    } catch (error) {
	console.error('Error reading CSV data:', error);
	return []; // Return empty array on error
    }
}

// Function to create histogram based on rent prices
function createHistogram(rentPrices) {
  const ctx = document.getElementById('rent-distribution').getContext('2d');

  // Assuming you want 10 bins
  const bins = createBins(rentPrices, 10);

  const histogramData = {
    labels: bins.map(bin => bin.label),
    datasets: [{
      label: 'Rent Price Distribution',
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
      // Additional chart options (scales, title, etc.)
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true, // Ensure y-axis starts at 0
          },
        }],
      },
    },
  });
}

// Function to create bins for the histogram (replace with your binning logic)
function createBins(rentPrices, numBins) {
  // Implement your logic to create bins based on rent prices and desired number of bins
  // This is a placeholder example, replace with your binning algorithm
  const minPrice = Math.min(...rentPrices);
  const maxPrice = Math.max(...rentPrices);
  const binSize = (maxPrice - minPrice) / numBins;

  const bins = [];
  for (let i = 0; i < numBins; i++) {
    const lowerBound = minPrice + i * binSize;
    const upperBound = lowerBound + binSize;
    bins.push({
      label: `${lowerBound.toFixed(0)} - ${upperBound.toFixed(0)}`,
      count: 0, // Initialize count for each bin
    });
  }

  for (const price of rentPrices) {
    const binIndex = Math.floor((price - minPrice) / binSize);
    if (binIndex >= 0 && binIndex < bins.length) {
      bins[binIndex].count++;
    }
  }

  return bins;
}

async function main() {
    console.log("Hello from your JavaScript code!");
    // Assuming your CSV file is named "rent_data.csv" and located in the same directory
    const csvFilePath = 'data/rent_data/Rent_averages_BHA.csv';
    const rentPrices = await readCSVData(csvFilePath).avg_per_bed;
    if (rentPrices.length === 0) {
	console.error('Error: No data found in CSV file');
	return;
    }
    
    console.log("Successfully loaded rent data")

    // Create the histogram
    createHistogram(rentPrices);

    // Configure noUiSlider (replace with your desired range and step values)
    const slider = document.getElementById('rent-slider');
    noUiSlider.create(slider, {
	start: [Math.min(...rentPrices), Math.max(...rentPrices)],
	connect: true,
	range: {
	    min: [Math.min(...rentPrices)],
	    max: [Math.max(...rentPrices)],
	},
    });

    // Update histogram based on slider selection
    slider.noUiSlider.on('update', (values, handle) => {
	const [minPrice, maxPrice] = values.map(Number); // Convert string values to numbers

	// Filter data based on selected price range
	const filteredPrices = rentPrices.filter(price => price >= minPrice && price <= maxPrice);

	// Update histogram with filtered data
	createHistogram(filteredPrices);
    });
}

main();
