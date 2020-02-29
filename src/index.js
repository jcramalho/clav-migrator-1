/* eslint-disable no-console */
/* eslint-disable import/extensions */
import xlsx from "xlsx";
import fs from "fs";
import Migrator from "./migrator.js";
import entParser from "./parsers/entParser.js";
import entTemp from "./template/entTemp.js";
import tiParser from "./parsers/tiParser.js";
import tiTemp from "./template/tiTemp.js";
import tipoParser from "./parsers/tipoParser.js";
import tipoTemp from "./template/tipoTemp.js";
import legParser from "./parsers/legParser.js";
import legTemp from "./template/legTemp.js";
import classParser from "./parsers/classParser.js";
import classTemp from "./template/classTemp.js";

// FIXME: Remove later
const workbook = xlsx.readFile("./data/Frecolha-20200204.xls", {
  cellDates: true,
  cellNF: false,
  cellText: false
});
const sheet = workbook.Sheets["ent.sioe.csv"];
const sheetTi = workbook.Sheets["ti.csv"];
const sheetTipo = workbook.Sheets["tip_ent.csv"];
const sheetLeg = workbook.Sheets["leg.csv"];
// TODO: Parse all class sheets
const sheetClass = workbook.Sheets["100.csv"];

const entTtl = Migrator.read(sheet, "entidade")
  .parse(entParser, "entidade")
  .convert(entTemp);

const tiTtl = Migrator.read(sheetTi, "ti")
  .parse(tiParser, "ti")
  .convert(tiTemp);

const tipoTtl = Migrator.read(sheetTipo, "tipologia")
  .parse(tipoParser, "tipologia")
  .convert(tipoTemp);

const legTtl = Migrator.read(sheetLeg, "legislacao")
  .parse(legParser, "legislacao")
  .convert(legTemp);

const classTtl = Migrator.read(sheetClass, "c100")
  .parse(classParser, "c100")
  .convert(classTemp);

fs.writeFileSync("data/ent.ttl", entTtl);
fs.writeFileSync("data/ti.ttl", tiTtl);
fs.writeFileSync("data/tipo.ttl", tipoTtl);
fs.writeFileSync("data/leg.ttl", legTtl);
fs.writeFileSync("data/c100.ttl", classTtl);

// console.log(classTtl);
