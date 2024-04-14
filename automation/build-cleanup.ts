import { PluginOption } from 'vite';
import { rimrafSync } from 'rimraf';
import { writeFileSync } from 'fs';
import { build_path, title_dashed } from './constants';

const BuildCleanup = () => {
	rimrafSync(build_path);
	rimrafSync('./dist/neutralino.config.json');
	rimrafSync('./neutralino.config.json');
	writeFileSync('./dist/meta.json', JSON.stringify({title: title_dashed}));
}

export default function buildCleanup() {
	return {
		name: 'build-cleanup',
		apply: 'build',
		enforce: 'post',
		closeBundle: BuildCleanup,
	} as PluginOption;
}
