/* eslint-disable no-console */
/* eslint-disable import/extensions */
import xlsx from "xlsx";
import fs from "fs";
import Migrator from "./migrator.js";
import entParser from "./parsers/entParser.js";
import entTempV2 from "./template/entTempV2.js";
import tiParser from "./parsers/tiParser.js";
import tiTempV2 from "./template/tiTempV2.js";
import tipoParser from "./parsers/tipoParser.js";
import tipoTempV2 from "./template/tipoTempV2.js";
import legParser from "./parsers/legParser.js";
import legTempV2 from "./template/legtempV2.js";
import classParser from "./parsers/classParser.js";
import classTempV2 from "./template/classTempV2.js";

// FIXME: Remove later
const workbook = xlsx.readFile("./data/Lista Consolidada 20200205.xls", {
  cellDates: true,
  cellNF: false,
  cellText: false
});
const sheet = workbook.Sheets["ent.sioe.csv"];
const sheetTi = workbook.Sheets["ti.csv"];
const sheetTipo = workbook.Sheets["tip_ent.csv"];
const sheetLeg = workbook.Sheets["leg.csv"];
const sheet100 = workbook.Sheets["100.csv"];
const sheet150 = workbook.Sheets["150.csv"];
const sheet200 = workbook.Sheets["200.csv"];
const sheet250 = workbook.Sheets["250.csv"];
const sheet300 = workbook.Sheets["300.csv"];
const sheet350 = workbook.Sheets["350.csv"];
const sheet400 = workbook.Sheets["400.csv"];
const sheet450 = workbook.Sheets["450.csv"];
const sheet500 = workbook.Sheets["500.csv"];
const sheet550 = workbook.Sheets["550.csv"];
const sheet600 = workbook.Sheets["600.csv"];
const sheet650 = workbook.Sheets["650.csv"];
const sheet700 = workbook.Sheets["700.csv"];
const sheet710 = workbook.Sheets["710.csv"];
const sheet750 = workbook.Sheets["750.csv"];
const sheet800 = workbook.Sheets["800.csv"];
const sheet850 = workbook.Sheets["850.csv"];
const sheet900 = workbook.Sheets["900.csv"];
const sheet950 = workbook.Sheets["950.csv"];

const entTtlV2 = Migrator.read(sheet, "entidade")
  .parse(entParser, "entidade")
  .convert2(entTempV2, "entidade");

const legTtlV2 = Migrator.read(sheetLeg, "legislacao")
  .parse(legParser, "legislacao")
  .convert2(legTempV2, "legislacao");

const tiTtlV2 = Migrator.read(sheetTi, "ti")
  .parse(tiParser, "ti")
  .convert2(tiTempV2, "ti");

const tipoTtlV2 = Migrator.read(sheetTipo, "tipologia")
  .parse(tipoParser, "tipologia")
  .convert2(tipoTempV2, "tipologia");

const classesTtlV2 = Migrator.read(sheet100, "classes")
  .read(sheet150)
  .read(sheet200)
  .read(sheet250)
  .read(sheet300)
  .read(sheet350)
  .read(sheet400)
  .read(sheet450)
  .read(sheet500)
  .read(sheet550)
  .read(sheet600)
  .read(sheet650)
  .read(sheet700)
  .read(sheet710)
  .read(sheet750)
  .read(sheet800)
  .read(sheet850)
  .read(sheet900)
  .read(sheet950)
  .parse(classParser, "classes")
  .convert2(classTempV2, "classes");

fs.writeFileSync("data/entV2.ttl", entTtlV2);
fs.writeFileSync("data/legV2.ttl", legTtlV2);
fs.writeFileSync("data/tipoV2.ttl", tipoTtlV2);
fs.writeFileSync("data/tiV2.ttl", tiTtlV2);
fs.writeFileSync("data/classV2.ttl", classesTtlV2);
