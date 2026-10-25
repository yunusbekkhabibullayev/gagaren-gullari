import fs from "fs";

const content = fs.readFileSync("example/Floriva – iPhone UI.html", "utf8");
const clean = content.replace(/data:image\/[^;]+;base64,[^"'\s]+/g, "[BASE64_IMAGE]");
fs.writeFileSync("example/floriva_structure.html", clean);
console.log("Successfully created example/floriva_structure.html, size:", clean.length);
