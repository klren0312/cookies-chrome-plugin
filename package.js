const fs = require('fs')
const path = require('path')

const ChromeExtension = require('crx')
const crx = new ChromeExtension({
  privateKey: fs.readFileSync('./crx.pem')
})

crx.load(path.resolve(__dirname, './extension'))
  .then(crx => crx.pack())
  .then(crxBuffer => {
    fs.writeFile(path.resolve('./crx/GetCookiesAndUserAgent.crx'), crxBuffer, (err) => {
      if (err) throw err
      console.log('crx create successful')
    })
  })
  .catch(err=>{
    console.error( err )
  })
