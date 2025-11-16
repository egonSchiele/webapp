import { z } from "zod";
import { Result, MoodValue } from "../types.js";
import { Mood } from "../../backend/db/types.js";

// Define the mood enum values for Zod validation
const moodValues: [MoodValue, ...MoodValue[]] = ["good", "ok", "bad"];

export const CreateMoodSchema = z.object({
  mood: z.enum(moodValues),
  note: z.string().nullable().optional(),
});

export const UpdateMoodSchema = z.object({
  mood: z.enum(moodValues).optional(),
  note: z.string().nullable().optional(),
});

export type CreateMoodRequest = z.infer<typeof CreateMoodSchema>;
export type UpdateMoodRequest = z.infer<typeof UpdateMoodSchema>;

export type ApiMoodsResponseGet = Result<Mood[]>;
export type ApiMoodResponseGet = Result<Mood>;
export type ApiMoodsResponsePost = Result<Mood>;
export type ApiMoodsResponsePut = Result<Mood>;
export type ApiMoodsResponseDelete = Result<null>;
