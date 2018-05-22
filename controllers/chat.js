exports.install = function() {
	F.websocket('/chat/',chat);
};


function chat(){
	this.on('open',(client)=>{
		const login = client.cookie('player');
		
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
