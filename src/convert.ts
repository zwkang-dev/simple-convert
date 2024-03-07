import path, { extname } from 'node:path'
import process from 'node:process'
import { globby } from 'globby'
import { logger } from 'rslog'
import fsExtra from 'fs-extra'
import { uploadFileToTinyPng } from './panda-convert'

interface IOptions {
  source?: string
  target?: string
  extensions?: string[]
}

const root = process.cwd()
export async function convert(opts: IOptions) {
  const { source, target, extensions = ['.png', '.jpg', '.jpeg'] } = opts

  if (!source || !target) {
    logger.error('source and target is required')
    return
  }
  const sourcePath = path.join(root, source!)

  const files = await globby(['**/*'], {
    cwd: sourcePath,
  })

  const extensionsFile = files.filter(file => extensions.includes(extname(file))).map(file => path.join(sourcePath, file))
  for (const file of extensionsFile) {
    const buffer = await fsExtra.readFile(file)
    const content = await uploadFileToTinyPng(buffer)
    const targetPath = file.replace(sourcePath, target)
    await fsExtra.ensureFile(targetPath)
    await fsExtra.writeFile(`${targetPath}`, content)
  }

  logger.success('convert success')
}
