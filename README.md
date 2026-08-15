# Caprio & Co — Website

Static website for Caprio & Co, metal exporter and supplier (Ferro Titanium, ferro alloys, industrial scrap, titanium alloy products).

Plain HTML, CSS and JavaScript. No build step, no dependencies, no npm install. Open it in a browser and it works.

---

## What's in here

```
caprio-and-co/
├── index.html            Home
├── products.html         All 19 products, filterable by category
├── product.html          Product detail — one page serves all 19 (?p=slug)
├── about.html            About Us
├── contact.html          Simple contact form (name, company, email, phone, message)
├── quote.html            Request a Quote — full form with grade/quantity/destination
├── 404.html              Not-found page
├── assets/
│   ├── css/styles.css    Entire design system
│   ├── js/products.js    ← ALL PRODUCT CONTENT LIVES HERE
│   ├── js/site.js        Navigation, rendering, form handling
│   └── img/
│       ├── site/         Logo + page photography
│       └── products/     One photo per product
├── vercel.json           Caching + security headers
├── robots.txt
└── sitemap.xml
```

**The one file to remember: `assets/js/products.js`.** Every product name, description, grade, form and packaging line lives there. Edit that one file and all three pages (home, products, product detail) update themselves. You never touch HTML to add a product.

---

## Step 1 — Open it in VS Code

1. Download and unzip the project folder.
2. Open VS Code → **File → Open Folder** → select `caprio-and-co`.
3. Install the extension **Live Server** (by Ritwick Dey) from the Extensions panel.
4. Right-click `index.html` → **Open with Live Server**.

The site opens at `http://127.0.0.1:5500` and reloads every time you save. Work this way while editing — don't double-click the HTML files directly, because `file://` blocks some browser features.

---

## Step 2 — Add the product photos

The site ships with generated metallic swatches so nothing looks broken. The moment you drop a real photo in, it takes over automatically — no code change needed.

**Naming is the whole trick.** Save each photo as `.jpg` into `assets/img/products/` using exactly these filenames.

**Ferro Alloys** products show a 3-photo carousel on their detail page — save three files per product, numbered `-1`, `-2`, `-3`:

| Files to create | Product |
|---|---|
| `ferro-titanium-1.jpg` / `-2.jpg` / `-3.jpg` | Ferro Titanium |
| `ferro-molybdenum-1.jpg` / `-2.jpg` / `-3.jpg` | Ferro Molybdenum |
| `ferro-nickel-1.jpg` / `-2.jpg` / `-3.jpg` | Ferro Nickel |
| `ferro-tungsten-1.jpg` / `-2.jpg` / `-3.jpg` | Ferro Tungsten |
| `ferro-silicon-magnesium-1.jpg` / `-2.jpg` / `-3.jpg` | Ferro Silicon Magnesium |
| `high-carbon-ferro-manganese-1.jpg` / `-2.jpg` / `-3.jpg` | High Carbon Ferro Manganese |
| `low-carbon-ferro-manganese-1.jpg` / `-2.jpg` / `-3.jpg` | Low Carbon Ferro Manganese |

**Scrap** products show a 2-photo carousel — numbered `-1`, `-2`:

| Files to create | Product |
|---|---|
| `titanium-scrap-1.jpg` / `-2.jpg` | Titanium Scrap |
| `nickel-alloy-scrap-1.jpg` / `-2.jpg` | Nickel Alloy Scrap |
| `stainless-steel-scrap-1.jpg` / `-2.jpg` | Stainless Steel Scrap |
| `super-alloy-scrap-1.jpg` / `-2.jpg` | Super Alloy Scrap |

**Titanium Products** (pipes & tubes) also show a 3-photo carousel — numbered `-1`, `-2`, `-3`:

