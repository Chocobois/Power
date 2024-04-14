import { team, title, team_dashed, title_dashed, git_count, neutralino } from './constants';
import neuConf from './neu-template.json';
import { writeFileSync } from 'fs';

export default function WriteNeuConfig(isProd: boolean) {
	neuConf.applicationId = `${team_dashed}.${title_dashed}`;
	neuConf.modes.window.title = `${title} by ${team}`;
	neuConf.cli.binaryName = `${team_dashed}-${title_dashed}`;
	neuConf.version = `0.0.${git_count}`;
	if(isProd) {
		neuConf.documentRoot = "/web/";
		neuConf.cli.resourcesPath = "/";
		neuConf.modes.window.icon = "/web/icon.png";
	} else {
		neuConf.tokenSecurity = 'none';
	}

	neuConf.nativeAllowList = [...neuConf.nativeAllowList, ...neutralino.allow];

	writeFileSync(isProd ? 'dist/neutralino.config.json' : 'neutralino.config.json', JSON.stringify(neuConf));
	writeFileSync('./src/public/__neutralino_globals.js', '// Dummy file');
}
