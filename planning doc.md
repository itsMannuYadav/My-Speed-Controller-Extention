# Build a Production-Ready Universal Video Speed Controller

You are an expert full-stack engineer, browser-extension engineer, UI/UX designer, and product architect.

I want you to design and build a polished, production-quality **Universal Video Speed Controller** that allows users to control playback speed across websites and HTML5 media.

The product must consist of **two clearly separated parts**:

1. A beautiful public-facing website/homepage
2. The actual browser extension that users can load into Chrome or Microsoft Edge

The website and extension should share the same visual identity, design language, terminology, and brand.

Do NOT build this as a basic demo.

The goal is to create something that feels like a real, modern, trustworthy browser product that could eventually be published to the Chrome Web Store and Microsoft Edge Add-ons.

---

# 1. PRODUCT CONCEPT

Create a browser extension that gives users complete control over HTML5 video/audio playback.

The core experience should be:

> Open any supported website → play a video → open the extension or use keyboard shortcuts → instantly control playback speed.

The extension should work across as many standard HTML5 media websites as technically possible.

Typical use cases include:

* YouTube
* Vimeo
* online courses
* educational platforms
* university lectures
* coding tutorials
* webinars
* recorded meetings
* news websites
* documentation/tutorial websites
* podcasts and audio players
* locally hosted HTML5 media
* websites containing multiple videos
* dynamically loaded videos
* single-page applications

Do not hard-code the application around one website.

The architecture should be generic and primarily operate on HTML5 `<video>` and `<audio>` elements.

---

# 2. TECHNOLOGY STACK

## Public Website

Use:

* Next.js
* TypeScript
* Tailwind CSS
* modern responsive design
* reusable React components
* accessible semantic HTML
* clean component architecture

Use the current stable Next.js architecture appropriate for a new project.

Prefer:

* App Router
* TypeScript
* server components where appropriate
* client components only when interaction requires them

Avoid unnecessary dependencies.

---

# 3. BROWSER EXTENSION

Build the extension as a separate project/directory.

Use:

* Manifest V3
* TypeScript
* modern JavaScript APIs
* Chrome Extension APIs
* `chrome.storage`
* `chrome.commands`
* `chrome.scripting`
* content scripts
* background/service worker where required

The extension should be designed so that the same packaged extension can be adapted for:

* Google Chrome
* Microsoft Edge
* Chromium-based browsers

Do not use deprecated Manifest V2 architecture.

Keep browser-specific APIs abstracted wherever practical.

---

# 4. PROJECT STRUCTURE

Create a clean monorepo-style structure such as:

```text
universal-speed-controller/
│
├── website/
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── styles/
│   ├── lib/
│   └── ...
│
├── extension/
│   ├── src/
│   │   ├── background/
│   │   ├── content/
│   │   ├── popup/
│   │   ├── options/
│   │   ├── sidepanel/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   │
│   ├── public/
│   ├── manifest.json
│   └── ...
│
├── shared/
│   ├── types/
│   ├── constants/
│   └── utilities/
│
├── README.md
└── package.json
```

Keep the website and extension independently buildable.

---

# 5. HOMEPAGE

The homepage should feel like a premium developer/productivity tool.

Do NOT make it look like a generic SaaS template.

The homepage should immediately communicate:

> Control video playback your way.

Suggested product positioning:

**Universal Speed Controller**

Possible supporting message:

> Speed up, slow down, rewind, and control media across the web — with one simple extension.

Do not overuse marketing language.

The product should feel fast, lightweight, private, and useful.

---

# 6. HOMEPAGE SECTIONS

Build the homepage with these sections.

## Header

Include:

* product logo
* product name
* Features
* How It Works
* Keyboard Shortcuts
* FAQ
* Download / Install button
* GitHub link if appropriate

Header should become sticky after scrolling.

Desktop:

```text
Logo       Features  How It Works  Shortcuts  FAQ       Install
```

Mobile:

