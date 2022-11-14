export interface ConvertConfig {
  quality?: number
  width?: number
  height?: number
  watermarkText: string
  watermarkTextColor: string
  outputExt: string
  editType: 'vstack' | 'mask' | 'hstack'
  outputName?: string
  watermarkTextSize: number
}

const getSize = (config: ConvertConfig) => config.height || config.width ? `scale=${config.width || -1}:${config.height || -1}` : ''
const getText = (config: ConvertConfig) => config.watermarkText ? `drawtext=text='${config.watermarkText}':fontcolor=${config.watermarkTextColor}:x=0:y=0:fontfile=font.ttf:fontsize=${config.watermarkTextSize}` : ''

export const generateThreeCommand = (input: string, config: ConvertConfig) => {
  const commands = ['-i', input, '-i', input, '-i', input]
  let main = 'vstack=inputs=3'
  const size = getSize(config)
  size && (main = `[0:v]${size}[top];[1:v]${size}[center];[2:v]${size}[bottom];[top][center][bottom]${config.editType}=inputs=3[v]`)
  const text = getText(config)
  text && (main += `${size ? ';[v]' : ''}${text}`)
  commands.push('-filter_complex', main, config.outputName ?? `output.${config.outputExt}`)
  console.log(commands)
  return commands
}

export const generateConvertCommand = (input: string, config: ConvertConfig) => {
  const commands = ['-i', input]
  let main = ''
  const size = getSize(config)
  size && (main = size)
  const text = getText(config)
  text && (main += `${size ? ';' : ''}${text}`)
  if (size || text)
    commands.push('-vf')
  commands.push(main, config.outputName ?? `output.${config.outputExt}`)
  console.log(commands)
  return commands
}
