# SpeedPilot — Manual Test Plan

Run through this after any change to `extension/`, before considering it done.
There's no automated browser suite (see README) so this is what stands in for
one. Load `extension/dist` as unpacked in both Chrome and Edge first — see
README's "Loading the unpacked extension".

Suggested test pages: a plain `<video>` on a local HTML file, a YouTube video,
a page with two `<video>` elements, a podcast/audio page, and a live stream if
you have one handy.

## Media detection

- [ ] Single `<video>` on a static page is detected on load
- [ ] `<audio>`-only page is detected and popup shows the "Audio" badge
- [ ] A `<video>` inserted into the DOM *after* page load (e.g. an SPA route
      change) is detected without a page refresh
- [ ] A page with two videos shows a media selector in the popup/side panel
- [ ] Removing a video from the DOM stops it appearing in the popup on next open
- [ ] A paused video (never played) still appears and is controllable
- [ ] An autoplay / muted-autoplay video is detected and controllable
- [ ] A live stream shows a "LIVE" badge and no misleading remaining time

## Speed values

For each of `0.1×, 0.5×, 1×, 1.25×, 1.5×, 2×, 4×, 8×, 16×`:
- [ ] Setting it from the popup applies and the video visibly changes rate
- [ ] The popup's displayed value matches the video's actual `playbackRate`
      after setting it (some players/extreme values may clamp — the display
      should reflect what the browser actually accepted, not the requested value)
- [ ] No console errors are thrown at any of these values

## Controls

- [ ] Popup: +/− buttons, slider, and presets all change speed correctly
- [ ] Popup: rewind/forward buttons seek by the configured number of seconds
- [ ] Popup: "Apply to all media" changes every detected element, only enabled
      when there's more than one
- [ ] Popup: "Remember for this site" checkbox creates/removes a site rule
- [ ] On-video controller: appears/hides per the configured mode (always /
      hover / auto-hide / disabled)
- [ ] On-video controller: +/− buttons work and track the live speed value
- [ ] Keyboard shortcuts (A/D/S/Z/X/V defaults): each one works on the page
- [ ] Keyboard shortcuts do **not** fire while focus is in a text input,
      textarea, or contenteditable element on the page
- [ ] Side panel opens via the popup button, shows the same media, and stays
      in sync when you switch tabs
- [ ] Side panel: Picture-in-Picture button works when supported, and is
      disabled (not broken) when it isn't
- [ ] Side panel: Focus mode dims the rest of the page without visibly
      breaking the host page's own layout
- [ ] Options page: every field persists after reload (close and reopen the
      Settings tab)
- [ ] Popup and side panel show a "Position" line (`current / total`) alongside
      "Remaining", not just the remaining estimate
- [ ] When a site rule is active, the popup/side panel show a
      "● Site speed: X×" indicator, not just the checkbox state
- [ ] Pressing the toggle-controller shortcut (default `V`) shows a brief
      on-page "Controller shown"/"Controller hidden" toast
- [ ] Toggling "Remember for this site" in the popup shows a brief confirmation
      toast
- [ ] The on-video controller (pill) can be dragged to a new spot by its body
      (not its −/+ buttons) and stays there across a page reload
- [ ] Moving the cursor from the video onto the now-visible pill (in "on hover"
      mode) does **not** immediately hide the pill — you can reach its buttons
- [ ] Settings → "Reset position" puts the on-video controller back at its
      default corner
- [ ] Settings → Speed Presets: the ◀/▶ arrows reorder a preset, and the new
      order is reflected immediately in the popup and side panel

## Persistence

- [ ] Global default speed persists across browser restarts
- [ ] A site-specific rule is re-applied automatically on returning to that site
- [ ] Custom presets persist and appear in both the popup and side panel
- [ ] Theme choice (system/light/dark) persists across popup/options/side panel
- [ ] On-video controller visibility preference persists

## Edge cases

- [ ] Entering an invalid custom speed (negative, letters, blank) doesn't
      corrupt stored settings or crash any surface
- [ ] "Keep my selected speed" (lock) restores the rate if the host page
      resets it, without looping or pegging the CPU
- [ ] A same-origin iframe's video is detected; a cross-origin iframe's video
      is silently skipped (no error, no crash)
- [ ] Opening the popup on a page with no media shows the empty state, not a
      blank panel or console error
- [ ] Opening the popup on a restricted page (e.g. a `chrome://` URL) shows
      the "not available here" state, not a hang
- [ ] The popup/side panel never hang indefinitely waiting on a response from
      the background relay — they resolve to a real state (media found, empty,
      or unsupported) within a second or two, every time

## Cross-browser

- [ ] Everything above holds in Chrome
- [ ] Everything above holds in Edge
