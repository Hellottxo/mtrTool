<script setup lang="ts">
import { fabric } from 'fabric'
import type { UploadUserFile } from 'element-plus'
import type { ConfigResult, DetectResult, RecognizeResult } from 'tesseract.js'
import { createScheduler } from 'tesseract.js'
import axios from 'axios'
import { addImg, addShape, addText, deleteObject, exportImg, setBackground } from './utils'
import { COMMON_ATTRIBUTE, TEXT_ATTRIBUTE } from './config'
import Layer from './components/Toolbar/layer.vue'
import AddMtr from './components/Toolbar/addMtr.vue'
// import Background from './components/Toolbar/background.vue'
import TextAttribute from './components/Toolbar/text.vue'
import CommonAttribute from './components/Toolbar/common.vue'
import Operation from './components/Toolbar/operation.vue'
import { convertImage, speedRecognize } from '~/utils/psd-translate'
import { getArrayBuffer } from '~/utils/utils'
import quickKeys from '~/utils/hotkeys'

const layerList = ref<Record<string, string>[]>([])
const activeLayer = ref<any[]>([])
const showTextAttribute = ref(false)
const background = reactive({ color: '', img: null, width: 900, height: 1200, scale: 0.5 })
const textAttribute = ref({ ...TEXT_ATTRIBUTE })
const commonAttribute = ref({ ...COMMON_ATTRIBUTE })
const prevList = ref<any[]>([])
const nextList = ref<any[]>([])
const loading = ref(false)
const loadingText = ref('')

let card: any = null
const MAX_HIS = 10

const getTextLayer = (textList: (ConfigResult | RecognizeResult | DetectResult)[], infoList: Record<string, number>[]) => {
  const list = [...card.getObjects()]
  textList.forEach(async (e, index) => {
    const { data: { text } } = e
    const str = text.replace('|', 'I').replace('\n', '')
    const reg = /^[\u4E00-\u9FA5A-Za-z0-9!.]+$/
    if (reg.test(str.replaceAll(' ', ''))) {
      deleteObject(card, list[index])
      const info = infoList[index]
      const res = await axios.post('/api/translate', {
        text: str,
      })
      const translateText = res.data.data.TargetText
      addText(card, translateText, { ...info, ratio: info.height * info.ratio / 40, fill: info.color })
    }
  })
}

const fileChange = async (file: UploadUserFile) => {
  loading.value = true
  loadingText.value = '素材加载中'
  let msgInstance = ElMessage({
    message: '素材加载中',
    duration: 0,
  })
  const arrayBuffer = await getArrayBuffer(file.raw!)
  const output = await convertImage('convert', [{ file, arrayBuffer }], 'png', {}) || []
  const info = await convertImage('readInfo', [{ file, arrayBuffer }], 'png', {}) || []
  const { width, height } = info[0]
  const ratio = width > 800 ? 0.6 : 1
  card.setWidth(width * ratio)
  card.setHeight(height * ratio)
  const infoList = info.slice(1).map(e => ({
    ...e,
    ratio,
    left: e.left * ratio,
    top: e.top * ratio,
  }))
  const scheduler = createScheduler()
  const list: Promise<ConfigResult | RecognizeResult | DetectResult>[] = []
  output.slice(1).forEach((e, index) => {
    const url = URL.createObjectURL(new Blob([e.buffer]))
    addImg(card, { url }, {
      ratio,
      left: infoList[index].left,
      top: infoList[index].top,
    })
    list.push(speedRecognize(url, scheduler))
  })
  loading.value = false
  msgInstance.close()
  msgInstance = ElMessage({
    message: '素材翻译中',
    duration: 0,
  })
  Promise.all(list).then((res) => {
    getTextLayer(res, infoList)
    scheduler.terminate()
  }).finally(() => {
    msgInstance.close()
    ElMessage.success('素材翻译完成！')
  })
}

const getLayerList = () => {
  console.log('qqwww', card.getObjects())
  layerList.value = [...card.getObjects()].reverse()
}

const updateTextAttribute = () => {
  const textLayer = activeLayer.value.filter(e => e.type === 'i-text')
  // 选中层中包含多个文字图层，则不展示文字修改框
  showTextAttribute.value = textLayer.length === 1
  if (textLayer.length === 1) {
    const textItem = textLayer[0]
    textAttribute.value = {
      textBackgroundColor: textItem.textBackgroundColor,
      lineHeight: Number(textItem.lineHeight),
      fontSize: Number(textItem.fontSize),
      charSpacing: Number(textItem.charSpacing),
      textAlign: textItem.textAlign,
    }
  }
  else {
    textAttribute.value = { ...TEXT_ATTRIBUTE }
  }
}

const updateCommonAttribute = () => {
  if (activeLayer.value.length === 1) {
    const { shadow } = activeLayer.value[0]
    commonAttribute.value = {
      fill: activeLayer.value[0].fill,
      stroke: activeLayer.value[0].stroke,
      strokeWidth: Number(activeLayer.value[0].strokeWidth),
      shadow: shadow || { ...COMMON_ATTRIBUTE.shadow },
    }
  }
  else {
    commonAttribute.value = { ...COMMON_ATTRIBUTE }
  }
}

const handleSelectLayer = (item: any[]) => {
  card.discardActiveObject()
  item.forEach(e => card.setActiveObject(e))
  card.renderAll()
}

