exports.id = 'game';
exports.version = '1.00';

//let map = [{}] 
// {"id":"7buqf","type":"progress","tree":{"cost":123,"name":"suka","description":"xyi gavno mocha jopa","next":[]}}


exports.check_terrain = (arg)=>{return true};

exports.check_science_zone = x => {return x>=100 && x<200};

exports.check_science_zone_promisify = x => {return new Promise((res,rej)=>{x>=100 && x<200?res():rej()});};


exports.load_tree_progress = callback => {NOSQL('tree').one().where('type','progress').callback(callback);}

exports.save_tree_progress = (tree,callback) => {
    NOSQL('tree').modify({'tree':tree}).where('type','progress').callback(callback);
}