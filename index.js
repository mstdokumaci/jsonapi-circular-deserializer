const getFirstIfSingleItemList = list => list.length === 1
  ? list[0]
  : list

const addToFlatResources = (flatResources, resource) => {
  if (!flatResources[resource['type']]) {
    flatResources[resource['type']] = {}
  }
  if (!flatResources[resource['type']][resource['id']]) {
    flatResources[resource['type']][resource['id']] = {
      id: resource['id']
    }
  }

  if (resource.relationships) {
    for (let name in resource.relationships) {
      const relationships = [].concat(resource.relationships[name].data).map(resource => {
        if (!resource) {
          return resource
        }

        if (!flatResources[resource['type']]) {
          flatResources[resource['type']] = {}
        }
        if (!flatResources[resource['type']][resource['id']]) {
          flatResources[resource['type']][resource['id']] = {
            id: resource['id']
          }
        }

        return flatResources[resource['type']][resource['id']]
      })

      flatResources[resource['type']][resource['id']][name] = getFirstIfSingleItemList(relationships)
    }
  }

  if (resource.attributes) {
    for (let name in resource.attributes) {
      flatResources[resource['type']][resource['id']][name] = resource.attributes[name]
    }
  }

  return flatResources[resource['type']][resource['id']]
}

exports.deserialize = json => {
  const flatResources = {}

  if (json.included) {
    json.included
      .forEach(resource => addToFlatResources(flatResources, resource))
  }

  const deserialized = []
    .concat(json.data)
    .map(resource => addToFlatResources(flatResources, resource))

  return getFirstIfSingleItemList(deserialized)
}
