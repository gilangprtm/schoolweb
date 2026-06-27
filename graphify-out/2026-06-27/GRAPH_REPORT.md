# Graph Report - schoolweb  (2026-06-26)

## Corpus Check
- 80 files · ~413,604 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 525 nodes · 763 edges · 71 communities (27 shown, 44 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8bc90c02`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_App Pages & Shared UI|App Pages & Shared UI]]
- [[_COMMUNITY_Staff & Homepage Data|Staff & Homepage Data]]
- [[_COMMUNITY_Content Pages & Galleries|Content Pages & Galleries]]
- [[_COMMUNITY_Achievements System|Achievements System]]
- [[_COMMUNITY_Dependencies & Build|Dependencies & Build]]
- [[_COMMUNITY_Shadcn UI Config|Shadcn UI Config]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Facilities System|Facilities System]]
- [[_COMMUNITY_News System|News System]]
- [[_COMMUNITY_Profile & Navigation|Profile & Navigation]]
- [[_COMMUNITY_Layout & Branding|Layout & Branding]]
- [[_COMMUNITY_Project Planning Docs|Project Planning Docs]]
- [[_COMMUNITY_Graphify Integration|Graphify Integration]]
- [[_COMMUNITY_iOS App Icon Assets|iOS App Icon Assets]]
- [[_COMMUNITY_Favicon SVG Assets|Favicon SVG Assets]]
- [[_COMMUNITY_PWA Icon Assets|PWA Icon Assets]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_PWA Manifest Icon 192|PWA Manifest Icon 192]]
- [[_COMMUNITY_Hero Background Photo|Hero Background Photo]]
- [[_COMMUNITY_Logo Bottom Text|Logo Bottom Text]]
- [[_COMMUNITY_Logo Central Emblem|Logo Central Emblem]]
- [[_COMMUNITY_Logo Crimson Color|Logo Crimson Color]]
- [[_COMMUNITY_Logo Gold Color|Logo Gold Color]]
- [[_COMMUNITY_Logo Navy Color|Logo Navy Color]]
- [[_COMMUNITY_Logo Purple Color|Logo Purple Color]]
- [[_COMMUNITY_Logo White Color|Logo White Color]]
- [[_COMMUNITY_Logo Gold Chevron|Logo Gold Chevron]]
- [[_COMMUNITY_Logo Motto Text|Logo Motto Text]]
- [[_COMMUNITY_Logo Shield Element|Logo Shield Element]]
- [[_COMMUNITY_Logo Top Text|Logo Top Text]]
- [[_COMMUNITY_Favicon 96x96 PNG|Favicon 96x96 PNG]]
- [[_COMMUNITY_Apple Touch Icon Image|Apple Touch Icon Image]]
- [[_COMMUNITY_RealFaviconGenerator Tool|RealFaviconGenerator Tool]]
- [[_COMMUNITY_School Logo Reference|School Logo Reference]]
- [[_COMMUNITY_Public Favicon 96x96|Public Favicon 96x96]]
- [[_COMMUNITY_Favicon Gen Metadata|Favicon Gen Metadata]]
- [[_COMMUNITY_File SVG Icon|File SVG Icon]]
- [[_COMMUNITY_Globe SVG Icon|Globe SVG Icon]]
- [[_COMMUNITY_Globe World Concept|Globe World Concept]]
- [[_COMMUNITY_Hero Section Component|Hero Section Component]]
- [[_COMMUNITY_Hero Background Image|Hero Background Image]]
- [[_COMMUNITY_School Building Photo|School Building Photo]]
- [[_COMMUNITY_Public Logo PNG|Public Logo PNG]]
- [[_COMMUNITY_Next.js Logo SVG|Next.js Logo SVG]]
- [[_COMMUNITY_Vercel Logo SVG|Vercel Logo SVG]]
- [[_COMMUNITY_PWA Maskable Purpose|PWA Maskable Purpose]]
- [[_COMMUNITY_PWA Icon 192 Public|PWA Icon 192 Public]]
- [[_COMMUNITY_PWA Icon 512 Public|PWA Icon 512 Public]]
- [[_COMMUNITY_Corrupted PWA Icon 512|Corrupted PWA Icon 512]]
- [[_COMMUNITY_Window SVG Icon|Window SVG Icon]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 49 edges
2. `compilerOptions` - 16 edges
3. `5. Halaman Detail per Route` - 14 edges
4. `PRD — Website Profil Sekolah` - 14 edges
5. `Badge()` - 13 edges
6. `Frontend Landing Page Plan — Website Profil Sekolah` - 13 edges
7. `What You Must Do When Invoked` - 12 edges
8. `/graphify` - 11 edges
9. `Button()` - 10 edges
10. `8.2 Fitur Tiap Menu` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Technology Stack (Next.js, PostgreSQL, Tailwind, Drizzle, Better Auth)` --shares_data_with--> `Frontend Implementation Plan`  [INFERRED]
  PRD.md → FRONTEND_PLAN.md
- `Root Layout Metadata` --references--> `Apple Touch Icon`  [EXTRACTED]
  src/app/layout.tsx → assets/favicon/apple-touch-icon.png
- `Server Components to PostgreSQL Data Flow` --conceptually_related_to--> `Coolify VPS Full-Stack Architecture`  [INFERRED]
  FRONTEND_PLAN.md → PRD.md
- `AchievementDetailPage()` --calls--> `formatDate()`  [INFERRED]
  src/app/prestasi/[slug]/page.tsx → src/lib/utils.ts
- `Breadcrumb()` --calls--> `cn()`  [EXTRACTED]
  src/components/shared/Breadcrumb.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Pipeline Stages** — graphify_skill_pipeline, graphify_extraction, graphify_community_analysis [EXTRACTED 1.00]
- **School Website Public Frontend** — frontend_landing_pages, frontend_shared_components, frontend_home_page, frontend_data_flow, frontend_plan_design_system [INFERRED 0.95]

## Communities (71 total, 44 thin omitted)

### Community 0 - "App Pages & Shared UI"
Cohesion: 0.09
Nodes (25): MobileMenuProps, NavItem, NAV_ITEMS, Navbar(), cn(), EmptyState(), FilterPill, FilterPills() (+17 more)

### Community 1 - "Staff & Homepage Data"
Cohesion: 0.09
Nodes (21): siteSettings, getActiveStaff(), getHeadmaster(), getRelatedStaff(), getStaffByRole(), getStaffBySlug(), staff, GuruStaffPage() (+13 more)

### Community 2 - "Content Pages & Galleries"
Cohesion: 0.09
Nodes (22): galleries, getPageBySlug(), pages, FacilityGalleryProps, ProfilTabs(), AchievementCategory, AchievementChampion, AchievementLevel (+14 more)

### Community 3 - "Achievements System"
Cohesion: 0.21
Nodes (13): CATEGORY_FILTERS, NewsGrid(), getLatestPosts(), getPostBySlug(), getPostsByCategory(), getPublishedPosts(), posts, NewsSection() (+5 more)

### Community 4 - "Dependencies & Build"
Cohesion: 0.06
Nodes (30): dependencies, @base-ui/react, class-variance-authority, clsx, framer-motion, lucide-react, next, react (+22 more)

### Community 5 - "Shadcn UI Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 6 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 7 - "Facilities System"
Cohesion: 0.09
Nodes (34): achievements, getAchievementBySlug(), getFeaturedAchievements(), getPublishedAchievements(), facilities, getFacilityBySlug(), getFeaturedFacilities(), getPublishedFacilities() (+26 more)

### Community 8 - "News System"
Cohesion: 0.06
Nodes (34): 10.1 Jenis Prestasi, 10.2 Tingkat Prestasi (Level), 10.3 Peringkat Kejuaraan (Champion), 10.4 Database Schema, 10.5 Tampilan Highlight Prestasi di Homepage, 10.6 Halaman Daftar Prestasi Lengkap, 10.7 Fitur CRUD pada Dashboard Admin, 10. Modul Prestasi (+26 more)

### Community 9 - "Profile & Navigation"
Cohesion: 0.12
Nodes (9): MISI, TIMELINE, TUJUAN, WAKASEK, Breadcrumb(), BreadcrumbItem, BreadcrumbProps, MiniHeroBanner() (+1 more)

### Community 10 - "Layout & Branding"
Cohesion: 0.15
Nodes (5): metadata, FOOTER_LINKS, SOCIAL_LINKS, inter, outfit

### Community 11 - "Project Planning Docs"
Cohesion: 0.18
Nodes (13): Server Components to PostgreSQL Data Flow, Home Page (7 Sections: Hero, Welcome, Achievements, News, Facilities, PPDB, Location), 13 Landing Pages (App Router Routes), Design System (Blue-Green Color Palette, Typography), Frontend Implementation Plan, Reusable UI Component Library (12 Components), Admin Dashboard (9 Menu Sections), Coolify VPS Full-Stack Architecture (+5 more)

### Community 12 - "Graphify Integration"
Cohesion: 0.40
Nodes (5): Community Detection and God Nodes Analysis, Extraction System (AST Structural + LLM Semantic), Graph Query, Path, and Explain System, Graphify Knowledge Graph Pipeline, Incremental Update and Cluster-Only

### Community 13 - "iOS App Icon Assets"
Cohesion: 0.67
Nodes (3): Apple Touch Icon, SMP Negeri 17 Denpasar Site Identity, Root Layout Metadata

### Community 14 - "Favicon SVG Assets"
Cohesion: 0.67
Nodes (3): MyWebSite / MySite (brand name from webmanifest), RealFaviconGenerator (online favicon generation tool), Favicon SVG (site icon for MyWebSite)

### Community 54 - "Community 54"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 55 - "Community 55"
Cohesion: 0.08
Nodes (25): 10. Aksesibilitas (a11y), 11. Data Flow (Frontend ↔ Database), 12. Catatan Implementasi, 1. Tech Stack & Setup, 2.1 Color Palette, 2.2 Typography Scale, 2.3 Spacing & Layout, 2.4 Breakpoints (Tailwind Default) (+17 more)

### Community 56 - "Community 56"
Cohesion: 0.10
Nodes (21): 5.10 Detail Prestasi — `/prestasi/[slug]`, 5.11 Guru & Staf — `/guru-dan-staf`, 5.12 Detail Guru/Staf — `/guru-dan-staf/[slug]`, 5.13 Kontak — `/kontak`, 5.1 Home — `/`, 5.2 Profil & Sejarah — `/profil`, 5.3 Berita & Pengumuman — `/berita`, 5.4 Detail Berita — `/berita/[slug]` (+13 more)

### Community 57 - "Community 57"
Cohesion: 0.13
Nodes (15): 8.1 Struktur Menu Dashboard, 8.2.1 Dashboard (Ringkasan), 8.2.2 Halaman, 8.2.3 Berita & Pengumuman, 8.2.4 Guru & Staf, 8.2.5 Prestasi, 8.2.6 Fasilitas, 8.2.7 Galeri (+7 more)

### Community 58 - "Community 58"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 59 - "Community 59"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 60 - "Community 60"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 61 - "Community 61"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 62 - "Community 62"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 63 - "Community 63"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **280 isolated node(s):** `graphify`, `FOOTER_LINKS`, `SOCIAL_LINKS`, `$schema`, `style` (+275 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **44 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `App Pages & Shared UI` to `Staff & Homepage Data`, `Content Pages & Galleries`, `Achievements System`, `Facilities System`, `Profile & Navigation`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `PRD — Website Profil Sekolah` connect `News System` to `Community 57`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `Frontend Landing Page Plan — Website Profil Sekolah` connect `Community 55` to `Community 56`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `graphify`, `FOOTER_LINKS`, `SOCIAL_LINKS` to the rest of the system?**
  _284 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Pages & Shared UI` be split into smaller, more focused modules?**
  _Cohesion score 0.08534850640113797 - nodes in this community are weakly interconnected._
- **Should `Staff & Homepage Data` be split into smaller, more focused modules?**
  _Cohesion score 0.09358974358974359 - nodes in this community are weakly interconnected._
- **Should `Content Pages & Galleries` be split into smaller, more focused modules?**
  _Cohesion score 0.0907563025210084 - nodes in this community are weakly interconnected._