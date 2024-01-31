import fs from 'fs'
import path from 'path'

import { dirCopy, isBinaryFile } from './utils'

interface ProjectOptions {
  projectName: string
  appType: string
  script: string
  pkg: string
  framework: string
  isHusky: boolean
}

const generateProject = async (
  templatePath: string,
  projectPath: string,
  options: ProjectOptions
) => {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`template missing: ${templatePath}`)
  }
  const REPLACE_REG = /{{PROJECT_NAME}}/g
  dirCopy(templatePath, projectPath, (srcPath, toPath) => {
    if (!isBinaryFile(srcPath)) {
      const data = fs.readFileSync(srcPath, { encoding: 'utf8' })
      const newData = data.replace(REPLACE_REG, options.projectName)
      fs.writeFileSync(toPath, newData, { encoding: 'utf8' })
      return true
    }
    return false
  })
}

const create = async (options: ProjectOptions) => {
  const currentPath = process.cwd()
  const targetProjectPath = path.resolve(currentPath, options.projectName)
  if (fs.existsSync(targetProjectPath)) {
    throw new Error(`folder: '${options.projectName}' already exists`)
  }
  const templatePath = path.resolve(__dirname, '../template')
  const templateName = `${options.appType}-${options.script}`
  const templateSourcePath = path.join(templatePath, templateName)
  await generateProject(templateSourcePath, targetProjectPath, options)
}

export { create }
