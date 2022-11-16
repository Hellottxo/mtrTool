<script setup lang="ts">
import { fabric } from 'fabric'
import type { UploadUserFile } from 'element-plus'
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
import axios from 'axios'
import { addImg, addShape, deleteObject, exportImg, setBackground } from './utils'
import { COMMON_ATTRIBUTE, STEPS, TEXT_ATTRIBUTE } from './config'
import Layer from './components/Toolbar/layer.vue'
import AddMtr from './components/Toolbar/addMtr.vue'
import Background from './components/Toolbar/background.vue'
import TextAttribute from './components/Toolbar/text.vue'
import CommonAttribute from './components/Toolbar/common.vue'
import Operation from './components/Toolbar/operation.vue'
import ImgTemplate from './components/Template/index.vue'
import quickKeys from '~/utils/hotkeys'

const layerList = ref<Record<string, string>[]>([])
const activeLayer = ref<any[]>([])
const showTextAttribute = ref(false)
const background = reactive({ color: '', img: null, width: 900, height: 1200, scale: 0.5 })
const textAttribute = ref({ ...TEXT_ATTRIBUTE })
const commonAttribute = ref({ ...COMMON_ATTRIBUTE })
const prevList = ref<any[]>([])
const nextList = ref<any[]>([])

const DRIVER_KEY = '@imgTool/isNewUser'

let card: any = null
const MAX_HIS = 10

const fileChange = async (file: UploadUserFile) => addImg(card, file)

const getLayerList = () => {
  console.log(card.getObjects())
  layerList.value = [...card.getObjects()].reverse()
}

const updateTextAttribute = () => {
  const textLayer = activeLayer.value.filter(e => e.type === 'i-text')
  // 选中层中包含多个文字图层，则不展示文字修改框
  showTextAttribute.value = textLayer.length === 1
  if (textLayer.length === 1) {
    const textItem = textLayer[0]
    console.log(textItem)
    textAttribute.value = {
      textBackgroundColor: textItem.textBackgroundColor,
      lineHeight: Number(textItem.lineHeight),
      fontSize: Number(textItem.fontSize),
      charSpacing: Number(textItem.charSpacing),
      textAlign: textItem.textAlign,
      fontWeight: Number(textItem.fontWeight),
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

const handleSelectLayer = (item: any) => {
  card.discardActiveObject()
  card.setActiveObject(item)
  card.requestRenderAll()
}

const updateBackground = (key: string, val: UploadUserFile | string | number, val2: number) => {
  if (key === 'size') {
    background.width = val as number
    background.height = val2 as number
    card.setWidth(val * background.scale)
    card.setHeight(val2 * background.scale)
    return
  }
  if (key === 'color') {
    background.color = val as string
    card.backgroundColor = val
    card.renderAll()
  }
  if (key === 'img')
    setBackground(card, val as UploadUserFile)
}

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

const setDriver = () => {
  if (localStorage.getItem(DRIVER_KEY))
    return
  nextTick(() => {
    const driver = new Driver({
      doneBtnText: '完成', // Text on the final button
      closeBtnText: '关闭', // Text on the close button for this step
      nextBtnText: '下一步', // Next button text for this step
      prevBtnText: '上一步',
    })
    driver.defineSteps(STEPS)
    driver.start()
  })
  localStorage.setItem(DRIVER_KEY, '1')
}

onMounted(() => {
  init()
  setDriver()
})

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
  console.log(textAttribute.value)
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

const addJson = (key: string) => {
  axios.get(`../../../../src/assets/json/${key}.json`).then((res) => {
    card.loadFromJSON(JSON.stringify(res.data), card.renderAll.bind(card))
  })
}

// const saveTemplate = () => {
//   const url = tcard.toJSON(['id'])
//   const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(url, null, '\t'))}`;

// }
</script>

<template>
  <div flex h-full>
    <div border-r-1 border-color>
      <ImgTemplate @addJson="addJson" />
    </div>
    <div id="preview" flex flex-col w-full h-full justify-center items-center>
      <canvas id="canvas" w-full h-full dark:bg-gray-9 bg-gray-1 />
      <div v-show="!layerList.length" i-fxemoji:mountainrailway position-absolute text-40 opacity-40 />
    </div>
    <div id="toolbar" border-l-1 border-gray-1 dark:border-gray-7 h-full max-w-lg p-x-4 w-80 flex-none overflow-auto>
      <!-- 操作 -->
      <Operation
        :config="{ prev: prevList.length - 1, next: nextList.length }"
        @saveImg="saveImg"
        @operate="operate"
      />
      <!-- 上传 -->
      <AddMtr
        @addImg="fileChange"
        @addMtr="addMtr"
      />
      <!-- 图层 -->
      <Layer
        v-if="layerList.length"
        :layer-list="layerList"
        :active-layer="activeLayer"
        @selectLayer="handleSelectLayer"
        @updateLayer="updateLayer"
        @delLayer="delLayer"
      />
      <!-- 文字 -->
      <TextAttribute
        v-if="showTextAttribute"
        :attribute="textAttribute"
        @textAttributeChg="textAttributeChg"
      />
      <!-- 基础信息 -->
      <CommonAttribute
        :attribute="commonAttribute"
        @commonAttributeChg="commonAttributeChg"
        @shadowChg="shadowChg"
      />
      <!-- 背景设置 -->
      <Background
        :background="background"
        @updateConfig="updateBackground"
      />
    </div>
  </div>
</template>

<style>
.ant-spin-container {
  height: 100%;
}
</style>

