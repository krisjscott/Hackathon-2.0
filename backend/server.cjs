// server.js
//
// HOW TO USE:
// 1. Place your 'properties.csv' file in the same folder as this file.
// 2. Run 'npm init -y' and 'npm install express cors csv-parser' in this folder.
// 3. Start the server with 'node server.js'.
// 4. Your data will be available at http://localhost:5000/properties

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
app.use(cors());

app.get('/properties', (req, res) => {
  const results = [];
  fs.createReadStream('indian_property_data_with_status.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results);
    });
});

app.get('/property', (req, res) => {
  const { propertyId, registrationNumber } = req.query;
  const results = [];
  fs.createReadStream('indian_property_data_with_status.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Use correct CSV column names!
      const found = results.find(
        row =>
          row['Property Number']?.toLowerCase().trim() === propertyId?.toLowerCase().trim() &&
          row['Registration Number']?.toLowerCase().trim() === registrationNumber?.toLowerCase().trim()
      );
      if (found) {
        res.json(found);
      } else {
        res.status(404).json({ error: 'Property not found' });
      }
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 