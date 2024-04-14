import { PluginOption } from 'vite';
import { title, title_dashed, game_dir, build_path, git_count, description, git_version, team } from './constants';
import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'fs';
import { NtExecutable, NtExecutableResource, Data, Resource } from 'resedit';
import pngToIco from 'png-to-ico';

const BundleWinApp = async () => {
	console.log(`Packaging Windows exe...`);

	const out_dir = `./dist/win/${title_dashed}`;

	mkdirSync('./dist/win');
	mkdirSync(out_dir);
	copyFileSync(`bin/resources.neu`, `${out_dir}/resources.neu`);

	const data = readFileSync(`bin/neutralino-win_x64.exe`);
	const exe = NtExecutable.from(data);
	const res = NtExecutableResource.from(exe);

	const pngData = readFileSync('./src/public/icon.png');
	const iconFile = Data.IconFile.from(await pngToIco(pngData));
	Resource.IconGroupEntry.replaceIconsForResource(
		res.entries, 101, 1033,
		iconFile.icons.map((item) => item.data)
	);

	const vi = Resource.VersionInfo.createEmpty();
	vi.setFileVersion(0, 0, Number(git_count), 0, 1033);
	vi.setStringValues(
		{ lang: 1033, codepage: 1200 },
		{
			FileDescription: description,
			ProductName: `${title} by ${team}`,
			ProductVersion: git_version,
			CompanyName: team,
		}
	);
	vi.outputToResourceEntries(res.entries);

	res.outputResource(exe);
	writeFileSync(`${out_dir}/${title}.exe`, Buffer.from(exe.generate()));
};

export default function bundleWinApp() {
	return {
		name: 'build-windows-bundle',
		apply: 'build',
		enforce: 'pre',
		closeBundle: {
			handler: BundleWinApp,
			sequential: true
		},
	} as PluginOption;
}
