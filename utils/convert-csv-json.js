
"use strict";

let fs = require("fs");
let parse = require("csv-parse");

let argv = require('minimist')(process.argv.slice(2));
let inputFile = argv._[0];
let outputFile = argv._[1];

let csvHeader;
let csvData = [];
fs.createReadStream(inputFile)
  .pipe(parse({delimiter: ","}))
  .on("data", function(csvRow) {
    if (!csvHeader) {
      csvHeader = csvRow;
      return;
    }
    let outputObj = {};
    Object.keys(csvRow).forEach(function (i) {
      outputObj[csvHeader[i]] = csvRow[i];
    });
    csvData.push(outputObj);
  })
  .on("end", function() {
    fs.writeFileSync(outputFile, JSON.stringify(csvData));
  });
