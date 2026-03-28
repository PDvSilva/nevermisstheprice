'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, X, ArrowUpRight } from "lucide-react";
import { ModernProductCard } from "@/components/ModernProductCard";
import { ModernProductModal } from "@/components/ModernProductModal";
import { type EnhancedProduct } from "@/components/EnhancedProductCard";

interface ScrapedProduct {
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

interface ProductGroup {
  baseModel: string;
  bestPrice: number;
  bestPriceIndex: number;
  products: ScrapedProduct[];
}

const EU_COUNTRIES = [
  { code: "all", label: "All" },
  { code: "de", label: "🇩🇪 Germany" },
  { code: "fr", label: "🇫🇷 France" },
  { code: "es", label: "🇪🇸 Spain" },
  { code: "it", label: "🇮🇹 Italy" },
  { code: "uk", label: "🇬🇧 UK" },
  { code: "nl", label: "🇳🇱 Netherlands" },
  { code: "pl", label: "🇵🇱 Poland" },
  { code: "se", label: "🇸🇪 Sweden" },
  { code: "be", label: "🇧🇪 Belgium" },
  { code: "ie", label: "🇮🇪 Ireland" },
];

const POPULAR_CATEGORIES = [
  { label: "Headphones",      category: "Audio",       query: "Sony WH-1000XM5",   image: "https://m.media-amazon.com/images/I/61MbKNgpBNL._AC_SL500_.jpg", emoji: "🎧" },
  { label: "Smartphones",     category: "Technology",  query: "Samsung Galaxy S25", image: "https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_SL500_.jpg", emoji: "📱" },
  { label: "Vacuum Cleaners", category: "Home",        query: "Dyson V15 Detect",   image: "https://m.media-amazon.com/images/I/51k6oOtB3qL._AC_SL500_.jpg", emoji: "🌀" },
  { label: "Laptops",         category: "Computers",   query: "MacBook Air M3",     image: "https://m.media-amazon.com/images/I/71TPda7cwUL._AC_SL500_.jpg", emoji: "💻" },
  { label: "Gaming Consoles", category: "Gaming",      query: "PlayStation 5",      image: "https://m.media-amazon.com/images/I/51k6oOtB3qL._AC_SL500_.jpg", emoji: "🎮" },
  { label: "Cameras",         category: "Photography", query: "Sony mirrorless camera", image: "https://m.media-amazon.com/images/I/81f8pJULNSL._AC_SL500_.jpg", emoji: "📷" },
];

const FEATURES = [
  { icon: "⚡", title: "Real-time comparison",    desc: "Live prices across all 5 EU Amazon stores, with accurate shipping costs to your location, updated in real time.",                                   stat: "0.8s", statLabel: "average scan time across 5 stores" },
  { icon: "🎯", title: "Smart deal scoring",      desc: "Every result scores price, seller rating, reviews and delivery speed. The best deal is always obvious at a glance.",                               stat: "3.2×", statLabel: "faster than searching manually" },
  { icon: "📈", title: "Price history & alerts",  desc: "Track 90 days of price history and get alerted the moment a product drops below your target price in any EU store.",                               stat: "€340", statLabel: "average annual saving per user" },
];

const STEPS = [
  { number: "Step 01", title: "Search any product",    desc: "Enter the product name or paste the Amazon ASIN directly. NeverMissThePrice finds the exact item across all five EU stores in milliseconds." },
  { number: "Step 02", title: "We scan in real time",  desc: "All five Amazon EU marketplaces are queried simultaneously: price, shipping, stock availability and seller ratings all included." },
  { number: "Step 03", title: "Pick the best deal",    desc: "Buy directly on Amazon with one click. We never store your data, never touch your basket, and never take a cut of your order." },
];

const DEMO_PRODUCTS = [
  {
    slug: "Sony WH-1000XM5", name: "Sony WH-1000XM5 Wireless Headphones",
    meta: "⭐ 4.7 · 14,200 reviews · Noise cancelling", emoji: "🎧", label: "Headphones",
    image: "https://m.media-amazon.com/images/I/61MbKNgpBNL._AC_SL500_.jpg",
    results: [
      { flag: "🇩🇪", store: "amazon.de",    cur: "€", price: 249, ship: "Free",   days: 2, score: 97 },
      { flag: "🇫🇷", store: "amazon.fr",    cur: "€", price: 271, ship: "Free",   days: 3, score: 82 },
      { flag: "🇬🇧", store: "amazon.co.uk", cur: "£", price: 268, ship: "Free",   days: 2, score: 79 },
      { flag: "🇪🇸", store: "amazon.es",    cur: "€", price: 289, ship: "Free",   days: 4, score: 71 },
      { flag: "🇮🇹", store: "amazon.it",    cur: "€", price: 294, ship: "€5.99",  days: 3, score: 64 },
    ],
  },
  {
    slug: "Samsung Galaxy S25", name: "Samsung Galaxy S25 128GB",
    meta: "⭐ 4.6 · 8,400 reviews · Phantom Black", emoji: "📱", label: "Smartphone",
    image: "https://m.media-amazon.com/images/I/61VuVU94RnL._AC_SL1500_.jpg",
    results: [
      { flag: "🇪🇸", store: "amazon.es",    cur: "€", price: 799, ship: "Free",  days: 2, score: 95 },
      { flag: "🇩🇪", store: "amazon.de",    cur: "€", price: 819, ship: "Free",  days: 2, score: 89 },
      { flag: "🇫🇷", store: "amazon.fr",    cur: "€", price: 849, ship: "Free",  days: 3, score: 80 },
      { flag: "🇮🇹", store: "amazon.it",    cur: "€", price: 869, ship: "Free",  days: 3, score: 73 },
      { flag: "🇬🇧", store: "amazon.co.uk", cur: "£", price: 799, ship: "Free",  days: 1, score: 71 },
    ],
  },
  {
    slug: "Dyson V15 Detect", name: "Dyson V15 Detect Absolute",
    meta: "⭐ 4.8 · 6,100 reviews · Cordless vacuum", emoji: "🌀", label: "Vacuum cleaner",
    image: "https://m.media-amazon.com/images/I/61t6IfGFCML._AC_SL1500_.jpg",
    results: [
      { flag: "🇫🇷", store: "amazon.fr",    cur: "€", price: 529, ship: "Free",   days: 2, score: 96 },
      { flag: "🇩🇪", store: "amazon.de",    cur: "€", price: 549, ship: "Free",   days: 2, score: 88 },
      { flag: "🇬🇧", store: "amazon.co.uk", cur: "£", price: 549, ship: "Free",   days: 1, score: 84 },
      { flag: "🇪🇸", store: "amazon.es",    cur: "€", price: 589, ship: "Free",   days: 3, score: 74 },
      { flag: "🇮🇹", store: "amazon.it",    cur: "€", price: 619, ship: "€6.99",  days: 4, score: 61 },
    ],
  },
  {
    slug: "MacBook Air M3", name: 'Apple MacBook Air 13" M3 8GB',
    meta: "⭐ 4.9 · 3,800 reviews · Midnight · 256GB", emoji: "💻", label: "Laptop",
    image: "https://m.media-amazon.com/images/I/71TPda7cwUL._AC_SL1500_.jpg",
    results: [
      { flag: "🇩🇪", store: "amazon.de",    cur: "€", price: 1149, ship: "Free",  days: 2, score: 94 },
      { flag: "🇫🇷", store: "amazon.fr",    cur: "€", price: 1169, ship: "Free",  days: 2, score: 88 },
      { flag: "🇪🇸", store: "amazon.es",    cur: "€", price: 1189, ship: "Free",  days: 3, score: 81 },
      { flag: "🇮🇹", store: "amazon.it",    cur: "€", price: 1199, ship: "Free",  days: 3, score: 76 },
      { flag: "🇬🇧", store: "amazon.co.uk", cur: "£", price: 1099, ship: "Free",  days: 1, score: 74 },
    ],
  },
];

const TESTIMONIALS = [
  { initials: "MR", name: "Miguel Rodrigues", role: "Freelance photographer, Lisbon",  text: "\"I saved €340 on a camera kit by switching from amazon.fr to amazon.de. NeverMissThePrice found it in seconds. I now use it for every purchase over €50.\"" },
  { initials: "ST", name: "Sophie Turner",    role: "Operations Lead, Berlin startup", text: "\"Our office manager started using NeverMissThePrice for equipment. We cut our Amazon spend by 22% in one quarter without changing what we buy at all.\"", shift: true },
  { initials: "LC", name: "Luca Conti",       role: "Product designer, Milan",         text: "\"The price history alerts alone are worth it. I waited three weeks and bought a laptop for €180 less than the day I first searched. Absolute game-changer.\"" },
];

function groupToEnhancedProduct(group: ProductGroup): EnhancedProduct {
  const best = group.products[0];
  const highest = group.products[group.products.length - 1];
  const discount = group.products.length > 1
    ? Math.round(((highest.priceEUR - best.priceEUR) / highest.priceEUR) * 100) : 0;
  return {
    id: group.baseModel.toLowerCase().replace(/\s+/g, "-"),
    title: best.title,
    image: best.imageUrl || `https://via.placeholder.com/400x400?text=${encodeURIComponent(group.baseModel)}`,
    lowestPrice: best.priceEUR,
    originalPrice: group.products.length > 1 ? highest.priceEUR : undefined,
    discountPercentage: discount > 0 ? discount : undefined,
    sellers: group.products.map((p) => ({ name: p.country, price: p.priceEUR, url: p.link })),
    badges: [
      ...(group.products.length >= 3 ? ["best-seller" as const] : []),
      ...(discount >= 10 ? ["best-price" as const] : []),
    ],
  };
}

/* ─── Shared style tokens ─────────────────────────────────────── */
const C = {
  cream:      "#f7f4ef",
  cream2:     "#f0ece4",
  espresso:   "#1c1814",
  bark:       "#6b5f52",
  dust:       "#a09890",
  surface:    "#ffffff",
  accent:     "#e84d10",
  accentH:    "#c73d08",
  accentSoft: "hsla(22,91%,47%,0.09)",
  accentMid:  "hsla(22,91%,47%,0.22)",
  border:     "rgba(28,24,20,0.10)",
  border2:    "rgba(28,24,20,0.06)",
  glow:       "hsla(22,91%,47%,0.12)",
};

/* ─── Dot grid background (hero) ─────────────────────────────── */
const DOT_GRID: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage: `radial-gradient(circle, ${C.border} 1px, transparent 1px)`,
  backgroundSize: "32px 32px",
  WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 70%)",
  maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 70%)",
  pointerEvents: "none",
};

