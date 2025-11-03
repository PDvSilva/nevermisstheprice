# Design Guidelines: Comparador de Preços Amazon

## Design Approach

**Reference-Based Approach** drawing inspiration from leading e-commerce platforms:
- **Amazon**: Familiar product card patterns, efficient information density
- **Shopify**: Clean visual hierarchy, modern spacing
- **Aliexpress/Mercado Libre**: Comparison-friendly layouts

**Key Principles:**
1. Information clarity: Prices and product details must be instantly scannable
2. Visual comparison: Enable easy side-by-side product evaluation
3. Trust signals: Professional presentation builds credibility
4. Efficiency: Quick access to filters, search, and product links

---

## Typography

**Font Families:**
- Primary: Inter or Roboto (via Google Fonts CDN)
- Accent: System font stack for performance

**Hierarchy:**
- Page Title: text-3xl md:text-4xl, font-bold
- Section Headers: text-2xl, font-semibold
- Product Titles: text-lg, font-medium, line-clamp-2
- Prices (Primary): text-2xl md:text-3xl, font-bold
- Body Text: text-base, font-normal
- Labels/Meta: text-sm, font-medium
- Small Print: text-xs

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8
- Micro spacing: gap-2, p-2 (8px)
- Component padding: p-4, px-6 (16-24px)
- Section spacing: py-8, my-6 (24-32px)
- Major gaps: gap-8, space-y-8 (32px)

**Container Structure:**
- Max width: max-w-7xl mx-auto
- Page padding: px-4 md:px-6 lg:px-8
- Card padding: p-4 md:p-6

**Grid System:**
- Product Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Comparison View: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Gap consistency: gap-4 md:gap-6

---

## Component Library

### Search & Filters Bar
- Sticky header: sticky top-0 z-10
- Search input: Large text input with search icon (Heroicons)
- Filter chips: Inline horizontal scroll on mobile, wrap on desktop
- Sort dropdown: Custom select with chevron icon
- Clear filters button when active

### Product Card (Primary Component)
**Structure:**
- Aspect ratio container for images: aspect-square or aspect-[4/3]
- Image with object-cover, rounded-lg
- Content section with p-4
- Product title: 2-line clamp
- Price display: Large, bold, with currency symbol
- Original price (if discount): text-sm, line-through
- Discount badge: Positioned top-right on image
- CTA button: "Ver na Amazon" with external link icon
- Quick compare checkbox: Top-left overlay

**States:**
- Hover: Subtle scale transform, shadow increase
- Selected for comparison: Border highlight

### Comparison Panel
- Fixed bottom bar on mobile: Shows selected count, "Comparar" button
- Side-by-side modal/panel on desktop
- Feature comparison table with aligned rows
- Clear selection button

### Empty States
- Search with no results: Illustration placeholder + suggested actions
- No products selected for comparison: Icon + instructional text

### Navigation
- Top bar: Logo/title left, search center, comparison counter right
- Breadcrumbs: text-sm with chevron separators (optional based on navigation depth)

### Loading States
- Skeleton screens for product cards during search
- Shimmer effect animation (subtle)
- Loading spinner for filters

### Price History (Future Enhancement Area)
- Line chart placeholder comment
- Last updated timestamp
- Price trend indicator (↑↓)

---

## Images

**Product Images:**
- Source: Placeholder API (e.g., placeholder.com with product dimensions)
- Dimensions: 300x300px minimum, square or 4:3 ratio
- Loading: lazy loading with blur-up placeholder
- Alt text: Product title

**Hero Section:**
- Large hero image: Full-width banner showcasing e-commerce theme
- Suggested image: Shopping cart with tech products, price tags, or Amazon boxes
- Height: h-64 md:h-80 lg:h-96
- Overlay gradient for text readability
- Hero content: Centered text with search bar overlay
- CTA button on hero: Blurred background (backdrop-blur-sm bg-white/20)

**Icons:**
- Library: Heroicons via CDN
- Common icons needed: MagnifyingGlass, AdjustmentsHorizontal, ChevronDown, ExternalLink, XMark, ShoppingCart, ChartBar

---

## Responsive Behavior

**Mobile (< 640px):**
- Single column product grid
- Collapsible filters (drawer/modal)
- Sticky search bar
- Fixed comparison bar at bottom

**Tablet (640px - 1024px):**
- 2-column product grid
- Filters in sidebar or top bar
- Expanded search

**Desktop (> 1024px):**
- 3-4 column product grid
- Persistent filter sidebar
- Spacious layout with generous whitespace

---

## Interaction Patterns

**Product Selection:**
- Checkbox for multi-select comparison (max 4 products)
- Visual feedback on selection
- Disable selection when limit reached

**Search Flow:**
1. User types in search bar
2. Show loading state
3. Display results with count
4. Enable filters after results load

**Comparison Flow:**
1. Select 2-4 products
2. Floating "Comparar" button appears
3. Click opens comparison view
4. Side-by-side cards with aligned features
5. Easy deselection and return to browse

---

## Accessibility

- Focus indicators on all interactive elements (ring-2 ring-offset-2)
- Skip to main content link
- ARIA labels for icon-only buttons
- Keyboard navigation for product grid (arrow keys)
- Screen reader announcements for comparison count
- Sufficient contrast ratios throughout
- Form labels properly associated with inputs