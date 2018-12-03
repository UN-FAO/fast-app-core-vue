require('babel-polyfill');
require('dotenv').config();
const Fluent = require('fast-fluent').Fluent;
const formio = require('fluent-formio').default;
const FLUENT_FORMIO_BASEURL = require('./config/env').FLUENT_FORMIO_BASEURL;

const process = async () => {
  await Fluent.config({
    REMOTE_CONNECTORS: [{
      name: 'formio',
      baseUrl: FLUENT_FORMIO_BASEURL,
      connector: formio
    }]
  });

  console.log(FLUENT_FORMIO_BASEURL);

  const model = Fluent.model({
    properties: {
      name: 'submission',
      config: {
        remote: {
          path: 'scoutingtraps',
          token: 'L8rKVWr6JiI5rc7qPq4bn2HVsyJJi1'
        }
      }
    }
  })();

  const keys = ['_id', 'owner', 'data.date as date', 'data.userCountry as userCountry', 'data.country as country', 'data.region as region'];
  const data = await model.remote().limit(20000).select(keys).collect();
  console.log(data.count());
  const duplicates = data.duplicatesBy(['owner', 'date', 'userCountry', 'country', 'region']);
  console.log(duplicates.count());

  try {
    await duplicates.chunkApply(100, async (d) => {
      await model.remote().remove(d._id)
    });
  } catch (e) {
    console.error(e);
  }
}

process().then(() => {
  console.log('ok');
}).catch((e) => {
  console.log(e);
});
