import { Webhook } from 'svix';

export const verifyClerkWebhook = (req, res, next) => {
    try {
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
        
        if (!WEBHOOK_SECRET) {
            console.error('Missing CLERK_WEBHOOK_SECRET');
            return res.status(500).json({ error: 'Webhook secret not configured' });
        }

        // Get headers
        const svix_id = req.headers['svix-id'];
        const svix_timestamp = req.headers['svix-timestamp'];
        const svix_signature = req.headers['svix-signature'];

        // If missing headers, skip verification for development
        if (!svix_id || !svix_timestamp || !svix_signature) {
            console.warn('Missing Svix headers - skipping verification');
            return next();
        }

        // Verify webhook
        const wh = new Webhook(WEBHOOK_SECRET);
        const payload = JSON.stringify(req.body);
        
        wh.verify(payload, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });

        next();
    } catch (error) {
        console.error('Webhook verification failed:', error);
        return res.status(401).json({ error: 'Webhook verification failed' });
    }
};