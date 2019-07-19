const base64Img = require('base64-img');
const path = require('path');
const fs = require('fs').promises;

(async () => {
    let targetImgArray = [];
    let fileList = await fs.readdir(path.resolve(__dirname));
    targetImgArray = fileList.filter(file => {
        const matches = /.*\.(jpg|png|svg|gif|webp)$/.exec(file);
        if (matches && (matches.length === 2)) {
            // console.table(matches);
            return true
        } else {
            return false
        }
    })
    // console.log("<======================>\n\ttargetImgArray")
    // console.table(targetImgArray);
    targetImgArray.forEach(async img => {
        const buffer = base64Img.base64Sync(path.resolve(__dirname, img));
        await fs.writeFile(path.resolve(__dirname, `../../out/imgs/${img}`), buffer, 'utf-8');
    })
})()