function normalizeValue(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function formatPath(pathSegments) {
  if (pathSegments.length === 0) {
    return 'racine';
  }

  return pathSegments.reduce((path, segment, index) => {
    if (typeof segment === 'number') {
      return `${path}[${segment}]`;
    }

    if (index === 0) {
      return segment;
    }

    return `${path}.${segment}`;
  }, '');
}

function describeType(value) {
  if (Array.isArray(value)) {
    return 'array';
  }

  if (value === null) {
    return 'null';
  }

  return typeof value;
}

function createSchema(kind, options = {}) {
  return {
    kind,
    optional: false,
    ...options,
  };
}

export function stringField(options = {}) {
  return createSchema('string', options);
}

export function objectField(shape, options = {}) {
  return createSchema('object', {
    shape,
    allowUnknown: false,
    ...options,
  });
}

export function arrayField(item, options = {}) {
  return createSchema('array', {
    item,
    ...options,
  });
}

export function optional(schema) {
  return {
    ...schema,
    optional: true,
  };
}

export function enumField(values, options = {}) {
  return stringField({
    oneOf: values,
    ...options,
  });
}

function buildError(pathSegments, message) {
  return `${formatPath(pathSegments)}: ${message}`;
}

function validateString(schema, value, pathSegments, errors) {
  if (typeof value !== 'string') {
    errors.push(buildError(pathSegments, `type invalide, string attendu, ${describeType(value)} reçu`));
    return;
  }

  const inspectedValue = schema.trim !== false ? normalizeValue(value) : value;

  if (schema.nonEmpty !== false && inspectedValue.length === 0) {
    errors.push(buildError(pathSegments, 'chaîne vide interdite'));
  }

  if (schema.startsWith && !inspectedValue.startsWith(schema.startsWith)) {
    errors.push(buildError(pathSegments, `doit commencer par "${schema.startsWith}"`));
  }

  if (schema.pattern && !schema.pattern.test(inspectedValue)) {
    errors.push(buildError(pathSegments, schema.patternMessage ?? 'format invalide'));
  }

  if (schema.oneOf) {
    const expectedValues = schema.oneOf.map((entry) => normalizeValue(entry));
    const matches = schema.caseInsensitive
      ? expectedValues.map((entry) => entry.toLocaleLowerCase('fr')).includes(inspectedValue.toLocaleLowerCase('fr'))
      : expectedValues.includes(inspectedValue);

    if (!matches) {
      errors.push(buildError(pathSegments, `valeur invalide, attendu: ${schema.oneOf.join(', ')}`));
    }
  }

  for (const validator of schema.validators ?? []) {
    const validationMessage = validator(inspectedValue);
    if (typeof validationMessage === 'string' && validationMessage.length > 0) {
      errors.push(buildError(pathSegments, validationMessage));
    }
  }
}

function validateObject(schema, value, pathSegments, errors) {
  if (!isPlainObject(value)) {
    errors.push(buildError(pathSegments, `type invalide, object attendu, ${describeType(value)} reçu`));
    return;
  }

  const shapeEntries = Object.entries(schema.shape);

  for (const [key, childSchema] of shapeEntries) {
    validateSchema(childSchema, value[key], [...pathSegments, key], errors);
  }

  if (schema.allowUnknown) {
    return;
  }

  const allowedKeys = new Set(shapeEntries.map(([key]) => key));
  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key)) {
      errors.push(buildError([...pathSegments, key], 'champ non prévu par le schéma'));
    }
  }
}

function validateArray(schema, value, pathSegments, errors) {
  if (!Array.isArray(value)) {
    errors.push(buildError(pathSegments, `type invalide, array attendu, ${describeType(value)} reçu`));
    return;
  }

  if (typeof schema.minLength === 'number' && value.length < schema.minLength) {
    errors.push(buildError(pathSegments, `doit contenir au moins ${schema.minLength} élément(s)`));
  }

  for (const [index, item] of value.entries()) {
    validateSchema(schema.item, item, [...pathSegments, index], errors);
  }
}

export function validateSchema(schema, value, pathSegments = [], errors = []) {
  if (value === undefined || value === null) {
    if (!schema.optional) {
      errors.push(buildError(pathSegments, 'champ requis manquant'));
    }
    return errors;
  }

  switch (schema.kind) {
    case 'string':
      validateString(schema, value, pathSegments, errors);
      break;
    case 'object':
      validateObject(schema, value, pathSegments, errors);
      break;
    case 'array':
      validateArray(schema, value, pathSegments, errors);
      break;
    default:
      errors.push(buildError(pathSegments, `type de schéma inconnu: ${schema.kind}`));
      break;
  }

  return errors;
}