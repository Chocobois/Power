import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default (options?: Parameters<typeof ViteImageOptimizer>[0]) => {
	const optimizer = ViteImageOptimizer(options);
	optimizer.closeBundle = { sequential: true, handler: optimizer.closeBundle as any}
	optimizer.enforce = 'pre';
	return optimizer;
}
