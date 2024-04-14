import { PluginOption } from 'vite';
import { readFileSync } from 'fs';

const tryCatch = <T>(fun: () => T, fallback: T): T => {
	try {
		return fun();
	} catch(e) {
		return fallback;
	}
}

const getGlobalsPath = () => {
	const isDev = process.env.NODE_ENV == 'development';
	const authInfo = JSON.parse(tryCatch(() => readFileSync('.tmp/auth_info.json').toString(), '{}'));
	const port = authInfo.nlPort;
	return `${(isDev && port) ? `http://localhost:${port}/` : ''}__neutralino_globals.js`
}

export default function neuInject(): PluginOption {
	return {
		name: 'neu-inject',
		transformIndexHtml: (html) => {
			return {
				html,
				tags: [{
					tag: 'script',
					injectTo: 'head-prepend',
					attrs: {
						src: getGlobalsPath()
					},
				}]
			};
		}
	};
}



