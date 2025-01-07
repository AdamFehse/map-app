const { readFile, writeFile } = require('fs');
const { parse } = require('papaparse');
const { join } = require('path');

// Path to your CSV file
const csvFilePath = join(__dirname, '../public/storymapdata.csv');

// Read and parse the CSV file
readFile(csvFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading CSV file:', err);
    return;
  }

  // Parse CSV to JSON
  const parsedData = parse(data, {
    header: true,
    skipEmptyLines: true,
  });

  // Write the JSON data to a file in the 'out' directory
  const jsonFilePath = join(__dirname, '../out/storymapdata.json');
  writeFile(jsonFilePath, JSON.stringify(parsedData.data, null, 2), (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
    } else {
      console.log('CSV converted to JSON and saved to out/storymapdata.json');
    }
  });
});
