import { INACTIVITY_LIMIT_MS } from '$lib/config';

const DEFAULT_LIMIT = INACTIVITY_LIMIT_MS;
const HEARTBEAT_MS = 60 * 1000; // ping every 1 min while active
let started = false;

export function initInactivityWatcher(limitMs = DEFAULT_LIMIT) {
	if (started || typeof window === 'undefined') return;
	started = true;

	let last = Date.now();
	let loggedOut = false;

	const mark = () => {
		last = Date.now();
		ping();
	};

	const onInactivity = async () => {
		if (loggedOut) return;
		loggedOut = true;
		try {
			await fetch('/api/logout', { method: 'POST', keepalive: true });
		} finally {
			location.href = '/auth?reason=inactive';
		}
	};

	const tick = () => {
		if (Date.now() - last > limitMs) {
			onInactivity();
		} else {
			ping();
		}
	};

	const ping = () => {
		fetch('/api/activity', { method: 'POST', keepalive: true }).catch(() => {});
	};

	['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'pointerdown'].forEach((evt) =>
		window.addEventListener(evt, mark, { passive: true })
	);
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'visible') mark();
	});

	window.setInterval(tick, HEARTBEAT_MS);
}
