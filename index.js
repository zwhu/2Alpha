import Canvas  from 'canvas'
import fs from 'fs'

const Image = Canvas.Image

let img = new Image
  , start = new Date
  , rawPath =  process.argv[2]
  , savePath = process.argv[3]

if(!rawPath)
  throw new Error('input raw image path')

  if(!savePath)
    throw new Error('input save image path')


img.onerror = function(err){
  throw err
}

img.onload = function(){

  let width = img.width
    , height = img.height
    , canvas = new Canvas(width, height)
    , ctx = canvas.getContext('2d')

  ctx.imageSmoothingEnabled = true
  ctx.drawImage(img, 0, 0, width, height)

  let imageData = ctx.getImageData(0, 0, width, height)
    , data = imageData.data

  for(let i = 0; i < data.length; i+=4) {
    let r = data[i]
      , g = data[i+1]
      , b = data[i+2]

    if([r,g,b].every(v => v < 256 && v > 240)) data[i+3] = 0
  }
  //
  ctx.putImageData(imageData, 0, 0)

  let out = fs.createWriteStream(`${__dirname}/${savePath}`)
    , stream = canvas.pngStream()

  stream.on('data', function (chunk) {
    out.write(chunk)
  })

  stream.on('end', function () {
    console.log(`保存到 ${__dirname}/${savePath}`)
    console.log(`耗时: ${new Date()-start}ms`)
  })
}

img.src = `${__dirname}/${rawPath}`
