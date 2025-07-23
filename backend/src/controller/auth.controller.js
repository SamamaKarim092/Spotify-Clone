import { User } from "../models/user.model.js";

export const authCallback = async(req, res, next) => {
    try {
        const {id, firstName, lastName, imageUrl} = req.body;

        // check if user already exists

        const user = await User.findOne({clerkId: id});

        if (!user) {
            //singup
            await User.create({
                clerkId: id,
                fullName: `${firstName} ${lastName}`,
                image: imageUrl,
            });
        }
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error in auth callback:', error);
        next(error);
    }
}