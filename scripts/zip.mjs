// Packs the extension for the Chrome Web Store: node scripts/zip.mjs (run `pnpm build` first)
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { deflateRawSync, crc32 } from "node:zlib";
import { join } from "node:path";

const FILES = ["manifest.json", "popup.html", "icon.png", "_locales", "build/content.js", "build/background.js", "build/popup.js"];
const { version } = JSON.parse(readFileSync("manifest.json", "utf8"));
const out = `json-filler-${version}.zip`;

const walk = (p) => (statSync(p).isDirectory() ? readdirSync(p).flatMap((f) => walk(join(p, f))) : [p]);
const paths = FILES.flatMap(walk).map((p) => p.replaceAll("\\", "/"));

const now = new Date();
const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

const locals = [], centrals = [];
let offset = 0;
for (const path of paths) {
    const data = readFileSync(path);
    const packed = deflateRawSync(data, { level: 9 });
    const name = Buffer.from(path);
    const crc = crc32(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);          // version needed
    local.writeUInt16LE(8, 8);           // deflate
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(packed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);        // version made by
    central.writeUInt16LE(20, 6);        // version needed
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(dosTime, 12);
    central.writeUInt16LE(dosDate, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(packed.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);

    locals.push(local, name, packed);
    centrals.push(central, name);
    offset += local.length + name.length + packed.length;
}

const dir = Buffer.concat(centrals);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(paths.length, 8);
end.writeUInt16LE(paths.length, 10);
end.writeUInt32LE(dir.length, 12);
end.writeUInt32LE(offset, 16);

writeFileSync(out, Buffer.concat([...locals, dir, end]));
console.log(`${out}: ${paths.length} files\n  ${paths.join("\n  ")}`);
