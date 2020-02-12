/* eslint-disable no-console */
/* eslint-disable import/extensions */
import xlsx from "xlsx";
import fs from "fs";
import Migrator from "./migrator.js";
import entParser from "./parsers/entParser.js";
import entTemp from "./template/entTemp.js";

// FIXME: Remove later
const workbook = xlsx.readFile("./data/Frecolha-20200204.xls");
const sheet = workbook.Sheets["ent.sioe.csv"];

const entTtl = Migrator.read(sheet)
  .parse(entParser)
  .convert(entTemp);

fs.writeFileSync("data/ent.ttl", entTtl);
console.log(entTtl);
