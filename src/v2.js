/* eslint-disable no-console */
/* eslint-disable import/extensions */
import xlsx from "xlsx";
import fs from "fs";
import Migrator from "./migrator.js";
import entParser from "./parsers/entParser.js";
import entTemp from "./template/entTemp.js";
import entTempV2 from "./template/entTempV2.js";
import tiParser from "./parsers/tiParser.js";
import tiTemp from "./template/tiTemp.js";
import tiTempV2 from "./template/tiTempV2.js";
import tipoParser from "./parsers/tipoParser.js";
import tipoTemp from "./template/tipoTemp.js";
import tipoTempV2 from "./template/tipoTempV2.js";
import legParser from "./parsers/legParser.js";
import legTemp from "./template/legTemp.js";
import legTempV2 from "./template/legtempV2.js";
import classParser from "./parsers/classParser.js";
import classTemp from "./template/classTemp.js";

// FIXME: Remove later
const workbook = xlsx.readFile("./data/Lista Consolidada 20200205.xls", {
  cellDates: true,
  cellNF: false,
  cellText: false,
});

const sheet = workbook.Sheets["ent.sioe.csv"];
const sheetLeg = workbook.Sheets["leg.csv"];
const sheetTi = workbook.Sheets["ti.csv"];
const sheetTipo = workbook.Sheets["tip_ent.csv"];

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

fs.writeFileSync("data/entV2.ttl", entTtlV2);
fs.writeFileSync("data/legV2.ttl", legTtlV2);
fs.writeFileSync("data/tipoV2.ttl", tipoTtlV2);
fs.writeFileSync("data/tiV2.ttl", tiTtlV2);
