import { PluginOption } from 'vite';
import { title_dashed, game_dir, build_path } from './constants';
import { mkdirSync, copyFileSync } from 'fs';

const BundleLinuxApp = () => {
	console.log(`Packaging Linux app...`);

	const out_dir = `./dist/linux/${title_dashed}`;

	mkdirSync('./dist/linux');
	mkdirSync(out_dir);

	copyFileSync(`bin/neutralino-linux_x64`, `${out_dir}/${title_dashed}-x64`);
	copyFileSync(`bin/neutralino-linux_arm64`, `${out_dir}/${title_dashed}-arm64`);
	copyFileSync(`bin/neutralino-linux_armhf`, `${out_dir}/${title_dashed}-armhf`);
	copyFileSync(`bin/resources.neu`, `${out_dir}/resources.neu`);
};

export default function bundleLinuxApp() {
	return {
		name: 'build-linux-bundle',
		apply: 'build',
		closeBundle: BundleLinuxApp,
	} as PluginOption;
}
