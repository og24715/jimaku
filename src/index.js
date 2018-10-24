const fs = require("fs");
const assParser = require("./util/assParser");

try {
  const readAss = fs.readFileSync("../../x.ja.ass", "utf-8");
  const returnString = assParser(readAss);
  console.log(returnString);

} catch(e) {
  console.log(e);
  return;
}
