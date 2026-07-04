CREATE TABLE "school_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"visi" text DEFAULT '' NOT NULL,
	"misi" text DEFAULT '[]' NOT NULL,
	"sejarah" text DEFAULT '' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
