# SpeedPilot

**Control playback. Your way.**

SpeedPilot is a universal video/audio speed controller: a Manifest V3 browser
extension for Chrome and Edge, plus the public website that explains and hosts
installation instructions for it. This repo is an npm-workspaces monorepo
containing both, plus the logic they share.

```text
speedpilot/
├── website/     Next.js 15 (App Router) + TypeScript + Tailwind — the public site
├── extension/   Manifest V3 extension — TypeScript, esbuild, no UI framework
├── shared/      Types, constants, and pure utilities used by both
├── README.md
└── TEST_PLAN.md
```

## Why it exists

Every video site puts speed control somewhere different — if it exposes one at
all. SpeedPilot gives you one consistent layer on top: the same popup, the same
on-video controller, the same keyboard shortcuts, regardless of which site
you're on. See the website's "Why This Exists" section for the full pitch.

## Architecture

The extension follows one data flow, all inside the content script that runs on
the page itself (the background service worker is a thin message relay, not a
second brain):

```text
MediaDetector  →  MediaRegistry  →  SpeedManager  →  PlaybackController(s)
 (MutationObserver)  (dedupe, prune)   (resolves effective speed,        (per <video>/<audio>:
                                        active-media tracking,            get/set rate, seek,
                                        speed-lock reassertion)           PiP, snapshot)
                                              ↕
                                    SiteRuleManager / StorageManager
                                       (chrome.storage.local, +
                                        optional opt-in sync mirror)
                                              ↕
                          OverlayController · FocusModeController · KeyboardHandler
```

- **Popup / Options / Side panel** never touch a `<video>` element directly —
  they send a typed `RuntimeMessage` (see `shared/types.ts`) through the
  background service worker, which relays it to the active tab's content
  script and relays the response back.
- **No polling.** Media discovery uses a single `MutationObserver`; the
  on-video controller and Focus Mode only run a `requestAnimationFrame` loop
  while they're actually visible/active; speed-lock reassertion is driven by
  the media element's own `ratechange` event, not a timer.
- **Iframes:** same-origin iframes are scanned too (common for embedded course
  players). Cross-origin iframes are a genuine browser security boundary — the
  content script can't reach into them, and the website says so rather than
  pretending otherwise.

## Prerequisites

- Node.js 18.18+ and npm 9+
- Chrome or Edge (any recent Chromium-based build) for testing the extension

## Install dependencies

```bash
npm install
```

This installs all three workspaces (`shared`, `website`, `extension`) in one
pass via npm workspaces.

## Website development

```bash
npm run dev              # next dev, from the repo root
# or: npm run dev --workspace website
```

```bash
npm run build             # production build (npm run build --workspace website)
npm run start --workspace website   # serve the production build locally
npm run lint --workspace website
```

## Extension development

```bash
npm run dev:extension     # esbuild watch mode + one-time static/icon copy
npm run build:extension   # production build → extension/dist
npm run typecheck --workspace extension
```

`npm run dev:extension` rebuilds the JS bundles on save; if you change
`manifest.json`, an HTML file, or a CSS file, re-run `npm run build:extension`
once (or restart dev) since those are only copied at build start, not watched.

### Loading the unpacked extension

**Chrome**
1. Open `chrome://extensions`
2. Turn on **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select `extension/dist`

**Edge**
1. Open `edge://extensions`
2. Turn on **Developer mode** (left sidebar toggle)
3. Click **Load unpacked**
4. Select `extension/dist`

After editing source and rebuilding, click the refresh icon on the extension's
card in `chrome://extensions` / `edge://extensions` to pick up the new build.

The same `extension/dist` output loads in both browsers — SpeedPilot targets
standard Manifest V3 + Chromium extension APIs rather than anything
Chrome-only, so no separate Edge build is needed.

## Production build (both)

```bash
npm run build:all
```

Produces the website's `.next` production build and `extension/dist`.

## Testing

```bash
npm run test              # shared/*.test.ts via Node's built-in test runner
```

There's no automated end-to-end browser suite here — genuinely exercising
media detection/speed control requires a live browser tab. `TEST_PLAN.md` is
the manual checklist to run through before calling a change done; it mirrors
the scenarios in the original product spec (multiple videos, dynamic
insertion, SPA navigation, extreme speeds, persistence, both browsers).

## Permissions — why each one is requested

| Permission | Why |
|---|---|
| `storage` | Save settings and per-site speed rules locally (and, only if you opt in, mirror to browser sync). |
| `sidePanel` | Power the optional side-panel view. |
| `host_permissions: http://*/*, https://*/*` | The one broad permission a *universal* speed controller genuinely needs — the content script (statically declared, not dynamically injected) must reach media on any site you visit, and it's also what makes `chrome.tabs.query`/`sendMessage` work without a separate `activeTab` grant. No other broad permission (`tabs`, `activeTab`, `scripting`, `history`, `webRequest`, `<all_urls>` for non-http(s) schemes, etc.) is requested — `scripting` and `activeTab` specifically are redundant once broad `host_permissions` are already declared, and `commands` isn't a permission string at all (just a manifest key), so none of the three are listed under `permissions`. |

## Privacy architecture

- No analytics, no trackers, no ads, no third-party or remote scripts.
- No browsing history is ever read or stored — the content script only sees
  the tab it's already running in, same as any extension with `activeTab`.
- Settings and site rules live in `chrome.storage.local` by default.
  Enabling **Sync settings across devices** in Settings mirrors only those two
  things — never browsing data — to `chrome.storage.sync`, and it's off by
  default.
- The extension makes zero network requests of its own.

## Deferred features

Deliberately out of this release, so the mandatory feature set could be solid
instead of spread thin. Listed in the extension's own Settings page too:

- **Speed Profiles** — named bundles of speed + rewind/forward settings.
- **Hold-to-Boost** — hold a key to temporarily jump to a boosted speed.
- **Skip Silence** — needs real audio analysis to do reliably; not worth doing
  cheaply just to check a box.

## Troubleshooting

- **Popup says "SpeedPilot isn't available here"** — some pages (browser
  settings pages, the Chrome/Edge Web Store, `chrome://` URLs) don't allow any
  extension to run on them. That's a browser restriction, not a bug.
- **"No media detected" but a video is visible** — the video may be inside a
  cross-origin iframe (see Architecture above), or hasn't started loading yet;
  SpeedPilot picks it up automatically once it's in the DOM.
- **A shortcut doesn't fire** — shortcuts are disabled while typing in any
  input/textarea/contenteditable field by design. Check Settings to confirm
  the shortcut is still enabled and bound to the key you expect.
- **Changed the manifest and nothing updates** — click the refresh icon on the
  extension's card in `chrome://extensions` after rebuilding; Chrome/Edge
  don't hot-reload unpacked extensions.
