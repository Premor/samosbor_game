exports.install = function() {
	// COMMON
	F.websocket('/game/',game)
	F.global.users_map = {};
	F.global.users_id = {};
	F.global.fighters = [];
};

function game() {
	//const self = this;
    this.on('open',(client)=>{
		const login = client.cookie('player');
		const password = client.cookie('password');
		const char = client.cookie('char');
		client.user = {x:200,speed:4};
		let list_online_id=[];
		let list_types = [];
		MODEL('user').login_u(login,password,(err,res)=>{
			if (err){
				this.send('gavno');
			}
			else{
				client.user.type = res.characters[char].type;
				this.send(`new player;${client.id};${client.user.type}`,null,[client.id]);
				client.send(`player;${client.user.type}`);
				for (i in this.connections){
					if (i!=client.id){
						list_online_id.push(i);
						list_types.push(this.connections[i].req.user.type);
					}
				}
				client.send(`all players;${list_online_id.join(',')};${list_types.join(',')}`);
		
			}
		})
		//if (this.online)
		/*const login = client.cookie('player');
		MODEL('user').person_f(login,(err,res)=>{
			if (err){
				client.send(`err;${err}`)
			}	
			else{
				let buf= res.person;
				if (buf == ''){
					client.send(`err;havnt character`)
				}
				else{
					client.user = buf;
					client.user.mode = 'idle';
					F.global.users_id[client.user.name]=client.id;
					
					client.send(`player;${JSON.stringify(buf)}`);
				}
				
			}
		})*/
	})
	
	this.on('close',(client)=>{
		this.send(`remove player;${client.id}`,null,[client.id]);
		/*
		const login = client.cookie('player');
		if (!client.user.timer_store){
			MODEL('user').person_m(login,client.user);
		}
		F.global.users_id[client.user.name]=null;
		*/
	})
	this.on('message',(client,message)=>{

		let res = '';
		const mes = message.split(';');
		//console.log(`mes: 	${mes}`)
		switch (mes[0]){
			case 'move': 
				if (mes[1]=='right'){
					client.user.x +=client.user.speed;
					
				} 
				else if (mes[1]=='left'){
					client.user.x -=client.user.speed;

				}  
				else {
					res = `${mes[0]};err`;
					break;
				}
				res = `${mes[0]};${client.user.x}`;
				this.send(`another move;${client.id},${client.user.x}`,null,[client.id]);
				break;
		}
		//console.log(`res: ${res}`);
		client.send(res);
	});
			/*case 'lvl_up':client.user = MODEL('game').lvl_up(client.user);res = `lvl_up;${JSON.stringify(client.user)}`; break;
            case 'store_en':if (client.user.timer_store) {res = `already`}else {client.user.timer_store = setTimeout((args)=>{
				const id = args[0];
				const login = args[1];
				
				let find = false;
				for (i in F.global.users_id){
					if (F.global.users_id[i] == id){
						const buf = this.find(id);
						
						buf.user.current_energy += 0.2;
						buf.user.timer_store = null;
						buf.send(`store_en;${buf.user.current_energy}`);
						find = true;
						break;
					}
				}
				if (!find){
					
					MODEL('user').person_f(login,(err,res)=>{
						if (err){return;}
						else{
							res.person.current_energy +=0.2;
							
							MODEL('user').person_m(login,res.person);
						}
					});	
				}						
				},10000,[client.id,client.cookie('player')]);  /*place.energy*player_talant; res = `store_en;${client.user.current_energy}`;}break;
            case 'list_online': {let buf = []; for(i in F.global.users_id){buf = buf.concat(i)};res = `list_online;${buf.join('`')}`;break;}//`list_online;${this.connections}`
			case 'fight':{let buf = this.find(F.global.users_id[mes[1]]);this.send(`fight;${JSON.stringify(client.user)}`,[F.global.users_id[mes[1]]]);res = `fight;${JSON.stringify(buf.user)}`;client.user.id_opp = F.global.users_id[mes[1]];buf.user.id_opp = client.id;client.user.mode = 'attack';buf.user.mode = 'defense';break;}
			case 'attack':if (client.user.mode == 'attack'){
						const buf = MODEL('game').damage(client.user,mes[1]);
						const buf2 = this.find(client.user.id_opp);
						buf2.user.current_hp -= buf;
						if (buf2.user.current_hp <= 0){
							client.user.mode = `idle`;
							buf2.user.mode = `idle`;
							res = `win;${JSON.stringify(client.user)}`;
							this.send(`lose;${JSON.stringify(buf2.user)}`,[client.user.id_opp]);}
						else{
							buf2.user.mode = 'attack';
							client.user.mode = 'defense';
							res = `opp_turn;${JSON.stringify(buf2.user)}`;
							this.send(`you_turn;${JSON.stringify(buf2.user)}`,[client.user.id_opp]);} 
						}
						//this.send(`damage;${buf}`)};
						break;
			//case 'damage':if (client.user.mode == 'defense') { const buf = this.find(client.id_opp);client.user.current_hp -= parseInt(mes[1]);if (client.user.current_hp <= 0){client.user.mode = `idle`;buf.user.mode = `idle`;res = `lose`,this.send(`win`,client.user.id_opp)}else{client.user.mode = 'attack';buf.user.mode = 'defense'} } break;
			default:;
        }
        console.log(`res: ${res}`);
		client.send(res);
	})*/
}