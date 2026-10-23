# Bonnie's radio (YouTube) — how a station or channel gets added

Everything for Bonnie's radio lives in this folder:

| File | What it is |
| --- | --- |
| `channels.json` | The registry: one entry per playlist or channel. Edit this. |
| `_yt_music.py` | Build step, called once from `_generator.py`. Keeps only approved, age-checked entries. |
| `stations.js` | Generated from `channels.json`. Never edit by hand. |
| `bonnie-radio.js` / `.css` | The play button, the genre dial and the mini-player. The site's ONE dial: the home page and the Music Playground both mount it. |

Nothing here uses a YouTube API key or an account. Playlists must be **Public** or **Unlisted** (Private ones can't play in
an embedded player). A **channel** plays through its uploads playlist: `UU` + the channel id without its leading `UC`
(the build does this for you).

## Adding a channel or playlist (Simmie)
1. Copy the id from the real YouTube page. **Never guess or make up an id.**
   - Playlist: the part after `list=` in the playlist link (often starts `PL`).
   - Channel: the channel id, which starts `UC` (from the channel's About page, "Share channel", "Copy channel ID").
2. Add ONE entry to `entries` in `channels.json`:
   ```json
   {
     "id": "short-unique-slug",
     "name": "Artist or playlist name",
     "type": "channel",
     "youtubeId": "UC...",
     "genres": ["indie-local", "acoustic"],
     "note": "Why it fits: where they're from, what it sounds like, clean lyrics checked on which songs.",
     "addedBy": "Simmie",
     "approvedByDad": false,
     "ageCheck": { "madeForKids": null, "ageSuitable": null, "checkedBy": null, "checkedOn": null, "how": "" },
     "addedOn": "YYYY-MM-DD"
   }
   ```
   `genres` uses the keys in the `genres` list: `pop`, `indie-local`, `lofi`, `rock`, `hiphop`, `electronic`, `acoustic`,
   `chill` (plus `main` for Bonnie's own playlist). Every approved channel also joins the **Indie / Local** station.
3. **Dad approves**: Dad listens, then sets `"approvedByDad": true` and fills `ageCheck`: either
   `"madeForKids": true` (YouTube's own label) or `"ageSuitable": true` after checking, plus `checkedBy` and `checkedOn`
   and a short `how`. An entry without both approval and a passed age check is never loaded.
4. **Regenerate**: from the site folder run `python3 _generator.py`. It rewrites `stations.js` (approved entries only) and
   the pages.

## Rules
- No social features: no comments, likes, subscribe buttons, chat, links to contact anyone.
- One player on the page, visible (200x200 minimum), nothing over it, only after a press, paused when the page is hidden.
- Placeholders (`REPLACE_WITH_...`) are skipped automatically, so it's safe to leave them until real ids arrive.

## Slots still waiting for real ids
`bonnie-main` (Bonnie's playlist) and the eight station slots `slot-pop`, `slot-indie-local`, `slot-lofi`, `slot-rock`,
`slot-hiphop`, `slot-electronic`, `slot-acoustic`, `slot-chill`. There are no real indie channels yet.

URL test overrides (`?list=`, `?genrelist=`) were removed before going live (24 Oct 2026): only ids in `stations.js` can ever load. To test, use a local copy with a temporary approved entry and never commit it.
