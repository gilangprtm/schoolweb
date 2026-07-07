import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  date,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ═══════════════════════════════════════════
// Better Auth tables
// ═══════════════════════════════════════════

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: varchar("role", { length: 20 }).notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ═══════════════════════════════════════════
// Application tables
// ═══════════════════════════════════════════

export const pages = pgTable(
  "pages",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    content: text("content").notNull().default(""),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("pages_slug_idx").on(table.slug)]
);

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    content: text("content").notNull().default(""),
    excerpt: text("excerpt").notNull().default(""),
    imageUrl: text("image_url").notNull().default(""),
    category: varchar("category", { length: 20 }).notNull().default("news"),
    isPublished: boolean("is_published").notNull().default(false),
    publishedAt: timestamp("published_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("posts_slug_idx").on(table.slug)]
);

export const staff = pgTable(
  "staff",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    role: varchar("role", { length: 50 }).notNull().default("teacher"),
    subject: varchar("subject", { length: 100 }),
    photoUrl: text("photo_url").notNull().default(""),
    education: text("education").notNull().default(""),
    bio: text("bio").notNull().default(""),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("staff_slug_idx").on(table.slug)]
);

export const achievements = pgTable(
  "achievements",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description").notNull().default(""),
    category: varchar("category", { length: 20 }).notNull().default("student"),
    level: varchar("level", { length: 50 }).notNull().default("kabupaten"),
    champion: varchar("champion", { length: 20 }).notNull().default("1"),
    organizer: varchar("organizer", { length: 255 }),
    date: date("date"),
    imageUrl: text("image_url").notNull().default(""),
    isFeatured: boolean("is_featured").notNull().default(false),
    isPublished: boolean("is_published").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("achievements_slug_idx").on(table.slug)]
);

export const facilities = pgTable(
  "facilities",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description").notNull().default(""),
    category: varchar("category", { length: 50 }).notNull().default("lainnya"),
    photoUrl: text("photo_url").notNull().default(""),
    isFeatured: boolean("is_featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("facilities_slug_idx").on(table.slug)]
);

export const facilityPhotos = pgTable("facility_photos", {
  id: serial("id").primaryKey(),
  facilityId: integer("facility_id")
    .notNull()
    .references(() => facilities.id, { onDelete: "cascade" }),
  filename: varchar("filename", { length: 255 }).notNull(),
  url: text("url").notNull(),
  caption: text("caption").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const galleries = pgTable("galleries", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull().default(""),
  type: varchar("type", { length: 10 }).notNull().default("photo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  galleryId: integer("gallery_id")
    .notNull()
    .references(() => galleries.id, { onDelete: "cascade" }),
  filename: varchar("filename", { length: 255 }),
  url: text("url").notNull(),
  caption: text("caption").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const settings = pgTable(
  "settings",
  {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 255 }).notNull(),
    value: text("value").notNull().default(""),
  },
  (table) => [uniqueIndex("settings_key_idx").on(table.key)]
);

// ═══════════════════════════════════════════
// School Profile (Visi, Misi, Sejarah)
// ═══════════════════════════════════════════

export const schoolProfile = pgTable("school_profile", {
  id: serial("id").primaryKey(),
  visi: text("visi").notNull().default(""),
  misi: text("misi").notNull().default("[]"), // JSON array of strings
  sejarah: text("sejarah").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ═══════════════════════════════════════════
// Relations
// ═══════════════════════════════════════════

export const facilitiesRelations = relations(facilities, ({ many }) => ({
  photos: many(facilityPhotos),
}));

export const facilityPhotosRelations = relations(facilityPhotos, ({ one }) => ({
  facility: one(facilities, {
    fields: [facilityPhotos.facilityId],
    references: [facilities.id],
  }),
}));

export const galleriesRelations = relations(galleries, ({ many }) => ({
  mediaItems: many(media),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  gallery: one(galleries, {
    fields: [media.galleryId],
    references: [galleries.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