Use a polished mobile menu.

---

# 7. HERO SECTION

Create a visually impressive hero section.

Example messaging:

### Control playback. Your way.

Speed up, slow down, rewind, and fine-tune videos and audio across the web.

Then include:

* Install Extension
* See How It Works

Add a large interactive product mockup showing the extension popup/controller.

The hero demo should visually communicate:

```text
−        1.50×        +
━━━━━━━━━━━━━━━━━━━━━━
0.5×  1×  1.25×  1.5×  2×  3×
```

Also show:

* keyboard shortcut hints
* current playback speed
* time remaining
* rewind/forward buttons

The visual should feel like the actual extension, not a random illustration.

---

# 8. "WHY THIS EXISTS"

Explain the problem.

Different video websites hide speed controls in different places.

Some websites:

* don't expose speed controls
* limit available speeds
* require multiple clicks
* have inconsistent shortcuts
* reset playback speed
* make speed control difficult on embedded media

Our extension provides a consistent control layer.

---

# 9. FEATURE SECTION

Create a polished feature grid.

Core features:

### ⚡ Instant Speed Control

Adjust playback speed instantly.

Support a wide configurable range.

Target a default range such as:

```text
0.05× → 16×
```

However, do not assume every website/player behaves correctly at extreme values.

Gracefully clamp or handle unsupported values.

---

### 🎚 Fine-Grained Speed

Allow users to choose:

* decrease step
* increase step
* exact speed
* custom presets

Example:

```text
0.75×
1×
1.1×
1.25×
1.5×
1.75×
2×
2.5×
3×
4×
8×
16×
```

Users should be able to customize these.

---

### ⌨ Keyboard Shortcuts

Provide configurable shortcuts.

Default suggestion:

```text
A       Decrease speed
D       Increase speed
S       Reset to 1×
Z       Rewind
X       Forward
V       Toggle controller
```

But shortcuts MUST be configurable.

Avoid interfering with websites whenever possible.

Do not intercept keyboard input while the user is typing in:

* input
* textarea
* contenteditable
* search fields

Allow users to disable individual shortcuts.

---

### ⏪ Smart Rewind

Allow configurable rewind duration.

Examples:

```text
5 seconds
10 seconds
15 seconds
30 seconds
```

---

### ⏩ Smart Forward

Same concept for forward seeking.

---

### 📌 Per-Site Speed Memory

Allow:

```text
YouTube → 1.5×
Coursera → 1.75×
Netflix → 1.25×
Everything else → 1×
```

The extension should remember the user's preference by hostname/domain.

Users should be able to:

* enable/disable site memory
* edit saved sites
* delete individual site rules
* clear all rules

---

### 🎯 Default Speed

Allow users to define a global default:

```text
1×
1.25×
1.5×
1.75×
2×
Custom
```

---

### 🎬 Multiple Videos

If a page contains multiple media elements, allow:

```text
Current video
All videos
```

When "All videos" is selected, apply the chosen speed to all controllable media on the page.

---

### 🔄 Dynamic Media Detection

This is extremely important.

Modern websites often load media dynamically.

Use appropriate DOM observation techniques such as `MutationObserver` so newly inserted `<video>` and `<audio>` elements can be detected.

Do not repeatedly scan the entire DOM unnecessarily.

Avoid memory leaks.

---

### 📺 On-Video Controller

Display a small floating controller over supported videos.

Example:

```text
┌──────────────────────────────┐
│       −   1.50×   +          │
└──────────────────────────────┘
```

Hover/click behavior should be configurable.

Allow:

* show always
* show on hover
* auto-hide
* completely disabled

Allow users to reposition it where technically practical.

---

### ⏱ Time Remaining

Calculate approximate remaining viewing time based on playback rate.

Example:

Original:

```text
60 minutes
```

At:

```text
1.5×
```

Approximate remaining playback time:

```text
40 minutes
```

Display this in the popup/controller.

