/** @type {import("prettier").Config} */
module.exports = {
  arrowParens: 'avoid', // 只有一个参数的箭头函数也带括号, 不带括号是avoid
  bracketSameLine: false, // </>放在最后一行的末尾
  bracketSpacing: true, // 大括号间使用空格
  htmlWhitespaceSensitivity: 'ignore',
  importOrder: ['^[./]'],
  importOrderSeparation: true, // 用于启用或禁用排序的导入声明组之间的新行分隔
  importOrderSortSpecifiers: true, // 用于启用或禁用导入声明中说明符的排序
  importOrderGroupNamespaceSpecifiers: false, // 用于启用或禁用将命名空间说明符排序到导入组的顶部
  importOrderCaseInsensitive: false, // 用于在用于对每个匹配组内的导入进行排序的排序算法中启用不区分大小写
  jsxSingleQuote: false,
  pluginSearchDirs: false, // 不自动加载插件, 不然会自动加载一些明明没有配置的插件进去导致问题
  printWidth: 100, // 每行最长代码长度
  proseWrap: 'preserve', // 使用默认的拆行标准
  quoteProps: 'consistent', // 是否有引号配置
  semi: false, // 自动加分号
  singleQuote: true, // 单引号
  tabWidth: 2, // 缩进空格数
  trailingComma: 'none', // 多行使用拖尾逗号
  useTabs: false, // 不使用tab缩进
  plugins: [
    '@trivago/prettier-plugin-sort-imports', // 自动排序import
    'prettier-plugin-sort-json' // 自动对json文件的key排序
  ]
}
