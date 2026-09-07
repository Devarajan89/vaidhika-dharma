import { docsLoader } from '@astrojs/starlight/loaders';

function isArchivePath(value: string | undefined): boolean {
	if (!value) return false;
	return value.split(/[\\/]/).some((part) => part === '_archive' || part.startsWith('_archive'));
}

/** Starlight only skips `_`-prefixed filenames, not `_archive/` directories. */
export function docsLoaderWithoutArchive() {
	const loader = docsLoader();
	return {
		name: loader.name,
		load: async (context: Parameters<typeof loader.load>[0]) => {
			await loader.load(context);
			for (const [id, entry] of context.store.entries()) {
				const filePath = entry.filePath ?? id;
				if (isArchivePath(id) || isArchivePath(filePath)) {
					context.store.delete(id);
				}
			}
		},
	};
}
