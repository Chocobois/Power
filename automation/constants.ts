import { execSync } from 'child_process';
import { platform } from 'os';
import { team, title, description, neutralino } from '../game.config.json';

export { team, title, description, neutralino };

const tryCatch = <T>(fun: () => T, fallback: T): T => {
	try {
		return fun();
	} catch(e) {
		return fallback;
	}
}

export const git_count = tryCatch(() => execSync('git rev-list --count HEAD').toString().trim(), "-1");
export const git_short = tryCatch(() => execSync('git rev-parse --short HEAD').toString().trim(), "no-git");
export const git_version = `v${git_count}.${git_short}`;

export const year_current = new Date().getFullYear();
export const year_initial = tryCatch(() => Number(platform() == 'win32'
		? execSync('git log --reverse | findstr "Date"').toString().match(/(\d+) \+/)?.[1]
		: execSync('git log --reverse | grep "Date" -m 1').toString().match(/(\d+) \+/)?.[1]
), year_current);
export const year_copyright = year_initial == year_current 
		? `${year_initial}` : `${year_initial} - ${year_current}`;

export const team_dashed = team.toLowerCase().replace(/\s/gi, '-');
export const title_dashed = title.toLowerCase().replace(/\s/gi, '-');
export const game_dir = `${team_dashed}-${title_dashed}`;
export const build_path = `./dist/${game_dir}/`;