Do not alter the actual media duration.

---

### 📊 Progress Information

Show:

```text
Current position
Remaining time
Playback speed
```

Example:

```text
32:14 / 1:04:20
1.75×
≈ 18:20 remaining
```

---

### 🖼 Picture-in-Picture

Where browser/player capabilities permit it, provide a convenient Picture-in-Picture action.

If PiP is unavailable for the current media, disable the button gracefully.

Never crash.

---

### 🖥 Focus / Theater Mode

If technically possible without fighting the host website, provide a "Focus Mode" or "Player Focus" option that visually emphasizes the current video.

Do not attempt to bypass website restrictions.

---

### 🔊 Audio Support

The extension should support both:

```html
<video>
<audio>
```

The UI should clearly identify whether the current media is video or audio.

---

# 10. OPTIONAL ADVANCED FEATURES

Do not add features merely because they sound impressive.

Only implement features that are technically reliable and genuinely useful.

Potential advanced features:

## Speed Profiles

Allow users to create profiles:

```text
Study
1.5×
10 sec rewind
15 sec forward

Deep Study
1.25×
5 sec rewind

Quick Review
2×
5 sec rewind
```

Users can switch profiles quickly.

---

## Hold-to-Boost

Allow:

> Hold a chosen shortcut → temporarily play at 2× / 4× / 8×.

When released:

> Return to the previous speed.

This should be optional.

---

## Skip Silence

If reliable and technically possible using available media information, consider an optional silence-skipping feature.

IMPORTANT:

Do not implement a CPU-heavy audio-analysis system merely for the sake of having the feature.

If it cannot be implemented efficiently and reliably, leave it as a future feature.

---

## Playback Presets

Allow custom presets.

Example:

```text
My Speeds

0.75×
1×
1.25×
1.5×
1.75×
2×
3×
```

Users can reorder them.

---

# 11. EXTENSION POPUP UI

This is one of the most important parts of the product.

The popup should be compact but powerful.

Recommended structure:

```text
┌─────────────────────────────────┐
│  ⚡ Universal Speed      ⚙  ⋮   │
│                                 │
│  YouTube                        │
│  ───────────────────────────    │
│                                 │
│            1.50×                │
│                                 │
│      −              +           │
│                                 │
│  ━━━━━━━━━●━━━━━━━━━━━━━━       │
│                                 │
│  0.5  1  1.25  1.5  2  3  4    │
│                                 │
│  ↶ 10s       ↷ 10s              │
│                                 │
│  Remaining      ~24:18           │
│                                 │
│  ☑ Remember for this site       │
│                                 │
│  [ Apply to all media ]         │
│                                 │
│  [      Open Side Panel       ] │
└─────────────────────────────────┘
```

Make the interface visually excellent.

Do not cram every feature into the popup.

Use progressive disclosure.

---

# 12. SIDE PANEL

If supported by the browser, create an optional side panel.

The side panel can provide a richer interface than the popup.

Include:

* current page
* detected media
* current media
* speed
* presets
* keyboard shortcuts
* site rule
* settings
* playback information

Example:

```text
CURRENT PAGE

YouTube

Detected Media
● Video 1
○ Video 2

Playback
1.50×

Speed
━━━━━━━━━━━━━━●━━

Quick Speeds
1×  1.25×  1.5×  1.75×  2×

Actions
↶ 10s     ↷ 10s
PiP       Focus

Site Rule
Always use 1.5×
```

---

# 13. OPTIONS / SETTINGS PAGE

Create a complete settings page.

Sections:

## General

* default speed
* default step
* auto-apply
* remember site speed
* show controller
* auto-hide controller

## Speed Presets

Create/edit/delete/reorder presets.

## Keyboard Shortcuts

Allow users to configure:

* increase speed
* decrease speed
* reset
* rewind
* forward
* toggle controller
* temporary boost

Also provide a button explaining that some browser-level shortcuts may need to be changed through the browser's extension shortcut settings.

