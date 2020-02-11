const xlsx = require("xlsx");
const fs = require("fs");

workbook = xlsx.readFile("data/Frecolha-20200204.xls");

for (sheet in workbook.Sheets) {
  var stream = xlsx.stream.to_csv(workbook.Sheets[sheet], {
    RS: ";",
    skipHidden: false
  });
  stream.pipe(fs.createWriteStream("data/" + sheet, { encoding: "UTF-8" }));
}
