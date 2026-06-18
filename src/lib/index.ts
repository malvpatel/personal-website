// place files you want to import through the `$lib` alias in this folder.

export interface Position {
	x: number;
	y: number;
}

export interface Rect extends Position {
	width: number;
	height: number;
}

export interface BoxPoints {
	topLeft: [number, number];
	topMid: [number, number];
	topRight: [number, number];
	centerLeft: [number, number];
	centerMid: [number, number];
	centerRight: [number, number];
	botLeft: [number, number];
	botMid: [number, number];
	botRight: [number, number];
}

/**
 *
 * @param input e.g. "example"
 * @returns "Example" capitalized first letter for input
 */
export function upperFirst(input: string): string {
	if (input.length === 0) return input;
	return input.charAt(0).toLocaleUpperCase() + input.substring(1);
}

// export function computeBoxPoints(x: Position['x'], y: Position['y'], width: Rect['width'], height: Rect["height"]): BoxPoints {

// }
