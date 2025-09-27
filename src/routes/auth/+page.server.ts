import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	login: async ({request, locals}) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { data, error } = await locals.supabase.auth.signInWithPassword({ email, password });
		if (error) {
			return { error: 'Invalid email or password' };
		}

		if (data?.session?.access_token) {
			await locals.supabase.auth.setSession({
				access_token: data.session.access_token,
				refresh_token: data.session.refresh_token
			});
		}

		throw redirect(303, '/app');
	},
	signUp: async ({request, locals}) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { data, error } = await locals.supabase.auth.signUp({ email, password });
		if (error) {
			return { error: 'Error during sign-up' };
		}

		if (data?.session?.access_token) {
			await locals.supabase.auth.setSession({
				access_token: data.session.access_token,
				refresh_token: data.session.refresh_token
			});
		}

		throw redirect(303, '/app');
	}
};
