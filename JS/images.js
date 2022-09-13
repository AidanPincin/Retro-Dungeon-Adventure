function image(src){const img = new Image(); img.src = src; return img}
const names = ['player','skeleton']
const directions = ['R','D','U','L']
const images = {
    axe: image('Images/axe.png'),
    shopguy: image('Images/shopguy.png'),
    sword: image('Images/sword.png')
}
for(let i=1; i<4; i++){
    for(let d=0; d<4; d++){
        for(let n=0; n<names.length; n++){
            images[names[n]+directions[d]+i] = image('Images/'+names[n]+directions[d]+i+'.png')
        }
    }
}
export function grabImage(name){
    return images[name]
}
