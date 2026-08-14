/* ==========================================================================
   CAPRIO & CO — SITE SCRIPT
   Depends on products.js being loaded first.
   ========================================================================== */

/* -------------------------------------------------------------- CONFIG */
const SITE = {
  phone1: "+919004397801",
  phone2: "+919082236878",
  wa1: "919004397801",
  wa2: "919082236878",
  email1: "caprioandco@gmail.com",
  email2: "caprioandco2022@gmail.com",
  /* Paste your Formspree endpoint here to make the form send real emails.
     Get it free at formspree.io — see README, Step 7. */
  formEndpoint: "",
};

const ICONS = {
  check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  chevronLeft: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 6 9 12 15 18"/></svg>',
  chevronRight: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>',
};

/* ------------------------------------------------------------- HELPERS */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function catName(id) {
  const c = CATEGORIES.find((c) => c.id === id);
  return c ? c.name : id;
}

function esc(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[m]));
}

function galleryCount(p) {
  const c = CATEGORIES.find((c) => c.id === p.category);
  return (c && c.galleryCount) || 1;
}

/* Product image block — uniform striped glass placeholder everywhere.
   When a real photo exists at assets/img/products/<file> it loads on
   top and the placeholder is hidden. If the file is missing, the <img>
   removes itself and the placeholder stays visible instead.
   Photos are shown in full (object-fit: contain) rather than cropped,
   since source photos won't all share the same dimensions — any empty
   letterbox space around a photo shows the panel's own glass tint.
   Categories with multiple gallery photos (see CATEGORIES.galleryCount)
   are represented here by their first photo, <slug>-1.jpg. */
function mediaHTML(p, opts = {}) {
  const { prefix = "", dims = "" } = opts;
  const file = galleryCount(p) > 1 ? `${p.slug}-1.jpg` : `${p.slug}.jpg`;
  const label = dims ? `${file}<br>${dims}` : file;
  return `
    <div class="imgph" aria-hidden="true"><span>${label}</span></div>
    <img src="${prefix}assets/img/products/${file}"
         alt="${esc(p.name)}" loading="lazy" decoding="async"
         onload="this.previousElementSibling.style.display='none'"
         onerror="this.remove()">
  `;
}

/* Product detail hero — a real photo carousel for categories with more
   than one gallery image (Ferro Alloys: 3, Scrap: 2), reading files
   named <slug>-1.jpg, <slug>-2.jpg, etc. Falls back to the single
   mediaHTML() image for categories with just one photo. */
function carouselHTML(p, opts = {}) {
  const count = galleryCount(p);
  if (count <= 1) return mediaHTML(p, opts);

  const { dims = "" } = opts;
  const slides = Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    const file = `${p.slug}-${n}.jpg`;
    const label = dims ? `${file}<br>${dims}` : file;
    return `
      <div class="carousel__slide" data-i="${i}">
        <div class="imgph" aria-hidden="true"><span>${label}</span></div>
        <img src="assets/img/products/${file}" alt="${esc(p.name)} — photo ${n}"
             loading="lazy" decoding="async"
             onload="this.previousElementSibling.style.display='none'"
             onerror="this.remove()">
      </div>`;
  }).join("");

  const dots = Array.from({ length: count }, (_, i) =>
    `<button class="carousel__dot${i === 0 ? " is-active" : ""}" type="button" data-i="${i}" aria-label="Show photo ${i + 1}"></button>`
  ).join("");

  return `
    <div class="carousel">
      <div class="carousel__track">${slides}</div>
      <button class="carousel__btn carousel__btn--prev" type="button" aria-label="Previous photo">${ICONS.chevronLeft}</button>
      <button class="carousel__btn carousel__btn--next" type="button" aria-label="Next photo">${ICONS.chevronRight}</button>
      <div class="carousel__dots">${dots}</div>
    </div>`;
}

/* Thumbnail strip — the same photos as the carousel (<slug>-1.jpg,
   -2.jpg, ...) as small clickable squares, captioned from p.gallery when
   available. Renders nothing for single-photo categories, and nothing
   for Titanium Products (carousel only, no thumbs, for that category).
   Targets the standalone #pdp-thumbs element already present in the
   page markup. */