| Files to create | Product |
|---|---|
| `inconel-pipes-tubes-1.jpg` / `-2.jpg` / `-3.jpg` | Inconel Pipes & Tubes |
| `monel-pipes-tubes-1.jpg` / `-2.jpg` / `-3.jpg` | Monel Pipes & Tubes |
| `hastelloy-pipes-tubes-1.jpg` / `-2.jpg` / `-3.jpg` | Hastelloy Pipes & Tubes |
| `cupro-nickel-alloy-pipes-tubes-1.jpg` / `-2.jpg` / `-3.jpg` | Cupro Nickel Alloy Pipes & Tubes |
| `nickel-alloy-pipes-tubes-1.jpg` / `-2.jpg` / `-3.jpg` | Nickel Alloy Pipes & Tubes |
| `duplex-steel-pipes-tubes-1.jpg` / `-2.jpg` / `-3.jpg` | Duplex Steel Pipes & Tubes |
| `super-duplex-steel-pipes-tubes-1.jpg` / `-2.jpg` / `-3.jpg` | Super Duplex Steel Pipes & Tubes |
| `titanium-alloy-pipes-tubes-1.jpg` / `-2.jpg` / `-3.jpg` | Titanium Alloy Pipes & Tubes |

The product grid (home page, catalogue, related-products rail) always shows photo `-1` as the card thumbnail; the full carousel only appears on that product's own detail page. To change how many photos a category carries, edit `galleryCount` on that category in `assets/js/products.js`.

And into `assets/img/site/`:

| File | Used for |
|---|---|
| `bg-home.jpg` | Full-page background photo behind the green tint on the **Home** page |
| `bg-products.jpg` | Full-page background photo behind the green tint on the **Products** page |
| `bg-ti-grades.jpg` | Full-page background photo behind the green tint on the **Ti Grades** page |
| `bg-about.jpg` | Full-page background photo behind the green tint on the **About Us** page |
| `plant.jpg` | Home page "About Caprio & Co" preview image |
| `about.jpg` | About page body image |
| `handshake.jpg` | Contact page header, "Why choose us" |
| `logistics.jpg` | The green call-to-action bands — port, container ship or loading dock |
| `logo.jpg` | Already in place. Replace with a transparent **PNG** named `logo.png` when you have one, then search-replace `logo.jpg` → `logo.png` across the HTML files. |

The four `bg-*.jpg` files sit *behind* the site's usual dark-green gradient wash (defined in `assets/css/styles.css` under "Per-page background photo") — so pick photos with enough contrast and darkness that white text stays readable over them; the gradient darkens them further but doesn't fully obscure a very bright photo. Contact, Quote and the 404 page don't have a background photo assigned and will keep the plain green gradient unless you add one — see that CSS section to wire up a fifth page the same way.

