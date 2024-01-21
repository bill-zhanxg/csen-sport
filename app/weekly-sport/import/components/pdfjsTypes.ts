export type TypedArray =
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array
	| Float64Array;
export type BinaryData = TypedArray | ArrayBuffer | Array<number> | string;
export type RefProxy = {
	num: number;
	gen: number;
};
export type OnProgressParameters = {
	/**
	 * - Currently loaded number of bytes.
	 */
	loaded: number;
	/**
	 * - Total number of bytes in the PDF file.
	 */
	total: number;
};
/**
 * Page getViewport parameters.
 */
export type GetViewportParameters = {
	/**
	 * - The desired scale of the viewport.
	 */
	scale: number;
	/**
	 * - The desired rotation, in degrees, of
	 * the viewport. If omitted it defaults to the page rotation.
	 */
	rotation?: number | undefined;
	/**
	 * - The horizontal, i.e. x-axis, offset.
	 * The default value is `0`.
	 */
	offsetX?: number | undefined;
	/**
	 * - The vertical, i.e. y-axis, offset.
	 * The default value is `0`.
	 */
	offsetY?: number | undefined;
	/**
	 * - If true, the y-axis will not be
	 * flipped. The default value is `false`.
	 */
	dontFlip?: boolean | undefined;
};
/**
 * Page getTextContent parameters.
 */
export type getTextContentParameters = {
	/**
	 * - When true include marked
	 * content items in the items array of TextContent. The default is `false`.
	 */
	includeMarkedContent?: boolean | undefined;
	/**
	 * - When true the text is *not*
	 * normalized in the worker-thread. The default is `false`.
	 */
	disableNormalization?: boolean | undefined;
};
/**
 * Page text content.
 */
export type TextContent = {
	/**
	 * - Array of
	 * {@link TextItem } and {@link TextMarkedContent } objects. TextMarkedContent
	 * items are included when includeMarkedContent is true.
	 */
	items: Array<TextItem | TextMarkedContent>;
	/**
	 * - {@link TextStyle } objects,
	 * indexed by font name.
	 */
	styles: {
		[x: string]: TextStyle;
	};
};
/**
 * Page text content part.
 */
export type TextItem = {
	/**
	 * - Text content.
	 */
	str: string;
	/**
	 * - Text direction: 'ttb', 'ltr' or 'rtl'.
	 */
	dir: string;
	/**
	 * - Transformation matrix.
	 */
	transform: Array<any>;
	/**
	 * - Width in device space.
	 */
	width: number;
	/**
	 * - Height in device space.
	 */
	height: number;
	/**
	 * - Font name used by PDF.js for converted font.
	 */
	fontName: string;
	/**
	 * - Indicating if the text content is followed by a
	 * line-break.
	 */
	hasEOL: boolean;
};
/**
 * Page text marked content part.
 */
export type TextMarkedContent = {
	/**
	 * - Either 'beginMarkedContent',
	 * 'beginMarkedContentProps', or 'endMarkedContent'.
	 */
	type: string;
	/**
	 * - The marked content identifier. Only used for type
	 * 'beginMarkedContentProps'.
	 */
	id: string;
};
/**
 * Text style.
 */
export type TextStyle = {
	/**
	 * - Font ascent.
	 */
	ascent: number;
	/**
	 * - Font descent.
	 */
	descent: number;
	/**
	 * - Whether or not the text is in vertical mode.
	 */
	vertical: boolean;
	/**
	 * - The possible font family.
	 */
	fontFamily: string;
};
/**
 * Page annotation parameters.
 */
export type GetAnnotationsParameters = {
	/**
	 * - Determines the annotations that are fetched,
	 * can be 'display' (viewable annotations), 'print' (printable annotations),
	 * or 'any' (all annotations). The default value is 'display'.
	 */
	intent?: string | undefined;
};
