
var config = require('./config.json'),
    mongoRepository = require('../repositories/mongoRepository'),
    sqlRepository = require('../repositories/sqlRepository'),
    Q = require('q');

var getInstance = function(datasource){
    var defer = Q.defer();
    
    var dataSourceType = config.dataSources.filter(function(item){
        return item.alias === datasource;
    });

    if(!dataSourceType || dataSourceType.length === 0){
        defer.reject({code: 404, error: 'Cannot find database server in the Configuration'});
    }
    else{
        switch (dataSourceType[0].type){
            case 'mongodb':
                defer.resolve(mongoRepository);
            break;
            case 'sqlserver':
                defer.resolve(sqlRepository);
            break;
        }    
    }
    
    return defer.promise;
};
exports.databasepop = function(req, res){
    getInstance('drataDemoExternal').then(function(instance){
        return instance.pop();
    }).done(function(result){
        res.send(result);
    },function(error){
        res.status(error.code).send(error.message);
    });
};

exports.getDatabaseNames = function(req, res){
    getInstance(req.params.datasource).then(function(instance){
        return instance.getDatabaseNames(req.params.datasource);
    }).done(function(result){
        res.send(result);
    },function(error) {
        res.status(error.code).send(error.message);
    });
};

exports.getCollectionNames = function(req, res){
    getInstance(req.params.datasource).then(function(instance){
        return instance.getCollectionNames(req.params.datasource, req.params.dbname);
    }).done(function(result){
        res.send(result);
    },function(error){
        console.log(error);
        res.status(error.code).send(error.message);
    });
};

exports.findProperties = function(req, res){
    getInstance(req.params.datasource).then(function(instance){
        return instance.findProperties(req.params.datasource, req.params.dbname, req.params.collectionName);
    }).done(function(result){
        res.send(result);
    },function(error){
        res.status(error.code).send(error.message);
    });
};

exports.findCollection = function(req, res){
    getInstance(req.params.datasource).then(function(instance){
        return instance.findCollection(req.params.datasource, req.params.dbname, req.params.collectionName, req.body);
    },function( error ) {
        res.status(error.code).send(error.message);
    }).done(function(result){
        res.send(result);
    },function(error){
        console.log(error);
        res.status(error.code).send('Message: ' + error.message + (error.ex ? '; Debug: ' + JSON.stringify(error.ex) : ''));
    });
};