**Photo specs:** product images square-ish, around 900 × 700 px. Page photography landscape, around 1920 × 1080. Compress every file at [squoosh.app](https://squoosh.app) before adding it — aim for under 200 KB each, or the site will load slowly on a buyer's phone.

**Where to get them:** Pexels, Unsplash and Pixabay are free for commercial use. Search terms that work well: "molten steel", "steel mill", "metal powder", "stainless steel pipes", "scrap metal yard", "cargo port containers". Do not pull images from a competitor's website — that is copyright infringement and it happens to be easy to detect.

---

## Step 3 — Make the quote form actually send email

Right now the form opens the sender's email app with everything pre-filled. That works, but it's better if enquiries land in your inbox automatically.

1. Sign up free at [formspree.io](https://formspree.io) using `caprioandco@gmail.com`.
2. Create a new form. Copy the endpoint URL — it looks like `https://formspree.io/f/xxxxxxx`.
3. Open `assets/js/site.js`. At the top, find:
   ```js
   formEndpoint: "",
   ```
   Paste your URL between the quotes:
   ```js
   formEndpoint: "https://formspree.io/f/xxxxxxx",
   ```
4. Save. Submitted enquiries now arrive by email, and the form shows a success message instead of opening a mail app.

The free tier covers 50 submissions a month, which is plenty to start.

---

## Step 4 — Put it on GitHub

Install [Git](https://git-scm.com/downloads) first if you don't have it, and create a free account at [github.com](https://github.com).

**The easy way (VS Code, no terminal):**

1. In VS Code, click the **Source Control** icon in the left sidebar (branching-lines icon).
2. Click **Initialize Repository**.
3. Type a message like `Initial website build` in the box, click **Commit**.
4. Click **Publish Branch** → choose **Publish to GitHub private repository** → name it `caprio-and-co`.

That's it. Private is the right choice — it keeps the source private while the live site stays public.

**The terminal way,** if you prefer it. Open VS Code's terminal (`Ctrl+~` / `Cmd+~`) and run:

```bash
git init
git add .
git commit -m "Initial website build"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/caprio-and-co.git
git push -u origin main
```

---

## Step 5 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Sign up** → **Continue with GitHub**.
2. Click **Add New → Project**.
3. Find `caprio-and-co` in the list → **Import**.
4. Leave every setting at its default. Framework Preset will say **Other**; that's correct — there's nothing to build. Do not fill in a build command.
5. Click **Deploy**.

About 30 seconds later you get a live URL like `caprio-and-co.vercel.app`. Share it, test it on your phone.

**From now on, deploying is automatic.** Edit a file → commit → push, and Vercel rebuilds within a minute. You never touch the Vercel dashboard again.

---

## Step 6 — Connect your own domain

1. Buy `caprioandco.com` (or `.in`) from GoDaddy, Namecheap or BigRock. Expect roughly ₹800–1,500 a year.
2. In Vercel: your project → **Settings → Domains** → type the domain → **Add**.
3. Vercel shows the DNS records to create. Log into your domain registrar, find DNS management, and add them:
   - An **A record** for `@` pointing to Vercel's IP address
   - A **CNAME record** for `www` pointing to `cname.vercel-dns.com`
4. Wait. DNS propagation takes anywhere from ten minutes to a few hours.

HTTPS is issued automatically and free. Once the domain is live, update the `https://www.caprioandco.com` URLs inside `sitemap.xml`, `robots.txt`, and the `canonical` and `og:` tags at the top of each HTML file so search engines index the right address.

---

## Step 7 — Get found on Google

1. **Google Search Console** → add your domain → verify → submit `https://yourdomain.com/sitemap.xml`.
2. **Google Business Profile** → create a listing for the Mumbai office. For a supplier whose buyers search locally, this matters more than anything else on this list.
3. Add the site to your IndiaMART and TradeIndia listings, and to your email signature.

---

## Editing content later

**Change a product description, grade or packaging:** open `assets/js/products.js`, find the product, edit the text between the quotes. Save.

**Add a new product:** copy an existing block in `products.js`, paste it inside the same category, change the fields. The `slug` must be lowercase with hyphens and no spaces — it becomes the page URL and the image filename. Then add `assets/img/products/your-new-slug.jpg`.

**Remove a product:** delete its block, from the opening `{` to the closing `},`.

**Feature a product on the homepage:** add `featured: true,` to it. Remove the line to un-feature it. The homepage shows up to eight.

**Change a phone number or email:** they appear in the footer of each HTML file and in the `SITE` block at the top of `site.js`. Use VS Code's **Edit → Replace in Files** (`Ctrl+Shift+H`) to change them everywhere at once.

**Change a brand colour:** open `assets/css/styles.css`. The first block at the top holds every colour in the site. Change `--green` and it updates site-wide.

**Careful with:** the header and footer are repeated in all six HTML files. If you change a nav link, change it in all six. Search-and-replace across files is your friend.

---

## Design reference

| | |
|---|---|
| Primary green | `#0F7B4D` |
| Bright green (hover, accents) | `#17A265` |
| Black | `#0A0A0A` |
| Metallic silver | `#BFC5CC` |
| Page background | `#F1F4F3` |
| Display typeface | Archivo |
| Body typeface | Inter |
| Specification codes | JetBrains Mono |

Light-mode pages with a dark industrial hero, heavy glass blur panels, rounded corners, sticky header. Grade and standard codes are set in a monospaced face on a stamped-metal "spec plate" — the detail that makes the site read as a technical supplier rather than a generic corporate template.

Accessibility and quality floor: keyboard focus is visible throughout, reduced-motion preferences are respected, product images carry alt text, the layout works down to 360 px wide, and pages print cleanly.
