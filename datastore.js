const fs = require('fs');
const path = require('path');

const { Datastore } = require('@google-cloud/datastore');

class WrongMethodError extends Error {}

const credentialsPath = path.join(__dirname, 'credentials.json');

const setupCredentials = async (base64ServiceAccount) => {
  const serviceAccountBuffer = Buffer.from(base64ServiceAccount, 'base64');

  const writeCredentialsPromise = new Promise((resolve, reject) => {
    fs.writeFile(credentialsPath, serviceAccountBuffer, (err) => {
      if (err) {
        reject(err);
      }
      resolve(credentialsPath);
    });
  });

  return await writeCredentialsPromise;
};

const setEntity = async (projectId, action, kind, name, jsonData) => {
  if (action !== 'save' && action !== 'merge') {
    throw new WrongMethodError();
  }

  const datastore = new Datastore({ projectId, keyFilename: credentialsPath });

  const data = JSON.parse(jsonData);
  const key = datastore.key([kind, name]);
  const entity = { key, data };

  const method = datastore[action];
  await method(entity);

  return entity;
};

module.exports = { credentialsPath, setupCredentials, setEntity, WrongMethodError };
