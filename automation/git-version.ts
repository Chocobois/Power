import { PluginOption } from 'vite';
import { writeFileSync } from 'fs';
import { git_count, git_short, git_version, title, team } from './constants';

const WriteGitVersion = () => {
	writeFileSync('./src/version.json', JSON.stringify({
		title,
		team,
		count: git_count,
		short: git_short,
		version: git_version
	}));
}

export default function writeGitVersion() {
	return {
		name: 'write-version-json',
		buildStart: WriteGitVersion
	} as PluginOption;
}
