import { User } from "../models/user.model.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const authCallback = async (req, res, next) => {
  try {
    console.log("Received webhook body:", req.body);

    const { id, firstName, lastName, imageUrl } = req.body;

    if (!id) {
      console.error("No user ID found in webhook data");
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch user details from Clerk to get email
    const clerkUser = await clerkClient.users.getUser(id);
    const primaryEmail = clerkUser.emailAddresses?.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    )?.emailAddress;

    if (!primaryEmail) {
      console.error("No email found for user:", id);
      return res.status(400).json({ error: "User email is required" });
    }

    console.log("Processing user:", {
      id,
      firstName,
      lastName,
      email: primaryEmail,
      imageUrl,
    });

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: id });

    if (!existingUser) {
      // Create new user
      const newUser = await User.create({
        clerkId: id,
        name: `${firstName || ""} ${lastName || ""}`.trim() || "Anonymous",
        email: primaryEmail,
        image: imageUrl || "",
      });
      console.log("✅ Created new user:", newUser);
    } else {
      // Update existing user
      existingUser.name =
        `${firstName || ""} ${lastName || ""}`.trim() || existingUser.name;
      existingUser.email = primaryEmail;
      existingUser.image = imageUrl || existingUser.image;
      await existingUser.save();
      console.log("✅ Updated existing user:", existingUser);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error in auth callback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
