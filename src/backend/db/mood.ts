import { nanoid } from "nanoid";
import { db } from "@/backend/db/index.js";
import {
  KyselyTransaction,
  Mood,
  MoodUpdate,
  NewMood,
} from "@/backend/db/types.js";

// Every query takes the id of the user who owns the moods,
// so a caller cannot read or change another user's moods.
export async function findMoodById({
  id,
  userId,
  trx,
}: {
  id: string;
  userId: string;
  trx?: KyselyTransaction;
}): Promise<Mood | undefined> {
  const executor = trx || db;
  return await executor
    .selectFrom("moods")
    .where("id", "=", id)
    .where("user_id", "=", userId)
    .selectAll()
    .executeTakeFirst();
}

export async function findMoods({
  criteria,
  userId,
  trx,
}: {
  criteria: Partial<Mood>;
  userId: string;
  trx?: KyselyTransaction;
}): Promise<Mood[]> {
  const executor = trx || db;
  let query = executor.selectFrom("moods").where("user_id", "=", userId);

  if (criteria.id) {
    query = query.where("id", "=", criteria.id);
  }

  if (criteria.note) {
    query = query.where("note", "=", criteria.note);
  }

  if (criteria.mood) {
    query = query.where("mood", "=", criteria.mood);
  }

  return await query.orderBy("created_at", "desc").selectAll().execute();
}

export async function updateMood({
  id,
  userId,
  updateWith,
  trx,
}: {
  id: string;
  userId: string;
  updateWith: Omit<MoodUpdate, "id" | "user_id">;
  trx?: KyselyTransaction;
}): Promise<Mood | undefined> {
  const executor = trx || db;
  return await executor
    .updateTable("moods")
    .set(updateWith)
    .where("id", "=", id)
    .where("user_id", "=", userId)
    .returningAll()
    .executeTakeFirst();
}

export async function createMood({
  mood,
  trx,
}: {
  mood: Omit<NewMood, "id">;
  trx?: KyselyTransaction;
}): Promise<Mood> {
  const executor = trx || db;
  return await executor
    .insertInto("moods")
    .values({ ...mood, id: nanoid() })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteMood({
  id,
  userId,
  trx,
}: {
  id: string;
  userId: string;
  trx?: KyselyTransaction;
}): Promise<Mood | undefined> {
  const executor = trx || db;
  return await executor
    .deleteFrom("moods")
    .where("id", "=", id)
    .where("user_id", "=", userId)
    .returningAll()
    .executeTakeFirst();
}
