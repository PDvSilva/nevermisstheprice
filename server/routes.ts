import type { Express } from "express";
import { createServer, type Server } from "http";
import { runScrape, SITES } from "./scrapers/amazonScraper.js";

// In-memory cache: query → { data, time }
const cache = new Map<string, { data: unknown; time: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

const COUNTRY_CODE_MAP: Record<string, string> = {
  es: "Spain",
  fr: "France",
  de: "Germany",
  it: "Italy",
  uk: "UK",
  nl: "Netherlands",
  pl: "Poland",
  se: "Sweden",
  be: "Belgium",
  ie: "Ireland",
};

export async function registerRoutes(app: Express): Promise<Server> {

  // ── GET /api/compare ───────────────────────────────────────────────────────
  app.get("/api/compare", async (req, res) => {
    const q = ((req.query.q as string) || "").trim().toLowerCase();
    const countriesParam = (req.query.countries as string) || "";

    if (!q) {
      return res.status(400).json({ error: "Missing query parameter: q" });
    }

    // Filter sites by country codes if provided
    let sitesToScrape = SITES;
    if (countriesParam) {
      const selected = countriesParam.split(",").map((c) => c.trim().toLowerCase());
      const filtered = SITES.filter((site) => {
        const countryName = site.country.replace(/\p{Emoji}/gu, "").trim();
        const code = Object.keys(COUNTRY_CODE_MAP).find(
          (k) => COUNTRY_CODE_MAP[k] === countryName
        );
        return code ? selected.includes(code) : false;
      });
      if (filtered.length > 0) sitesToScrape = filtered;
    }

    // Cache check
    const cacheKey = `${q}__${sitesToScrape.map((s) => s.domain).join(",")}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
      return res.json(cached.data);
    }

    // 60-second hard timeout
    let timedOut = false;
    const timeoutHandle = setTimeout(() => {
      timedOut = true;
      if (!res.headersSent) {
        res.status(504).json({
          error: "timeout",
          message: "Search took too long. Try a more specific query.",
        });
      }
    }, 60000);

    try {
      const results = await runScrape(q, sitesToScrape);
      clearTimeout(timeoutHandle);

      if (timedOut) return;

      cache.set(cacheKey, { data: results, time: Date.now() });
      return res.json(results);
    } catch (err: any) {
      clearTimeout(timeoutHandle);
      if (!timedOut && !res.headersSent) {
        console.error("Scrape error:", err.message);
        return res.status(500).json({
          error: "scrape_failed",
          message: err.message || "Unknown error",
        });
      }
    }
  });

  // ── GET /api/health ────────────────────────────────────────────────────────
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ── DELETE /api/cache ──────────────────────────────────────────────────────
  app.delete("/api/cache", (_req, res) => {
    cache.clear();
    res.json({ message: "Cache cleared" });
  });

  return createServer(app);
}
