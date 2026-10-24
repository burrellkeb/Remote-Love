# Remote Love

A daily "I love…" compliment, switching at 10 PM Central, through Dec 24.

- `compliments.js` is **the only file to edit**: compliments, her name, and your number.
- `widget.js` is the home-screen widget, run by Scriptable.
- `index.html` is the web-app version and fallback. It also lets you preview the design on your computer.

## 1. Publish (you)

1. Create a **public** repo named `remote-love` and push these files to it.
2. In the repo, go to **Settings → Pages → Source: Deploy from a branch → `main` / root**.
3. After a minute, check that `https://burrellkeb.github.io/remote-love/` loads.

Whenever you edit `compliments.js` later, commit and push. Her widget picks up the change within about 10 minutes.

## 2. Widget setup (her)

1. Install **Scriptable** from the App Store.
2. Open it, tap **+** to make a new script, and name it **Remote Love** (tap the title at the top).
3. Paste this one line and tap **Done**:

```js
const B="https://burrellkeb.github.io/remote-love/",f=FileManager.local(),p=f.joinPath(f.documentsDirectory(),"rl-widget.js");let c;try{const r=new Request(B+"widget.js?t="+Date.now());c=await r.loadString();if(r.response.statusCode!==200)throw 0;f.writeString(p,c)}catch(e){c=f.readString(p)}await eval(c)(B)
```

4. Tap ▶︎ once. This opens the Respin / Send love back screen and confirms it works.
5. Long-press the home screen, tap **+**, search **Scriptable**, and add the **medium** widget.
6. Long-press the widget, choose **Edit Widget**, and set **Script** to **Remote Love**.

Tapping the widget opens the screen with Respin and Send love back. Send love back opens iMessage with the photo already attached. She types or picks you as the recipient.

## Fallback: web app only (no widget)

On her phone, open `https://burrellkeb.github.io/remote-love/` in **Safari**, then tap **Share → Add to Home Screen**. This gives a "Remote Love" icon with the K heart. Send love back uses the share sheet, so she picks Messages and then you.