function thumbsHTML(p) {
  const count = galleryCount(p);
  if (count <= 1 || p.category === "titanium-products") return "";
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    const file = `${p.slug}-${n}.jpg`;
    const caption = (p.gallery && p.gallery[i]) || `Photo ${n}`;
    return `
      <button class="pdp__thumb glass${i === 0 ? " is-active" : ""}" type="button" data-i="${i}" aria-label="Show photo ${n}">
        <div class="imgph imgph--thumb" aria-hidden="true"></div>
        <img src="assets/img/products/${file}" alt="${esc(p.name)} — photo ${n}"
             loading="lazy" decoding="async"
             onload="this.previousElementSibling.style.display='none'"
             onerror="this.remove()">
        <span>${esc(caption)}</span>
      </button>`;
  }).join("");
}

/* Wires up the prev/next buttons, dots and thumbnail strip for the
   carousel rendered by carouselHTML()/thumbsHTML(). Safe to call even
   when no carousel is present. */
function initCarousel() {
  const car = $(".carousel", $("#pdp"));
  if (!car) return;

  const track = $(".carousel__track", car);
  const slides = $$(".carousel__slide", car);
  const dots = $$(".carousel__dot", car);
  const thumbs = $$(".pdp__thumb");
  let index = 0;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle("is-active", di === index));
    thumbs.forEach((t, ti) => t.classList.toggle("is-active", ti === index));
  }

  const prev = $(".carousel__btn--prev", car);
  const next = $(".carousel__btn--next", car);
  if (prev) prev.addEventListener("click", () => goTo(index - 1));
  if (next) next.addEventListener("click", () => goTo(index + 1));
  dots.forEach((d) => d.addEventListener("click", () => goTo(Number(d.dataset.i))));
  thumbs.forEach((t) => t.addEventListener("click", () => goTo(Number(t.dataset.i))));
}

function cardHTML(p, prefix = "") {
  const tag = p.specCodes.join(" · ");
  return `
  <a class="pcard glass" href="${prefix}product.html?p=${p.slug}" data-reveal>
    <div class="pcard__media">
      ${mediaHTML(p, { prefix })}
      <span class="pcard__cat">${esc(catName(p.category))}</span>
    </div>
    <div class="pcard__body">
      <h3>${esc(p.name)}</h3>
      <p class="pcard__desc">${esc(p.short)}</p>
      <div class="pcard__tag">${esc(tag)}</div>
      <div class="pcard__foot">
        <span class="pcard__link">View details</span>
        <span class="pcard__arrow" aria-hidden="true">${ICONS.arrow}</span>
      </div>
    </div>
  </a>`;
}

/* ------------------------------------------------------------- HEADER */
function initHeader() {
  const header = $(".header");
  const burger = $(".burger");
  const drawer = $(".drawer");

  if (header) {
    const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (burger && drawer) {
    const toggle = (open) => {
      burger.setAttribute("aria-expanded", String(open));
      drawer.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    };
    burger.addEventListener("click", () =>
      toggle(burger.getAttribute("aria-expanded") !== "true")
    );
    drawer.addEventListener("click", (e) => {
      if (e.target.closest("a")) toggle(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") toggle(false);
    });
  }

  /* Mark the current page in the nav */
  const path = location.pathname.split("/").pop() || "index.html";
  $$(".nav__link, .drawer a[data-nav]").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;
    const target = href.split("?")[0].split("#")[0];
    if (target === path || (path === "product.html" && target === "products.html")) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    }
  });
}

/* ------------------------------------------------------- PRODUCTS MENU
   Hover flyout under the "Products" nav link — categories and every
   product, read straight from products.js so it never drifts out of
   sync with the catalogue. Clicking "Products" itself still goes to
   products.html as normal; this is purely an additional hover reveal. */
function initProductsMenu() {
  const menu = $("#products-menu");
  if (!menu) return;
  const chevron = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>';
  menu.innerHTML = CATEGORIES.map((cat) => {
    const items = PRODUCTS.filter((p) => p.category === cat.id)
      .map((p) => `<a class="navmenu__link" href="product.html?p=${p.slug}">${esc(p.name)}</a>`)
      .join("");
    return `
      <div class="navsub">
        <a class="navmenu__cat" href="products.html#${cat.id}">${esc(cat.name)} ${chevron}</a>
        <div class="navsubmenu">${items}</div>
      </div>`;
  }).join("");
}

