import { z } from "zod";

export const searchSchema = z.object({
  q: z.string().min(1, { message: "Query is required" }),
});

export const autocompleteSchema = z.object({
  q: z.string().min(1, { message: "Query is required" }),
});
