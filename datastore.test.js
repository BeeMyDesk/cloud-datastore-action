const fs = require('fs');

const datastore = require('@google-cloud/datastore');

const { credentialsPath, setEntity, setupCredentials, WrongMethodError } = require('./datastore');

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
    expect(setEntity('projectId', 'save', 'foo', 'bar', 'invalid_data')).rejects.toThrow();
  });

  test('invalid method', async () => {
    expect(setEntity('projectId', 'wrong_method', 'foo', 'bar', '{"value": 42}')).rejects.toThrow(WrongMethodError);
  });

  test('save method', async () => {
    const mockKey = { kind: 'foo', name: 'bar' };
    datastore.Datastore.prototype.key.mockReturnValue(mockKey);
    await setEntity('projectId', 'save', 'foo', 'bar', '{"value": 42}');

    expect(datastore.Datastore).toHaveBeenCalledWith({ projectId: 'projectId', keyFilename: credentialsPath });
    expect(datastore.Datastore.prototype.key).toHaveBeenCalledWith(['foo', 'bar']);
    expect(datastore.Datastore.prototype.save).toHaveBeenCalledWith({ key: mockKey, data: { value: 42 }});
  });

  test('merge method', async () => {
    const mockKey = { kind: 'foo', name: 'bar' };
    datastore.Datastore.prototype.key.mockReturnValue(mockKey);
    await setEntity('projectId', 'merge', 'foo', 'bar', '{"value": 42}');

    expect(datastore.Datastore).toHaveBeenCalledWith({ projectId: 'projectId', keyFilename: credentialsPath });
    expect(datastore.Datastore.prototype.key).toHaveBeenCalledWith(['foo', 'bar']);
    expect(datastore.Datastore.prototype.merge).toHaveBeenCalledWith({ key: mockKey, data: { value: 42 }});
  });
});
