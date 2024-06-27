import { getPackageJson, resolvePkgPath, getBaseRollupPlugins } from './utils';
import rollupPluginGeneratePackageJson from 'rollup-plugin-generate-package-json';

// 为什么用getPackageJson拿name再获取路径，好怪
// const { name, module } = getPackageJson('react');
// const pkgPath = resolvePkgPath(name);
// const distPath = resolvePkgPath(name, true);

// 试试我的写法吧
const pkgName = 'react';
const { module } = getPackageJson(pkgName);
const pkgPath = resolvePkgPath(pkgName);
const pkgDistPath = resolvePkgPath(pkgName, true);

export default [
	// react
	{
		input: `${pkgPath}/${module}`,
		output: {
			file: `${pkgDistPath}/index.js`,
			name: 'index.js',
			format: 'umd'
		},
		plugins: [
			...getBaseRollupPlugins(),
			rollupPluginGeneratePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				baseContents: ({ name, version, description }) => ({
					name,
					version,
					description,
					main: 'index.js'
				})
			})
		]
	},
	{
		input: `${pkgPath}/src/jsx.ts`,
		output: [
			// react-runtime
			{
				file: `${pkgDistPath}/jsx-runtime.js`,
				name: 'jsx-runtime.js',
				format: 'umd'
			},
			// react-dev-runtime
			{
				file: `${pkgDistPath}/jsx-dev-runtime.js`,
				name: 'jsx-dev-runtime.js',
				format: 'umd'
			}
		],
		plugins: getBaseRollupPlugins()
	}
];
