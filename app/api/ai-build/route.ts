import { generateObject } from "ai"
import { z } from "zod"

export const maxDuration = 30

const blockActionSchema = z.object({
  actions: z.array(
    z.object({
      action: z.enum(["add", "remove"]),
      color: z.enum(["red", "blue", "green", "yellow", "orange", "purple", "pink", "cyan"]).optional(),
      position: z.tuple([z.number(), z.number(), z.number()]).optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      index: z.number().optional(),
    }),
  ),
  description: z.string(),
})

export async function POST(req: Request) {
  const { prompt, currentBricks } = await req.json()

  const systemPrompt = `You are an AI assistant that helps build 3D block structures. 
You can place and remove colored blocks on a grid.

Current blocks on the board: ${JSON.stringify(currentBricks)}

Available colors: red, blue, green, yellow, orange, purple, pink, cyan

Position coordinates:
- x and z are grid positions (integers, typically -5 to 5)
- y is the height (starts at 0.5 for ground level, then 1.5, 2.5, etc.)
- width is always 1 (standard block width)
- height is always 1 (standard block height)

Rules:
1. Blocks must be placed on the ground (y=0.5) or on top of other blocks
2. Keep structures within the grid bounds (-5 to 5 for x and z)
3. Be creative but practical`

  const { object } = await generateObject({
    model: "openai/gpt-4o-mini",
    schema: blockActionSchema,
    prompt: `${systemPrompt}\n\nUser request: ${prompt}`,
  })

  return Response.json(object)
}