Do not pretend the extension can override browser-reserved shortcuts.

---

# 14. SITE RULES

Create a site management interface.

Example:

```text
Saved Sites

youtube.com       1.5×
coursera.org      1.75×
vimeo.com         1.25×
example.com       2×
```

Each row should support:

* edit
* disable
* delete

Include:

```text
Add current website
```

---

# 15. MEDIA DETECTION

The extension should detect:

```javascript
HTMLVideoElement
HTMLAudioElement
```

Track:

* playbackRate
* currentTime
* duration
* paused
* volume
* muted
* readyState

Handle:

* dynamically created media
* removed media
* multiple media
* SPA navigation
* changing DOM structures

Avoid attaching duplicate event listeners.

Use a clean internal media registry.

---

# 16. SPA SUPPORT

This is mandatory.

Modern websites often use client-side navigation.

Do not assume:

```text
page load → one video → done
```

Handle navigation where possible.

The extension should continue functioning when the user moves between videos without a full page reload.

---

# 17. SPEED ENFORCEMENT

Some websites may attempt to reset playback speed.

Provide an optional:

```text
Lock playback speed
```

When enabled:

* detect unexpected playback-rate changes
* restore the user's selected rate where technically safe

BUT:

Do not create aggressive infinite loops.

Use a controlled mechanism.

Avoid excessive event listeners or timers.

Provide a clear setting:

```text
☑ Keep my selected speed
```

---

# 18. WEBSITE DESIGN SYSTEM

The website and extension must have a consistent design system.

Use:

* modern typography
* rounded cards
* subtle borders
* restrained shadows
* excellent spacing
* polished hover states
* smooth transitions
* accessible contrast

Avoid:

* excessive gradients
* giant glowing effects
* fake 3D
* excessive animations
* generic AI-looking UI
* clutter

The product should feel like a premium utility.

---

# 19. DARK MODE

Support:

* dark mode
* light mode
* system mode

The extension popup should default to system preference unless the user changes it.

Persist the preference.

---

# 20. ACCESSIBILITY

Accessibility is mandatory.

Support:

* keyboard navigation
* visible focus states
* ARIA labels where needed
* sufficient contrast
* reduced motion preference
* semantic controls
* screen-reader-friendly labels

Do not rely only on icons.

Tooltips should explain unfamiliar controls.

---

# 21. RESPONSIVE WEBSITE

The website must work beautifully on:

* desktop
* laptop
* tablet
* mobile

The extension itself should prioritize compact desktop browser usage.

---

# 22. PRIVACY

Privacy should be a core product principle.

The extension should NOT collect browsing history.

Do not introduce:

* analytics
* trackers
* advertising
* unnecessary external requests
* remote scripts
* unnecessary permissions

Prefer storing settings locally using extension storage.

If sync storage is implemented, make it optional and clearly explain what is synced.

Do not send URLs, browsing history, or media information to a server unless there is a genuine future feature requiring it and the user explicitly opts in.

The homepage should contain a clear privacy section.

---

# 23. MINIMAL PERMISSIONS

Request only permissions actually required by the implementation.

Do NOT blindly request broad permissions just because they are convenient.

Before finalizing `manifest.json`, review every permission.

Explain in README why each permission exists.

Avoid:

```text
<all_urls>
```

unless the actual architecture genuinely requires it.

If broad host permissions are technically necessary for a universal controller, structure the extension so the reason is clear and minimize other permissions.

---

# 24. SECURITY

Do not use:

* remote executable JavaScript
* unsafe dynamic code execution
* `eval`
* unnecessary inline scripts
* unnecessary third-party scripts

Keep the extension compatible with modern extension security policies.

Validate settings before using them.

Do not trust arbitrary DOM attributes or page-provided values.

---

# 25. ERROR HANDLING

The extension must fail gracefully.

Examples:

If no media is detected:

