const { override, fixBabelImports, addLessLoader, addBabelPlugins } = require('customize-cra')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
  }),
  addBabelPlugins(['@babel/plugin-proposal-optional-chaining']),
  addBabelPlugins(['@babel/plugin-proposal-nullish-coalescing-operator'])
)
