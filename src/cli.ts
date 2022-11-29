import * as path from 'path'
import fs from 'fs'
import minimist from 'minimist'

// 需要入侵源码进行修改的文件
const changeIffiles = [
  path.resolve(process.cwd(), '../../@tarojs/plugin-framework-react/dist/index.js'),
  path.resolve(process.cwd(), '../../@tarojs/plugin-framework-react/dist/runtime.js'),
  path.resolve(process.cwd(), '../../@tarojs/runtime/dist/runtime.esm.js'),
  path.resolve(process.cwd(), '../../@tarojs/webpack5-runner/dist/webpack/Combination.js'),
  path.resolve(process.cwd(), '../../@tarojs/webpack5-prebundle/dist/index.js'),
  path.resolve(process.cwd(), '../../@tarojs/webpack5-prebundle/dist/webpack/TaroContainerPlugin.js'),
  path.resolve(process.cwd(), '../../@tarojs/webpack5-prebundle/dist/webpack/TaroContainerReferencePlugin.js'),
  path.resolve(process.cwd(), '../../@tarojs/webpack5-prebundle/dist/webpack/TaroRemoteRuntimeModule.js'),
  path.resolve(process.cwd(), '../../@tarojs/webpack5-runner/dist/postcss/postcss.h5.js'),
  path.resolve(process.cwd(), '../../@tarojs/api/dist/taro.js'),
  path.resolve(process.cwd(), '../../@tarojs/api/dist/index.js'),
  path.resolve(process.cwd(), '../../@tarojs/api/dist/index.esm.js'),
  path.resolve(process.cwd(), '../../babel-preset-taro/index.js'),
  path.resolve(process.cwd(), '../../postcss-html-transform/dist/index.js'),
  path.resolve(process.cwd(), '../../postcss-pxtransform/index.js')
];

// 修改Taro源码，开启H5扩展云闪付支持
const changeFile = (filePath: string) => {
  const is_exists = fs.existsSync(filePath);
  if (is_exists) {
    let context = fs.readFileSync(filePath, 'utf8');
    if (context.indexOf(`['h5', 'ysf'].indexOf(process.env.TARO_ENV)`) < 0) {
      context = context.replace(/process.env.TARO_ENV === 'h5'/g, `['h5', 'ysf'].indexOf(process.env.TARO_ENV) >= 0`);
      context = context.replace(/process.env.TARO_ENV !== 'h5'/g, `['h5', 'ysf'].indexOf(process.env.TARO_ENV) < 0`);
      fs.writeFileSync(filePath, context, 'utf8');
    }
    if (context.indexOf(`case 'ysf':`) < 0) {
      context = context.replace(/case 'h5':/g, `case 'ysf':\ncase 'h5':`);
      fs.writeFileSync(filePath, context, 'utf8');
    }
  }
}

// 修改Taro源码，关闭H5扩展云闪付支持
const restoreFile = (filePath: string) => {
  const is_exists = fs.existsSync(filePath);
  if (is_exists) {
    let context = fs.readFileSync(filePath, 'utf8');
    if (context.indexOf(`['h5', 'ysf'].indexOf(process.env.TARO_ENV)`) >= 0) {
      const regx1 = new RegExp(`\\[(.*?)\\].indexOf\\(process.env.TARO_ENV\\) >= 0`, 'gim');
      context = context.replace(regx1, "process.env.TARO_ENV === 'h5'");
      const regx2 = new RegExp(`\\[(.*?)\\].indexOf\\(process.env.TARO_ENV\\) < 0`, 'gim');
      context = context.replace(regx2, "process.env.TARO_ENV !== 'h5'");
      fs.writeFileSync(filePath, context, 'utf8');
    }
    if (context.indexOf(`case 'ysf':`) >= 0) {
      context = context.replace(/case 'ysf':\n/g, ``);
      fs.writeFileSync(filePath, context, 'utf8');
    }
  }
}

const args = minimist(process.argv.slice(2));
switch (args.type) {
  case 'enabled':
    changeIffiles.forEach(f => {
      changeFile(f);
    });
    break;
  case 'disabled':
    changeIffiles.forEach(f => {
      restoreFile(f);
    });
    break;
}
