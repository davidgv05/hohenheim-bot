CREATE TABLE "mensa_days" (
	"date" date PRIMARY KEY NOT NULL,
	"meals" jsonb NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);
