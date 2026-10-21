CREATE TABLE "users" (
	"chat_id" bigint PRIMARY KEY NOT NULL,
	"faculty" text,
	"language" text DEFAULT 'de' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
