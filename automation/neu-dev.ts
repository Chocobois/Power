import { exec } from 'child_process';
import WriteNeuConfig from './write-neu-config';

WriteNeuConfig();
const vite = exec('vite');
vite.stdout?.pipe(process.stdout);
exec('neu run -- --window-enable-inspector=true').on('close', () => {
	vite.kill();
	process.exit();
});
