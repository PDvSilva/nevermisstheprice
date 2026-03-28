import puppeteer, { type Browser } from "puppeteer";
import axios from "axios";
import pLimit from "p-limit";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AmazonSite {
  country: string;
  domain: string;
  currency: string;
  tag: string;
}

export interface ScrapedProduct {
  country: string;
  domain: string;
  currency: string;
  title: string;
  link: string;
  price: number;
  priceEUR: number;
  imageUrl: string | null;
  isBestPrice?: boolean;
}

export interface ProductGroup {
  baseModel: string;
  bestPrice: number;
  bestPriceIndex: number;
  products: ScrapedProduct[];
}

// ─── Config ──────────────────────────────────────────────────────────────────

const MAX_RESULTS_PER_SITE = parseInt(process.env.MAX_RESULTS_PER_SITE || "3", 10);

const AFFILIATE_TAGS: Record<string, string> = {
  es: process.env.AMAZON_AFFILIATE_ES || "dogshoppt-21",
  fr: process.env.AMAZON_AFFILIATE_FR || "dogshoppt01-21",
  de: process.env.AMAZON_AFFILIATE_DE || "dogshoppt0e-21",
  it: process.env.AMAZON_AFFILIATE_IT || "dogshoppt0d-21",
  uk: process.env.AMAZON_AFFILIATE_UK || "dogshoppt00-21",
};

export const SITES: AmazonSite[] = [
  { country: "🇪🇸 Spain",       domain: "amazon.es",    currency: "EUR", tag: AFFILIATE_TAGS.es },
  { country: "🇫🇷 France",      domain: "amazon.fr",    currency: "EUR", tag: AFFILIATE_TAGS.fr },
  { country: "🇩🇪 Germany",     domain: "amazon.de",    currency: "EUR", tag: AFFILIATE_TAGS.de },
  { country: "🇮🇹 Italy",       domain: "amazon.it",    currency: "EUR", tag: AFFILIATE_TAGS.it },
  { country: "🇬🇧 UK",          domain: "amazon.co.uk", currency: "GBP", tag: AFFILIATE_TAGS.uk },
  { country: "🇳🇱 Netherlands", domain: "amazon.nl",    currency: "EUR", tag: AFFILIATE_TAGS.nl || "" },
  { country: "🇵🇱 Poland",      domain: "amazon.pl",    currency: "PLN", tag: AFFILIATE_TAGS.pl || "" },
  { country: "🇸🇪 Sweden",      domain: "amazon.se",    currency: "SEK", tag: AFFILIATE_TAGS.se || "" },
  { country: "🇧🇪 Belgium",     domain: "amazon.be",    currency: "EUR", tag: AFFILIATE_TAGS.be || "" },
  { country: "🇮🇪 Ireland",     domain: "amazon.ie",    currency: "EUR", tag: AFFILIATE_TAGS.ie || "" },
];

// Hardcoded fallback rates relative to EUR (updated periodically)
const FALLBACK_RATES: Record<string, number> = {
  GBP: 0.86,
  PLN: 4.25,
  SEK: 11.5,
  EUR: 1,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function addAffiliateTag(url: string, tag: string): string {
  if (!tag || tag.includes("your-tag")) return url;
  try {
    const u = new URL(url);
    u.searchParams.delete("tag");
    u.searchParams.set("tag", tag);
    return u.toString();
  } catch {
    return url;
  }
}

/** Parses EU and UK price strings like "1.234,56 €" or "£329.99" */
export function parsePrice(text: string): number {
  if (!text) return NaN;
  const cleaned = text.replace(/\s/g, "").replace(/[^\d,.\-]/g, "");
  if (cleaned.includes(",") && cleaned.lastIndexOf(",") > cleaned.lastIndexOf(".")) {
    return parseFloat(cleaned.replace(/\./g, "").replace(",", "."));
  }
  return parseFloat(cleaned.replace(/,/g, ""));
}

function extractBaseModel(title: string): string {
  if (!title) return "Unknown";

  const patterns = [
    /(iPhone\s+\d+[a-z\s]*(?:Pro|Plus|Max)?)/i,
    /(iPad\s+\w+(?:\s+\w+)?)/i,
    /(MacBook\s+\w+(?:\s+\d+)?)/i,
    /(AirPods\s+\w+(?:\s+\w+)?)/i,
    /(PlayStation\s+\d+)/i,
    /(Nintendo\s+Switch(?:\s+\w+)?)/i,
    /(Samsung\s+Galaxy\s+\w+\d+)/i,
    /(Xbox\s+\w+(?:\s+\w+)?)/i,
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) return match[1].trim();
  }

  // Strip parens/brackets and take first 3 words
  const cleaned = title.replace(/\s*\([^)]*\)/g, "").replace(/\s*\[[^\]]*\]/g, "").trim();
  const words = cleaned.split(/\s+/);
  return words.length > 3 ? words.slice(0, 3).join(" ") : cleaned;
}

