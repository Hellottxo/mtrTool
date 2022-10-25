export const FORMAT_OPTIONS = [
  'jpeg',
  'png',
]

export const ACCEPT = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
]

export const MTR_SYMBOL = [
  { type: 'image', icon: 'i-uil:image', name: '图片' },
  { type: 'i-text', icon: 'i-uil:text-fields', name: '文字' },
  { type: 'circle', icon: 'i-uil:circle', name: '圆形' },
  { type: 'rect', icon: 'i-uil:square', name: '方形' },
  { type: 'triangle', icon: 'i-uil:triangle', name: '三角形' },
]

const symbolMap: Record<string, string> = {}
MTR_SYMBOL.forEach(e => symbolMap[e.type] = e)
export const SYMBOL_MAP = { ...symbolMap }

export const TEXT_ATTRIBUTE = {
  textBackgroundColor: '',
  lineHeight: 1,
  fontSize: 40,
  charSpacing: 0,
  textAlign: 'left',
}

export const COMMON_ATTRIBUTE = {
  fill: '#ffb636',
  stroke: '',
  strokeWidth: 0,
  shadow: {
    color: '',
    blur: 1,
    offsetX: 1,
    offsetY: 1,
  },
}

export const PREDEFINE_COLOR = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
]

export const HISTORY = [
  { type: 'prev', icon: 'i-uil:corner-up-left', name: '上一步' },
  { type: 'next', icon: 'i-uil:corner-up-right', name: '下一步' },
  // { type: 'reset', icon: 'i-uil:refresh', name: '重置' },
]
