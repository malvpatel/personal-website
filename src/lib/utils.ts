import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function convertKeys<T>(
	data: Record<string, unknown>,
	converter: (key: string) => string
): T {
	return Object.fromEntries(
		Object.entries(data).map(([key, value]) => [converter(key), value])
	) as T;
}

export function snakeToCamel(str: string): string {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
