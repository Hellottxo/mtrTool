export const getArrayBuffer = (file: File): Promise<ArrayBuffer> => new Promise((resolve) => {
  const filereader = new FileReader()
  filereader.onload = (e: any) => {
    resolve(e.target.result)
  }
  // 将 file 转换为 ArrayBuffer 并调用 onload
  filereader.readAsArrayBuffer(file)
})

export const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export const getExtByString = (name: string) => name.split('.')?.pop()?.toLowerCase()

export const downloadByURL = (url: string, filename?: string) => {
  const elink = document.createElement('a')
  elink.download = filename?.replaceAll('"', '') ?? ''
  elink.style.display = 'none'
  elink.href = url
  document.body.appendChild(elink)
  elink.click()
  document.body.removeChild(elink)
}
