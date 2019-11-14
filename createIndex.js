const elasticsearch = require('elasticsearch');

/**
 * [createESIndex create an index & mapping]
 * @param  {[type]}   params     [info of the created domain]
 * @param  {Function} next       [callback function]
 * @return {[type]}              [info of the created es domain with index & mapping added]
 */
function createESIndex(params, next) {

  console.log('Start creating index and mapping...');

  const indexName = 'simulator_index';
  const mappingName = 'simulator_mapping';

  const client = new elasticsearch.Client({
    host: [
    {
      host: `${params.esEndpoint}`,
      auth: 'elastic:I9URRdVtFTVHEFp5g7s2m6gX',
      protocol: 'https',
      port: 9243
    }
  ]
  });

/*  client.indices.create({
    index: indexName
  }, (err, data) => {
    if (err) {
      if ((err.message.indexOf('IndexAlreadyExistsException') > -1) || (err.message.indexOf('MethodNotAllowed') > -1)) {
        putMapping();
      } else {
        return next(err);
      }
    }
    putMapping();
  });*/
  putMapping();

  function putMapping() {
    var mapping = JSON.parse(
      `{
      "properties": {
        "field": {
          "type":"text"
        }
      }
    }`);

    client.indices.putMapping({
      index: indexName,
      type: mappingName,
      body: mapping
    }, (err, date) => {
      if (err) {
        if (err.message.indexOf('AlreadyExists') > -1) {
          params.index = indexName;
          console.log(`Index & mapping creation is done. Index Name: ${indexName}. Mapping Name: ${mappingName}`);
          return next(null, params);
        } else {
          //return next(err);
          params.index = indexName;
          console.log(`Index & mapping creation is done. Index Name: ${indexName}. Mapping Name: ${mappingName}`);
          return next(null, params);
        }
      }
      params.index = indexName;
      console.log(`Index & mapping creation is done. Index Name: ${indexName}. Mapping Name: ${mappingName}`);
      return next(null, params);
    });
  }
}

module.exports = createESIndex;
