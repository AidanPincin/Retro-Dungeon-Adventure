function image(src){const img = new Image(); img.src = src; return img}
const images = {
    playerR1: image('Images/playerR1.png'),
    playerR2: image('Images/playerR2.png'),
    playerR3: image('Images/playerR3.png'),
    playerD1: image('Images/playerD1.png'),
    playerD2: image('Images/playerD2.png'),
    playerD3: image('Images/playerD3.png'),
    playerU1: image('Images/playerU1.png'),
    playerU2: image('Images/playerU2.png'),
    playerU3: image('Images/playerU3.png'),
    playerL1: image('Images/playerL1.png'),
    playerL2: image('Images/playerL2.png'),
    playerL3: image('Images/playerL3.png')
}
export function grabImage(name){
    return images[name]
}
