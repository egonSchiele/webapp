import { nanoid } from "nanoid";
import { db } from "@/backend/db/index.js";
import {
  KyselyTransaction,
  User,
  UserUpdate,
  NewUser,
} from "@/backend/db/types.js";
import { Result, success, failure } from "@/common/types.js";

export async function findUserById({
  id,
  trx,
}: {
  id: string;
  trx?: KyselyTransaction;
}): Promise<Result<User>> {
  const executor = trx || db;
  const user = await executor
    .selectFrom("users")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();

  if (!user) {
    return failure(`User with id ${id} not found`);
  }

  return success(user);
}

export async function findUserByEmail({
  email,
  trx,
}: {
  email: string;
  trx?: KyselyTransaction;
}): Promise<Result<User>> {
  const executor = trx || db;
  const user = await executor
    .selectFrom("users")
    .where("email", "=", email)
    .selectAll()
    .executeTakeFirst();

  if (!user) {
    return failure(`User with email ${email} not found`);
  }

  return success(user);
}

export async function findUsers({
  criteria,
  trx,
}: {
  criteria: Partial<User>;
  trx?: KyselyTransaction;
}): Promise<Result<User[]>> {
  const executor = trx || db;
  let query = executor.selectFrom("users");

  if (criteria.id) {
    query = query.where("id", "=", criteria.id);
  }

  if (criteria.email) {
    query = query.where("email", "=", criteria.email);
  }

  if (criteria.first_name) {
    query = query.where("first_name", "=", criteria.first_name);
  }

  if (criteria.last_name) {
    query = query.where("last_name", "=", criteria.last_name);
  }

  if (criteria.is_admin !== undefined) {
    query = query.where("is_admin", "=", criteria.is_admin);
  }

  if (criteria.approved !== undefined) {
    query = query.where("approved", "=", criteria.approved);
  }

  const users = await query.orderBy("created_at", "desc").selectAll().execute();
  return success(users);
}

export async function updateUser({
  id,
  updateWith,
  trx,
}: {
  id: string;
  updateWith: UserUpdate;
  trx?: KyselyTransaction;
}): Promise<Result<User>> {
  const executor = trx || db;
  const user = await executor
    .updateTable("users")
    .set(updateWith)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();

  if (!user) {
    return failure(`User with id ${id} not found`);
  }

  return success(user);
}

export async function createUser({
  user,
  trx,
}: {
  user: Omit<NewUser, "id">;
  trx?: KyselyTransaction;
}): Promise<Result<User>> {
  const executor = trx || db;
  try {
    const newUser = await executor
      .insertInto("users")
      .values({ ...user, id: nanoid() })
      .returningAll()
      .executeTakeFirstOrThrow();
    return success(newUser);
  } catch (error) {
    return failure(`Failed to create user: ${error}`);
  }
}

export async function deleteUser({
  id,
  trx,
}: {
  id: string;
  trx?: KyselyTransaction;
}): Promise<Result<User>> {
  const executor = trx || db;
  const user = await executor
    .deleteFrom("users")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();

  if (!user) {
    return failure(`User with id ${id} not found`);
  }

  return success(user);
}
