import type { RequestHandler } from './$types';
import { INACTIVITY_LIMIT_MS } from '$lib/config';

export const POST: RequestHandler = async ({ locals, cookies }) => {
	if (locals.user) {
		cookies.set('last_activity', String(Date.now()), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: Math.floor(INACTIVITY_LIMIT_MS / 1000)
		});
	}
	return new Response(null, { status: 204 });
};
