import xlsx from "xlsx";

const migrator = { data: null };

migrator.read = function read(sheet) {
  this.data = xlsx.utils.sheet_to_json(sheet);
  return this;
};

migrator.parse = function parse(parser) {
  this.data = this.data.map(parser);
  return this;
};

migrator.convert = function convert(template) {
  return template(this.data);
};

export default migrator;
