import { grabImage } from "./images.js"
window.localStorage.clear()
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.height = window.document.defaultView.innerHeight-20
canvas.width = window.document.defaultView.innerWidth-20
function setElements(obj,strings,values){
    for(const i in strings){
        obj[strings[i]] = values[i]
    }
}
const keys = {
    'w': {bool: false, fn: function(){const ks = [keys['w'],keys['a'],keys['s'],keys['d']];data.player.y-=5-(5-(Math.sqrt(50)/Math.pow(Math.sqrt(2),ks.filter(k => k.bool == true).length)))}},
    'a': {bool: false, fn: function(){const ks = [keys['w'],keys['a'],keys['s'],keys['d']];data.player.x-=5-(5-(Math.sqrt(50)/Math.pow(Math.sqrt(2),ks.filter(k => k.bool == true).length)))}},
    's': {bool: false, fn: function(){const ks = [keys['w'],keys['a'],keys['s'],keys['d']];data.player.y+=5-(5-(Math.sqrt(50)/Math.pow(Math.sqrt(2),ks.filter(k => k.bool == true).length)))}},
    'd': {bool: false, fn: function(){const ks = [keys['w'],keys['a'],keys['s'],keys['d']];data.player.x+=5-(5-(Math.sqrt(50)/Math.pow(Math.sqrt(2),ks.filter(k => k.bool == true).length)))}}
}
const classes = {
    player: class {
        constructor(){
            setElements(this,['time','name','img','x','y'],[0,undefined,'playerR1',canvas.width/2,canvas.height/2])
            this.stats = {}
            setElements(this.stats,['constitution','strength','intelligence','charisma','wisdom','perception','dexterity','hp','maxHp','gold','items'],[0,0,0,0,0,0,0,0,0,0,[]])
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
                    data.setItem('player',this)
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
            if(this.x<=0){
                this.x = 0
            }
            if(this.x>=canvas.width-200*(width/total)){
                this.x=canvas.width-200*(width/total)
            }
            if(this.y<=0){
                this.y = 0
            }
            if(this.y>=canvas.height-200*(height/total)){
                this.y = canvas.height-200*(height/total)
            }
            ctx.drawImage(grabImage(this.img),this.x,this.y,200*(width/total),200*(height/total))
        }
    },
    button: class{
        constructor(x,y,w,h,txt,color,font,fn,centered=false){
            setElements(this,['x','y','w','h','txt','color','font','fn'],[x,y,w,h,txt,color,font,fn])
            if(this.w==0){
                ctx.font = this.font+'px Arial';setElements(this,['w','h'],[ctx.measureText(this.txt).width+10,font+10])
                if(centered){
                    this.x -= this.w/2
                    this.y -= this.h/2
                }
            }
        }
        draw(){
            ctx.fillStyle = this.color
            ctx.fillRect(this.x,this.y,this.w,this.h)
            ctx.font = this.font+'px Arial'
            const width = ctx.measureText(this.txt).width
            ctx.fillStyle = '#000000'
            ctx.fillText(this.txt,this.x+this.w/2-width/2,this.y+this.h/2+this.font/(10/3))
        }
        wasClicked(e){
            const x = e.pageX-10
            const y = e.pageY-10
            if(x>=this.x && x<=this.x+this.w && y>=this.y && y<=this.y+this.h){
                this.fn()
                return true
            }
        }
    }
}
class Storage{
    constructor(info){
        this.info = info
        const vars = [['player','class'],['page','mainMenu'],['CCstep',0]]
        for(let i=0; i<vars.length; i++){
            if(this.getItem(vars[i][0]) == null){
                if(vars[i][1] == 'class'){
                    this.setItem(vars[i][0],new classes[vars[i][0]]())
                }
                else{
                    this.setItem(vars[i][0],vars[i][1])
                }
            }
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
                if(typeof item == 'object'){
                    for(const i in item){
                        this[d][i] = this.copy(i,item[i])
                    }
                }
            }
        }
    }
    getItem(string){
        try{
            return JSON.parse(this.info.getItem(string))
        }
        catch{
            return this.info.getItem(string)
        }
    }
    setItem(string,data){
        if(typeof data == 'string'){
            this.info.setItem(string,data)
        }
        else{
            this.info.setItem(string,JSON.stringify(data))
        }
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
    changeVar(name,val){
        this[name] = val
        this.setItem(name,val)
    }
}
function autoSize(txt,fontsize,y){
    let lines = 1
    let startChar = 0
    let endChar = 0
    ctx.font = fontsize+'px Arial'
    const width = ctx.measureText(txt).width
    if(width>=canvas.width-100){
        lines = Math.ceil(width/(canvas.width-100))
    }
    for(let i=0; i<lines; i++){
        const chars = Math.ceil(txt.length/lines)
        if(chars>=txt.length-startChar){
            endChar = txt.length
        }
        else{
            endChar = txt.indexOf(' ',chars)
        }
        const newTxt = txt.slice(startChar,endChar)
        const w = ctx.measureText(newTxt).width
        ctx.fillText(newTxt,canvas.width/2-w/2,y+fontsize*i)
        startChar = endChar+1
    }
}
class Renderer{
    constructor(){
        const b = classes['button']
        this.buttons = {
            'mainMenu': [
                new b(canvas.width/2,canvas.height/2,0,0,'Play','#00ff00',48,function(){data.changeVar('page','town')},true),
                new b(canvas.width/2-52.5,canvas.height/2+35,105,50,'How','#00ff00',48,function(){data.changeVar('page','how')}),
                new b(canvas.width/2-82.5,canvas.height/2+90,165,50,'Credits','#00ff00',48,function(){data.changeVar('page','credits')})
            ],
            'town':[],
            'how':[new b(canvas.width/2,canvas.height-100,0,0,'Back','#ff0000',48,function(){data.changeVar('page','mainMenu')},true)],
            'credits':[new b(canvas.width/2,canvas.height-100,0,0,'Back','#ff0000',48,function(){data.changeVar('page','mainMenu')},true)],
            'characterCreation':[]
        }
    }
    draw(){
        this[data.page]()
        this.buttons[data.page].forEach(b => b.draw())
    }
    mainMenu(){
        ctx.font = canvas.width/15.1+'px Arial'
        ctx.fillStyle = '#000000'
        const width = ctx.measureText('Welcome To Dungeon Adventure').width
        ctx.fillText('Welcome To Dungeon Adventure',(canvas.width-width)/2,(canvas.width/15)*0.85)
    }
    town(){
        data.player.draw()
    }
    how(){
        ctx.fillStyle = '#000000'
        autoSize('WASD keys to move',36,100)
        autoSize("press 'e' to interact with certain objects",36,140)
    }
    credits(){
        ctx.fillStyle = '#000000'
        autoSize('Programmer -- Aidan Pincin',36,75)
        autoSize('Artists:',36,175)
        const artists = ['Aidan Engle','SLoothS','Zackari Baker']
        for(let i=0; i<artists.length; i++){
            autoSize(artists[i],36,225+i*36)
        }
    }
    characterCreation(){
        if(data.CCstep == 0){
            ctx.fillStyle = '#0000000'
            ctx.font = '36px Arial'
        }
    }
    onClick(e){
        this.buttons[data.page].find(b => b.wasClicked(e))
    }
}
const data = new Storage(window.localStorage)
let renderer = new Renderer()
function mainLoop(){
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    renderer.draw()
    requestAnimationFrame(mainLoop)
}
mainLoop()
window.addEventListener('resize',function(e){
    canvas.height = e.currentTarget.innerHeight-20
    canvas.width = e.currentTarget.innerWidth-20
    if(canvas.height<400){canvas.height = 400}
    renderer = new Renderer()
})
window.addEventListener('keydown',function(e){if(keys[e.key] != undefined){keys[e.key].bool = true}})
window.addEventListener('keyup',function(e){if(keys[e.key] != undefined){keys[e.key].bool = false}})
window.addEventListener('mousedown',function(e){renderer.onClick(e)})
