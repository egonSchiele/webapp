import { nanoid } from "nanoid";
import { db } from "@/backend/db/index.js";
import {
  KyselyTransaction,
  Mood,
  MoodUpdate,
  NewMood,
} from "@/backend/db/types.js";

// Some example queries
export async function findMoodById({
  id,
  trx,
}: {
  id: string;
  trx?: KyselyTransaction;
}): Promise<Mood | undefined> {
  const executor = trx || db;
  return await executor
    .selectFrom("moods")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export async function findMoods({
  criteria,
  trx,
}: {
  criteria: Partial<Mood>;
  trx?: KyselyTransaction;
}): Promise<Mood[]> {
  const executor = trx || db;
  let query = executor.selectFrom("moods");

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
  updateWith,
  trx,
}: {
  id: string;
  updateWith: MoodUpdate;
  trx?: KyselyTransaction;
}): Promise<Mood | undefined> {
  const executor = trx || db;
  return await executor
    .updateTable("moods")
    .set(updateWith)
    .where("id", "=", id)
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
  trx,
}: {
  id: string;
  trx?: KyselyTransaction;
}): Promise<Mood | undefined> {
  const executor = trx || db;
  return await executor
    .deleteFrom("moods")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}
