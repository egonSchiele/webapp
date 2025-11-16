import { nanoid } from "nanoid";
import { db } from "@/backend/db/index.js";
import {
  CurrentUser,
  KyselyTransaction,
  Mood,
  MoodUpdate,
  NewMood,
} from "@/backend/db/types.js";

// Some example queries
export async function findMoodById({
  id,
  currentUser,
  trx,
}: {
  id: string;
  currentUser: CurrentUser;
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
  currentUser,
  trx,
}: {
  criteria: Partial<Mood>;
  currentUser: CurrentUser;
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
  currentUser,
  trx,
}: {
  id: string;
  updateWith: MoodUpdate;
  currentUser: CurrentUser;
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
  currentUser,
  trx,
}: {
  mood: Omit<NewMood, "id">;
  currentUser: CurrentUser;
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
  currentUser,
  trx,
}: {
  id: string;
  currentUser: CurrentUser;
  trx?: KyselyTransaction;
}): Promise<Mood | undefined> {
  const executor = trx || db;
  return await executor
    .deleteFrom("moods")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}
