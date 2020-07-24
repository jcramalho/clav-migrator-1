import express from "express";
import XLSX from "xlsx";
import fs from "fs";
var router = express.Router();
import {
  Migrator,
  entParser,
  entTemp,
  tiParser,
  tiTemp,
  tipoParser,
  tipoTemp,
  legParser,
  legTemp,
  classParser,
  classTemp,
} from "clav-migrator";
import path from "path";
const __dirname = path.resolve();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.download(path.join(__dirname, "final.ttl"), "clav.ttl");
});

router.post("/", function(req, res, next) {
  var workbook = XLSX.read(req.files.file.data, {
    type: "buffer",
    cellDates: true,
    cellNF: false,
    cellText: false,
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

  const entTtl = Migrator.read(sheet, "entidade")
    .parse(entParser, "entidade")
    .convert2(entTemp, "entidade");

  const legTtl = Migrator.read(sheetLeg, "legislacao")
    .parse(legParser, "legislacao")
    .convert2(legTemp, "legislacao");

  const tiTtl = Migrator.read(sheetTi, "ti")
    .parse(tiParser, "ti")
    .convert2(tiTemp, "ti");

  const tipoTtl = Migrator.read(sheetTipo, "tipologia")
    .parse(tipoParser, "tipologia")
    .convert2(tipoTemp, "tipologia");

  fs.writeFileSync(`log/parsingBase.json`, JSON.stringify(Migrator.log));

  Migrator.printLog("parsingBase.log");

  const classesTtl = Migrator.read(sheet100, "classes")
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
    .convert2(classTemp, "classes");

  let base = fs.readFileSync(path.join(__dirname, "base.ttl"), "utf8");

  fs.writeFileSync(
    path.join(__dirname, "final.ttl"),
    base + entTtl + legTtl + tipoTtl + tiTtl + classesTtl
  );

  fs.writeFileSync(`log/classes.json`, JSON.stringify(Migrator.log));

  Migrator.printLog("classes.log");

  Migrator.data = {};

  res.download(path.join(__dirname, "final.ttl"), "clav.ttl");
});

router.get("/logs", function(req, res, next) {
  var parsing = JSON.parse(
    fs.readFileSync(path.join(__dirname, "log/parsingBase.json"), "utf8")
  );
  var classes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "log/classes.json"), "utf8")
  );
  res.jsonp({
    parsing,
    classes,
  });
});

export default router;
