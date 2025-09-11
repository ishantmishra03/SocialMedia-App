import { z } from 'zod';

export const postSchema = z.object({
    content: z.string().min(5, "Content of min length 5 is required"),
})