/// <reference types="@sveltejs/kit" />

type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

type Brand<Base, Branding, ReservedName extends string = '__type__'> = Base & {
	[K in ReservedName]: Branding;
} & { __witness__: Base };

type Result<T, E> =
	| { readonly ok: true; readonly data: T }
	| { readonly ok: false; readonly error: E };

declare const QueryBrand: unique symbol;

type QueryDef<T> = {
	sql: string;
	[QueryBrand]: T;
};
