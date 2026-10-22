CREATE TABLE "reminders_sent" (
	"chat_id" bigint NOT NULL,
	"reminder_key" text NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reminders_sent_chat_id_reminder_key_pk" PRIMARY KEY("chat_id","reminder_key")
);
--> statement-breakpoint
ALTER TABLE "reminders_sent" ADD CONSTRAINT "reminders_sent_chat_id_users_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."users"("chat_id") ON DELETE cascade ON UPDATE no action;