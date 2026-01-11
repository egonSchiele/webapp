import { db } from "@/backend/db/index.js";
import { isLoggedIn } from "@/backend/lib/middleware/auth.js";
import {
  ApiMoodsResponseGet,
  ApiMoodsResponsePost,
  CreateMoodSchema,
} from "@/common/apiTypes/moods.js";
import { failure, success } from "@/common/types.js";
import { Request, Response } from "express";
import { createMood, findMoods } from "@/backend/db/mood.js";

export const get = [
  isLoggedIn,
  async (req: Request, res: Response): Promise<ApiMoodsResponseGet> => {
    const moods = await findMoods({
      criteria: {},
    });
    return success(moods);
  },
];

export const getType = "ApiMoodsResponseGet";

export const post = [
  isLoggedIn,
  async (req: Request, res: Response): Promise<ApiMoodsResponsePost> => {
    const validatedData = CreateMoodSchema.safeParse(req.body);
    if (!validatedData.success) {
      console.error(validatedData.error.issues);
      return failure("Invalid input");
    }

    const { mood, note } = validatedData.data;
    const newMood = await createMood({
      mood: {
        mood,
        note: note || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });

    return success(newMood);
  },
];

export const postType = "ApiMoodsResponsePost";
