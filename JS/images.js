let loaded = 0
function image(src){const img = new Image(); img.src = src; return img;}
const names = ['player','skeleton']
const items = ['axe','flamingSword','sword','shopguy','titleScreen','katana','chest1','chest2','chest3','chest4']
const directions = ['R','D','U','L']
const images = {}
for(let i=1; i<4; i++){
    for(let d=0; d<4; d++){
        for(let n=0; n<names.length; n++){
            images[names[n]+directions[d]+i] = image('Images/'+names[n]+directions[d]+i+'.png')
        }
    }
}
for(let i=0 ;i<items.length; i++){
    images[items[i]] = image('Images/'+items[i]+'.png')
}
for(const img in images){
    images[img].onload = function(){loaded+=1}
}
export function grabImage(name){
    return images[name]
}
export function loading(){
    return loaded
}
export function maxLoad(){
    let num = 0
    for(const img in images){
        num += 1
    }
    return num
}
