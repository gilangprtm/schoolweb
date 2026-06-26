# Graph Report - D:/Project/schoolweb  (2026-06-26)

## Corpus Check
- 99 files · ~413,602 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 357 nodes · 611 edges · 54 communities (17 shown, 37 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.82)
- Token cost: 184 input · 175 output

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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 49 edges
2. `compilerOptions` - 16 edges
3. `Badge()` - 13 edges
4. `Button()` - 10 edges
5. `formatDate()` - 9 edges
6. `getPublishedAchievements()` - 8 edges
7. `getActiveStaff()` - 8 edges
8. `School Profile Website PRD` - 7 edges
9. `Frontend Implementation Plan` - 7 edges
10. `tailwind` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Technology Stack (Next.js, PostgreSQL, Tailwind, Drizzle, Better Auth)` --shares_data_with--> `Frontend Implementation Plan`  [INFERRED]
  PRD.md → FRONTEND_PLAN.md
- `Root Layout Metadata` --references--> `Apple Touch Icon`  [EXTRACTED]
  src/app/layout.tsx → assets/favicon/apple-touch-icon.png
- `Server Components to PostgreSQL Data Flow` --conceptually_related_to--> `Coolify VPS Full-Stack Architecture`  [INFERRED]
  FRONTEND_PLAN.md → PRD.md
- `Graphify Knowledge Graph Integration` --references--> `Graphify Knowledge Graph Pipeline`  [EXTRACTED]
  CLAUDE.md → .claude/skills/graphify/SKILL.md
- `AchievementDetailPage()` --calls--> `formatDate()`  [INFERRED]
  src/app/prestasi/[slug]/page.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Graphify Pipeline Stages** — graphify_skill_pipeline, graphify_extraction, graphify_community_analysis [EXTRACTED 1.00]
- **School Website Public Frontend** — frontend_landing_pages, frontend_shared_components, frontend_home_page, frontend_data_flow, frontend_plan_design_system [INFERRED 0.95]

## Communities (54 total, 37 thin omitted)

### Community 0 - "App Pages & Shared UI"
Cohesion: 0.09
Nodes (23): MobileMenuProps, NavItem, NAV_ITEMS, Navbar(), cn(), EmptyState(), EmptyStateProps, Pagination() (+15 more)

### Community 1 - "Staff & Homepage Data"
Cohesion: 0.10
Nodes (23): siteSettings, getActiveStaff(), getHeadmaster(), getRelatedStaff(), getStaffByRole(), getStaffBySlug(), staff, GuruStaffPage() (+15 more)

### Community 2 - "Content Pages & Galleries"
Cohesion: 0.09
Nodes (22): galleries, getPageBySlug(), pages, FacilityGalleryProps, ProfilTabs(), AchievementCategory, AchievementChampion, AchievementLevel (+14 more)

### Community 3 - "Achievements System"
Cohesion: 0.12
Nodes (21): achievements, getAchievementBySlug(), getFeaturedAchievements(), getPublishedAchievements(), AchievementHighlight(), formatLevel(), getChampionEmoji(), getLevelBadgeColor() (+13 more)

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
Cohesion: 0.20
Nodes (14): facilities, getFacilityBySlug(), getFeaturedFacilities(), getPublishedFacilities(), CATEGORY_FILTERS, FasilitasPage(), FacilityHighlight(), getFacilityCategoryLabel() (+6 more)

### Community 8 - "News System"
Cohesion: 0.24
Nodes (12): CATEGORY_FILTERS, NewsGrid(), getLatestPosts(), getPostBySlug(), getPostsByCategory(), getPublishedPosts(), posts, NewsSection() (+4 more)

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
Cohesion: 0.29
Nodes (7): Next.js Breaking Changes Warning, Graphify Knowledge Graph Integration, Community Detection and God Nodes Analysis, Extraction System (AST Structural + LLM Semantic), Graph Query, Path, and Explain System, Graphify Knowledge Graph Pipeline, Incremental Update and Cluster-Only

### Community 13 - "iOS App Icon Assets"
Cohesion: 0.67
Nodes (3): Apple Touch Icon, SMP Negeri 17 Denpasar Site Identity, Root Layout Metadata

### Community 14 - "Favicon SVG Assets"
Cohesion: 0.67
Nodes (3): MyWebSite / MySite (brand name from webmanifest), RealFaviconGenerator (online favicon generation tool), Favicon SVG (site icon for MyWebSite)

## Knowledge Gaps
- **154 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+149 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **37 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `App Pages & Shared UI` to `Staff & Homepage Data`, `Content Pages & Galleries`, `Achievements System`, `Facilities System`, `Profile & Navigation`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `Badge()` connect `Staff & Homepage Data` to `News System`, `App Pages & Shared UI`, `Achievements System`, `Facilities System`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _158 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Pages & Shared UI` be split into smaller, more focused modules?**
  _Cohesion score 0.08780487804878048 - nodes in this community are weakly interconnected._
- **Should `Staff & Homepage Data` be split into smaller, more focused modules?**
  _Cohesion score 0.09716599190283401 - nodes in this community are weakly interconnected._
- **Should `Content Pages & Galleries` be split into smaller, more focused modules?**
  _Cohesion score 0.0907563025210084 - nodes in this community are weakly interconnected._
- **Should `Achievements System` be split into smaller, more focused modules?**
  _Cohesion score 0.11553030303030302 - nodes in this community are weakly interconnected._