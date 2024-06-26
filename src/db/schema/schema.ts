import { relations, sql } from "drizzle-orm";
import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Define the Project table schema
export const tbl_projects = sqliteTable("tbl_projects", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  secretKey: text("secret_key").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
});

// Define the Schedules(Cron Job) table schema
export const tbl_schedules = sqliteTable("tbl_schedules", {
  id: integer("id").primaryKey(),
  project_id: integer("project_id")
    .notNull()
    .references(() => tbl_projects.id),

  name: text("name").default("Untitled"),
  description: text("description").default("No Description"),
  request: blob("request", { mode: "json" }), // JSON request (contains url, headers, body)

  cron_expression: text("cron_expression").notNull(),
  paused: integer('paused', { mode: 'boolean' }).default(false), //  Paused or active. Default it's active
  scheduled_for: text("scheduled_for").notNull(), // ISO 8601 timestamp, when the schedule is scheduled to be executed

  schedule_name: text("schedule_name").notNull(),
  rule_arn: text("rule_arn").notNull(),
  target_id: text("target_id").notNull(),
  
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
});

// ** __________ RELATIONS __________ **
export const relation_cron_jobs = relations(tbl_schedules, ({ one }) => ({
  projects: one(tbl_projects, {
    fields: [tbl_schedules.project_id],
    references: [tbl_projects.id],
  }),
}));

export const relation_projects = relations(tbl_projects, ({ many }) => ({
  cron_jobs: many(tbl_schedules),
}));
