/* Screenshots a page with headless Edge/Chrome so you can look at what you built.
   Usage: node tools/shot.js <file-or-url> <out.png> [width] [height]
   Examples:
     node tools/shot.js trail.html C:/tmp/trail.png 420 900
     node tools/shot.js "trail.html#w0-l1" C:/tmp/lesson.png
     node tools/shot.js index.html C:/tmp/home.png 380 1400 --seed C:/tmp/state.json
   Local paths are resolved against the project root and opened as file:// URLs.
   --seed <file.json>: a JSON object of localStorage key -> value (objects are stringified),
     written before the page loads. Only works for local pages.
   Widths under 500 are rendered inside an iframe of that width, because headless browsers
   will not lay out a top-level window narrower than about 500px.
   An old file at the output path is deleted first, so a "Saved" line always means a fresh image.
   Each run uses its own throwaway browser profile, so runs can overlap safely. */
"use strict";
var fs = require("fs");
var os = require("os");
var path = require("path");
var cp = require("child_process");

var argv = process.argv.slice(2);
var seedFile = null;
var si = argv.indexOf("--seed");
if (si !== -1) { seedFile = argv[si + 1]; argv.splice(si, 2); }
var target = argv[0];
var out = argv[1];
var width = parseInt(argv[2] || "1000", 10);
var height = parseInt(argv[3] || "800", 10);
if (!target || !out) {
  console.log("Usage: node tools/shot.js <file-or-url> <out.png> [width] [height] [--seed state.json]");
  process.exit(2);
}

var candidates = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
];
var exe = candidates.filter(function (p) { return fs.existsSync(p); })[0];
if (!exe) { console.log("No Edge or Chrome found."); process.exit(1); }

var root = path.join(__dirname, "..");
var temps = [];
function fileUrl(abs) { return "file:///" + abs.replace(/\\/g, "/").replace(/ /g, "%20"); }

var url = target;
var isLocal = !/^[a-z]+:\/\//i.test(target);
if (isLocal) {
  var hash = "";
  var i = target.indexOf("#");
  if (i !== -1) { hash = target.slice(i); target = target.slice(0, i); }
  var abs = path.isAbsolute(target) ? target : path.join(root, target);
  if (!fs.existsSync(abs)) { console.log("Not found: " + abs); process.exit(1); }
  url = fileUrl(abs) + hash;

  var seed = null;
  if (seedFile) seed = JSON.parse(fs.readFileSync(seedFile, "utf8"));
  if (seed || width < 500) {
    /* A wrapper page in the same folder (same file:// origin rules) that seeds storage and
       frames the page at the requested width. */
    var stamp = String(process.pid) + "-" + String(process.hrtime()[1]);
    var wrap = path.join(path.dirname(abs), "_tmp-shot-" + stamp + ".html");
    var seedJs = "";
    if (seed) {
      Object.keys(seed).forEach(function (k) {
        var v = typeof seed[k] === "string" ? seed[k] : JSON.stringify(seed[k]);
        seedJs += "localStorage.setItem(" + JSON.stringify(k) + "," + JSON.stringify(v) + ");";
      });
    }
    var inner = path.basename(abs) + hash;
    fs.writeFileSync(wrap,
      "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><style>html,body{margin:0;background:#000}" +
      "iframe{border:0;display:block;width:" + width + "px;height:" + height + "px}</style></head><body>" +
      "<script>try{localStorage.clear();" + seedJs + "}catch(e){}" +
      "document.write('<iframe src=" + JSON.stringify(inner).replace(/'/g, "\\'") + "></iframe>');<\/script>" +
      "</body></html>", "utf8");
    temps.push(wrap);
    url = fileUrl(wrap);
  }
}

var outAbs = path.resolve(out);
fs.mkdirSync(path.dirname(outAbs), { recursive: true });
try { fs.unlinkSync(outAbs); } catch (e) { /* no old file */ }

function cleanup(profile) {
  temps.forEach(function (t) { try { fs.unlinkSync(t); } catch (e) { /* ignore */ } });
  if (profile) { try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* may be locked */ } }
}

function attempt() {
  var profile = fs.mkdtempSync(path.join(os.tmpdir(), "shot-"));
  var winW = Math.max(width, 500);
  var args = [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
    "--no-default-browser-check", "--disable-extensions", "--allow-file-access-from-files",
    "--user-data-dir=" + profile, "--window-size=" + winW + "," + height,
    "--virtual-time-budget=5000", "--screenshot=" + outAbs, url
  ];
  var r = cp.spawnSync(exe, args, { timeout: 90000, encoding: "utf8" });
  /* The image can land a moment after the browser returns. */
  var waited = 0;
  while (!fs.existsSync(outAbs) && waited < 8000) {
    cp.spawnSync(process.execPath, ["-e", "setTimeout(function(){},250)"]);
    waited += 250;
  }
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* may be locked */ }
  return { ok: fs.existsSync(outAbs) && fs.statSync(outAbs).size > 0, err: r.stderr };
}

var res = attempt();
if (!res.ok) res = attempt();
if (!res.ok) res = attempt();
cleanup();
if (!res.ok) {
  console.log("Screenshot failed after 3 tries." + (res.err ? "\n" + String(res.err).slice(0, 600) : ""));
  process.exit(1);
}
console.log("Saved " + outAbs + " (" + fs.statSync(outAbs).size + " bytes), " + width + "x" + height + ", from " + url);
