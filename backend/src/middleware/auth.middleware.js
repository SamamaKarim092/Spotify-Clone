import { clerkClient } from "@clerk/express";

export const protectRoute = (req, res, next) => {
    if (req.auth.userId) {
        return res.status(401).json({ message: "Unauthorized - you must be logged in    " });
    }

    next();
}

export const requireAdmin = async (req, res, next) => {
    try {
        const currentUser = await clerkClient.users.getUser(req.auth.userId);
        const isAdmin = process.env.ADMIN_EMAIL === currentUser.emailAddresses[0].emailAddress;

        if (!isAdmin) {
            return res.status(403).json({ message: "Forbidden - you do not have admin access" });
        }

        next();
    } catch (error) {
        next(error);  
    }
}