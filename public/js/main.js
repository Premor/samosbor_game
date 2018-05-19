$(document).ready(function() {
    
    
    
});
var game = new Phaser.Game(800, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
//var address = "ws://localhost:8000/game/";//"ws://diamant-s.ru:8000/game/"
//var socket = new WebSocket(address);
//= make_new_player('Test');
var player;
var speed = 4;
/*socket.onopen = function() {
    socket.send('load_player');
    //socket.send('list_online');
  };*/



function preload() {
    /*this.load.image('screen','/img/meditation.jpg');
    this.load.image('button','/img/small/apple.png');
    this.load.image('button1','/img/small/Накопить.png');
    this.load.image('button2','/img/small/Прорыв.png');
    this.load.image('fight_screen','/img/fight.jpg');*/
    this.load.image('cobra','/img/cobra.gif')
    
    
    
}

function create_fight_screen(player,enemy){
    game.add.sprite(0,0,'fight_screen');
    
    fbutton1 = game.add.button(50, 100, 'button1', ()=>{socket.send('attack;strength')}, this);
    fbutton2 = game.add.button(50, 300, 'button1', ()=>{socket.send('attack;agility')}, this);
    fbutton3 = game.add.button(50, 500, 'button1', ()=>{socket.send('attack;intellige')}, this);
    ibutton1.destroy();
    ibutton2.destroy();

}

function create_idle_screen(){
    game.add.sprite(0,0,'screen');
    ibutton1 = game.add.button(game.world.centerX + 195, 100, 'button1', actionOnClick, game);
    ibutton2 = game.add.button(game.world.centerX + 195, 200, 'button2', level_up, game);
    textTable.level_name.text = `Вы в ${player.level.name}`;
    textTable.energy.text = `Кол-во духовной энергии: ${player.current_energy.toFixed(2)}/${player.level.max_energy.toFixed(2)}`;
    textTable.level_up.text = check_state()?'Энергии хватает для прорыва':'Не хватает энергии для прорыва';
}

function create() {
    
    player = this.add.sprite(200,200,'cobra');
    player.anchor.setTo(0.5,0.5);
    
    

    /*
    ibutton1 = this.add.button(this.world.centerX + 195, 100, 'button1', actionOnClick, this);
    ibutton2 = this.add.button(this.world.centerX + 195, 200, 'button2', level_up, this);
    textTable.level_name = this.add.text(16, 16, `Вы в Духовная сфера`, { font: 'Arkhip',fontSize: '16px', fill: 'white' });
    textTable.energy = this.add.text(256, 16, `Кол-во духовной энергии: 2/3`, {  font: 'Arkhip',fontSize: '16px', fill: 'green' });
    textTable.level_up = this.add.text(616, 16, 'Не хватает энергии для прорыва', {  font: 'Arkhip',fontSize: '16px', fill: 'red' });
    */
   game.input.keyboard.addKeyCapture([
    Phaser.Keyboard.LEFT,
    Phaser.Keyboard.RIGHT,
    Phaser.Keyboard.UP,
    Phaser.Keyboard.DOWN,
    Phaser.Keyboard.SPACEBAR
]);
}

function update() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        player.x -= speed;
        //ufo.angle = -15;
        //leftBtn.alpha = 0.6;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        player.x += speed;
        //ufo.angle = 15;
        //rightBtn.alpha = 0.6;
    }
}

function actionOnClick(){
   
    socket.send('store_en');
    
    
}

socket.onmessage = (event)=>{
    let mes = decodeURIComponent(event.data).split(';');console.log(mes);
    switch (mes[0]){
        case 'player':player = JSON.parse(mes[1]);need_update = true;break;
        case 'store_en': player.current_energy = parseFloat(mes[1]);need_update = true;break;
        case 'lvl_up': player = JSON.parse(mes[1]);need_update = true;break;
        case 'list_online':online(mes[1].split('`'));break;
        case 'fight':{let buf = JSON.parse(mes[1]);mode = 'fight';opp = buf;need_update = true; create_fight_screen();break;}
        case 'you_turn':{let buf = JSON.parse(mes[1]);player = buf;need_update = true;show_damage_button(); break;}
        case 'opp_turn':{let buf = JSON.parse(mes[1]);opp = buf;need_update = true;hide_damage_button(); break;}
        case 'win':player = JSON.parse(mes[1]);mode = 'idle';create_idle_screen(); need_update = true;break;
        case 'lose':player = JSON.parse(mes[1]);mode = 'idle';create_idle_screen();need_update = true;break;
    }
};

function show_damage_button(){
    fbutton1 = game.add.button(50, 100, 'button1', ()=>{socket.send('attack;strength')}, this);
    fbutton2 = game.add.button(50, 300, 'button1', ()=>{socket.send('attack;agility')}, this);
    fbutton3 = game.add.button(50, 500, 'button1', ()=>{socket.send('attack;intellige')}, this);
}

function hide_damage_button(){
    //game.add.sprite(0,0,'fight_screen');
    fbutton1.destroy();
    fbutton2.destroy();
    fbutton3.destroy();
    
}

function online(arg){
    let i = 0;
    $('#left').empty();
    $('#right').empty();
    while (i < arg.length){
    $('#left').append(`<p onclick="callfight(this)">${arg[i]}</p>`);
    i++;
}
}

function callfight(ell){
    //alert(`fight;${ell.innerHTML}`);//console.log('abc'.split(';'));
    socket.send(`fight;${ell.innerHTML}`);
}



function level_up(){
    socket.send('lvl_up');
    /*if (check_state()){
        player.level = level_next(player.level);
        need_update = true;
    }*/
    
}

function make_new_player(name_){
    return  {           name:name_,
                        level: make_level(1,1),
                        current_energy: 2,
                        stats: [make_stat('str'),make_stat('agl'),make_stat('int'),make_stat('sta'),make_stat('know'),make_stat('tal')],
                        items: [],
                        spells: [],
                        features:[],
                        place:'Amsterdam',


    }
}


function check_state(){
    
    return player.current_energy > player.level.max_energy;
}

function level_next(level){
    if (level.stage<10){
        level.stage +=1;
        level.max_energy = level.calculate_max_energy();
    }
    else if (level.stage == 10){
        level.rarity += 1;
        level.stage = 1;
        level = make_level(level.rarity,level.stage);
    }
    return level;
}

function make_level(rarity_,stage_){
    var ret = {rarity:rarity_,stage:stage_,calculate_max_energy:function(){return Math.exp(this.rarity+this.stage/10);},max_energy: calculate_max_energy(rarity_,stage_)};
    switch(rarity_){
        case 1: ret.name = 'Духовная сфера';break;
        case 2: ret.name = 'Сфера истока';break;
        case 3: ret.name = 'Сфера основ';break;
        default:ret.name = 'За гранью понимания';ret.max_energy= Infinity;break;
    }
    return ret;
}

function calculate_max_energy(rarity_,stage_){
    return Math.exp(rarity_+stage_/10);
}

function make_stat(stat,value_=100,scale_=1.0){
    var ret = {value:value_,scale:scale_};
    switch (stat){
        case 'str':ret.name = 'strength';break;
        case 'agl':ret.name = 'agility';break;
        case 'int':ret.name = 'intellige';break;
        case 'know':ret.name = 'knowlege';break;
        case 'tal':ret.name = 'talent';ret.scale = 0;break;
        case 'sta':ret.name = 'stamina';break;
        default: ret = Error('unknow state');
    }
    return ret;
}