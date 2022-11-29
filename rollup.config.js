const { join } = require('path')
const typescript = require('rollup-plugin-typescript2')
const cwd = __dirname

const base = {
  external: ['@tarojs/service'],
  plugins: [typescript({
    useTsconfigDeclarationDir: true
  })]
}

const compileConfig = {
  input: join(cwd, 'src/index.ts'),
  output: {
    file: join(cwd, 'dist/index.js'),
    format: 'cjs',
    sourcemap: true,
    exports: 'named'
  },
  ...base
}

const cliConfig = {
  input: join(cwd, 'src/cli.ts'),
  output: {
    exports: 'auto',
    file: join(cwd, 'dist/cli.js'),
    format: 'cjs',
    sourcemap: true
  },
  ...base
}

module.exports = [compileConfig, cliConfig]
