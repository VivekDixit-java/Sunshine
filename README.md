# Sunshine — our story

A private, cinematic love-story website for Shagun, from Vivek.
A love story in seven years and one monsoon night.

## How to open it

Double-click **`index.html`**. It opens in your browser. That's it, no install,
no build step, no internet needed (the only online part is the fonts, which fall
back gracefully offline).

For the smoothest experience (so photos load reliably), you can optionally run a
tiny local server from this folder:

```
# if you have Python installed:
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

## Add your photos

Go to `assets/photos/` and read the `README.md` there. It lists the exact
filename for each photo slot. Save your pictures with those names and refresh.
Until then, each slot shows a gold-star placeholder, nothing breaks.

## The chapters

1. **Hero** — "You water me, and I water you."
2. **Two Strangers** — Snapchat, Feb 2019.
3. **The Seven Years** — a timeline of staying, drifting, and coming back.
4. **The Almost** — the meetings that didn't happen, "very soon."
5. **Mumbai** — the airport gate, the rain, the ATM shed, the confession, the kiss.
6. **Now** — she is your sukoon, a photo gallery.
7. **The Promise** — a love letter and a promise for the future.

## Edit the words

All the text lives in `index.html` as plain, readable HTML. Search for any
sentence and change it, the love letter is near the bottom in the
`class="love-letter"` block. Save and refresh.

## Background music (mini player)

There's a small music player fixed to the bottom-right corner with:
- a **play / pause** button,
- the **song title**,
- a **mute / unmute** button.

To enable it, drop an MP3 here:

```
assets/audio/ambience.mp3
```

Then it plays softly (with a gentle fade) and loops. If there's no file, the
player just shows "add a song file" and does nothing else.

**When does it start?** Browsers block audio until the visitor interacts, so it
can't auto-play on load. It tries to start the moment she taps **"Open our
story"** at the end of the quiz (that tap counts), and she can always use the
play button afterwards.

**Change the song name shown:** open `index.html`, find
`id="playerTitle"` and edit the text (currently `Yellow — Coldplay`).

**Use a track you own or have the right to use** — this is a private page, so a
personal-use copy is fine.

## Privacy

100% local and static. No analytics, no uploads, no third-party hosting.
Your photos and your story never leave your machine.

## Files

```
index.html            the whole site (text + structure)
assets/css/style.css  all the styling
assets/js/main.js     rain effect, scroll reveals, lightbox, music toggle
assets/photos/        your photos (+ a README with the filename map)
assets/audio/         optional ambience.mp3
```
