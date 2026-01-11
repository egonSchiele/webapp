import { db } from "@/backend/db/index.js";
import { deleteMood, findMoodById, updateMood } from "@/backend/db/mood.js";
import { isLoggedIn } from "@/backend/lib/middleware/auth.js";
import {
  ApiMoodResponseGet,
  ApiMoodsResponseDelete,
  ApiMoodsResponsePut,
  UpdateMoodSchema,
} from "@/common/apiTypes/moods.js";
import { failure, success } from "@/common/types.js";
import { Request, Response } from "express";

export const get = [
  isLoggedIn,
  async (req: Request, res: Response): Promise<ApiMoodResponseGet> => {
    const id = req.params.id;

    const mood = await findMoodById({
      id: id.toString(),
    });
    if (!mood) {
      return failure("Mood not found");
    } else {
      return success(mood);
    }
  },
];

export const getType = "ApiMoodResponseGet";

export const put = [
  isLoggedIn,
  async (req: Request, res: Response): Promise<ApiMoodsResponsePut> => {
    const id = req.params.id;

    const validatedData = UpdateMoodSchema.safeParse(req.body);
    if (!validatedData.success) {
      console.error(validatedData.error.issues);
      return failure("Invalid input");
    }

    const updateData = validatedData.data;

    const updatedMood = await updateMood({
      id: id.toString(),
      updateWith: { ...updateData, updated_at: new Date().toISOString() },
    });

    if (!updatedMood) {
      return failure("Mood not found");
    }

    return success(updatedMood);
  },
];

export const putType = "ApiMoodsResponsePut";

export const del = [
  isLoggedIn,
  async (req: Request, res: Response): Promise<ApiMoodsResponseDelete> => {
    const id = req.params.id;

    const result = await deleteMood({
      id,
    });

    if (!result) {
      return failure("Mood not found");
    }

    return success(null);
  },
];

export const delType = "ApiMoodsResponseDelete";
