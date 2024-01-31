import fs from 'fs'
import { isBinaryFileSync } from 'isbinaryfile'
import path from 'path'

const fileForeach = (
  dirPath: string,
  callback: (relativePath: string, stats: fs.Stats) => void,
  rootPath?: string
) => {
  if (rootPath == null) {
    rootPath = ''
  }
  const files = fs.readdirSync(dirPath)
  for (let i = 0; i < files.length; i++) {
    const name = files[i]
    if (name == null) continue
    const fullPath = path.join(dirPath, name)
    const relativePath = path.join(rootPath, name).replace(/\\/g, '/')
    const stat = fs.lstatSync(fullPath)
    if (stat.isDirectory()) {
      fileForeach(fullPath, callback, relativePath)
    } else {
      callback(relativePath, stat)
    }
  }
}

const dirCopy = (
  sourcePath: string,
  targetPath: string,
  writeFile: (srcPath: string, toPath: string) => boolean
) => {
  fileForeach(sourcePath, relativePath => {
    const filePath = path.join(sourcePath, relativePath)
    const targetFilePath = path.join(targetPath, relativePath)
    const dir = path.dirname(targetFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    if (!writeFile(filePath, targetFilePath)) {
      fs.copyFileSync(filePath, targetFilePath)
    }
  })
}

const isBinaryFile = (filePath: string) => {
  return isBinaryFileSync(filePath)
}

export { dirCopy, isBinaryFile }
