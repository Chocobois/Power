import { execSync } from 'child_process';
import WriteNeuConfig from './write-neu-config';

WriteNeuConfig();
execSync('vite', { stdio: 'inherit' });