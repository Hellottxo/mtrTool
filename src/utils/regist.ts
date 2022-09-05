const Module = {
  locateFile: _ => '../wasm/wasm-im.wasm',
  noInitialRun: true,
  moduleLoaded: false,
  messagesToProcess: [],
  print: (text: string) => {
    console.log(text)
  },
  printErr: (text: string) => {
    console.error(text)
  },
}
Module.onRuntimeInitialized = function () {
  Module.moduleLoaded = true
  FS.mkdir('/im')
  FS.currentPath = '/im'
  console.log('模块加载完成', Module)
}
