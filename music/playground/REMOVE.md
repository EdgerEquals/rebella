# Removing the Music Playground
1. Delete the `music/playground/` folder.
2. Run `python3 _generator.py`.
The hook line in `_generator.py` (marked `MUSIC PLAYGROUND hook`) skips itself when the folder is missing; delete that one line too for a clean file. The Music section itself is unaffected (see `music/REMOVE.md`).
The shared genre dial (`music/youtube/`), help orb (`js/help-orb.js`) and the Playground entries in `help.json` are used by other pages and stay; the Playground keys in `help.json` can be deleted if you like.
