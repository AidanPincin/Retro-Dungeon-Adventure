import { grabImage, loading, maxLoad } from "./images.js"
window.localStorage.clear()
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const ratio = 1920/1080
let width = window.document.defaultView.innerWidth-20
let height = window.document.defaultView.innerHeight-20
if(height*ratio>width){
    canvas.height = width/ratio
    canvas.width = width
}
else{
    canvas.width = height*ratio
    canvas.height = height
}
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
            setElements(this,['time','name','img','x','y','items'],[0,undefined,'playerR1',canvas.width/2,canvas.height/2,[]])
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
        changeVar(name,val){
            this[name] = val
            data.setItem('player',this)
        }
        storeItem(item){
            this.items.push(item)
            data.setItem('player',this)
        }
    },
    button: class{
        constructor(x,y,w,h,txt,color,font,fn,centered=false,doDraw=true){
            setElements(this,['x','y','w','h','txt','color','font','fn','doDraw'],[x,y,w,h,txt,color,font,fn,doDraw])
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
    },
    monster: class{
        constructor(name,x,y){
            this.name = name
            this.x = x
            this.y = y
            this.time = 0
            this.direction = 'U'
        }
        draw(){
            const directions = ['U','R','D','L']
            this.time += 1
            if(this.direction == 'U'){
                this.y -= 5
            }
            if(this.direction == 'D'){
                this.y += 5
            }
            if(this.direction == 'R'){
                this.x += 5
            }
            if(this.direction == 'L'){
                this.x -= 5
            }
            if(this.time<=15 || (this.time >= 45 && this.time <= 60) || (this.time>=75 && this.time<=90) || (this.time>=105 && this.time<=120)){
                ctx.drawImage(grabImage(this.name+this.direction+2),this.x,this.y,100,100)
            }
            else{
                ctx.drawImage(grabImage(this.name+this.direction+3),this.x,this.y,100,100)
            }
            if(this.time == 120){
                if(this.direction == 'L'){
                    this.direction = 'U'
                }
                else{
                    this.direction = directions[directions.findIndex(d => d == this.direction)+1]
                }
                this.time = 0
            }
        }
    }
}
class Storage{
    constructor(info){
        this.info = info
        const vars = [['player','class'],['page','mainMenu']]
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
    if(width>=canvas.width-50){
        lines = Math.ceil(width/(canvas.width-50))
    }
    for(let i=0; i<lines; i++){
        const chars = Math.ceil(txt.length/lines)
        if(i == lines-1){
            endChar = txt.length
        }
        else{
            endChar = txt.indexOf(' ',startChar+chars-5)
        }
        const newTxt = txt.slice(startChar,endChar)
        const w = ctx.measureText(newTxt).width
        ctx.fillText(newTxt,canvas.width/2-w/2,y+fontsize*i)
        startChar = endChar
    }
}
class Renderer{
    constructor(){
        this.monster = new classes['monster']('skeleton',canvas.width-700,600)
        const b = classes['button']
        function backButton(page,show=true){
            return new b(canvas.width/2,canvas.height-100,0,0,'Back','#ff0000',48,function(){data.changeVar('page',page)},true,show)
        }
        function stat(){
            data.player.changeVar(this.txt.toLowerCase(),data.roll.total)
            renderer.buttons['CC2'].splice(renderer.buttons['CC2'].findIndex(B => B.txt == this.txt),1)
            data.changeVar('roll',renderer.rollTheDice(4,6,true))
            if(renderer.buttons['CC2'].length == 0){
                data.changeVar('page','CC3')
                data.changeVar('roll',renderer.rollTheDice(20,6))
                data.player.changeVar('gold',data.roll.total)
            }
        }
        this.buttons = {
            'mainMenu': [
                new b(canvas.width/2-175/(1920/canvas.width),canvas.height/2-105/(1080/canvas.height),300/(1920/canvas.width),115/(1080/canvas.height),'Play','#00ff00',48,function(){data.changeVar('page','CC1'); data.changeVar('roll',renderer.rollTheDice(4,6,true))},true,false),
                new b(canvas.width/2-310/(1920/canvas.width),canvas.height/2+18,575/(1920/canvas.width),100/(1080/canvas.height),'Settings','#00ff00',48,function(){data.changeVar('page','settings')},false,false),
                new b(canvas.width/2-260/(1920/canvas.width),canvas.height/2+135/(1080/canvas.height),485/(1920/canvas.width),100/(1080/canvas.height),'Credits','#00ff00',48,function(){data.changeVar('page','credits')},false,false),
                new b(canvas.width/2-375/(1920/canvas.width),canvas.height/2+245/(1080/canvas.height),710/(1920/canvas.width),105/(1080/canvas.height),'How','#00ff00',48,function(){data.changeVar('page','how')},false,false)
            ],
            'town':[],
            'how':[backButton('mainMenu')],
            'credits':[backButton('mainMenu')],
            'settings':[backButton('mainMenu')],
            'CC1': [new b(canvas.width/2,canvas.height-100,0,0,'Next','#00ff00',48,function(){data.changeVar('page','CC2')},true)],
            'CC2': [
                new b(canvas.width/2-316,250,0,0,'Strength','#00ff00',36,stat,false),
                new b(canvas.width/2-160,250,0,0,'Dexterity','#00ff00',36,stat,false),
                new b(canvas.width/2+2,250,0,0,'Wisdom','#00ff00',36,stat,false),
                new b(canvas.width/2+152,250,0,0,'Charisma','#00ff00',36,stat,false),
                new b(canvas.width/2-298,306,0,0,'Intelligence','#00ff00',36,stat,false),
                new b(canvas.width/2-96,306,0,0,'Constitution','#00ff00',36,stat,false),
                new b(canvas.width/2+114,306,0,0,'Perception','#00ff00',36,stat,false)
            ],
            'CC3': [new b(canvas.width/2,canvas.height-100,0,0,'Next','#00ff00',48,function(){
                data.changeVar('page','CC4')
                data.changeVar('roll',renderer.rollTheDice(3,6))
                data.player.changeVar('hp',data.player.constitution*2+data.roll.total)
                data.player.changeVar('maxHp',data.player.hp)
            },true)],
            'CC4': [new b(canvas.width/2,canvas.height-100,0,0,'Next','#00ff00',48,function(){data.changeVar('page','CC5')},true)],
            'CC5': [new b(canvas.width/2,canvas.height-100,0,0,'Next','#00ff00',48,function(){data.changeVar('page','town')},true)]
        }
        const stats = ['Strength','Constitution','Perception','Intelligence','Wisdom','Charisma','Dexterity']
        for(let i=0; i<stats.length; i++){
            if(data.player[stats[i].toLowerCase()] != undefined){
                this.buttons['CC2'].splice(this.buttons['CC2'].findIndex(B => B.txt == stats[i]),1)
            }
        }
    }
    draw(){
        this[data.page]()
        this.buttons[data.page].forEach(b => {if(b.doDraw){b.draw()}})
    }
    mainMenu(){
        ctx.drawImage(grabImage('titleScreen'),0,0,canvas.width,canvas.height)
    }
    town(){
        data.player.draw()
        this.monster.draw()
    }
    how(){
        ctx.fillStyle = '#000000'
        autoSize('WASD keys to move',36,100)
        autoSize("press 'e' to interact with certain objects",36,140)
    }
    settings(){

    }
    credits(){
        ctx.fillStyle = '#000000'
        autoSize('Programmer -- Aidan Pincin',36,75)
        autoSize('Artists:',36,175)
        const artists = ['Aidan Engle','SLoothS','Zackari Baker','Makayla Marsh']
        for(let i=0; i<artists.length; i++){
            autoSize(artists[i],36,225+i*36)
        }
    }
    CC1(){
        ctx.fillStyle = '#000000'
        autoSize('Welcome to Dungeon Adventure! Before we begin we must create your character, where we will determine your starting attributes, hit-points, and gold. Fisrt we will determine your attributes by rolling 4 six-sided dice, adding the 3 highest numbers, then assigning it to one of your attributes and repeating this process until all your attributes have been assigned.',36,100)
    }
    CC2(){
        ctx.fillStyle = '#000000'
        autoSize('You rolled a '+data.roll.dice+'. So the 3 highest numbers comes to a '+data.roll.total+'. Where would you like to assign your value of '+data.roll.total+'?',36,100)
    }
    CC3(){
        ctx.fillStyle = '#000000'
        autoSize('Rolling for your starting gold you get '+data.roll.total+' gold(the sum of 20 six-sided dice)',36,100)
    }
    CC4(){
        ctx.fillStyle = '#000000'
        autoSize('Rolling for your starting hitpoints you got '+data.roll.dice+' for a total of '+data.roll.total+'. Plus your constitution of '+data.player.constitution+' times 2 adds to a grand total of '+data.player.hp+'. So your starting hitpoints is '+data.player.hp+'.',36,100)
    }
    CC5(){
        ctx.fillStyle = '#000000'
        autoSize('Congratulations, you have finished creating your character!',36,60)
        autoSize('Your stats:',36,120)
        const stats = ['Strength','Constitution','Intelligence','Dexterity','Perception','Wisdom','Charisma','Gold','HP']
        for(let i=0; i<stats.length; i++){
            autoSize(stats[i]+' -- '+data.player[stats[i].toLowerCase()],36,160+i*40)
        }
    }
    onClick(e){
        this.buttons[data.page].find(b => b.wasClicked(e))
    }
    rollTheDice(dice,sides,stats=false){
        const rolls = []
        for(let i=0; i<dice; i++){
            rolls.push(1+Math.floor(Math.random()*(sides-1)))
        }
        let sum = 0
        for(let i=0; i<dice; i++){
            sum += rolls[i]
        }
        if(stats == true){
            sum -= Math.min(...rolls)
        }
        return {dice:rolls, total:sum}
    }
}
const data = new Storage(window.localStorage)
let renderer = new Renderer()
let loaded = 0
const id = setInterval(() => {loaded = loading(); if(loaded == maxLoad()){clearInterval(id)}})
function mainLoop(){
    ctx.fillStyle = '#696969'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    if(loaded<maxLoad()){
        ctx.fillStyle = '#00ff00'
        ctx.strokeRect(canvas.width/2-150,canvas.height/2-37.5,300,75)
        ctx.fillRect(canvas.width/2-148,canvas.height/2-35.5,296*(loaded/maxLoad()),71)
        ctx.fillStyle = '#000000'
        ctx.fillText(loaded+'/'+maxLoad(),canvas.width/2-50,canvas.height/2+100)
    }
    else{
        renderer.draw()
    }
    requestAnimationFrame(mainLoop)
}
mainLoop()
window.addEventListener('resize',function(e){
    width = window.document.defaultView.innerWidth-20
    height = window.document.defaultView.innerHeight-20
    if(height*ratio>width){
        canvas.height = width/ratio
        canvas.width = width
    }
    else{
        canvas.width = height*ratio
        canvas.height = height
    }
    renderer = new Renderer()
})
window.addEventListener('keydown',function(e){if(keys[e.key] != undefined){keys[e.key].bool = true}})
window.addEventListener('keyup',function(e){if(keys[e.key] != undefined){keys[e.key].bool = false}})
window.addEventListener('mousedown',function(e){renderer.onClick(e)})
