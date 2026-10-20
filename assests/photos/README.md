# Your photos

Good news: your real photos are **already placed** in the slots below (I matched
them from the ones you sent). The site uses these filenames, so if you ever want
to swap a photo, just overwrite the file of the same name and refresh.

**One slot is still a placeholder on purpose:** `mumbai-kiss.jpg` (the final,
intimate forehead-kiss reveal). I left that for you to drop in yourself, since
it's a personal choice. Save your chosen photo as `mumbai-kiss.jpg` in this
folder and it will appear as the closing image of the Mumbai chapter.

No code changes needed. Overwrite a file, refresh the page, done.

> Tip: keep images reasonably sized (under ~1.5 MB each) so the page loads fast,
> especially on her phone. JPG is perfect.

---

## The filenames (save your photos as these)

### Opening "this is us" (Chapter 1)
| Filename        | Which photo                                             |
|-----------------|---------------------------------------------------------|
| `vivek.jpg`     | A good solo portrait of **you** (portrait orientation)  |
| `shagun.jpg`    | A good solo portrait of **Shagun** (portrait)           |

### Mumbai — the climax (Chapter 4)
| Filename                  | Which photo                                               |
|---------------------------|-----------------------------------------------------------|
| `mumbai-together-1.jpg`   | The best photo of **you two together** at Marine Drive    |
| `mumbai-1.jpg`            | A Marine Drive night shot (sea wall / city lights)        |
| `mumbai-2.jpg`            | Another Marine Drive night shot                           |
| `mumbai-3.jpg`            | Another Marine Drive night shot                           |
| `mumbai-rain-walk.jpg`    | The rainy-walk selfie (the two of you on the promenade)   |
| `mumbai-kiss.jpg`         | The tender forehead-kiss photo (the final reveal)         |

### "Now" gallery (Chapter 5)
| Filename         | Which photo                        |
|------------------|------------------------------------|
| `together-1.jpg` | A favourite photo of you together  |
| `shagun-1.jpg`   | Shagun (e.g. yellow suit)          |
| `shagun-2.jpg`   | Shagun (e.g. red saree)            |
| `shagun-3.jpg`   | Shagun (e.g. green saree / mural)  |
| `vivek-1.jpg`    | You (any favourite solo shot)      |
| `together-2.jpg` | Another photo of you together      |

---

## Want to add more photos to the gallery?

Open `index.html`, find the `<div class="gallery" ...>` block in Chapter 5,
and copy a line like this, pointing to your new file:

```html
<figure class="g-item"><img src="assets/photos/my-new-photo.jpg" alt="us" loading="lazy" /></figure>
```

## Privacy

Everything stays on your computer. Nothing is uploaded anywhere, no analytics,
no third-party hosting. These photos and this story are just yours.
