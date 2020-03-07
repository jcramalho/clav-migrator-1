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
const workbook = xlsx.readFile("./data/Lista Consolidada 20200205.xls", {
  cellDates: true,
  cellNF: false,
  cellText: false
});
const sheet = workbook.Sheets["ent.sioe.csv"];
const sheetTi = workbook.Sheets["ti.csv"];
const sheetTipo = workbook.Sheets["tip_ent.csv"];
const sheetLeg = workbook.Sheets["leg.csv"];
// TODO: Parse all class sheets
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

const Ttl100 = Migrator.read(sheet100, "c100")
  .parse(classParser, "c100")
  .convert(classTemp("c100"));

const Ttl150 = Migrator.read(sheet150, "c150")
  .parse(classParser, "c150")
  .convert(classTemp("c150"));

const Ttl200 = Migrator.read(sheet200, "c200")
  .parse(classParser, "c200")
  .convert(classTemp("c200"));

const Ttl250 = Migrator.read(sheet250, "c250")
  .parse(classParser, "c250")
  .convert(classTemp("c250"));

const Ttl300 = Migrator.read(sheet300, "c300")
  .parse(classParser, "c300")
  .convert(classTemp("c300"));

const Ttl350 = Migrator.read(sheet350, "c350")
  .parse(classParser, "c350")
  .convert(classTemp("c350"));

const Ttl400 = Migrator.read(sheet400, "c400")
  .parse(classParser, "c400")
  .convert(classTemp("c400"));

const Ttl450 = Migrator.read(sheet450, "c450")
  .parse(classParser, "c450")
  .convert(classTemp("c450"));

const Ttl500 = Migrator.read(sheet500, "c500")
  .parse(classParser, "c500")
  .convert(classTemp("c500"));

const Ttl550 = Migrator.read(sheet550, "c550")
  .parse(classParser, "c550")
  .convert(classTemp("c550"));

const Ttl600 = Migrator.read(sheet600, "c600")
  .parse(classParser, "c600")
  .convert(classTemp("c600"));

const Ttl650 = Migrator.read(sheet650, "c650")
  .parse(classParser, "c650")
  .convert(classTemp("c650"));

const Ttl700 = Migrator.read(sheet700, "c700")
  .parse(classParser, "c700")
  .convert(classTemp("c700"));

const Ttl710 = Migrator.read(sheet710, "c710")
  .parse(classParser, "c710")
  .convert(classTemp("c710"));

const Ttl750 = Migrator.read(sheet750, "c750")
  .parse(classParser, "c750")
  .convert(classTemp("c750"));

const Ttl800 = Migrator.read(sheet800, "c800")
  .parse(classParser, "c800")
  .convert(classTemp("c800"));

const Ttl850 = Migrator.read(sheet850, "c850")
  .parse(classParser, "c850")
  .convert(classTemp("c850"));

const Ttl900 = Migrator.read(sheet900, "c900")
  .parse(classParser, "c900")
  .convert(classTemp("c900"));

const Ttl950 = Migrator.read(sheet950, "c950")
  .parse(classParser, "c950")
  .convert(classTemp("c950"));

fs.writeFileSync("data/ent.ttl", entTtl);
fs.writeFileSync("data/ti.ttl", tiTtl);
fs.writeFileSync("data/tipo.ttl", tipoTtl);
fs.writeFileSync("data/leg.ttl", legTtl);
fs.writeFileSync("data/c100.ttl", Ttl100);
fs.writeFileSync("data/c150.ttl", Ttl150);
fs.writeFileSync("data/c200.ttl", Ttl200);
fs.writeFileSync("data/c250.ttl", Ttl250);
fs.writeFileSync("data/c300.ttl", Ttl300);
fs.writeFileSync("data/c350.ttl", Ttl350);
fs.writeFileSync("data/c400.ttl", Ttl400);
fs.writeFileSync("data/c450.ttl", Ttl450);
fs.writeFileSync("data/c500.ttl", Ttl500);
fs.writeFileSync("data/c550.ttl", Ttl550);
fs.writeFileSync("data/c600.ttl", Ttl600);
fs.writeFileSync("data/c650.ttl", Ttl650);
fs.writeFileSync("data/c700.ttl", Ttl700);
fs.writeFileSync("data/c710.ttl", Ttl710);
fs.writeFileSync("data/c750.ttl", Ttl750);
fs.writeFileSync("data/c800.ttl", Ttl800);
fs.writeFileSync("data/c850.ttl", Ttl850);
fs.writeFileSync("data/c900.ttl", Ttl900);
fs.writeFileSync("data/c950.ttl", Ttl950);

// console.log(classTtl);
