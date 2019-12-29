const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', { // 配置上 babel-plugin-import（按需打包）
    libraryName: 'antd', // 针对的是 antd 组件库
    libraryDirectory: 'es', // 对应源码文件夹中的 es 文件夹
    style: true, // 自动打包相关的 css
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {'@primary-color': '#1DA57A'},
  }),
);