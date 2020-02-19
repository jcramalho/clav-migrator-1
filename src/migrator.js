import xlsx from "xlsx";

const migrator = { data: {} };

migrator.read = function read(sheet, name) {
  this.data[name] = xlsx.utils.sheet_to_json(sheet, { dateNF: "dd.mm.yyyy" });
  return this;
};

migrator.parse = function parse(parser, name) {
  this.data[name] = this.data[name].map(line => parser(line, this.data));
  return this;
};

migrator.convert = function convert(template) {
  return template(this.data);
};

export default migrator;
