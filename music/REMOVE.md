# Removing the Music section

Everything for the Music section lives in this `music/` folder. It touches the rest of the site in exactly three places, all added by the generator hook: one **Music** link (the mint pill in the main nav bar, and the same link in the phone menu drawer), one small **"New: Music"** teaser on the home page (just above "Make a mood board"), and one entry in `sitemap.xml`.

## Option 1: switch it off (keeps the files)
1. In `_generator.py`, change `MUSIC_SECTION=True` to `MUSIC_SECTION=False`.
2. Run `python3 _generator.py`.

The nav link, teaser and sitemap entry disappear, and every other page goes back to exactly what it was without the section (checked: with the flag off the generator output is byte-identical to `main`). `music/index.html` stays on disk and reachable by its direct URL until you also delete the folder.

## Option 2: take it out completely
1. Delete the `music/` folder.
2. In `_generator.py`, delete the two lines that mention `MUSIC_SECTION` (the flag near `UPDATED=` and the `if MUSIC_SECTION:` hook just above `os.makedirs`).
3. Run `python3 _generator.py`.

Nothing else references the section.