// const updateBackground = (key: string, val: UploadUserFile | string | number, val2: number) => {
//   if (key === 'size') {
//     background.width = val as number
//     background.height = val2 as number
//     card.setWidth(val * background.scale)
//     card.setHeight(val2 * background.scale)
//     return
//   }
//   if (key === 'color') {
//     background.color = val as string
//     card.backgroundColor = val
//     card.renderAll()
//   }
//   if (key === 'img')
//     setBackground(card, val as UploadUserFile)
// }

let inHistoryOperation = false
const saveHistory = () => {
  const data = card.toJSON(['id'])
  if (inHistoryOperation)
    return
  nextList.value = []
  if (prevList.value.length > MAX_HIS)
    prevList.value.shift()

  prevList.value.push(data)
}

const onSelectedUpdate = () => {
  activeLayer.value = card.getActiveObjects()
  updateTextAttribute()
  updateCommonAttribute()
}

const setControlsStyle = () => {
  fabric.Object.prototype.cornerSize = 8
  fabric.Object.prototype.cornerStrokeColor = '#00b89c'
  fabric.Object.prototype.cornerStyle = 'circle'
  fabric.Object.prototype.borderColor = '#00b89c'
}

const afterRender = () => {
  getLayerList()
  inHistoryOperation = false
}

const init = () => {
  card = new fabric.Canvas('canvas')
  card.setWidth(background.width * background.scale)
  card.setHeight(background.height * background.scale)
  saveHistory()
  card.on('after:render', afterRender)
  card.on('selection:created', onSelectedUpdate)
  card.on('selection:updated', onSelectedUpdate)
  card.on('selection:cleared', onSelectedUpdate)
  card.on('object:modified', saveHistory)
  card.on('object:added', saveHistory)

  card.preserveObjectStacking = true
  setControlsStyle()
  quickKeys(card)
}
onMounted(init)

const updateLayer = (item: any) => {
  if (!item)
    return
  card.discardActiveObject()
  card.setActiveObject(item.element)
  const { oldIndex: preIndex, newIndex: currentIndex } = item
  let step = Math.abs(preIndex - currentIndex)
  while (step > 0) {
    preIndex < currentIndex ? item.element.bringToFront() : item.element.bringForward()
    step -= 1
  }
  console.log(card.getActiveObjects()[0].lineHeight)
}
const addMtr = (key: keyof typeof addShape) => {
  addShape[key](card)
}

const attributeChg = (type: string, key: string, val: unknown) => {
  const map = {
    text: textAttribute.value,
    common: commonAttribute.value,
  }
  map[type][key] = val
  card.getActiveObjects().forEach((e: any) => {
    e && e.set(key, val)
  })
  card.renderAll()
}

const commonAttributeChg = (key: string, val: unknown) => attributeChg('common', key, val)
const textAttributeChg = (key: string, val: unknown) => attributeChg('text', key, val)

const shadowChg = (key: string, val: unknown) => {
  const shadow = {
    ...commonAttribute.value.shadow,
    [key]: val,
  }
  commonAttribute.value.shadow = { ...shadow }
  card.getActiveObjects().forEach((e: any) => {
    e && e.set('shadow', new fabric.Shadow(shadow))
  })
  card.renderAll()
}
const renderCanvas = (data: any) => {
  card.clear()
  card.loadFromJSON(data, card.renderAll.bind(card))
  card.renderAll()
}
const saveImg = () => exportImg(card)
const operate = (key: string) => {
  inHistoryOperation = true
  if (key === 'prev') {
    const item = prevList.value.pop()
    nextList.value.push(item)
    renderCanvas(prevList.value[prevList.value.length - 1])
  }
  if (key === 'next') {
    const item = nextList.value.pop()
    prevList.value.push(item)
    renderCanvas(item)
  }
}

const delLayer = (id: string) => {
  const item = card.getObjects().find((e: any) => e.id === id)
  deleteObject(card, item)
  const index = activeLayer.value.findIndex(e => e.id === id)
  if (index > -1) {
    const list = [...activeLayer.value]
    handleSelectLayer(list)
  }
}
</script>

<template>
  <div flex h-full>
    <div
      flex flex-col w-full h-full justify-center
      items-center
    >
      <canvas id="canvas" w-full h-full dark:bg-gray-9 bg-gray-1 />
      <div v-show="!layerList.length" i-fxemoji:mountainrailway position-absolute text-40 opacity-40 />
    </div>
    <div border-l-1 border-gray-1 dark:border-gray-7 h-full max-w-lg p-x-4 w-80 flex-none overflow-auto>
      <!-- 操作 -->
      <Operation :config="{ prev: prevList.length - 1, next: nextList.length }" @saveImg="saveImg" @operate="operate" />
      <!-- 上传 -->
      <AddMtr @addImg="fileChange" @addMtr="addMtr" />
      <!-- 图层 -->
      <Layer
        v-if="layerList.length"
        :layer-list="layerList"
        :active-layer="activeLayer"
        @selectLayer="handleSelectLayer"
        @updateLayer="updateLayer"
        @delLayer="delLayer"
      />
      <!-- 基础信息 -->
      <CommonAttribute :attribute="commonAttribute" @commonAttributeChg="commonAttributeChg" @shadowChg="shadowChg" />
      <!-- 背景设置 -->
      <!-- <Background :background="background" @updateConfig="updateBackground" /> -->
      <!-- 文字 -->
      <TextAttribute v-if="showTextAttribute" :attribute="textAttribute" @textAttributeChg="textAttributeChg" />
    </div>
  </div>
</template>

<style>
.ant-spin-container {
  height: 100%;
}
</style>
