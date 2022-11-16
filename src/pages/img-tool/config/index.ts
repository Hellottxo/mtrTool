export const FORMAT_OPTIONS = [
  'jpeg',
  'png',
]

export const MTR_SYMBOL = [
  { type: 'image', icon: 'i-uil:image', name: '图片' },
  { type: 'i-text', icon: 'i-uil:text-fields', name: '文字' },
  { type: 'circle', icon: 'i-uil:circle', name: '圆形' },
  { type: 'rect', icon: 'i-uil:square', name: '方形' },
  { type: 'triangle', icon: 'i-uil:triangle', name: '三角形' },
  { type: 'group', icon: 'i-carbon:svg', name: 'svg' },
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
  fontWeight: 400,
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

export const HISTORY = [
  { type: 'prev', icon: 'i-uil:corner-up-left', name: '上一步' },
  { type: 'next', icon: 'i-uil:corner-up-right', name: '下一步' },
  // { type: 'reset', icon: 'i-uil:refresh', name: '重置' },
]

export const STEPS = [
  {
    element: '#router-select',
    popover: {
      title: '切换路由',
      description: '这里可以切换不同的功能唷～',
      position: 'bottom',
    },
  },
  {
    element: '#toolbar',
    popover: {
      title: '工具栏',
      description: '快来添加你的第一个素材吧！',
      position: 'left',
    },
  },
  {
    element: '#img-template',
    popover: {
      title: '模板',
      description: '虽然现在有点少，但是我们会努力的变多的！🥹',
      position: 'right',
    },
  },
  {
    element: '#preview',
    popover: {
      title: '预览区域',
      description: '可以在画布预览区域对素材进行编辑唷～',
      position: 'right',
    },
  },
  {
    element: '#download',
    popover: {
      title: '✌️',
      description: '处理完素材后就可以下载啦！',
      position: 'left',
    },
  },
]
