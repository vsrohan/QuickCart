import { Inngest } from "inngest";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

// Create Inngest client
export const inngest = new Inngest({
  id: "quickcart-next",
});

/* =========================
   USER CREATION
========================= */
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    await connectDB();

    await User.findOneAndUpdate(
      { clerkId: id },
      {
        clerkId: id,
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        imageUrl: image_url || "",
      },
      { upsert: true, new: true }
    );
  }
);

/* =========================
   USER UPDATE
========================= */
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    await connectDB();

    await User.findOneAndUpdate(
      { clerkId: id },
      {
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        imageUrl: image_url || "",
      },
      { new: true }
    );
  }
);

/* =========================
   USER DELETION
========================= */
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    await User.findOneAndDelete({ clerkId: event.data.id });
  }
);



