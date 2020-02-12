export default function entTemp(data) {
  let ttl = "#Ent\n";
  ttl += data.reduce((prev, ent) => `${prev}:example ${ent.id}\n`, "");
  return ttl;
}
