exports.id = 'game';
exports.version = '1.00';

exports.check_terrain = (arg)=>{return true};


exports.load_tree_progress = callback => {NOSQL('tree').one().where('type','progress').callback(callback);}

exports.save_tree_progress = (tree,callback) => {
    NOSQL('users').modify({'tree':tree}).where('type','progress').callback(callback);
}