export const portal = (node: HTMLElement) => {
	document.querySelector('main')?.appendChild(node).focus();
};