// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module 'chinese-conv' {
	export function tify(input: string): string;
	export function sify(input: string): string;
}

declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		'on:longpress'?: (event: CustomEvent) => void;
	}
}

export {};

