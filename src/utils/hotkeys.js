import hotkeys from 'hotkeys-js'
import { v4 as uuid } from 'uuid'

const quickKeys = (card) => {
  let _clipboard
  hotkeys('backspace', () => {
    const activeObject = card.getActiveObjects()
    if (activeObject) {
      activeObject.map(item => card.remove(item))
      card.renderAll()
      card.discardActiveObject()
    }
  })
  hotkeys('ctrl+c, command+c', () => {
    card.getActiveObject().clone((cloned) => {
      _clipboard = cloned
    })
  })

  hotkeys('ctrl+v, command+v', () => {
    // clone again, so you can do multiple copies.
    _clipboard.clone((clonedObj) => {
      card.discardActiveObject()
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
      })
      if (clonedObj.type === 'activeSelection') {
        // active selection needs a reference to the card.
        clonedObj.card = card
        clonedObj.forEachObject((obj) => {
          card.add(obj)
        })
        // this should solve the unselectability
        clonedObj.setCoords()
      }
      else {
        card.add(clonedObj)
      }
      _clipboard.top += 10
      _clipboard.left += 10
      card.setActiveObject(clonedObj)
      card.requestRenderAll()
    })
  })
}

export default quickKeys
