const fs = require('fs');

const datastore = require('@google-cloud/datastore');

const { credentialsPath, setEntity, setupCredentials } = require('./datastore');

jest.mock('@google-cloud/datastore');

describe('setupCredentials', () => {
  afterAll(() => {
    fs.unlinkSync(credentialsPath);
  });

  test('save decoded base64 data to credentials.json file', async () => {
    await setupCredentials('eyJ2YWx1ZSI6IDQyfQo=');
    const data = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    expect(data).toEqual({ value: 42 });
  });
});

describe('setEntity', () => {
  test('invalid JSON data', async () => {
    expect(setEntity('projectId', 'foo', 'bar', 'invalid_data')).rejects.toThrow();
  });

  test('valid data', async () => {
    const mockKey = { kind: 'foo', name: 'bar' };
    datastore.Datastore.prototype.key.mockReturnValue(mockKey);
    await setEntity('projectId', 'foo', 'bar', '{"value": 42}');

    expect(datastore.Datastore).toHaveBeenCalledWith({ projectId: 'projectId', keyFilename: credentialsPath });
    expect(datastore.Datastore.prototype.key).toHaveBeenCalledWith(['foo', 'bar']);
    expect(datastore.Datastore.prototype.save).toHaveBeenCalledWith({ key: mockKey, data: { value: 42 }});
  });
});
