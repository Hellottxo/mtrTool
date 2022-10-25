import type { UploadFile } from 'ant-design-vue'
import type { FORMAT_OPTIONS } from '~/pages/img-tool/config'

export interface ConvertConfig {
  quality?: number
  width?: number
  height?: number
}

interface ExtConfig {
  inputExt?: typeof FORMAT_OPTIONS[number]
  outputExt?: typeof FORMAT_OPTIONS[number]
}

interface ConvertSource {
  file: UploadFile
  arrayBuffer: ArrayBuffer
}

const generateConvertCommand = (name: string, extConfig: ExtConfig, config: ConvertConfig) => {
  const commands: string[] = ['convert']
  config.height && config.width && commands.push('-size', `${config.width}x${config.height}`)
  commands.push(`${name}.${extConfig.inputExt}`)
  config.quality && commands.push('-quality', config.quality.toString())
  commands.push(`${name}.${extConfig.outputExt}`)
  return commands
}

const genertateCompositeCommand = (files: any[]) => {
  const commands = ['convert', '-append']
  files.forEach(e => commands.push(e.name))

  return commands
}

export const convertImage = async (
  type: string,
  sourceList: ConvertSource[],
  outputExt: typeof FORMAT_OPTIONS[number],
  config: ConvertConfig,
) => {
  const list = sourceList.map((e) => {
    const index = e.file.name.lastIndexOf('.')
    const name = e.file.name.slice(0, index)
    const inputExt = e.file.name.slice(index + 1)
    return { ...e, name, inputExt }
  })
  const bytes: Uint8Array[] = sourceList.map(e => new Uint8Array(e.arrayBuffer))
  const inputFiles = bytes.map((e, index) => ({ name: sourceList[index].file.name, content: e, outPut: `${list[index].name}.${outputExt}` }))
  if (type === 'convert') {
    list.forEach(({ name, inputExt }, i) => {
      const commands = generateConvertCommand(name, { inputExt, outputExt }, config)
      FS.writeFile(inputFiles[i].name, inputFiles[i].content)
      console.log(commands)
      Module.callMain(commands)
    })
    const resFile = []
    inputFiles.forEach((e, i) => {
      let err = false
      let index = 0
      while (!err) {
        try {
          console.log(index)
          resFile.push(FS.readFile(`${list[i].name}-${index}.png`))
          index += 1
        }
        catch (error) {
          console.log(222)
          err = true
        }
      }
    })
    console.log(resFile)
    return resFile
  }
  if (type === 'composite') {
    const commands = genertateCompositeCommand(inputFiles)
    commands.push(`out.${outputExt}`)
    inputFiles.map(e => FS.writeFile(e.name, e.content))
    console.log(commands)
    Module.callMain(commands)
    console.log(FS.readFile(`out.${outputExt}`).buffer)
    return [FS.readFile(`out.${outputExt}`)]
  }
  if (type === 'readInfo')
    readInfo(inputFiles)
}

export const readInfo = (files: { name: string; content: Uint8Array; outPut: string }[]) => {
  files.map(e => FS.writeFile(e.name, e.content))
  const commands = ['identify', '-verbose', files[0].name]
  console.log(commands)
  Module.callMain(commands)
}