```text
No media detected

Play a video or audio on this page and we'll detect it automatically.
```

If playback rate cannot be changed:

```text
Speed control isn't available for this player.
```

If PiP isn't available:

Disable the button and show:

```text
Picture-in-Picture isn't available for this media.
```

Never show raw JavaScript errors to users.

---

# 26. EXTENSION STATES

Design all important states.

## No Media

```text
No media detected
```

## One Video

Show full controls.

## Multiple Videos

Show media selector.

## Audio

Use audio-oriented UI.

## Unsupported Player

Explain gracefully.

## Loading

Show subtle skeleton/loading state.

## Error

Provide useful recovery instructions.

---

# 27. HOMEPAGE "HOW IT WORKS"

Create a simple three-step section.

### 01 — Install

Install the extension.

### 02 — Open a video

Visit any supported webpage.

### 03 — Control playback

Use the popup, on-video controller, or keyboard shortcuts.

Use visual mockups.

---

# 28. COMPATIBILITY SECTION

Do not claim compatibility with every website.

Instead say something like:

> Works with standard HTML5 video and audio players across the web.

Then explain:

> Some websites use custom, DRM-protected, cross-origin, or otherwise restricted players where browser extensions cannot directly control playback.

This is technically honest.

---

# 29. FAQ

Include questions such as:

### Does it work on YouTube?

It should work with standard HTML5 media on YouTube, subject to changes in the site's player implementation.

### Does it work on online courses?

Yes, when the course player exposes controllable HTML5 media.

### Can I use custom speeds?

Yes.

### Can I remember a different speed for each website?

Yes.

### Does it work with audio?

Yes.

### Does it collect my browsing history?

No, by design.

### Can I use keyboard shortcuts?

Yes, and they are configurable.

### Does it work on Edge?

The extension should be designed for Chromium compatibility and packaged appropriately for Chrome and Edge.

Do not make absolute compatibility promises.

---

# 30. DOWNLOAD / INSTALL EXPERIENCE

The homepage should contain:

```text
Install for Chrome
```

and optionally:

```text
Install for Edge
```

During development, also provide:

```text
Download Extension
```

with instructions for loading the unpacked extension.

Create a dedicated:

```text
/docs/installation
```

or website installation section.

Explain:

### Chrome

1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click Load unpacked
4. Select the extension build directory

### Edge

1. Open `edge://extensions`
2. Enable Developer Mode
3. Choose Load unpacked
4. Select the extension build directory

Make sure these instructions are appropriate for the current browser versions when the documentation is written.

---

# 31. DEVELOPER EXPERIENCE

Create:

```text
README.md
```

with:

* project overview
* architecture
* prerequisites
* installation
* website development
* extension development
* production build
* loading unpacked extension
* Chrome testing
* Edge testing
* troubleshooting
* permissions explanation
* privacy architecture

Example commands:

```bash
npm install
npm run dev
npm run build
npm run build:extension
```

Adapt commands to the actual implementation.

---

# 32. TESTING

Testing is extremely important.

Test at minimum:

### Media

* one video
* multiple videos
* audio
* dynamically inserted video
* SPA navigation
* paused media
* autoplay media

### Speed

* 0.1×
* 0.5×
* 1×
* 1.25×
* 1.5×
* 2×
* 4×
* 8×
* 16×

Do not assume extreme speeds behave identically across browsers.

### Controls

* popup
* keyboard
* on-video controller
* side panel
* settings

### Persistence

* global speed
* site speed
* presets
* theme
* controller preference

### Browser

* Chrome
* Microsoft Edge

---

# 33. PERFORMANCE

The extension must be lightweight.

Avoid:

* continuous DOM polling
* aggressive intervals
* unnecessary React rendering
* repeatedly scanning the entire page
* large dependencies
* expensive observers

Use event-driven approaches wherever possible.

Do not run expensive work on every animation frame unless absolutely necessary.

---

# 34. PRODUCT ANALYTICS

