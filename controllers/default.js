exports.install = function() {
	F.route('/login/',login,['post','#session']);
	F.route('/registration/',json_create_user,['post','#session']);
	F.route('/logout/',logout,['#session']);
	F.route('/',home,['#session']);
	//F.route('/game/choise_character',)
	F.route('/game/play/',view_game,['#session']);
	F.route('/game/create_character/',view_char,['#session']);
	F.route('/game/create_character/',create_char,['post','#session']);
	//F.route('/',create_person,['post','#session'])
	F.route('/{path}/', view_page,['#session']);
};



function home(){
	this.view('index')
}

function view_game(){
	this.view('play');
}

function view_char(){
	if (this.session.user){
		this.view('char_create');
	}
	else {
		this.redirect('/login/');
	}
}

function view_page(path) {
	// models/pages.js --> Controller.prototype.render()
	if (path ==='login' && this.session.user && this.cookie('player'))
	{this.redirect('/game/')}
	this.view(path);
}

function create_char(){
	const login = this.session.user.login;
	const type_u = this.body.type;
	if (type_u=='обычный'||type_u=='ученый'){
		MODEL('user').find_u(login,(err,res)=>{
			if (err){
				this.view('gavno');
			}
			else{
				res.characters.push({type:type_u})
				MODEL('user').char_m(login,res.characters,(err)=>{err?this.view('gavno'):this.session.user.type = type_u;this.view('congratulation');});
				this.cookie('char',res.characters.length-1,'7 days');
			}
		})
	}
}

/*function create_person(){
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


*/
function logout(){
	this.cookie('player','','-1 day')
	this.cookie('char','','-1 day');
	delete this.session.user;
	this.redirect('/')
}

function login(){
	var self = this;
	MODEL('user').login_u(this.body.login, this.body.psw, (err,res)=>{
		if (err)
			this.view('gavno', err);
		else
		{
			this.cookie('player',self.body.login,'7 days');
			this.cookie('password',self.body.psw,'7 days');
			this.session.user = {id: res.id, login: self.body.login};
			this.redirect('/game/');
		}
	})
}

function json_create_user() {
	var user = { id: Utils.GUID(5), login: this.body.login, password: this.body.psw,characters:[] };
    MODEL('user').create(user);
    this.redirect('/');
}
