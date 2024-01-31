#!/usr/bin/env node
import { confirm, input, select } from '@inquirer/prompts'

import { create } from './create'

const main = async () => {
  const projectName = await input({
    message: 'Enter Your Project Name',
    default: 'example-refast-project'
  })
  const appType = await select({
    message: 'Choose App Type',
    choices: [{ name: 'web (default)', value: 'web' }, { value: 'tauri' }, { value: 'electron' }]
  })
  const script = await select({
    message: 'Choose Language',
    choices: [{ name: 'typescript (default)', value: 'typescript' }, { value: 'javascript' }]
  })
  const pkg = await select({
    message: 'Choose Package Manager',
    choices: [{ name: 'pnpm (default)', value: 'pnpm' }, { value: 'npm' }]
  })
  const framework = await select({
    message: 'Choose Framework',
    choices: [{ name: 'react (default)', value: 'react' }, { value: 'preact' }]
  })
  const isHusky = await confirm({
    message: 'Is Add Husky (default: true)',
    default: true
  })
  try {
    console.log('please wait...')
    await create({ projectName, appType, script, pkg, framework, isHusky })
    console.log(`✅ create done! ${projectName}`)
  } catch (e) {
    console.error(`${e}`)
  }
}

main()
