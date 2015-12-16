function cleanModel( model, fields ) {
    var modelObj = model.toObject();
    var cleanedObj = {};

    fields = fields.replace(' ', '').split(',');

    for( var i = 0; i < fields.length; i++ ) {
        var field = fields[i];

        cleanedObj[field] = modelObj[field];
    }

    return cleanedObj;
}


//////////////////////
///// PUBLIC API /////
//////////////////////

module.exports = cleanModel;