async function toEUR(amount: number, from: string): Promise<number> {
  if (from === "EUR") return amount;
  try {
    const r = await Promise.race([
      axios.get("https://api.exchangerate.host/convert", {
        params: { from, to: "EUR", amount },
        timeout: 3000,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("currency timeout")), 3000)
      ),
    ]);
    const result = Number((r as any).data?.result);
    return result > 0 ? result : amount * (1 / (FALLBACK_RATES[from] ?? 1));
  } catch {
    // Use hardcoded fallback
    const rate = FALLBACK_RATES[from];
    return rate ? amount / rate : amount;
  }
}

function groupSimilarProducts(results: ScrapedProduct[]): ProductGroup[] {
  const groups = new Map<string, ProductGroup>();

  for (const result of results) {
    const baseModel = extractBaseModel(result.title);
    const key = baseModel.toLowerCase().trim();

    if (!groups.has(key)) {
      groups.set(key, { baseModel, bestPrice: Infinity, bestPriceIndex: -1, products: [] });
    }

    const group = groups.get(key)!;
    group.products.push(result);

    if (result.priceEUR < group.bestPrice) {
      group.bestPrice = result.priceEUR;
      group.bestPriceIndex = group.products.length - 1;
    }
  }

  return Array.from(groups.values()).map((group) => {
    if (group.bestPriceIndex >= 0) {
      group.products[group.bestPriceIndex].isBestPrice = true;
    }
    group.products.sort((a, b) => a.priceEUR - b.priceEUR);
    return group;
  });
}

// ─── Browser ─────────────────────────────────────────────────────────────────

export async function launchBrowser(): Promise<Browser> {
  const launchOptions: Parameters<typeof puppeteer.launch>[0] = {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-extensions",
    ],
  };

  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  } else {
    const { existsSync } = await import("fs");
    const candidates = [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
      "/usr/bin/google-chrome-stable",
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
      "/usr/bin/google-chrome",
    ];
    for (const p of candidates) {
      if (existsSync(p)) {
        launchOptions.executablePath = p;
        break;
      }
    }
  }

  return puppeteer.launch(launchOptions);
}

// ─── Scraper ─────────────────────────────────────────────────────────────────

