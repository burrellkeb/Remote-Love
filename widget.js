// widget.js - Remote Love for Scriptable.
// Loaded from GitHub Pages by the one-line script on her phone.
// The whole file is one async function that receives the site URL.
(async (BASE) => {

const TZ = "America/Chicago";
const SWITCH_HOUR = 22;            // 10 PM Central
const HOUR = 3600 * 1000;

const TOP_COLOR    = [255, 143, 177];
const BOTTOM_COLOR = [224,  69, 123];
const HEART_COLOR  = new Color("#FFFFFF");
const TEXT_COLOR   = new Color("#FFFFFF");

const fm = FileManager.local();
const DIR = fm.documentsDirectory();
const DATA_CACHE = fm.joinPath(DIR, "remote-love-compliments.js");
const STATE_PATH = fm.joinPath(DIR, "remote-love-state.json");

// ---------- Load compliments (fresh from GitHub, cached for offline) ----------
let code = null;
try {
  const req = new Request(BASE + "compliments.js?t=" + Date.now());
  const txt = await req.loadString();
  if (req.response.statusCode === 200 && txt.includes("COMPLIMENTS")) {
    code = txt;
    fm.writeString(DATA_CACHE, txt);
  }
} catch (e) {}
if (!code && fm.fileExists(DATA_CACHE)) code = fm.readString(DATA_CACHE);
if (!code) throw new Error("Remote Love: couldn't load compliments. Check the internet connection.");

const { CONFIG, COMPLIMENTS } =
  new Function(code + "\n;return { CONFIG: CONFIG, COMPLIMENTS: COMPLIMENTS };")();

// ---------- Which day is showing? (Central time, switches at 10 PM) ----------
function centralWallClockMs(now) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ, hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(now);
  const get = (t) => parseInt(parts.find((p) => p.type === t).value, 10);
  return Date.UTC(get("year"), get("month") - 1, get("day"),
                  get("hour") % 24, get("minute"), get("second"));
}

function currentKey(now) {
  const shifted = centralWallClockMs(now) + (24 - SWITCH_HOUR) * HOUR;
  let key = new Date(shifted).toISOString().slice(0, 10);
  const keys = Object.keys(COMPLIMENTS).sort();
  if (key < keys[0]) key = keys[0];
  if (key > keys[keys.length - 1]) key = keys[keys.length - 1];
  return key;
}

function nextSwitch(now) {
  const shifted = centralWallClockMs(now) + (24 - SWITCH_HOUR) * HOUR;
  const msLeft = 24 * HOUR - (shifted % (24 * HOUR));
  return new Date(now.getTime() + msLeft + 30 * 1000);
}

// ---------- Respin state (resets each new day) ----------
function loadState(key) {
  try {
    if (fm.fileExists(STATE_PATH)) {
      const s = JSON.parse(fm.readString(STATE_PATH));
      if (s.key === key) return s;
    }
  } catch (e) {}
  return { key, showSecond: false };
}
function saveState(s) {
  try { fm.writeString(STATE_PATH, JSON.stringify(s)); } catch (e) {}
}

function entryFor(key, state) {
  const e = COMPLIMENTS[key];
  if (!Array.isArray(e)) return { special: true, text: e.special };
  return { special: false, text: state.showSecond ? e[1] : e[0] };
}

// ---------- Draw the card (used by widget and app screen) ----------
const W = 1100, H = 520;

function heartPath(x, y, w, h) {
  const sx = w / 100, sy = h / 90;
  const P = (px, py) => new Point(x + px * sx, y + py * sy);
  const p = new Path();
  p.move(P(50, 25));
  p.addCurve(P(25, 0),   P(50, 10),  P(35, 0));
  p.addCurve(P(0, 27),   P(10, 0),   P(0, 12));
  p.addCurve(P(50, 90),  P(0, 50),   P(25, 65));
  p.addCurve(P(100, 27), P(75, 65),  P(100, 50));
  p.addCurve(P(75, 0),   P(100, 12), P(90, 0));
  p.addCurve(P(50, 25),  P(65, 0),   P(50, 10));
  p.closeSubpath();
  return p;
}

const hex = (rgb) => "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

function sizeFor(text) {
  const n = text.length;
  if (n <= 25) return 76;
  if (n <= 50) return 62;
  if (n <= 90) return 50;
  return 42;
}
function estimateHeight(text, size, width) {
  const perLine = Math.max(1, Math.floor(width / (size * 0.55)));
  return Math.ceil(text.length / perLine) * size * 1.22;
}

function renderCard(entry) {
  const ctx = new DrawContext();
  ctx.size = new Size(W, H);
  ctx.opaque = true;
  ctx.respectScreenScale = false;

  for (let yy = 0; yy < H; yy += 4) {
    const t = yy / H;
    ctx.setFillColor(new Color(hex(TOP_COLOR.map((v, i) => v + (BOTTOM_COLOR[i] - v) * t))));
    ctx.fillRect(new Rect(0, yy, W, 5));
  }

  ctx.addPath(heartPath(70, 125, 300, 270));
  ctx.setFillColor(HEART_COLOR);
  ctx.fillPath();

  const tx = 430, tw = W - tx - 60;
  ctx.setTextColor(TEXT_COLOR);
  ctx.setTextAlignedLeft();
  const size = sizeFor(entry.text);
  const bodyH = estimateHeight(entry.text, size, tw);
  const leadSize = 48, leadH = entry.special ? 0 : leadSize * 1.3;
  let y = Math.max(40, (H - (leadH + bodyH)) / 2);

  if (!entry.special) {
    ctx.setFont(Font.mediumRoundedSystemFont(leadSize));
    ctx.drawTextInRect("I love", new Rect(tx, y, tw, leadH));
    y += leadH;
  }
  ctx.setFont(Font.boldRoundedSystemFont(size));
  ctx.drawTextInRect(entry.text, new Rect(tx, y, tw, H - y - 50));

  if (CONFIG.herName) {
    ctx.setFont(Font.mediumRoundedSystemFont(30));
    ctx.setTextAlignedRight();
    ctx.drawTextInRect("for " + CONFIG.herName, new Rect(tx, H - 62, tw, 40));
  }
  return ctx.getImage();
}

// ---------- Widget ----------
function buildWidget(entry, now) {
  const w = new ListWidget();
  w.backgroundImage = renderCard(entry);
  const inAnHour = new Date(now.getTime() + HOUR);
  const sw = nextSwitch(now);
  w.refreshAfterDate = sw < inAnHour ? sw : inAnHour;
  return w;   // tapping it opens the app screen below
}

// ---------- App screen ----------
async function sendLoveBack() {
  const a = new Alert();
  a.title = "Send love back";
  a.addAction("Take me a picture of my beautiful girlfriend");
  a.addAction("Find me a photo of my gorgeous girlfriend");
  a.addCancelAction("Cancel");
  const choice = await a.presentSheet();
  if (choice === -1) return;

  let img;
  try {
    img = choice === 0 ? await Photos.fromCamera() : await Photos.fromLibrary();
  } catch (e) { return; }

  const m = new Message();
  m.addImageAttachment(img);
  await m.send();
}

async function showApp(now) {
  const key = currentKey(now);
  const state = loadState(key);
  const table = new UITable();
  table.showSeparators = false;
  const BG = new Color("#FFF0F5");

  const row = (h) => { const r = new UITableRow(); r.height = h; r.backgroundColor = BG; return r; };

  function build() {
    table.removeAllRows();
    const entry = entryFor(key, state);
    table.addRow(row(70));

    const card = row(190);
    card.addImage(renderCard(entry)).centerAligned();
    table.addRow(card);
    table.addRow(row(40));

    if (!entry.special) {
      const r = row(60);
      const b = r.addButton("🔄  Respin");
      b.centerAligned();
      b.onTap = () => {
        state.showSecond = !state.showSecond;
        saveState(state);
        build();
        table.reload();
      };
      table.addRow(r);
    }

    const r2 = row(60);
    const b2 = r2.addButton("💌  Send love back");
    b2.centerAligned();
    b2.onTap = () => { sendLoveBack(); };
    table.addRow(r2);
    table.addRow(row(400));
  }

  build();
  await table.present(true);
}

// ---------- Run ----------
const now = new Date();
if (config.runsInWidget) {
  const key = currentKey(now);
  Script.setWidget(buildWidget(entryFor(key, loadState(key)), now));
} else {
  await showApp(now);
}
Script.complete();

})
