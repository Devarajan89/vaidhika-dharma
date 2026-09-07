import { defineMiddleware } from 'astro:middleware';

const HTML_THEME_DARK = /(<html\b[^>]*?)\sdata-theme="dark"/;

export const onRequest = defineMiddleware(async (_context, next) => {
	const response = await next();
	const contentType = response.headers.get('content-type') ?? '';
	if (!contentType.includes('text/html')) return response;

	const html = (await response.text()).replace(HTML_THEME_DARK, '$1 data-theme="light"');
	return new Response(html, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers,
	});
});
