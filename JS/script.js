import { grabImage } from "./images.js"
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.height = window.document.defaultView.innerHeight-20
canvas.width = window.document.defaultView.innerWidth-20
const keys = {
    'w': {bool: false, fn: function(){data.player.y-=5}},
    'a': {bool: false, fn: function(){data.player.x-=5}},
    's': {bool: false, fn: function(){data.player.y+=5}},
    'd': {bool: false, fn: function(){data.player.x+=5}}
}
const classes = {
    player: class {
        constructor(){
            this.time = 0
            this.name = undefined
            this.img = 'playerR1'
            this.x = 0
            this.y = 0
            this.stats = {
                'constitution': 0,
                'strength': 0,
                'intelligence': 0,
                'charisma': 0,
                'wisdom': 0,
                'perception': 0,
                'dexterity':0,
                'hp': 0,
                'maxHp': 0,
                'gold': 0,
                'items': []
            }
        }
        draw(){
            const directions = {
                'w': 'U',
                's': 'D',
                'a': 'L',
                'd': 'R'
            }
            let count = 0
            for(const key in keys){
                if(keys[key].bool){
                    keys[key].fn()
                    this.time += 1
                    if(this.time<=15){
                        this.img = 'player'+directions[key]+'2'
                    }
                    else{
                        this.img = 'player'+directions[key]+'3'
                    }
                    if(this.time == 30){
                        this.time = 0
                    }
                }
                else{
                    count += 1
                }
            }
            if(count == 4){
                this.img = this.img.slice(0,this.img.length-1)+'1'
            }
            const width = grabImage(this.img).width
            const height = grabImage(this.img).height
            const total = width+height
            ctx.drawImage(grabImage(this.img),this.x-50,this.y-50,200*(width/total),200*(height/total))
        }
    },
}
class Storage{
    constructor(info){
        this.info = info
        if(this.getItem('player') == null){
            this.setItem('player',new classes['player']())
        }
        const invalids = ['length','key','removeItem','setItem','clear','getItem']
        for(const d in this.info){
            if(!invalids.find(i => i == d)){
                const item = this.getItem(d)
                if(classes[d] != undefined){
                    this[d] = new classes[d]()
                }
                else{
                    this[d] = item
                }
                for(const i in item){
                    this[d][i] = this.copy(i,item[i])
                }
            }
        }
    }
    getItem(string){
        return JSON.parse(this.info.getItem(string))
    }
    setItem(string,data){
        this.info.setItem(string,JSON.stringify(data))
    }
    copy(str,val){
        if(Array.isArray(val)){
            const copiedArray = []
            for(const [i,v] of val.entries())
            copiedArray[i] = this.copy(i,v)
            return copiedArray
        }
        else if( val && typeof val === 'object'){
            let copiedObject = {}
            if(classes[str] != undefined){
                copiedObject = new classes[str]()
            }
            for (const [k, v] of Object.entries(val))
            copiedObject[k] = this.copy(k,v)
            return copiedObject
        }
        else{
            return val
        }
    }
}
const data = new Storage(window.localStorage)
function mainLoop(){
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    data.player.draw()
    requestAnimationFrame(mainLoop)
}
mainLoop()
window.addEventListener('resize',function(e){
    canvas.height = e.currentTarget.innerHeight-20
    canvas.width = e.currentTarget.innerWidth-20
    if(canvas.height<400){
        canvas.height = 400
    }
})
let thing = undefined
window.addEventListener('keydown',function(e){
    if(keys[e.key] != undefined){
        keys[e.key].bool = true
    }
})
window.addEventListener('keyup',function(e){
    if(keys[e.key] != undefined){
        keys[e.key].bool = false
    }
})
window.localStorage.clear()