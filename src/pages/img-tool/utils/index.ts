import type { UploadUserFile } from 'element-plus'
import { fabric } from 'fabric'
import { v4 as uuid } from 'uuid'
import { downloadByURL } from '~/utils/utils'

const INITIAL_CONFIG = {
  left: 100,
  top: 100,
  shadow: '',
  fontFamily: 'arial',
  fontSize: 40,
  fontWeight: 400,
  radius: 20,
  fill: '#ffb636',
}

const createNode = (file: UploadUserFile) => {
  const imgEl = document.createElement('img')
  imgEl.src = file.url!
  document.body.appendChild(imgEl)
  return imgEl
}

export const setBackground = (card: any, file: UploadUserFile) => {
  const imgEl = createNode(file)
  imgEl.onload = () => {
    const imgInstance = new fabric.Image(imgEl, {
      id: file.uid,
      name: file.name,
    })

    card.setBackgroundImage(imgInstance, card.renderAll.bind(card), {
      scaleX: card.width / imgInstance.width,
      scaleY: card.height / imgInstance.height,
    })
    imgEl.remove()
  }
}

export const addImg = (card: any, file: UploadUserFile) => {
  const imgEl = createNode(file)
  imgEl.onload = () => {
    const imgInstance = new fabric.Image(imgEl, {
      id: file.uid,
      name: file.name,
      ...INITIAL_CONFIG,
    })
    const widthRatio = Number(card.width / imgInstance.width / 2)
    const heightRatio = Number(card.height / imgInstance.height / 2)
    const ratio = Math.min(widthRatio, heightRatio, 1)
    imgInstance.scale(ratio)
    card.add(imgInstance).setActiveObject(imgInstance)
    card.renderAll()
    imgEl.remove()
  }
}

export const addText = (card: any) => {
  const text = new fabric.IText('双击编辑', {
    ...INITIAL_CONFIG,
    id: uuid(),
  })
  card.add(text)
  card.setActiveObject(text)
}

export const addRect = (card: any) => {
  const rect = new fabric.Rect({
    ...INITIAL_CONFIG,
    width: 40,
    height: 40,
    id: uuid(),
  })

  card.add(rect)
  card.setActiveObject(rect)
}

export const addCircle = (card: any) => {
  const rect = new fabric.Circle({
    ...INITIAL_CONFIG,
    width: 40,
    height: 40,
    id: uuid(),
  })

  card.add(rect)
  card.setActiveObject(rect)
}

export const addTriangle = (card: any) => {
  const triangle = new fabric.Triangle({
    ...INITIAL_CONFIG,
    width: 40,
    height: 40,
    id: uuid(),
  })

  card.add(triangle)
  card.setActiveObject(triangle)
}

export const addShape = {
  'i-text': addText,
  'rect': addRect,
  'circle': addCircle,
  'triangle': addTriangle,
}

export const exportImg = (card: any) => {
  const option = { name: '图片', format: 'png', quality: 1, multiplier: 2 }
  const url = card.toDataURL(option)
  downloadByURL(url)
}

export const deleteObject = (card: any, item: any) => {
  card.remove(item)
  card.requestRenderAll()
}
