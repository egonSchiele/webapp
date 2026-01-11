import type { Kysely } from "kysely";

export async function seed(db: Kysely<any>): Promise<void> {
  await db
    .insertInto("users")
    .values([
      {
        id: "user_1a2b3c4d5e6f",
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        is_admin: true,
        approved: true,
        created_at: new Date("2024-01-01T10:00:00Z").toISOString(),
      },
      {
        id: "user_2b3c4d5e6f7g",
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        is_admin: false,
        approved: true,
        created_at: new Date("2024-01-02T11:00:00Z").toISOString(),
      },
      {
        id: "user_3c4d5e6f7g8h",
        first_name: "Bob",
        last_name: "Johnson",
        email: "bob.johnson@example.com",
        is_admin: false,
        approved: false,
        created_at: new Date("2024-01-03T12:00:00Z").toISOString(),
      },
    ])
    .execute();
}
