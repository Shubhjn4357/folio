import { pgTable, serial, text, timestamp, boolean, integer, varchar } from 'drizzle-orm/pg-core';

// ============ CONTACTS TABLE ============
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============ BLOGS TABLE ============
export const blogs = pgTable('blogs', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  coverImage: text('cover_image'),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============ VISITORS TABLE ============
export const visitors = pgTable('visitors', {
  id: serial('id').primaryKey(),
  page: varchar('page', { length: 255 }).notNull(),
  userAgent: text('user_agent'),
  ip: varchar('ip', { length: 45 }),
  country: varchar('country', { length: 100 }),
  referrer: text('referrer'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============ ADMINS TABLE ============
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============ PROJECTS TABLE ============
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  image: text('image'),
  sourceCodeLink: text('source_code_link'),
  liveLink: text('live_link'),
  tags: text('tags'), // JSON string of tags
  isFeatured: boolean('is_featured').default(false),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============ TYPE EXPORTS ============
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;

export type Visitor = typeof visitors.$inferSelect;
export type NewVisitor = typeof visitors.$inferInsert;

export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
