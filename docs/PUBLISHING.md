# Chrome Web Store kit — My Speed Up

Everything below is ready to copy/paste into the
[Developer Dashboard](https://chrome.google.com/webstore/devconsole). Files are all in this repo.

## 0. Files to upload
| What | File | Size |
|---|---|---|
| Extension package | `extension/my-speed-up-v1.0.0.zip` | — |
| Store icon | `extension/store-logo-300.png` (the 128×128 icon is already inside the zip) | 300×300 |
| Screenshot 1 | `extension/store-screenshots/store-01-overlay.png` | 1280×800 |
| Screenshot 2 | `extension/store-screenshots/store-02-settings.png` | 1280×800 |
| Small promo tile | `extension/store/promo-small-440x280.png` | 440×280 |
| Marquee promo (optional) | `extension/store/promo-marquee-1400x560.png` | 1400×560 |

Rebuild the package any time: `cd extension && npm run build`, then zip the **contents** of `extension/dist/` (manifest.json must be at the zip root).
Regenerate tiles/logo: `npm run store-assets --workspace extension`.

## 1. Store listing tab
**Name** (from manifest, 36 chars): `My Speed Up: Video Speed Controller`

**Summary** (≤132 chars):
```
Control playback speed on any video or audio. Per-site memory, keyboard shortcuts, on-video controller. No tracking.
```

**Category:** Productivity  ·  **Language:** English

**Description:**
```
My Speed Up is a simple, fast video speed controller that works the same way on every website.

Speed up long lectures, slow down tutorials, rewind a missed sentence — all with one consistent control, instead of hunting for a different speed menu on every site.

WHAT YOU GET
• Speeds from 0.05× to 16× — with presets (0.75×, 1×, 1.25×, 1.5×, 2×, up to 16×) you can edit
• A small on-video controller (−, 1.00×, +) you can drag anywhere; show always, on hover, or auto-hide
• Remembers your speed per website — YouTube at 1.5×, lectures at 1.75×, everything else at 1×
• Keyboard shortcuts: A slower · D faster · S reset to 1× · Z rewind · X forward · V show/hide (all reassignable or disableable)
• Toolbar popup and side panel for quick control
• Works with HTML5 video and audio, including players that load after the page
• "Keep my selected speed" option for sites that try to reset it
• Light and dark themes
• Works in Chrome, Edge and other Chromium browsers

PRIVACY FIRST
• No account, no analytics, no trackers, no ads
• Makes no network requests of its own
• Never records the sites you visit or what you watch
• Settings are stored locally in your browser (optional browser sync backup is off by default)

NOTES
Some sites use protected or custom players (for example DRM streams) that don't expose a standard media element; the controller can't change those. My Speed Up is an independent project and is not affiliated with any website it works on.
```

**Official URL / Homepage:** your deployed website URL (e.g. `https://<your-site>.vercel.app`)
**Support URL:** `https://github.com/itsMannuYadav/My-Speed-Controller-Extention/issues`
**Mature content:** No

## 2. Privacy tab
**Single purpose:**
```
Let users change the playback speed of HTML5 video and audio on the web pages they visit.
```

**Permission justifications**
- `storage`:
```
Saves the user's settings, speed presets and per-site speed preferences locally in the browser so they persist between sessions.
```
- `sidePanel`:
```
Provides an optional side panel with the same speed controls as the toolbar popup.
```
- Host permissions (`http://*/*`, `https://*/*`) and content script:
```
A speed controller must find and control the video/audio elements on whichever site the user is watching, and show the on-video control. The content script only reads and sets the playback rate of media elements and shows its own control. It does not read, collect, store or transmit page content, URLs, or browsing history.
```
- Remote code: **No, I am not using remote code.**

**Data usage:** leave every "collected data" checkbox **unchecked** (nothing is collected). Tick all three certifications (no selling, no use unrelated to the single purpose, no creditworthiness/lending use).

**Privacy policy URL:** `<your site>/privacy` — deploy the website first (the page already exists).

## 3. Test instructions for reviewers (Distribution → "Test instructions")
```
No login needed. Open any page with a video (e.g. a YouTube video), play it, and hover the video: a small "− 1.00× +" controller appears in the top-right. Click + or press D to speed up, A to slow down, S to reset. Click the toolbar icon for the popup, or right-click it → Options for settings. Everything works offline and locally; there are no accounts or servers.
```

## 4. Distribution tab
Visibility **Public** · Regions **All** · Pricing **Free** → **Submit for review**.
The all-sites host permission means a manual review; expect days up to ~2 weeks. Choose "defer publishing" if you want to press publish yourself after approval.

## 5. Before you submit — checklist
- [ ] Website deployed (e.g. Vercel) and `/privacy` loads
- [ ] 2-step verification on the Google account
- [ ] Contact email verified in dashboard → Account
- [ ] Zip loads via `chrome://extensions` → Developer mode → Load unpacked (unzip first) and works on a real video
- [ ] Listing graphics uploaded (table in section 0)

## 6. After approval
1. Copy the store URL (`https://chromewebstore.google.com/detail/<id>`).
2. Send it to Claude (or add `CHROME_STORE_URL` next to `EDGE_STORE_URL` in `website/src/lib/content.ts`) so the site's install buttons, README and docs link to it.
3. Rename the Edge Add-ons listing to the same name.

## Updating later
Bump `version` in `extension/manifest.json`, rebuild, zip, then **Package → Upload new package** in the dashboard.