export async function scrapeAmazonSite(
  site: AmazonSite,
  query: string,
  browser: Browser
): Promise<ScrapedProduct[]> {
  const { domain, country, currency } = site;
  const url = `https://${domain}/s?k=${encodeURIComponent(query)}`;
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({ "accept-language": "en-GB,en;q=0.9" });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 8000 });

    if (/captcha/i.test(await page.content())) {
      throw new Error("CAPTCHA page");
    }

    try {
      await page.waitForSelector("div.s-main-slot", { timeout: 5000 });
    } catch {
      // continue without it
    }

    await new Promise((r) => setTimeout(r, 500));

    const rawItems = await page.evaluate(
      (domainName: string, maxResults: number) => {
        const collected: Array<{
          title: string;
          href: string;
          priceText: string;
          imageUrl: string | null;
          asin: string;
        }> = [];
        const seenAsins = new Set<string>();

        const titleSelectors = [
          "h2 a span",
          "h2 a",
          "h2 span",
          "[data-cy='title-recipe'] a",
          ".s-title-instructions-style a",
        ];
        const priceSelectors = [
          ".a-price .a-offscreen",
          ".a-price-whole",
          ".a-price .a-price-whole",
          "span.a-price",
          ".a-price span",
          "[data-a-color='price'] span",
        ];
        const imageSelectors = [
          ".s-image img",
          "img[data-image-latency]",
          "img[data-a-dynamic-image]",
          ".s-product-image img",
          "img.s-image",
          "[data-component-type='s-product-image'] img",
        ];

        const cleanImageUrl = (rawUrl: string | null): string | null => {
          if (!rawUrl) return null;
          if (rawUrl.startsWith("{")) {
            try {
              const data = JSON.parse(rawUrl);
              const urls = Object.keys(data);
              if (urls.length) {
                const high = urls.filter((u) => u.includes("_AC_SL") || u.includes("_AC_"));
                rawUrl = (high.length ? high : urls).sort((a, b) => b.length - a.length)[0];
              }
            } catch {
              return null;
            }
          }
          if (rawUrl.includes("_AC_")) {
            rawUrl = rawUrl.replace(/_AC_[^_]+_/g, "_AC_SL1500_");
          }
          if (!rawUrl.startsWith("http")) {
            if (rawUrl.startsWith("//")) rawUrl = "https:" + rawUrl;
            else if (rawUrl.startsWith("/")) rawUrl = "https://" + domainName + rawUrl;
          }
          if (rawUrl.includes("?")) rawUrl = rawUrl.split("?")[0];
          return rawUrl.startsWith("http") ? rawUrl : null;
        };

        const processCard = (el: Element) => {
          const asin = el.getAttribute("data-asin");
          if (!asin || asin === "" || seenAsins.has(asin)) return null;

          let titleEl: Element | null = null;
          let hrefEl: Element | null = null;
          for (const sel of titleSelectors) {
            titleEl = el.querySelector(sel);
            if (titleEl) {
              hrefEl = titleEl.closest("a") || el.querySelector("h2 a");
              if (hrefEl) break;
            }
          }
          if (!titleEl || !hrefEl) return null;

          let priceEl: Element | null = null;
          for (const sel of priceSelectors) {
            priceEl = el.querySelector(sel);
            if (priceEl?.textContent?.trim()) break;
          }
          if (!priceEl) {
            for (const span of Array.from(el.querySelectorAll("span"))) {
              if (/[\d,.]+\s*[€£$]|[\d,.]+\s*EUR|[\d,.]+\s*GBP/.test(span.textContent || "")) {
                priceEl = span;
                break;
              }
            }
          }
          if (!priceEl) return null;

          const href = (hrefEl as HTMLAnchorElement).getAttribute("href") || "";
          if (!href || href === "#" || href.includes("javascript:") || href.includes("sspa/click"))
            return null;

          let imageUrl: string | null = null;
          for (const sel of imageSelectors) {
            const imgEl = el.querySelector(sel);
            if (imgEl) {
              imageUrl = cleanImageUrl(
                imgEl.getAttribute("data-src") ||
                  imgEl.getAttribute("data-lazy-src") ||
                  imgEl.getAttribute("data-a-dynamic-image") ||
                  imgEl.getAttribute("src")
              );
              if (imageUrl) break;
            }
          }
          if (!imageUrl) {
            imageUrl = `https://images-na.ssl-images-amazon.com/images/I/${asin}.01._AC_SL1500_.jpg`;
          }

          return {
            title: (titleEl.textContent || "").trim(),
            href,
            priceText: priceEl.textContent?.trim() || priceEl.getAttribute("aria-label") || "",
            imageUrl,
            asin,
          };
        };

        const tryCollect = (container: Element | null) => {
          if (!container) return;
          const cards = Array.from(
            container.querySelectorAll("div[data-asin][data-index], div[data-asin]:not([data-index=''])")
          );
          for (const card of cards) {
            if (collected.length >= maxResults) break;
            const item = processCard(card);
            if (item) {
              collected.push(item);
              seenAsins.add(item.asin);
            }
          }
        };

        tryCollect(document.querySelector("div.s-main-slot"));
        if (collected.length < maxResults) {
          tryCollect(document.querySelector(".s-result-list") || document.body);
        }

        return collected.slice(0, maxResults);
      },
      domain,
      MAX_RESULTS_PER_SITE
    );

    if (!rawItems || rawItems.length === 0) throw new Error("no priced item");

    const processedItems: ScrapedProduct[] = [];
    const seenLinks = new Set<string>();

    for (const raw of rawItems) {
      if (!raw.title || !raw.priceText || !raw.href) continue;

      let href = raw.href.split("?")[0].split("#")[0];
      let link: string;

      if (href.startsWith("http://") || href.startsWith("https://")) {
        if (!href.includes(domain.replace("www.", ""))) {
          try {
            href = new URL(href).pathname;
            link = `https://${domain}${href}`;
          } catch {
            link = href;
          }
        } else {
          link = href;
        }
      } else if (href.startsWith("/")) {
        link = `https://${domain}${href}`;
      } else {
        link = `https://${domain}/${href}`;
      }

      if (seenLinks.has(link)) continue;

      const price = parsePrice(raw.priceText);
      if (isNaN(price) || price <= 0) continue;

      processedItems.push({
        country,
        domain,
        currency,
        title: raw.title,
        link,
        price,
        priceEUR: price, // will be converted below
        imageUrl: raw.imageUrl,
      });
      seenLinks.add(link);
    }

    if (processedItems.length === 0) throw new Error("no priced item");
    return processedItems;
  } finally {
    await page.close().catch(() => {});
  }
}

// ─── Main orchestrator ───────────────────────────────────────────────────────

export async function runScrape(query: string, sites: AmazonSite[] = SITES): Promise<ProductGroup[]> {
  let browser: Browser | undefined;

  try {
    browser = await Promise.race([
      launchBrowser(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Browser launch timeout")), 30000)
      ),
    ]);

    const limit = pLimit(5);

    const tasks = sites.map((site) =>
      limit(async () => {
        try {
          return await Promise.race([
            scrapeAmazonSite(site, query, browser!),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error("Site timeout")), 10000)
            ),
          ]);
        } catch {
          return null;
        }
      })
    );

    const settled = await Promise.allSettled(tasks);
    const raw: ScrapedProduct[] = [];

    for (const result of settled) {
      if (result.status === "fulfilled" && Array.isArray(result.value)) {
        raw.push(...result.value);
      }
    }

    if (raw.length === 0) return [];

    // Convert currencies in parallel
    await Promise.all(
      raw.map(async (r) => {
        r.priceEUR = await toEUR(r.price, r.currency);
        const site = sites.find((s) => s.domain === r.domain);
        if (site?.tag) r.link = addAffiliateTag(r.link, site.tag);
      })
    );

    const valid = raw.filter((r) => r.priceEUR > 0 && r.link);
    const grouped = groupSimilarProducts(valid);
    grouped.sort((a, b) => a.bestPrice - b.bestPrice);

    return grouped;
  } finally {
    await browser?.close().catch(() => {});
  }
}
