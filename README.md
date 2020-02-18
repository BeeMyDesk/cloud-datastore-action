# Google Cloud Datastore Action

<p align="center">
  <a href="https://github.com/BeeMyDesk/cloud-datastore-action/actions"><img alt="status" src="https://github.com/BeeMyDesk/cloud-datastore-action/workflows/units-test/badge.svg"></a>
</p>

Easily set an entity in Google Cloud Datastore during your GitHub Actions workflow.

## Usage

```yaml
- uses: BeeMyDesk/cloud-datastore-action@v1.0.0
  with:
    credentials: ${{ secrets.GOOGLE_APPLICATION_CREDENTIALS }}
    project_id: ${{ secrets.GOOGLE_PROJECT_ID }}
    action: save
    entity_kind: cloud-datastore-action-test
    entity_name:  cloud-datastore-action-test-${{ matrix.action }}
    entity_data: '{"value": 42, "sha": "${{github.sha}}"}'
```

### Parameters

* `credentials`: [Service account key for GCP](https://console.cloud.google.com/apis/credentials/serviceaccountkey), **exported as JSON** and **encoded in base64**. To encode a JSON file, you can do: `base64 ~/credentials.json`.
* `project_id`: Google Cloud Project ID.
* `action`: Action to perform on the entity. `save` will overwrite the whole entity, while `merge` will keep the existing properties not specified here.
* `entity_kind`: Kind of entity.
* `entity_name`: Name of the entity to insert/update.
* `entity_data`: JSON representation of the entity data.

## License

[MIT License](https://github.com/BeeMyDesk/cloud-datastore-action/blob/master/LICENSE)
