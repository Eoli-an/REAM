// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
			session: Session | null
			user: User | null
			}
		interface PageData {
			session: Session | null
			}
		interface PageState {
			selected?: any;
		  }
		
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

declare module 'hanzi';

export {};

