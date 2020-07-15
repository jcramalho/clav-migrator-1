import xlsx from "xlsx";
import fs from "fs";

const migrator = {
  data: {},
  readName: "default",
  log: { geral: [], parsing: [], invariantes: [] }
};

migrator.read = function read(sheet, name) {
  let readName = name;
  if (!readName) readName = this.readName;
  if (!this.data[readName]) this.data[readName] = [];
  this.data[readName] = [
    ...this.data[readName],
    ...xlsx.utils.sheet_to_json(sheet, {
      dateNF: "dd.mm.yyyy"
    })
  ];
  this.readName = readName;
  return this;
};

migrator.parse = function parse(parser, name) {
  this.data[name] = this.data[name].map(line =>
    parser(line, this.data, this.report.bind(this))
  );
  return this;
};

migrator.convert = function convert(template) {
  return template(this.data);
};

migrator.convert2 = function convert(template, name) {
  let document = "";

  const print = (...lines) =>
    lines.forEach(line => {
      if (!line) return;
      document += `${line}\n`;
    });

  this.data[name].forEach(item =>
    template(item, print, this.report.bind(this), this.data)
  );
  console.log(`Foram migradas ${this.data[name].length} ${name}`);

  return document;
};

migrator.report = function report({ msg, type }, defaultVal = null) {
  this.log[type].push(msg);
  return defaultVal;
};

migrator.printLog = function printLog(outFile) {
  const parse = this.log.parsing.reduce((prev, item) => {
    return `${prev} parsing: ${item}\n`;
  }, "");
  const inv = this.log.invariantes.reduce((prev, item) => {
    return `${prev} invariantes: ${item}\n`;
  }, "");
  fs.writeFileSync(`log/${outFile}`, parse + inv);

  this.log = { geral: [], parsing: [], invariantes: [] };
};

export default migrator;
