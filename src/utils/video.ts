export interface ConvertConfig {
  quality?: number
  width?: number
  height?: number
  watermarkText: string
  watermarkTextColor: string
  outputExt: string
  editType: 'vstack' | 'up-mask' | 'down-mask' | 'mask' | 'vtoh' | 'htov'
  outputName?: string
  watermarkTextSize: number
}

const getSize = (config: ConvertConfig) => config.height || config.width ? `scale=${config.width || -1}:${(config.height / 3) || -1}` : ''
const getText = (config: ConvertConfig) => config.watermarkText ? `drawtext=text='${config.watermarkText}':fontcolor=${config.watermarkTextColor}:x=0:y=0:fontfile=font.ttf:fontsize=${config.watermarkTextSize}` : ''

// 三联屏
export const generateThreeCommand = (input: string[], config: ConvertConfig) => {
  const commands: string[] = []
  input.forEach(e => commands.push('-i', e))
  let main = `vstack=inputs=${input.length}`
  const size = getSize(config)
  // size && (main = `[0:v]${size}[top];[1:v]${size}[center];[2:v]${size}[bottom];[top][center][bottom]${config.editType}=inputs=3[v]`)
  size && (main = `[0:v][1:v][2:v]vstack=inputs=${input.length}[tmp];[tmp]scale=${config.width}:${config.height}`)
  // const text = getText(config)
  // text && (main += `${size ? ';[v]' : ''}${text}`)
  commands.push('-filter_complex', main, config.outputName ?? `output.${config.outputExt}`)
  console.log(commands)
  return commands
}

// 图片转视频
export const genterateVideoByImg = (input: string, width: number, height: number, output: string) => ['-i', input, `${output}.mp4`]

// 普通转换格式
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
  return commands
}

// 竖转横
export const generateHtoVCommand = (input: string, config: ConvertConfig) =>
  ['-i', input, '-vf', `split[a][b];[a]scale=${config.width}:${config.height},boxblur=20:5[1];[b]scale=${config.width}:ih*${config.width}/iw[2];[1][2]overlay=0:(H-h)/2`, '-c:v', 'libx264', '-crf', '18', '-aspect', '9:16', '-f', 'mp4', 'output.mp4', '-y']

// 竖版视频加黑边
export const generatePadCommand = (type: 'mask' | 'up-mask' | 'down-mask', input: string, config: ConvertConfig) => {
  let commandString = ''
  // 上下
  if (type === 'mask')
    commandString = `-i ${input} -vf pad=${config.width}:${config.height}:0:((${config.height}-ih)/2) pad.mp4`
  if (type === 'up-mask')
    commandString = `-i ${input} -vf pad=${config.width}:${config.height}:0:(${config.height}-ih) pad.mp4`
  if (type === 'down-mask')
    commandString = `-i ${input} -vf pad=${config.width}:${config.height}:0:0 pad.mp4`

  return commandString.split(' ')
}

// 给视频加图片蒙版
export const generateMaskCommand = (input: string, type: 'up-mask' | 'down-mask', offsetY: number) => {
  let commandString = ''
  if (type === 'up-mask')
    commandString = `-i ${input} -i up.png  -filter_complex overlay=0:${offsetY} up-mask.mp4`
  if (type === 'down-mask')
    commandString = `-i ${input} -i down.png  -filter_complex overlay=0:${offsetY} down-mask.mp4`

  return commandString.split(' ')
}
