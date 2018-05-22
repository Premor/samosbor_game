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
