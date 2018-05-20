exports.install = function() {
	F.route('/login/',login,['post','#session']);
	F.route('/registration/',json_create_user,['post','#session']);
	F.route('/logout/',logout,['#session'])
	F.route('/',home,['#session'])
	F.route('/',create_person,['post','#session'])
	F.route('/{path}/', view_page,['#session']);
	F.websocket('/test/',test);
	F.websocket('/test2/',test2,['#session']);
	F.global.online_users = [];
};



function home(){
	this.view('index')
}


function view_page(path) {
	// models/pages.js --> Controller.prototype.render()
	if (path ==='login' && this.session.user && this.cookie('player'))
	{this.redirect('/game/')}
	this.view(path);
}
function test(){
	this.on('open',(client)=>{
		const login = client.cookie('player');
		console.log(client);
		client.user = {name:login};
		this.send(`Приветствуем ${client.user.name}`,null,[client.id]);
		client.send('вы подключены')
	})
	this.on('close',(client)=>{
		//offline_user(client.id);
		this.send(`${client.user.name} покинул нас`,null,[client.id]);
	})
	this.on('message',(client,message)=>{

		this.send(`${client.user.name}: ${message}`);
	})
	
}

function test2(){
	this.on('open',(client)=>{
		
		const login = client.cookie('player');
		MODEL('user').person_f(login,(err,res)=>{
			if (err){
				client.send(`err;${err}`)
			}	
			else{
				let buf= res.person;
				if (res.person == ''){
					buf = MODEL('game').make_player('Broly');
					MODEL('user').person_m(login,buf)
				}
				client.send(`персонаж: ${JSON.stringify(buf)}`)
			}
		})
		
	})
	this.on('close',(client)=>{
		//offline_user(client.id);
		this.send(`${client.id} покинул нас`,null,[client.id]);
	})
	this.on('message',(client,message)=>{
		//console.log(`${client.id}:last message ${client.cookie.player}`)
		client.cookie.player = message;
		this.send(`${message}`);
	})
	
}

function create_person(){
	const login = this.cookie('player');
	if (login){
		buf = MODEL('game').make_player(this.body.name);
		buf.max_hp = MODEL('game').calculate_hp((buf.stats.find(el => {return el.name === 'strength'})).value ,(buf.stats.find(el => {return el.name === 'stamina'})).value );
		buf.max_mana = MODEL('game').calculate_mana((buf.stats.find(el => {return el.name === 'intellige'})).value );
		buf.current_hp = buf.max_hp;
		buf.current_mana = buf.max_mana;
		MODEL('user').person_m(login,buf);
		this.redirect('/game/')
	}
	else{
		this.redirect('/login/');
	}

}


function offline_user(id){
	let buf=0;
	for (i of F.global.online_users){
		if (i.id == id){
			break;
		}
		buf++;
	}
	F.global.online_users.splice(buf,1)
}


function logout(){
	this.cookie('player','','-1 day')
	delete this.session.user;
	this.redirect('/')
}

function login(){
	var self = this;
	MODEL('user').find_u(this.body.login, this.body.psw, (err,res)=>{
		if (err)
			this.view('fail', err);
		else
		{
			this.cookie('player',self.body.login,'7 days');
			this.session.user = {id: res.id, login: self.body.login};
			this.redirect('/game/');
		}
	})
}

function json_create_user() {
	var user = { id: Utils.GUID(5), login: this.body.login, password: this.body.psw };
	

	//console.log(this.flags)
	//console.log(this.body)
    // global alias:
    MODEL('user').create(user);
    this.redirect('/');
}
