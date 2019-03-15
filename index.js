const initializeResource = (flatResources, resource) => {
  if (!flatResources[resource['type']]) {
    flatResources[resource['type']] = {}
  }
  if (!flatResources[resource['type']][resource['id']]) {
    flatResources[resource['type']][resource['id']] = {
      id: resource['id']
    }
  }

  return flatResources[resource['type']][resource['id']]
}

const parseRelationship = (flatResources, relationship) => {
  if (Array.isArray(relationship)) {
    return relationship
      .map(resource => initializeResource(flatResources, resource))
  } else if (relationship) {
    return initializeResource(flatResources, relationship)
  } else {
    return relationship
  }
}

const parseResource = (flatResources, resource) => {
  const flatResource = initializeResource(flatResources, resource)

  if (resource.relationships) {
    for (let name in resource.relationships) {
      flatResource[name] = parseRelationship(
        flatResources, resource.relationships[name].data
      )
    }
  }

  if (resource.attributes) {
    for (let name in resource.attributes) {
      flatResource[name] = resource.attributes[name]
    }
  }

  return flatResource
}

exports.deserialize = json => {
  const flatResources = {}

  if (json.included) {
    json.included
      .forEach(resource => parseResource(flatResources, resource))
  }

  if (Array.isArray(json.data)) {
    return parseResource(flatResources, json.data)
  } else {
    return json.data
      .map(resource => parseResource(flatResources, resource))
  }
}
