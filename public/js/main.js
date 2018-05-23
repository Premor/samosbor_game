$(document).ready(function() {
    
    
        
    //$.cookie('player','sooka',{path:'/'});        
        // отправить сообщение из формы publish
        $('#publish').submit(function(event) {
            event.preventDefault();
            let outgoingMessage = this.message.value;
            this.reset();
            socket_chat.send(outgoingMessage);
            
        });
        
        
        
        
    
});
const address = 'localhost:8001';
// const address = 'diamant-s.ru:8001';
let another_players = [];
let socket_chat = new WebSocket(`ws://${address}/chat/`);
// обработчик входящих сообщений
socket_chat.onmessage = function(event) {
    let incomingMessage = event.data;
    showMessage(incomingMessage);
};

// показать сообщение в div#subscribe
function showMessage(message) {
    $('div#subscribe').append(`<p>${decodeURIComponent(message)}</p>`);
    
}
//======= чат ===================


//======= чат ===================



var game = new Phaser.Game(800, 800, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
var socket ;
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
    this.load.spritesheet('goku','/img/goku.png',37,46)
    
    
    
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
    player = this.add.sprite(200,200,'goku');
    player.anchor.setTo(0.5,0.5);    
    socket= new WebSocket(`ws://${address}/game/`);
    create_handler();


    player.frame = 5;
    player.animations.add('test',[6,7,8,9,10,11],10,true);
    player.animations.add('idle',[0,1,2,3,4,5],10,true);
    
    /*
    ibutton1 = this.add.button(this.world.centerX + 195, 100, 'button1', actionOnClick, this);
    ibutton2 = this.add.button(this.world.centerX + 195, 200, 'button2', level_up, this);
    textTable.level_name = this.add.text(16, 16, `Вы в Духовная сфера`, { font: 'Arkhip',fontSize: '16px', fill: 'white' });
    textTable.energy = this.add.text(256, 16, `Кол-во духовной энергии: 2/3`, {  font: 'Arkhip',fontSize: '16px', fill: 'green' });
    textTable.level_up = this.add.text(616, 16, 'Не хватает энергии для прорыва', {  font: 'Arkhip',fontSize: '16px', fill: 'red' });
    */
    
    player.animations.play('test');
    

    game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN,
        //Phaser.Keyboard.SPACEBAR
    ]);
}
function update() {
    for (a of another_players){
        
        if (a.move_x){
            a.player.x = a.move_x;
            a.move_x = null; 
        }
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        if (player.animations.currentAnim.name != 'test'){
            player.animations.play('test');
        }
        player.x -= speed;
        socket.send('move;left');
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        if (player.animations.currentAnim.name != 'test'){
            player.animations.play('test');
        }
        player.x += speed;
        socket.send('move;right');
    }
    else{
        if (player.animations.currentAnim.name != 'idle'){
            player.animations.play('idle');
        }
    }
    
}
function create_handler(){
    socket.onmessage = (event)=>{
        let mes = decodeURIComponent(event.data).split(';');console.log(mes);
        switch (mes[0]){
            case 'new player':create_new_player(mes[1]);break;
            case 'another move':another_move(mes[1].split(','));break;
            case 'all players':create_current_players(mes[1].split(','));break;
            case 'remove player':remove_player(mes[1]);break;
            //case 'move':mes[1]!='err'?console.log(`server: ${mes[1]}`):console.log('move err');
            //////
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
}
function create_current_players(args){
    if (args == '') return false;
    for (i of args){
        console.log(i);
        another_players.push({player:game.add.sprite(200,200,'cobra'),id:i,move_x:null})    
        another_players[another_players.length-1].player.anchor.setTo(0.5,0.5);
    }
    console.log('pidor  '+another_players);
}

function remove_player(_id){
    const finder_id = another_players.findIndex((ell)=>{return ell.id == _id});
    another_players[finder_id].player.destroy(true);
    another_players.splice(finder_id,1);
}

function create_new_player(_id){
    another_players.push({player:game.add.sprite(200,200,'cobra'),id:_id,move_x:null});
    another_players[another_players.length-1].player.anchor.setTo(0.5,0.5);    
  
}

function another_move(args){
    const id = args[0];
    const x = parseInt(args[1]);
    const finder_id = another_players.findIndex((ell)=>{return ell.id == id});
    if (finder_id!=(-1)) another_players[finder_id].move_x = x;
    
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
