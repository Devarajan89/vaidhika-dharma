import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HTML_THEME_DARK = /(<html\b[^>]*?)\sdata-theme="dark"/;

export function forceLightHtml() {
	return {
		name: 'force-light-html',
		hooks: {
			'astro:build:done': async ({ dir }) => {
				const root = fileURLToPath(dir);
				const queue = [root];
				while (queue.length) {
					const current = queue.pop();
					const entries = await fs.readdir(current, { withFileTypes: true });
					for (const entry of entries) {
						const full = path.join(current, entry.name);
						if (entry.isDirectory()) {
							queue.push(full);
							continue;
						}
						if (!entry.name.endsWith('.html')) continue;
						const html = await fs.readFile(full, 'utf8');
						const next = html.replace(HTML_THEME_DARK, '$1 data-theme="light"');
						if (next !== html) await fs.writeFile(full, next);
					}
				}
			},
		},
	};
}
