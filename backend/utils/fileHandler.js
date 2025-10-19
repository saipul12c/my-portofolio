import fs from "fs";
import path from "path";

const __dirname = path.resolve();
const dataPath = path.join(__dirname, "../src/data/blog/data.json");

// Pastikan file ada
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
  console.log("🆕 File data.json dibuat di:", dataPath);
}

export function readData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

export function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}
