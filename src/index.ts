import * as path from 'path'
import { merge, get } from 'lodash'
import type { IPluginContext } from '@tarojs/service'

export default (ctx: IPluginContext) => {
  ctx.registerPlatform({
    name: 'ysf',
    useConfigName: 'h5',
    async fn({ config }) {
      console.log('云闪付小程序编译...');
      const { appPath, outputPath, sourcePath } = ctx.paths
      const { initialConfig } = ctx
      const { port } = ctx.runOpts.options
      const { emptyDirectory, recursiveMerge, npm, ENTRY, SOURCE_DIR, OUTPUT_DIR } = ctx.helper
      emptyDirectory(outputPath)
      const entryFileName = `${ENTRY}.config`
      const entryFile = path.basename(entryFileName)
      const defaultEntry = {
        [ENTRY]: [path.join(sourcePath, entryFile)]
      }
      const customEntry = get(initialConfig, 'h5.entry')

      const h5RunnerOpts = recursiveMerge(Object.assign({}, config), {
        entryFileName: ENTRY,
        env: {
          TARO_ENV: JSON.stringify('ysf'),
          FRAMEWORK: JSON.stringify(config.framework),
          TARO_VERSION: require(path.join(ctx.paths.nodeModulesPath, '@tarojs/taro/package.json')).version
        },
        devServer: { port },
        sourceRoot: config.sourceRoot || SOURCE_DIR,
        outputRoot: config.outputRoot || OUTPUT_DIR
      })
      h5RunnerOpts.entry = merge(defaultEntry, customEntry)
      const htmlPluginOption = h5RunnerOpts.htmlPluginOption ?? {};
      htmlPluginOption.upsdk = `<script src="https://open.95516.com/s/open/js/upsdk.js"></script>`;
      h5RunnerOpts.htmlPluginOption = htmlPluginOption;
      
      let runnerPkg: string
      const compiler = typeof config.compiler === 'object' ? config.compiler.type : config.compiler
      switch (compiler) {
        case 'webpack5':
          runnerPkg = '@tarojs/webpack5-runner/dist/index.h5.js'
          // 需要禁用webpack5的prebundle
          h5RunnerOpts.compiler = {
            type: 'webpack5',
            prebundle: {
              enable: false
            }
          }
          break
        default:
          runnerPkg = '@tarojs/webpack-runner/dist/index.js'
      }

      const webpackModule = await npm.getNpmPkg(runnerPkg, appPath)
      const webpackRunner = webpackModule.default;
      webpackRunner(appPath, h5RunnerOpts)
    }
  })
}
