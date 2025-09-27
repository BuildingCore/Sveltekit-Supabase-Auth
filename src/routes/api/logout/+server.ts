import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, cookies }) => {
	try {
		await locals.supabase?.auth.signOut();
	} catch {}
	cookies.delete('last_activity', { path: '/' });
	return new Response(null, { status: 204 });
};
