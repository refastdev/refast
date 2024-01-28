const path = require('path')

/** @type {import("eslint").Linter.Config} */
module.exports = {
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js'],
      env: {
        browser: true,
        node: true,
        es6: true,
        mocha: true,
        jest: true,
        jasmine: true
      },
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'jest'],
      extends: ['eslint:recommended', 'prettier'],
      rules: {
        'indent': [
          // 缩进: https://eslint.org/docs/latest/rules/indent
          'warn',
          2,
          {
            SwitchCase: 1 // switch的case语句缩进
          }
        ],
        'quotes': [
          // 单引号: https://eslint.org/docs/latest/rules/quotes
          'warn',
          'single'
        ],
        'quote-props': ['warn', 'consistent'],
        'semi': [
          // 分号: https://eslint.org/docs/latest/rules/semi
          'warn',
          'never'
        ],
        'prefer-const': [
          // const声明: https://eslint.org/docs/latest/rules/prefer-const
          'warn',
          {
            destructuring: 'any',
            ignoreReadBeforeAssign: false
          }
        ],
        '@typescript-eslint/no-explicit-any': 0, // 允许使用any: https://typescript-eslint.io/rules/no-explicit-any/
        'no-unused-vars': 0, // 允许未使用的变量: https://eslint.org/docs/latest/rules/no-unused-vars
        '@typescript-eslint/no-unused-vars': 0, // 允许未使用的变量: https://typescript-eslint.io/rules/no-unused-vars/
        'no-var': 'warn', // 没有var: https://eslint.org/docs/latest/rules/no-var
        'prefer-template': 'warn', // 使用模板字符串: https://eslint.org/docs/latest/rules/prefer-template
        'jest/expect-expect': 0, // 禁用jest断言检查: https://github.com/jest-community/eslint-plugin-jest/blob/v25.7.0/docs/rules/expect-expect.md
        'no-duplicate-imports': 0, // 禁用只能使用一条import语句, 有时可能会把import type分开: https://eslint.org/docs/latest/rules/no-duplicate-imports
        'prefer-arrow-callback': 'warn', // 优先使用箭头函数: https://eslint.org/docs/latest/rules/prefer-arrow-callback
        'no-else-return': 'warn', // else改为return: https://eslint.org/docs/latest/rules/no-else-return
        'object-shorthand': 'warn', // 属性简写: https://eslint.org/docs/latest/rules/object-shorthand
        // "space-before-function-paren": [      // 函数后面的空格: https://eslint.org/docs/latest/rules/space-before-function-paren#rule-details
        //   "warn",
        //   {
        //     "anonymous": "always",
        //     "named": "never",
        //     "asyncArrow": "always",
        //   },
        // ],
        'no-spaced-func': 'warn', // 函数名和括号之间没有空格: https://eslint.org/docs/latest/rules/no-spaced-func
        'brace-style': [
          // 大括号风格，允许写在一行
          2,
          '1tbs',
          {
            allowSingleLine: true
          }
        ],
        // 注意: 您必须禁用基本规则，因为它可能会报告不正确的错误
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': 'off', // 禁止空方法
        '@typescript-eslint/no-var-requires': 'off', // 允许require
        'react-hooks/exhaustive-deps': 'off', // 允许useEffect中传递空数组
        '@typescript-eslint/explicit-function-return-type': 'off', // 函数返回类型不强制
        '@typescript-eslint/no-empty-interface': 'off', // 允许空接口
        'react/display-name': 'off', // jsx允许空export
        'no-constant-condition': 'off', // 允许常数条件
        '@typescript-eslint/no-this-alias': 'off' // 允许this赋值给其他变量
      }
    }
  ]
}