Do NOT implement analytics by default.

This is a privacy-first product.

If analytics architecture is ever added in the future, it should be opt-in and documented.

---

# 35. BRANDING

Choose a professional product name.

Possible working name:

**Speedly**

Alternative:

**FlowSpeed**

Alternative:

**Playback+**

Alternative:

**SpeedPilot**

Pick ONE final name after considering:

* memorability
* simplicity
* extension suitability
* domain availability if researching online
* avoiding obvious trademark conflicts

Do not pretend domain/trademark availability without checking.

Use a simple logo mark such as:

```text
▶ ×
```

or a stylized speed/play symbol.

Do not copy an existing extension's branding.

---

# 36. UI DETAILS

Micro-interactions matter.

Examples:

When increasing speed:

```text
1.25× → 1.50×
```

Use a subtle transition.

When pressing reset:

```text
1.75× → 1.00×
```

Provide visual feedback.

When a site rule is active:

```text
● Site speed: 1.5×
```

When controller is disabled:

```text
Controller hidden
```

Use toast notifications sparingly.

---

# 37. SMART TIME CALCULATOR

Build a small reusable utility.

Given:

```text
duration
currentTime
playbackRate
```

calculate:

```text
remainingRealTime = (duration - currentTime) / playbackRate
```

Display it in a human-friendly format.

Example:

```text
Original remaining: 01:20:00
At 1.5×:            00:53:20
```

This should update efficiently.

---

# 38. ARCHITECTURE

Separate concerns.

Suggested internal architecture:

```text
MediaDetector
      ↓
MediaRegistry
      ↓
PlaybackController
      ↓
SpeedManager
      ↓
SiteRuleManager
      ↓
StorageManager
      ↓
UI
```

The UI should not directly manipulate every video element.

Create reusable services.

---

# 39. STORAGE MODEL

Create a typed storage model similar to:

```typescript
interface UserSettings {
  defaultSpeed: number;
  speedStep: number;
  presets: number[];
  rememberSiteSpeed: boolean;
  showOverlay: boolean;
  autoHideOverlay: boolean;
  theme: "system" | "light" | "dark";
  rewindSeconds: number;
  forwardSeconds: number;
}

interface SiteRule {
  hostname: string;
  enabled: boolean;
  speed: number;
}

interface AppStorage {
  settings: UserSettings;
  siteRules: SiteRule[];
}
```

Adapt the model as needed.

Validate all values.

---

# 40. IMPORTANT EDGE CASES

Handle:

* no media
* media added after page load
* media removed
* multiple videos
* same video moved in DOM
* video replaced by SPA navigation
* player changing playbackRate itself
* invalid custom speed
* negative values
* NaN
* Infinity
* extremely large values
* cross-origin iframe
* inaccessible iframe
* media without duration
* live streams
* autoplay
* muted autoplay
* audio-only elements

Do not crash.

---

# 41. LIVE STREAMS

For live media:

Do not display misleading "time remaining".

Instead show:

```text
LIVE
```

or:

```text
Live playback
```

Speed control should still work where the player permits it.

---

# 42. INTERNATIONALIZATION

Architect the extension so localization can be added later.

Keep user-visible strings centralized.

Do not scatter hard-coded strings everywhere.

English can be the initial language.

---

# 43. NO FAKE FUNCTIONALITY

This is extremely important.

Do NOT create buttons that look functional but do nothing.

Every visible button must either:

1. Work correctly
2. Be clearly marked as unavailable
3. Be omitted

Do not build a fake prototype.

---

# 44. NO HARDCODED DEMO DATA IN THE REAL EXTENSION

The homepage may use mock/demo content for visual presentation.

The actual extension must use real browser media detection and real playback control.

Do not simulate video playback using fake counters.

---

# 45. DEVELOPMENT PHASES

Build in phases.

## Phase 1

Project setup.

## Phase 2

Core media detection.

## Phase 3

Playback speed controller.

