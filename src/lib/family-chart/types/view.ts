import type { TreeDatum } from './treeData';
import type { Link } from '../layout/create-links';
import type { Selection, BaseType } from 'd3';

export interface CardHtmlSelection extends Selection<
	HTMLDivElement,
	TreeDatum,
	BaseType,
	unknown
> {}

export interface LinkSelection extends Selection<SVGPathElement, Link, BaseType, unknown> {}
