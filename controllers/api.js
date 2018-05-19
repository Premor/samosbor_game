// API for e.g. Mobile application
// This API uses the website

exports.install = function() {
	// COMMON
	F.route('/api/ping/',        json_ping);
	F.route('/api/save_char/', save_char, ['post']);
	
};

// ==========================================================================
// COMMON
// ==========================================================================

function json_ping() {
	var self = this;
	self.plain('null');
}

function save_char(){
	console.log(this.body);
	console.log(this.body.player);
	MODEL('user').create(this.body.player);
}









function level_up(){
    if (check_state()){
        player.level = level_next(player.level);
        need_update = true;
    }
    
}

function make_new_player(name_){
    return  {           name:name_,
                        level: make_level(1,1),
                        current_energy: 2,
                        stats: [make_stat('str'),make_stat('agl'),make_stat('int'),make_stat('know'),make_stat('tal')],
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
        default: ret = Error('unknow state');
    }
    return ret;
}