// widget.js - Remote Love for Scriptable.
// Loaded from GitHub Pages by the one-line script on her phone.
// The whole file is one async function that receives the site URL.
(async (BASE) => {

const TZ = "America/Chicago";
const SWITCH_HOUR = 22;            // 10 PM Central
const HOUR = 3600 * 1000;

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

// ---------- Draw the card: a little love letter ----------
// (used by the widget and the app screen)
const W = 1100, H = 520;
const PAPER   = "#FFF8EE";   // cream stationery
const ROSE    = "#C8385C";   // airmail stripe
const BLUSH   = "#F4B6C2";   // airmail stripe
const SEAL    = "#8E1B3A";   // wax
const SEAL_LT = "#B23C5C";
const SEAL_DK = "#5E0F25";
const INK     = "#5A1A2E";   // compliment text
const INK_RED = "#B0284F";   // "I love" + signature

const SCRIPT = (s) => new Font("SnellRoundhand-Bold", s);
const SERIF  = (s) => new Font("Georgia-Italic", s);

const col = (h, a) => (a === undefined ? new Color(h) : new Color(h, a));

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

// Slightly irregular circle, like pressed wax
function waxPoints(cx, cy, r) {
  const pts = [];
  const N = 72;
  for (let k = 0; k < N; k++) {
    const a = (k / N) * Math.PI * 2;
    const rr = r * (1 + 0.045 * Math.sin(a * 7 + 0.6) + 0.025 * Math.cos(a * 13) + 0.015 * Math.sin(a * 23));
    pts.push(new Point(cx + rr * Math.cos(a), cy + rr * Math.sin(a)));
  }
  return pts;
}

function fillPoly(ctx, pts, color) {
  const p = new Path();
  p.addLines(pts);
  p.closeSubpath();
  ctx.addPath(p);
  ctx.setFillColor(col(color));
  ctx.fillPath();
}

function drawSeal(ctx, cx, cy, r) {
  // soft shadow
  fillPoly(ctx, waxPoints(cx + 5, cy + 8, r).map((q) => q), SEAL_DK);
  // wax body
  fillPoly(ctx, waxPoints(cx, cy, r), SEAL);
  // pressed inner ring
  ctx.setStrokeColor(col(SEAL_LT));
  ctx.setLineWidth(5);
  ctx.strokeEllipse(new Rect(cx - r * 0.74, cy - r * 0.74, r * 1.48, r * 1.48));
  // embossed heart: dark offset, then light face
  const hw = r * 0.9, hh = hw * 0.9;
  ctx.addPath(heartPath(cx - hw / 2 + 3, cy - hh / 2 + 6, hw, hh));
  ctx.setFillColor(col(SEAL_DK));
  ctx.fillPath();
  ctx.addPath(heartPath(cx - hw / 2, cy - hh / 2 + 2, hw, hh));
  ctx.setFillColor(col(SEAL_LT));
  ctx.fillPath();
}

function drawAirmail(ctx, b) {
  ctx.setFillColor(col(PAPER));
  ctx.fillRect(new Rect(0, 0, W, H));
  const sw = 38, colors = [ROSE, PAPER, BLUSH, PAPER];
  let i = 0;
  for (let x = -H; x < W + sw; x += sw, i++) {
    const p = new Path();
    p.addLines([new Point(x, 0), new Point(x + sw, 0), new Point(x + sw + H, H), new Point(x + H, H)]);
    p.closeSubpath();
    ctx.addPath(p);
    ctx.setFillColor(col(colors[i % 4]));
    ctx.fillPath();
  }
  // paper on top of the stripes
  ctx.setFillColor(col(PAPER));
  ctx.fillRect(new Rect(b, b, W - 2 * b, H - 2 * b));
  // thin keyline
  ctx.setStrokeColor(col(ROSE, 0.35));
  ctx.setLineWidth(2);
  ctx.strokeRect(new Rect(b + 12, b + 12, W - 2 * b - 24, H - 2 * b - 24));
}

function sizeFor(text, special) {
  const n = text.length;
  const base = n <= 25 ? 72 : n <= 50 ? 56 : n <= 90 ? 45 : 37;
  return special ? base + 4 : base;
}
function estimateHeight(text, size, width) {
  const perLine = Math.max(1, Math.floor(width / (size * 0.5)));
  return Math.ceil(text.length / perLine) * size * 1.25;
}

function renderCard(entry) {
  const ctx = new DrawContext();
  ctx.size = new Size(W, H);
  ctx.opaque = true;
  ctx.respectScreenScale = false;

  const b = 30;
  drawAirmail(ctx, b);

  drawSeal(ctx, 215, 262, 120);

  // writing
  const tx = 404, tw = W - b - 46 - tx;
  const size = sizeFor(entry.text, entry.special);
  const bodyH = estimateHeight(entry.text, size, tw);
  const leadSize = 76, leadH = entry.special ? 0 : leadSize * 1.05;
  const sigH = CONFIG.herName ? 40 : 0;
  let y = Math.max(b + 30, (H - (leadH + bodyH + sigH)) / 2 - 6);

  ctx.setTextAlignedLeft();
  if (!entry.special) {
    ctx.setFont(SCRIPT(leadSize));
    ctx.setTextColor(col(INK_RED));
    ctx.drawTextInRect("I love", new Rect(tx, y - 8, tw, leadH + 20));
    y += leadH;
  }
  ctx.setFont(SERIF(size));
  ctx.setTextColor(col(INK));
  ctx.drawTextInRect(entry.text, new Rect(tx, y, tw, H - b - 50 - y));

  if (CONFIG.herName) {
    ctx.setFont(SCRIPT(42));
    ctx.setTextColor(col(INK_RED));
    ctx.setTextAlignedRight();
    ctx.drawTextInRect("for " + CONFIG.herName, new Rect(tx, H - b - 78, tw, 56));
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
  const BG = new Color("#F7E4E6");

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
