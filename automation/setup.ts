import { execSync } from 'child_process';
import WriteNeuConfig from './write-neu-config';

WriteNeuConfig();
execSync('neu update', { stdio: 'inherit' });
