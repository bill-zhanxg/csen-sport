const Style = {
	base: ['color: #fff', 'background-color: #444', 'padding: 2px 4px', 'border-radius: 2px'],
	debug: ['color: #eee', 'background-color: blue'],
	warning: ['color: #000', 'background-color: yellow'],
	error: ['color: #eee', 'background-color: red'],
};

// TODO: Test sentry logging

export function logDebug(message: any) {
	console.debug(`%c[${getCurrentTime()}] DEBUG: ${message}`, getStyle(Style.debug));
}

export function logInfo(message: any) {
	console.info(`%c[${getCurrentTime()}] INFO: ${message}`, getStyle());
}

export function logWarn(message: any) {
	console.warn(`%c[${getCurrentTime()}] WARNING: ${message}`, getStyle(Style.warning));
}

export function logError(message: any) {
	console.error(`%c[${getCurrentTime()}] ERROR: ${message}`, getStyle(Style.error));
}

function getStyle(style?: (typeof Style)[keyof typeof Style]) {
	return Style.base.join(';') + ';' + (style ? style.join(';') : '');
}

function getCurrentTime() {
	return new Date().toLocaleTimeString('en-US', { hour12: false });
}
