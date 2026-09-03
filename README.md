# a p — portfolio

A single-page static site. React + Vite, no other runtime libraries. The masonry
grids, the accordions and the 55-page carousel are all hand-rolled with plain
CSS and React state.

```
npm install
npm run dev      # http://localhost:5173
npm run build    # writes dist/
```

---

## 1. Put your files in place

Everything the site loads lives in `public/works/`. The paths in
`src/data.js` must match the filenames exactly — lowercase, hyphens, no spaces.

```
public/works/
  fanfiction/
    normal.pdf
    epicentre.pdf
  i-give-the-music-to/
    exhibition-view-1.jpg
    exhibition-view-2.jpg
    img-1620.jpg
    lamp.jpg
    letter-to-evan.jpg
  master-thesis/
    flipbook-version.pdf
    extra-cover/
      1.jpg  2.jpg  3.jpg
    scan-livre/
      01.jpg  02.jpg  …  55.jpg
  today-i-dug-a-little-hole/
    exhibition-view-1.jpg
    exhibition-view-2.jpg
    exhibition-view-3.jpg
    img-9151.jpg
    layered-text.jpg
```

### HEIC will not display

`IMG_1620.HEIC` and `IMG_9151.HEIC` cannot be shown by any browser. Convert them
first.

```bash
# macOS, no install needed
sips -s format jpeg IMG_1620.HEIC --out img-1620.jpg

# anywhere, with ImageMagick
magick IMG_1620.HEIC img-1620.jpg
```

### Turning the two PDFs into images

`Extra Cover 1.pdf` (3 pages) and `Scan livre.pdf` (55 pages) are displayed as
images, so export them. `pdftoppm` ships with poppler (`brew install poppler`,
`apt install poppler-utils`).

```bash
# Extra Cover 1.pdf -> 1.jpg 2.jpg 3.jpg
cd public/works/master-thesis/extra-cover
pdftoppm -jpeg -r 200 "Extra Cover 1.pdf" p
for f in p-*.jpg; do mv "$f" "$(echo "${f#p-}" | sed 's/^0*//')"; done

# Scan livre.pdf -> 01.jpg … 55.jpg
cd ../scan-livre
pdftoppm -jpeg -r 150 "Scan livre.pdf" p
for f in p-*.jpg; do mv "$f" "${f#p-}"; done
```

Then shrink them so the page doesn't take a minute to load. 1800px on the long
edge is plenty:

```bash
mogrify -resize 1800x1800\> -quality 82 *.jpg
```

Do the same for the exhibition photographs. Aim for under 500 KB each.

`flipbook version.pdf` stays a PDF — rename it `flipbook-version.pdf` and drop it
in `public/works/master-thesis/`. It is only ever offered as a download.

### If your scans aren't 3:2

The carousel keeps a fixed page box so nothing jumps around as you flip.
Set it to your real proportions in `src/data.js`:

```js
aspect: '3 / 2'   // width / height
```

---

## 2. Write your own words

Open `src/data.js`. Name, role, email, Instagram, bio and every work
description are at the top of the file, in plain text. The placeholder bio and
descriptions are mine, not yours — replace all of them.

To add or reorder works, move the objects in the `works` array. Each work has a
`blocks` array, and each block is one of:

| type | what it renders |
| --- | --- |
| `masonry` | column masonry, 3 wide on desktop, 2 on mobile, click to enlarge |
| `pdf-pair` | two PDFs side by side, each scrolling vertically |
| `row` | images in a flex row on desktop, stacked on mobile |
| `carousel` | one page at a time with prev/next, a scrubber and arrow keys |
| `download` | a download link with a note that appears on hover |

---

## 3. GitHub → Netlify → GoDaddy

```bash
git init
git add .
git commit -m "Portfolio"
git branch -M main
git remote add origin git@github.com:YOURNAME/portfolio.git
git push -u origin main
```

In Netlify: **Add new site → Import an existing project → GitHub**, pick the repo.
`netlify.toml` already sets the build command (`npm run build`) and the publish
directory (`dist`), so accept the defaults and deploy.

Then **Domain management → Add a custom domain**, enter your GoDaddy domain.
Netlify will show you the exact records to create. The usual pair, added in
GoDaddy under **My Products → DNS**:

- `A` record, host `@`, value `75.2.60.5`
- `CNAME` record, host `www`, value `your-site-name.netlify.app`

Delete GoDaddy's default parking `A` record for `@` first, or the two will
fight. DNS takes anywhere from ten minutes to a few hours. Once it resolves,
turn on **Force HTTPS** in Netlify.

If your images total more than about 100 MB, git will start complaining. Compress
harder before you reach for Git LFS — Netlify does not handle LFS on the free
plan.

---

## Notes

- Only one accordion is open at a time. To open the first work by default,
  change `useState(null)` to `useState(works[0].id)` in `src/App.jsx`.
- Century Gothic is not a web font. The site uses it when the visitor has it
  installed and falls back to Questrial, which is very close. If you want the
  same face for everyone, buy a licensed webfont and add an `@font-face` rule.
- iOS Safari will not scroll a PDF embedded in a page. The Fanfiction accordion
  shows an "open full size" link for exactly that reason.
- The logo re-rolls its rotation, size and ink texture on every page load.
