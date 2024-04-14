import { PluginOption } from 'vite';
import WriteNeuConfig from './write-neu-config';
import { createPackage } from '@electron/asar';

export default function neuBuild(): PluginOption {
	return {
		name: 'neu-build',
		apply: 'build',
		enforce: 'pre',
		async closeBundle() {
			console.log('Building game app');
			WriteNeuConfig(true);
			await createPackage('dist', 'bin/resources.neu');
		},
	};
}
