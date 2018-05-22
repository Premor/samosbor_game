exports.install = function() {
	F.route('/login/',login,['post','#session']);
	F.route('/registration/',json_create_user,['post','#session']);
	F.route('/logout/',logout,['#session'])
	F.route('/',home,['#session'])
	F.route('/',create_person,['post','#session'])
	F.route('/{path}/', view_page,['#session']);
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
    MODEL('user').create(user);
    this.redirect('/');
}
