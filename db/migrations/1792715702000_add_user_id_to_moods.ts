import type { Kysely } from "kysely";

// Existing moods have no owner, so this migration fails if the moods table
// has rows. Delete them or reset the database before running it.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("moods")
    .addColumn("user_id", "text", (col) =>
      col.notNull().references("users.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createIndex("moods_user_id_index")
    .on("moods")
    .column("user_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("moods_user_id_index").execute();
  await db.schema.alterTable("moods").dropColumn("user_id").execute();
}