/* ------------------------------------------------------------- REVEAL */
function initReveal() {
  const items = $$("[data-reveal]");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = Math.min(i * 55, 220);
          setTimeout(() => el.classList.add("is-in"), delay);
          io.unobserve(el);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
  );
  items.forEach((el) => io.observe(el));
}

/* --------------------------------------------------- HOME: FEATURED */
function renderFeatured() {
  const host = $("#featured-grid");
  if (!host) return;
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 8);
  host.innerHTML = featured.map((p) => cardHTML(p)).join("");
}

/* Home hero side panel — "N materials · N categories · View catalogue" */
function initHeroStats() {
  const el = $("#hero-stats");
  if (!el) return;
  el.innerHTML = `
    <span>${PRODUCTS.length} materials &middot; ${CATEGORIES.length} categories</span>
    <a class="link-arrow" href="products.html">View catalogue ${ICONS.arrow}</a>`;
}

/* --------------------------------------------- PRODUCTS PAGE LISTING */
function renderProducts() {
  const host = $("#product-catalogue");
  if (!host) return;

  const params = new URLSearchParams(location.search);
  const qRaw = params.get("q") || "";
  const q = qRaw.trim().toLowerCase();

  const searchInput = $("#site-search");
  if (searchInput && qRaw) searchInput.value = qRaw;

  const pool = q
    ? PRODUCTS.filter(
        (p) => p.name.toLowerCase().includes(q) || p.short.toLowerCase().includes(q)
      )
    : PRODUCTS;

  if (q && pool.length === 0) {
    host.innerHTML = `
      <div class="glass nomatch" data-reveal>
        <h2>No products match &ldquo;${esc(qRaw)}&rdquo;</h2>
        <p>Try a different grade, material name or keyword.</p>
        <a class="btn btn--outline" href="products.html">Clear search</a>
      </div>`;
  } else {
    host.innerHTML = CATEGORIES.map((cat) => {
      const items = pool.filter((p) => p.category === cat.id);
      if (!items.length) return "";
      return `
        <section class="catblock" id="${cat.id}">
          <div class="catblock__head">
            <div>
              <h2>${esc(cat.name)}</h2>
              <p>${esc(cat.blurb)}</p>
            </div>
            <span class="catblock__count">${items.length} materials</span>
          </div>
          <div class="grid g-4">
            ${items.map((p) => cardHTML(p)).join("")}
          </div>
        </section>`;
    }).join("");
  }

  /* Category chips — always reflect the full catalogue, independent of search */
  const nav = $("#catnav");
  if (nav) {
    nav.innerHTML =
      `<button class="chip is-active" data-cat="all">All products<span class="chip__n">${PRODUCTS.length}</span></button>` +
      CATEGORIES.map((c) => {
        const n = PRODUCTS.filter((p) => p.category === c.id).length;
        return `<button class="chip" data-cat="${c.id}">${esc(c.name)}<span class="chip__n">${n}</span></button>`;
      }).join("");

    nav.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      $$(".chip", nav).forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      const cat = chip.dataset.cat;
      $$(".catblock", host).forEach((block) => {
        block.style.display = cat === "all" || block.id === cat ? "" : "none";
      });
      if (cat !== "all") {
        const y = host.getBoundingClientRect().top + window.scrollY - 150;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  }

  /* Specification reference notes */
  const notes = $("#spec-notes");
  if (notes) {
    notes.innerHTML = SPEC_NOTES.map(
      (n) => `<div class="note glass" data-reveal><h3>${esc(n.group)}</h3><p>${esc(n.text)}</p></div>`
    ).join("");
  }
}

/* --------------------------------------------------- PRODUCT DETAIL */
function renderProductDetail() {
  const host = $("#pdp");
  if (!host) return;

  const slug = new URLSearchParams(location.search).get("p");
  const p = PRODUCTS.find((x) => x.slug === slug);

  if (!p) {
    host.innerHTML = `
      <div style="text-align:center;padding:60px 0;grid-column:1/-1">
        <h1 style="font-size:1.7rem">That product isn't in the catalogue</h1>
        <p class="lede" style="margin-top:14px">Browse the full range to find the material you need.</p>
        <a class="btn btn--primary" style="margin-top:24px" href="products.html">View all products</a>
      </div>`;
    return;
  }

  document.title = `${p.name} — Caprio & Co | Metal Exporter & Supplier`;
  const metaDesc = $('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", `${p.name} — ${p.short} Supplied by Caprio & Co, metal exporter and supplier, Mumbai, India.`);

  /* Breadcrumb */
  const crumbs = $("#pdp-crumbs");
  if (crumbs) {
    crumbs.innerHTML = `
      <a href="index.html">Home</a>
      <span class="sep">/</span>
      <a href="products.html">Products</a>
      <span class="sep">/</span>
      <a href="products.html#${p.category}">${esc(catName(p.category))}</a>
      <span class="sep">/</span>
      <span aria-current="page">${esc(p.name)}</span>`;
  }

  host.innerHTML = `
    <div class="pdp__media glass" data-reveal>
      ${carouselHTML(p, { dims: "900 &times; 700" })}
    </div>

    <div data-reveal>
      <span class="eyebrow eyebrow--green">${esc(catName(p.category))}</span>
      <h1 class="pdp__title">${esc(p.name)}</h1>
      <p class="pdp__short">${esc(p.short)}</p>

      <div class="glass specblock">
        <div class="specblock__label">Specification</div>
        <div class="plate__codes">
          ${p.specCodes.map((c) => `<span>${esc(c)}</span>`).join("")}
        </div>
      </div>

      <div class="tilegrid">
        <div class="tile glass"><div class="tile__label">Forms</div><div class="tile__value">${esc(p.forms)}</div></div>
        <div class="tile glass"><div class="tile__label">Packaging</div><div class="tile__value">${esc(p.packaging)}</div></div>
        ${p.sizeRange ? `<div class="tile glass tile--full"><div class="tile__label">Size range</div><div class="tile__value">${esc(p.sizeRange)}</div></div>` : ""}
      </div>

      <div class="pdp__apps">
        <h3>Applications</h3>
        <ul class="checkrows">
          ${p.applications.map((a) => `<li class="checkrow"><span class="checkrow__ico">${ICONS.check}</span><span>${esc(a)}</span></li>`).join("")}
        </ul>
      </div>

      <div class="pdp__actions">
        <a class="btn btn--primary" href="quote.html?product=${p.slug}">Request a quote</a>
        <a class="btn btn--wa" target="_blank" rel="noopener"
           href="https://wa.me/${SITE.wa1}?text=${encodeURIComponent("Hello Caprio & Co, I would like a quotation for " + p.name + ".")}">
          Enquire on WhatsApp
        </a>
      </div>
    </div>`;

  const thumbs = $("#pdp-thumbs");
  if (thumbs) thumbs.innerHTML = thumbsHTML(p);

  /* Related products from the same category */
  const rail = $("#pdp-related");
  if (rail) {
    const related = PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4);
    rail.innerHTML = related.map((x) => cardHTML(x)).join("");
  }

  initCarousel();
}

/* ------------------------------------------------------ CONTACT FORMS
   Populates the quote form's product dropdown (#f-product) from the
   catalogue and prefills it when arriving from a product page. Actual
   form submission is handled separately by forms-submit.js. */
function initForm(formId) {
  const form = $(formId);
  if (!form) return;

  const select = $("#f-product", form);
  if (!select) return;

  select.innerHTML =
    `<option value="">Select a product (optional)</option>` +
    CATEGORIES.map((c) => {
      const opts = PRODUCTS.filter((p) => p.category === c.id)
        .map((p) => `<option value="${esc(p.name)}">${esc(p.name)}</option>`)
        .join("");
      return `<optgroup label="${esc(c.name)}">${opts}</optgroup>`;
    }).join("") +
    `<option value="Other / multiple products">Other / multiple products</option>`;

  /* Prefill when arriving from a product page */
  const slug = new URLSearchParams(location.search).get("product");
  const match = PRODUCTS.find((p) => p.slug === slug);
  if (match) {
    select.value = match.name;
    const subject = $("#f-subject", form);
    if (subject && !subject.value) subject.value = `Quotation request — ${match.name}`;
  }
}

/* -------------------------------------------------------------- MISC */
function initMisc() {
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
}

/* --------------------------------------------------------------- BOOT */
document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initProductsMenu();
  renderFeatured();
  initHeroStats();
  renderProducts();
  renderProductDetail();
  initForm("#quote-form");
  initMisc();
  initReveal();
});