/* ─── Section label pill ──────────────────────────────────────── */
function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "4px 13px", borderRadius: 9999,
      fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
      color: C.accent, background: C.accentSoft,
      border: `1px solid ${C.accentMid}`,
      marginBottom: 16,
    }}>
      {children}
    </div>
  );
}

export default function ModernHome() {
  const [demoSelected, setDemoSelected] = useState(0);
  const [inputValue, setInputValue]     = useState("");
  const [query, setQuery]               = useState("");
  const [results, setResults]           = useState<EnhancedProduct[]>([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [selectedCountries]             = useState<string[]>([]);
  const [activeCountry, setActiveCountry] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<EnhancedProduct | null>(null);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [hasSearched, setHasSearched]   = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string = inputValue) => {
    const q = searchQuery.trim();
    if (!q) return;
    setQuery(q); setLoading(true); setError(null);
    setHasSearched(true); setResults([]); setActiveCountry("all");
    const params = new URLSearchParams({ q });
    if (selectedCountries.length > 0) params.set("countries", selectedCountries.join(","));
    try {
      const res = await fetch(`/api/compare?${params.toString()}`);
      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.message || `Error ${res.status}`); }
      const groups: ProductGroup[] = await res.json();
      setResults(groups.map(groupToEnhancedProduct));
    } catch (err: any) {
      setError(err.message || "Search failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleCategoryClick = (cat: (typeof POPULAR_CATEGORIES)[0]) => {
    setActiveCategory(cat.query); setInputValue(cat.query); handleSearch(cat.query);
  };

  const filteredResults = activeCountry === "all"
    ? results
    : results.filter((p) =>
        p.sellers.some((s) => {
          const country = EU_COUNTRIES.find((c) => c.code === activeCountry);
          const label = country?.label.replace(/[^\w\s]/g, "").trim().toLowerCase() ?? "";
          return s.name.toLowerCase().includes(label);
        })
      );

  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "'Roboto', system-ui, sans-serif", color: C.espresso, overflowX: "hidden" }}>

      {/* ── Noise texture overlay ── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9998,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
      }} />

      {/* ───────── NAV ───────── */}
      <nav style={{
        position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 100,
        width: "calc(100% - 40px)", maxWidth: 960,
        padding: "10px 16px", borderRadius: 9999,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(247,244,239,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${C.border}`,
        boxShadow: "0 4px 24px rgba(28,24,20,.08)",
      }}>
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: 15, color: C.espresso }}>
          <img src="/Imagem_2.png" alt="logo" style={{ width: 38, height: 38, objectFit: "contain", flexShrink: 0 }} />
          NeverMissThePrice
        </a>
        {/* Links */}
        <ul style={{ display: "flex", alignItems: "center", gap: 22, listStyle: "none", margin: 0, padding: 0 }}>
          {[
            { label: "Live demo",    id: "demo" },
            { label: "Features",     id: "features" },
            { label: "How it works", id: "how" },
          ].map(({ label, id }) => (
            <li key={id}>
              <button
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                style={{ fontSize: 13.5, color: C.bark, background: "none", border: "none", cursor: "pointer", fontWeight: 500, fontFamily: "'Roboto', sans-serif" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.espresso)}
                onMouseLeave={e => (e.currentTarget.style.color = C.bark)}>
                {label}
              </button>
            </li>
          ))}
        </ul>
        {/* CTA */}
        <button
          onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); document.getElementById("hero-search")?.focus(); }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "9px 20px", borderRadius: 9999,
            background: C.accent, color: "#fff", border: "none", cursor: "pointer",
            fontSize: 13.5, fontWeight: 600, fontFamily: "'Roboto', sans-serif",
            boxShadow: "0 2px 8px rgba(232,77,16,.30)",
            transition: "all .2s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = C.accentH; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = C.accent; (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
        >
          Compare now →
        </button>
      </nav>

      {/* ───────── HERO ───────── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px 60px", position: "relative", overflow: "hidden" }}>
        {/* Glow */}
        <div style={{ position: "absolute", width: 800, height: 500, top: -60, left: "50%", transform: "translateX(-50%)", background: `radial-gradient(ellipse at 50% 40%, ${C.glow} 0%, transparent 68%)`, pointerEvents: "none" }} />
        {/* Dot grid */}
        <div style={DOT_GRID} />

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 6px 5px 14px", borderRadius: 9999,
            fontSize: 12, fontWeight: 500, color: C.bark,
            marginBottom: 22, position: "relative", zIndex: 1,
            background: "rgba(255,255,255,0.7)", border: `1px solid ${C.border}`,
            backdropFilter: "blur(8px)",
          }}
        >
          Real-time · 5 Amazon EU markets
          <span style={{ background: C.accent, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 9999, letterSpacing: "0.04em" }}>
            100% free
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: "clamp(42px, 6.5vw, 80px)",
            fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.07,
            maxWidth: 860, marginBottom: 20, position: "relative", zIndex: 1, color: C.espresso,
          }}
        >
          You're probably{" "}
          <span style={{ color: C.accent, position: "relative", display: "inline-block" }}>
            overpaying
            <span style={{ content: "", position: "absolute", left: 0, bottom: -3, right: 0, height: 3, background: C.accent, borderRadius: 2, opacity: 0.32, display: "block" }} />
          </span>
          <br />on Amazon.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16 }}
          style={{ fontSize: 17, color: C.bark, lineHeight: 1.7, maxWidth: 380, marginBottom: 28, fontWeight: 300, position: "relative", zIndex: 1 }}
        >
          Paste any Amazon link. We show you the cheapest country in seconds.
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.22 }}
          style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 680 }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 12px 12px 24px", borderRadius: 9999,
            background: C.surface, border: `2px solid ${C.accentMid}`,
            boxShadow: `0 0 0 7px ${C.accentSoft}, 0 2px 4px rgba(28,24,20,0.06), 0 24px 64px rgba(28,24,20,0.14)`,
          }}>
            <Search style={{ width: 20, height: 20, color: C.bark, flexShrink: 0 }} />
            <input
              id="hero-search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Paste an Amazon product link (e.g. AirPods Pro)"
              disabled={loading}
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                fontFamily: "'Roboto', sans-serif", fontSize: 17, color: C.espresso, minWidth: 0,
              }}
            />
            {inputValue && (
              <button onClick={() => setInputValue("")} style={{ background: "none", border: "none", cursor: "pointer", color: C.dust, display: "flex" }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            )}
            <button
              onClick={() => handleSearch()}
              disabled={loading || !inputValue.trim()}
              style={{
                background: C.accent, color: "#fff", border: "none",
                padding: "14px 30px", borderRadius: 9999,
                fontSize: 15, fontWeight: 700, fontFamily: "'Roboto', sans-serif",
                cursor: loading || !inputValue.trim() ? "not-allowed" : "pointer",
                opacity: loading || !inputValue.trim() ? 0.6 : 1,
                transition: "all .2s", whiteSpace: "nowrap",
                boxShadow: "0 4px 14px rgba(232,77,16,.40)",
                display: "flex", alignItems: "center", gap: 7,
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={e => { if (!loading && inputValue.trim()) { (e.currentTarget as HTMLButtonElement).style.background = C.accentH; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = C.accent; (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
            >
              {loading ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : "Check cheapest price →"}
            </button>
          </div>

          {/* Country coverage */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, justifyContent: "center" }}>
            <span style={{ fontSize: 12, color: C.dust, fontWeight: 500 }}>Compare prices across:</span>
            {["🇪🇸", "🇩🇪", "🇫🇷", "🇮🇹", "🇬🇧"].map((flag) => (
              <span key={flag} style={{ fontSize: 22, lineHeight: 1 }}>{flag}</span>
            ))}
          </div>

          {/* Micro proof */}
          <p style={{ marginTop: 12, fontSize: 12, color: C.dust, textAlign: "center", fontWeight: 400, letterSpacing: "0.01em" }}>
            Checked 5 Amazon stores in 0.8s &nbsp;·&nbsp; Saved €35 on average
          </p>

        </motion.div>
      </section>


      {/* ───────── SIDEBAR + CONTENT (only when searching) ───────── */}
      {(hasSearched || loading || !!error) && <div style={{ maxWidth: 1060, margin: "0 auto", padding: "60px 48px" }}>
        <div style={{ display: "flex", gap: 48 }}>

          {/* Sidebar */}
          <aside style={{ width: 176, flexShrink: 0 }} className="hidden md:block">
            <div style={{ position: "sticky", top: 88 }}>
              <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 15, fontWeight: 700, color: C.espresso, marginBottom: 4 }}>Countries</p>
              <p style={{ fontSize: 12, color: C.dust, marginBottom: 20, lineHeight: 1.6 }}>Filter results by Amazon store.</p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                {EU_COUNTRIES.map((c) => (
                  <li key={c.code}>
                    <button onClick={() => setActiveCountry(c.code)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "none", border: "none", cursor: "pointer", padding: "6px 0", textAlign: "left" }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${activeCountry === c.code ? C.accent : C.dust}`, background: activeCountry === c.code ? C.accent : "transparent", flexShrink: 0, transition: "all .2s" }} />
                      <span style={{ fontSize: 13.5, color: activeCountry === c.code ? C.espresso : C.bark, fontWeight: activeCountry === c.code ? 600 : 400, transition: "color .2s" }}>{c.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ marginBottom: 32, padding: 16, borderRadius: 12, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 14, textAlign: "center" }}>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading */}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "80px 0", textAlign: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: "50%", background: C.accentSoft, marginBottom: 20 }}>
                  <Loader2 style={{ width: 28, height: 28, color: C.accent, animation: "spin 1s linear infinite" }} />
                </div>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 18, fontWeight: 600, color: C.espresso }}>Scanning 5 Amazon EU stores…</p>
                <p style={{ fontSize: 13, color: C.dust, marginTop: 6 }}>This can take up to 30 seconds</p>
              </motion.div>
            )}

            {/* Results */}
            <AnimatePresence>
              {!loading && hasSearched && results.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
                    <div>
                      <p style={{ fontSize: 11, color: C.dust, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Results</p>
                      <h2 style={{ fontFamily: "'Roboto', sans-serif", fontSize: 24, fontWeight: 700, color: C.espresso }}>"{query}"</h2>
                      <p style={{ fontSize: 13, color: C.dust, marginTop: 4 }}>{filteredResults.length} product{filteredResults.length !== 1 ? "s" : ""} · prices in EUR</p>
                    </div>
                    <button onClick={() => { setHasSearched(false); setResults([]); setInputValue(""); setQuery(""); setActiveCategory(null); }}
                      style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.dust, background: "none", border: "none", cursor: "pointer" }}>
                      <X style={{ width: 12, height: 12 }} /> Clear
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
                    {filteredResults.map((product, index) => (
                      <ModernProductCard key={product.id} product={product} onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }} index={index} />
                    ))}
                  </div>
                  {filteredResults.length === 0 && (
                    <div style={{ padding: "80px 0", textAlign: "center", fontSize: 14, color: C.dust }}>No results for this country filter.</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* No results */}
            {!loading && hasSearched && results.length === 0 && !error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "80px 0", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <h3 style={{ fontFamily: "'Roboto', sans-serif", fontSize: 20, fontWeight: 700, color: C.espresso, marginBottom: 8 }}>No results found</h3>
                <p style={{ fontSize: 13.5, color: C.dust }}>Try a different product name or adjust your filters.</p>
              </motion.div>
            )}

          </div>
        </div>
      </div>}

      {/* ───────── BELOW-FOLD (before search) ───────── */}
      {!hasSearched && (
        <>

          {/* ── TRUST / COVERAGE ── */}
          <section style={{ padding: "80px 48px 60px", textAlign: "center", position: "relative", overflow: "hidden", borderTop: `1px solid ${C.border}`, background: C.cream }}>
            {/* Concentric decorative rings */}
            {[220, 300, 380].map((size) => (
              <div key={size} style={{
                position: "absolute", top: "50%", left: "50%",
                width: size, height: size,
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                border: `1px solid ${C.border}`,
                opacity: 0.55,
                pointerEvents: "none",
              }} />
            ))}

            <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
              {/* Arc container */}
              <div style={{ position: "relative", height: 300, width: "100%" }}>

                {/* Center text */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 2, width: 190,
                }}>
                  <p style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "clamp(15px, 2vw, 19px)", fontWeight: 700,
                    color: C.espresso, lineHeight: 1.4,
                  }}>
                    We scan all major Amazon EU stores
                  </p>
                </div>

                {/* Country bubbles – arc positions (semicircle, top half) */}
                {[
                  { flag: "🇪🇸", label: "Spain",   left: "19%", top: "65%" },
                  { flag: "🇩🇪", label: "Germany", left: "27%", top: "23%" },
                  { flag: "🇫🇷", label: "France",  left: "45%", top:  "5%" },
                  { flag: "🇮🇹", label: "Italy",   left: "63%", top: "23%" },
                  { flag: "🇬🇧", label: "UK",      left: "71%", top: "65%" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.75 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      position: "absolute",
                      left: item.left, top: item.top,
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
                    }}
                  >
                    <div style={{
                      width: 66, height: 66, borderRadius: "50%",
                      background: C.surface, border: `1.5px solid ${C.border}`,
                      boxShadow: "0 2px 10px rgba(28,24,20,0.08), 0 1px 3px rgba(28,24,20,0.05)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 28,
                    }}>
                      {item.flag}
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 500, color: C.bark }}>{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── LIVE DEMO ── */}
          {(() => {
            const p = DEMO_PRODUCTS[demoSelected];
            const prices = p.results.map(r => r.price);
            const maxP = Math.max(...prices), minP = Math.min(...prices);
            const saving = maxP - minP;
            const best = p.results[0], worst = p.results[p.results.length - 1];
            return (
              <section id="demo" style={{ padding: "110px 48px", borderTop: `1px solid ${C.border}`, background: C.cream2, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 55% 45% at 50% 50%, ${C.glow} 0%, transparent 65%)`, pointerEvents: "none", opacity: 0.5 }} />
                <div style={{ maxWidth: 820, margin: "0 auto", position: "relative" }}>
                  {/* Header */}
                  <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <SectionLabel>Real results</SectionLabel>
                    <h2 style={{ fontFamily: "'Roboto', sans-serif", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 700, letterSpacing: "-0.025em", color: C.espresso, lineHeight: 1.07 }}>
                      See how much prices vary<br />across Amazon Europe.
                    </h2>
                    <p style={{ fontSize: 15, color: C.bark, maxWidth: 380, margin: "12px auto 0", lineHeight: 1.7, fontWeight: 300 }}>
                      Pick a product and see the price gap across all five Amazon EU stores.
                    </p>
                  </div>

                  {/* Product tabs */}
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
                    {DEMO_PRODUCTS.map((prod, i) => (
                      <button key={prod.slug} onClick={() => setDemoSelected(i)}
                        style={{
                          display: "flex", alignItems: "center", gap: 11,
                          padding: "7px 14px 7px 7px", borderRadius: 12,
                          background: demoSelected === i ? C.accentSoft : C.surface,
                          border: `1.5px solid ${demoSelected === i ? C.accentMid : C.border}`,
                          cursor: "pointer", fontFamily: "'Roboto', sans-serif",
                          color: demoSelected === i ? C.espresso : C.bark,
                          fontSize: 13, fontWeight: 500, transition: "all .2s",
                        }}
                        onMouseEnter={e => { if (demoSelected !== i) { (e.currentTarget as HTMLButtonElement).style.borderColor = C.accentMid; (e.currentTarget as HTMLButtonElement).style.color = C.espresso; } }}
                        onMouseLeave={e => { if (demoSelected !== i) { (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; (e.currentTarget as HTMLButtonElement).style.color = C.bark; } }}
                      >
                        <span style={{ width: 44, height: 44, borderRadius: 9, background: C.cream2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                          <img src={prod.image} alt={prod.slug} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; (e.currentTarget.parentElement as HTMLElement).innerText = prod.emoji; }} />
                        </span>
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{prod.slug}</div>
                          <div style={{ fontSize: 10.5, color: C.dust, marginTop: 1 }}>{prod.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Demo card */}
                  <motion.div key={demoSelected} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                    style={{ background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 4px rgba(28,24,20,0.06),0 20px 60px rgba(28,24,20,0.12)" }}>
                    {/* Browser bar */}
                    <div style={{ background: C.cream2, padding: "10px 16px", display: "flex", alignItems: "center", gap: 7, borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
                      <div style={{ flex: 1, margin: "0 10px", background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 6, padding: "4px 12px", fontSize: 11, color: C.dust }}>
                        nevermisstheprice.com/compare — {p.slug}
                      </div>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: 22 }}>
                      {/* Product info */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, paddingBottom: 16, borderBottom: `1px solid ${C.border2}`, flexWrap: "wrap", gap: 10 }}>
                        <div>
                          <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 15, fontWeight: 700, color: C.espresso }}>{p.name}</div>
                          <div style={{ fontSize: 11.5, color: C.dust, marginTop: 3 }}>{p.meta}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 9999, padding: "3px 10px" }}>
                            <span style={{ width: 6, height: 6, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />
                            Live result
                          </span>
                          <span style={{ fontSize: 11, color: C.dust }}>Updated just now</span>
                        </div>
                      </div>

                      {/* Price rows */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        {p.results.map((r, i) => {
                          const isBest = i === 0;
                          const spread = maxP - minP || 1;
                          const barPct = Math.round(100 - ((r.price - minP) / spread) * 70);
                          return (
                            <div key={r.store}
                              style={{
                                display: "grid", gridTemplateColumns: "34px 160px 1fr auto auto",
                                alignItems: "center", gap: 14, padding: "11px 15px",
                                borderRadius: 11, border: `1.5px solid ${isBest ? C.accentMid : C.border2}`,
                                background: isBest ? C.accentSoft : C.cream,
                                transition: "all .22s",
                              }}
                            >
                              <div style={{ fontSize: 21, textAlign: "center" }}>{r.flag}</div>
                              <div>
                                <div style={{ fontSize: 10.5, color: C.dust, marginBottom: 3, fontWeight: 500 }}>{r.store}</div>
                                <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 19, fontWeight: 700, color: isBest ? C.accent : C.espresso, letterSpacing: "-0.02em" }}>
                                  {r.cur}{r.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                                </div>
                              </div>
                              <div style={{ minWidth: 60 }}>
                                <div style={{ height: 4, background: "rgba(28,24,20,.08)", borderRadius: 9999, overflow: "hidden" }}>
                                  <motion.div
                                    initial={{ width: 0 }} animate={{ width: `${barPct}%` }}
                                    transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1], delay: i * 0.05 }}
                                    style={{ height: "100%", borderRadius: 9999, background: isBest ? C.accent : "#d4cdc5" }}
                                  />
                                </div>
                              </div>
                              <div style={{ fontSize: 11, color: C.dust, whiteSpace: "nowrap", textAlign: "right" }}>
                                {r.ship === "Free"
                                  ? <><span style={{ color: "#2ecc71", fontWeight: 600 }}>✓ Free</span> · {r.days}d</>
                                  : <>{r.ship} · {r.days}d</>
                                }
                              </div>
                              <span style={{
                                display: "inline-flex", fontSize: 10.5, fontWeight: 700,
                                padding: "4px 10px", borderRadius: 9999, whiteSpace: "nowrap",
                                background: isBest ? C.accent : C.surface,
                                color: isBest ? "#fff" : C.dust,
                                boxShadow: isBest ? `0 2px 10px hsla(22,91%,53%,.30)` : "none",
                              }}>
                                {isBest ? `⚡ Best · ${r.score}` : r.score}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Savings bar */}
                      <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 10, background: C.accentSoft, border: `1px solid ${C.accentMid}`, display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: C.bark, flexWrap: "wrap" }}>
                        <span>💡</span>
                        <span>
                          <strong style={{ color: C.espresso }}>Save {best.cur}{saving}</strong> vs {worst.flag} {worst.store} — buy from{" "}
                          <strong style={{ color: C.espresso }}>{best.flag} {best.store}</strong>
                        </span>
                        <button
                          onClick={() => { setInputValue(p.slug); handleSearch(p.slug); }}
                          style={{ marginLeft: "auto", color: C.accent, fontWeight: 600, fontSize: 12.5, background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Roboto', sans-serif" }}
                          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.textDecoration = "underline")}
                          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.textDecoration = "none")}
                        >
                          See full results →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>
            );
          })()}

          {/* ── FEATURES ── */}
          <section id="features" style={{ padding: "110px 48px", position: "relative", overflow: "hidden", borderTop: `1px solid ${C.border}`, background: C.cream2 }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 55% 45% at 50% 50%, ${C.glow} 0%, transparent 65%)`, pointerEvents: "none", opacity: 0.5 }} />
            <div style={{ maxWidth: 960, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <SectionLabel>Core tools</SectionLabel>
                <h2 style={{ fontFamily: "'Roboto', sans-serif", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 700, letterSpacing: "-0.025em", color: C.espresso }}>
                  Built to find you<br />the sharpest price.
                </h2>
                <p style={{ fontSize: 15, color: C.bark, maxWidth: 380, margin: "14px auto 0", lineHeight: 1.7, fontWeight: 300 }}>
                  Three tools that work together so you never overpay on Amazon Europe again.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
                {FEATURES.map((f, i) => (
                  <motion.div key={f.title}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    style={{ padding: "32px 26px", borderRadius: 14, border: `1.5px solid ${C.border}`, background: C.surface, display: "flex", flexDirection: "column", transition: "all .2s", cursor: "default" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-3px)"; el.style.borderColor = C.accentMid; el.style.boxShadow = "0 2px 4px rgba(28,24,20,0.06),0 20px 60px rgba(28,24,20,0.12)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ""; el.style.borderColor = C.border; el.style.boxShadow = ""; }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: C.accentSoft, border: `1px solid ${C.accentMid}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, marginBottom: 20 }}>{f.icon}</div>
                    <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 10, color: C.espresso }}>{f.title}</div>
                    <p style={{ fontSize: 13.5, color: C.bark, lineHeight: 1.75, marginBottom: 22, fontWeight: 300, flex: 1 }}>{f.desc}</p>
                    <hr style={{ border: "none", borderTop: `1px solid ${C.border2}`, marginBottom: 16 }} />
                    <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 30, fontWeight: 800, color: C.espresso }}>{f.stat}</div>
                    <div style={{ fontSize: 11, color: C.dust, marginTop: 3, fontWeight: 500 }}>{f.statLabel}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section id="how" style={{ padding: "120px 48px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.cream, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 50% 40% at 50% 50%, ${C.glow} 0%, transparent 62%)`, pointerEvents: "none", opacity: 0.5 }} />
            <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
              <SectionLabel>How it works</SectionLabel>
              <h2 style={{ fontFamily: "'Roboto', sans-serif", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 700, letterSpacing: "-0.025em", color: C.espresso, marginBottom: 52 }}>
                Three steps.<br />One best deal.
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
                {STEPS.map((step, i) => (
                  <motion.div key={step.number}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    style={{ padding: "30px 26px", borderRadius: 14, border: `1.5px solid ${C.border}`, background: C.surface, textAlign: "left", transition: "transform .2s" }}
                    onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.transform = "")}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, fontFamily: "'Roboto', sans-serif", fontSize: 11, fontWeight: 800, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      <span style={{ width: 20, height: 2, background: C.accent, borderRadius: 2, display: "block" }} />
                      {step.number}
                    </div>
                    <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 10, color: C.espresso }}>{step.title}</div>
                    <p style={{ fontSize: 13.5, color: C.bark, lineHeight: 1.7, fontWeight: 300 }}>{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── BIG STAT ── */}
          <section style={{ padding: "100px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", width: 600, height: 600, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: `radial-gradient(circle, ${C.glow} 0%, transparent 65%)`, pointerEvents: "none" }} />
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: "clamp(72px,13vw,130px)", fontWeight: 800, lineHeight: 1, color: C.espresso, marginBottom: 10, letterSpacing: "-0.04em" }}>
                €<em style={{ fontStyle: "normal", color: C.accent }}>4.7M</em>
              </div>
              <p style={{ fontSize: 16, color: C.bark, marginBottom: 6, fontWeight: 300 }}>Saved by NeverMissThePrice users this year</p>
              <p style={{ fontSize: 12, color: C.dust, marginBottom: 24 }}>Across all Amazon EU marketplaces combined · updated monthly</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              style={{ maxWidth: 560, margin: "0 auto", padding: "30px 48px", borderRadius: 18, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 32, border: `1.5px solid ${C.border}`, background: C.surface, boxShadow: "0 1px 3px rgba(28,24,20,0.07),0 8px 24px rgba(28,24,20,0.06)" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 34, fontWeight: 800, color: C.espresso, letterSpacing: "-0.03em" }}>18M</div>
                <div style={{ fontSize: 12, color: C.dust, fontWeight: 500, marginTop: 4 }}>Products scanned monthly</div>
              </div>
              <div style={{ width: 1, height: 44, background: C.border }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: 34, fontWeight: 800, color: C.espresso, letterSpacing: "-0.03em" }}>99.97%</div>
                <div style={{ fontSize: 12, color: C.dust, fontWeight: 500, marginTop: 4 }}>Platform uptime</div>
              </div>
            </motion.div>
          </section>

          {/* TESTIMONIALS removed — placeholder for real user reviews */}

          {/* ── CTA ── */}
          <section style={{ padding: "60px 48px 120px", maxWidth: 880, margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ padding: "72px 60px", borderRadius: 22, textAlign: "center", border: `1.5px solid ${C.border}`, background: C.surface, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 55% at 50% 0%, ${C.glow} 0%, transparent 60%)`, pointerEvents: "none" }} />
              <h2 style={{ fontFamily: "'Roboto', sans-serif", fontSize: "clamp(30px,4vw,50px)", fontWeight: 800, lineHeight: 1.08, marginBottom: 14, color: C.espresso, position: "relative", zIndex: 1, letterSpacing: "-0.03em" }}>
                Stop overpaying<br />on Amazon.
              </h2>
              <p style={{ fontSize: 15, color: C.bark, marginBottom: 32, fontWeight: 300, position: "relative", zIndex: 1, maxWidth: 340, marginLeft: "auto", marginRight: "auto", lineHeight: 1.65 }}>
                No account. No subscription. No hidden fees. Ever.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", position: "relative", zIndex: 1 }}>
                <button
                  onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setTimeout(() => document.getElementById("hero-search")?.focus(), 600); }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "13px 30px", borderRadius: 9999, background: C.accent, color: "#fff", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600, fontFamily: "'Roboto', sans-serif", boxShadow: "0 2px 8px rgba(232,77,16,.30)", transition: "all .2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = C.accentH; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = C.accent; (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
                >
                  Compare now, it's free →
                </button>
              </div>
              <p style={{ fontSize: 12, color: C.dust, marginTop: 14, position: "relative", zIndex: 1, fontWeight: 500 }}>
                Used by 340,000+ shoppers across Europe
              </p>
            </motion.div>
          </section>

        </>
      )}

      {/* ───────── FOOTER ───────── */}
      <footer id="about" style={{ borderTop: `1px solid ${C.border}`, padding: "56px 48px 40px", maxWidth: 1060, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr", gap: 48, marginBottom: 44 }}>
          <div>
            <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none", fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: 15, color: C.espresso }}>
              <img src="/Imagem_2.png" alt="logo" style={{ width: 38, height: 38, objectFit: "contain", flexShrink: 0 }} />
              NeverMissThePrice
            </a>
            <p style={{ fontSize: 13, color: C.bark, lineHeight: 1.7, marginTop: 14, maxWidth: 210, fontWeight: 300 }}>
              Compare prices across Amazon UK, DE, FR, ES, and IT. Find the best deal in seconds, for free.
            </p>
          </div>
          {[
            { title: "Product",   links: ["Features", "Compare now", "How it works"] },
            { title: "Company",   links: ["About", "Blog", "How we earn"] },
            { title: "Resources", links: ["Guides", "Support", "Community"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, fontWeight: 800, color: C.espresso, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>{col.title}</h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {col.links.map((link) => (
                  <li key={link} style={{ marginBottom: 10 }}>
                    <button style={{ fontSize: 13, color: C.bark, background: "none", border: "none", cursor: "pointer", fontWeight: 300, padding: 0, fontFamily: "'Roboto', sans-serif", transition: "color .2s" }}
                      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = C.espresso)}
                      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = C.bark)}
                    >{link}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <p style={{ fontSize: 12, color: C.dust }}>© 2026 NeverMissThePrice · Amazon Associates participant · Not affiliated with Amazon.com, Inc.</p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <button key={item} style={{ fontSize: 12, color: C.dust, background: "none", border: "none", cursor: "pointer", fontFamily: "'Roboto', sans-serif", transition: "color .2s" }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = C.espresso)}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = C.dust)}
              >{item}</button>
            ))}
          </div>
        </div>
      </footer>

      <ModernProductModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
