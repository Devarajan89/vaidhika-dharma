import { INDIC_SCRIPTS, type IndicScriptId } from '../data/indic-scripts';
import { devanagariToGrantha } from './devanagari-to-grantha';
import { getInditrans, toAsciiDigits, transliterateDevanagariRuns } from './inditrans-browser';

const ROOT_SELECTORS = '.veda-corpus__body, .ritual-page-shell__content, .sl-markdown-content';
const SKIP_CLOSEST =
	'.study-layer, .veda-mantra__alt, .veda-mantra__num, .veda-mantra__marker, .rigveda-mantra__ref-marker, aside, nav, button, select, code, pre, .reader-toolbar, .corpus-seq-bar, .doc-page-nav, .breadcrumbs';

const origHtml = new WeakMap<HTMLElement, string>();

function convertRoots(): HTMLElement[] {
	const seen = new Set<HTMLElement>();
	const roots: HTMLElement[] = [];
	for (const node of document.querySelectorAll<HTMLElement>(ROOT_SELECTORS)) {
		if (node.closest('.study-layer')) continue;
		const nestedCorpus =
			node.classList.contains('sl-markdown-content') &&
			node.querySelector('.veda-corpus__body, .ritual-page-shell__content');
		if (nestedCorpus) continue;
		if (seen.has(node)) continue;
		seen.add(node);
		roots.push(node);
	}
	return roots;
}

function restoreRoot(root: HTMLElement) {
	const orig = origHtml.get(root);
	if (orig !== undefined) root.innerHTML = orig;
	else origHtml.set(root, root.innerHTML);
}

function skipNode(node: Node): boolean {
	const el = node instanceof Element ? node : node.parentElement;
	return Boolean(el?.closest(SKIP_CLOSEST));
}

function walkTextNodes(root: HTMLElement, visit: (node: Text) => void) {
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
	const nodes: Text[] = [];
	let current = walker.nextNode();
	while (current) {
		if (!skipNode(current) && current.nodeValue && /[\u0900-\u097F]/.test(current.nodeValue)) {
			nodes.push(current as Text);
		}
		current = walker.nextNode();
	}
	for (const node of nodes) visit(node);
}

export async function applyIndicScript(scriptId: IndicScriptId) {
	const option = INDIC_SCRIPTS.find((entry) => entry.id === scriptId);
	if (!option) return;

	document.documentElement.dataset.indicScript = scriptId;
	const roots = convertRoots();
	for (const root of roots) restoreRoot(root);

	try {
		if (option.engine === 'grantha') {
			for (const root of roots) {
				walkTextNodes(root, (node) => {
					node.nodeValue = toAsciiDigits(devanagariToGrantha(node.nodeValue ?? ''));
				});
			}
			return;
		}

		if (option.engine === 'inditrans') {
			const engine = await getInditrans();
			const target = option.inditrans ?? 'devanagari';
			for (const root of roots) {
				walkTextNodes(root, (node) => {
					node.nodeValue = transliterateDevanagariRuns(engine, node.nodeValue ?? '', target);
				});
			}
		}
	} finally {
		document.documentElement.dataset.indicReady = 'true';
	}
}
