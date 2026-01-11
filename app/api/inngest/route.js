import { serve } from "inngest/next";
import { inngest } from " @/config/inngest";
import { syncUserCeration, syncUserDeletion, syncUserUpdation } from "@/config/innges";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCeration,
    syncUserUpdation,
    syncUserDeletion
  ],
});