## Phase 4

Popup UI.

## Phase 5

Keyboard shortcuts.

## Phase 6

Persistent settings.

## Phase 7

Per-site rules.

## Phase 8

On-video controller.

## Phase 9

Multiple media support.

## Phase 10

Side panel.

## Phase 11

Options/settings page.

## Phase 12

Public website.

## Phase 13

Testing and bug fixing.

## Phase 14

Production polish.

Do not move forward while core functionality is broken.

---

# 46. QUALITY BAR

The final product should feel like:

> A small, extremely polished browser utility that you install once and forget it's there until you need it.

It should be:

* fast
* intuitive
* lightweight
* privacy-friendly
* accessible
* reliable
* visually polished
* technically honest

Do not over-engineer.

Do not add features simply to increase the feature count.

---

# 47. RESEARCH REQUIREMENT

Before making technical assumptions, inspect the current browser-extension environment and official documentation.

Use authoritative sources whenever possible, especially for:

* Chrome Manifest V3
* Chrome extension APIs
* Chrome storage
* Chrome commands
* scripting/content scripts
* side panel
* extension permissions
* Chrome Web Store requirements
* Microsoft Edge extension compatibility

You may also inspect existing speed-controller extensions for UX inspiration.

However:

**Do NOT copy their code, branding, wording, UI, or proprietary implementation.**

Use competitors only to understand common expectations and identify opportunities to improve.

---

# 48. COMPETITIVE DIFFERENTIATION

The product should not merely be:

> "Another speed controller."

Differentiate through:

### 1. Better UX

One consistent interface across websites.

### 2. Site Profiles

Remember exactly how the user likes each website.

### 3. Excellent Keyboard Experience

Fast, configurable controls.

### 4. Time Savings

Clearly show how much viewing time is saved at the selected speed.

Example:

```text
You save ~22 minutes at 1.5×
```

### 5. Clean UI

No clutter.

### 6. Privacy

Local-first architecture.

### 7. Smart Media Detection

Dynamic websites should feel seamless.

---

# 49. "TIME SAVED" FEATURE

This can become one of the product's signature features.

If:

```text
Original duration = 60 minutes
Current speed = 1.5×
```

Show:

```text
You save 20 minutes
```

For a currently watched video:

```text
At 1.5×
~13m saved
```

Be mathematically accurate.

Do not claim time saved from portions the user has already watched incorrectly.

---

# 50. WEBSITE DEMO

Create an interactive fake/demo player on the homepage.

The user should be able to click:

```text
1×
1.25×
1.5×
2×
```

and see:

* speed change
* calculated time remaining
* calculated time saved

This demonstrates the product without requiring the extension.

---

# 51. FINAL DELIVERABLES

At the end, provide:

### Website

```text
website/
```

Production-ready Next.js site.

### Extension

```text
extension/
```

Buildable Chrome/Edge Manifest V3 extension.

### Documentation

```text
README.md
```

Include complete installation and development instructions.

### Build Output

Provide a production extension build that can be loaded through:

```text
chrome://extensions
```

and:

```text
edge://extensions
```

---

# 52. FINAL VERIFICATION CHECKLIST

Before considering the project complete, verify:

* [ ] Website builds successfully
* [ ] Extension builds successfully
* [ ] Manifest is valid
* [ ] No deprecated Manifest V2 APIs
* [ ] Popup opens
* [ ] Media is detected
* [ ] Video speed changes
* [ ] Audio speed changes
* [ ] Increase works
* [ ] Decrease works
* [ ] Reset works
* [ ] Rewind works
* [ ] Forward works
* [ ] Keyboard shortcuts work
* [ ] Settings persist
* [ ] Site-specific speed persists
* [ ] Dynamic videos are detected
* [ ] Multiple videos are handled
* [ ] Controller can be disabled
* [ ] Dark mode works
* [ ] Light mode works
* [ ] No media state works
* [ ] Unsuppo
