import {createSupabaseClient} from './lib/supabaseClient';
import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { INACTIVITY_LIMIT_MS, PROTECTED_BASE } from '$lib/config';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseClient(event);
	const { data: { user } } = await event.locals.supabase.auth.getUser();
	event.locals.user = user ?? null;

	// Get last activity from cookies
	const lastActivityRaw = event.cookies.get('last_activity');
	const lastActivity = lastActivityRaw ? Number(lastActivityRaw) : null;
	const now = Date.now();

	if (user) {
		if (lastActivity && Number.isFinite(lastActivity) && now - lastActivity > INACTIVITY_LIMIT_MS) {
			try {
				await event.locals.supabase.auth.signOut();
			} catch {}
			event.cookies.delete('last_activity', { path: '/' });
			throw redirect(303, '/auth?reason=inactive');
		}
		// Update last activity cookie
		event.cookies.set('last_activity', String(now), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: Math.floor(INACTIVITY_LIMIT_MS / 1000)
		});
	} else {
		event.cookies.delete('last_activity', { path: '/' });
	}

	// Route protection
	if (event.url.pathname.startsWith(PROTECTED_BASE)) {
		if (!event.locals.user) {
			throw redirect(303, '/auth');
		}
	}
	// If visiting auth while logged in, send to protected base
	if (event.url.pathname.startsWith('/auth') && event.locals.user) {
		throw redirect(303, PROTECTED_BASE);
	}

	return await resolve(event);
}
