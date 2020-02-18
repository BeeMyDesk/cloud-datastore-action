const core = require('@actions/core');

const { setEntity, setupCredentials } = require('./datastore');

async function run() {
  try {
    const credentials = core.getInput('credentials');
    const credentialsPath = await setupCredentials(credentials);
    core.debug(`Credentials written to ${credentialsPath}`);

    const projectId = core.getInput('project_id');
    const kind = core.getInput('entity_kind');
    const name = core.getInput('entity_name');
    const jsonData = core.getInput('entity_data');

    const entity = await setEntity(projectId, kind, name, jsonData);

    core.info(`Saved ${entity.key.name}`);
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
