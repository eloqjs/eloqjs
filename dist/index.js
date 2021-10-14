'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isObject$1(val) {
  return val !== null && typeof val === 'object';
} // Base function to apply defaults


function _defu(baseObj, defaults) {
  var namespace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
  var merger = arguments.length > 3 ? arguments[3] : undefined;

  if (!isObject$1(defaults)) {
    return _defu(baseObj, {}, namespace, merger);
  }

  var obj = Object.assign({}, defaults);

  for (var key in baseObj) {
    if (key === '__proto__' || key === 'constructor') {
      continue;
    }

    var val = baseObj[key];

    if (val === null) {
      continue;
    }

    if (merger && merger(obj, key, val, namespace)) {
      continue;
    }

    if (Array.isArray(val) && Array.isArray(obj[key])) {
      obj[key] = obj[key].concat(val);
    } else if (isObject$1(val) && isObject$1(obj[key])) {
      obj[key] = _defu(val, obj[key], (namespace ? "".concat(namespace, ".") : '') + key.toString(), merger);
    } else {
      obj[key] = val;
    }
  }

  return obj;
} // Create defu wrapper with optional merger and multi arg support


function extend(merger) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.reduce(function (p, c) {
      return _defu(p, c, '', merger);
    }, {});
  };
} // Basic version


var defu = extend(); // Custom version with function merge support

defu.fn = extend(function (obj, key, currentValue, _namespace) {
  if (typeof obj[key] !== 'undefined' && typeof currentValue === 'function') {
    obj[key] = currentValue(obj[key]);
    return true;
  }
}); // Custom version with function merge support only for defined arrays

defu.arrayFn = extend(function (obj, key, currentValue, _namespace) {
  if (Array.isArray(obj[key]) && typeof currentValue === 'function') {
    obj[key] = currentValue(obj[key]);
    return true;
  }
}); // Support user extending

defu.extend = extend;

var defu_1 = defu;

class Uid {
  static make(namespace = "attribute") {
    this._count[namespace]++;
    return `${this._prefix}${this._count[namespace]}`;
  }
  static reset(namespace = "global") {
    this._count[namespace] = 0;
  }
}
Uid._count = {
  attribute: 0,
  model: 0,
  collection: 0
};
Uid._prefix = "$uid";

function sortNullish(valueA, valueB) {
  if (valueA === null || valueA === void 0) {
    return 1;
  }
  if (valueB === null || valueB === void 0) {
    return -1;
  }
  return 0;
}
function sortGreaterOrLessThan(valueA, valueB) {
  if (valueA < valueB) {
    return -1;
  }
  if (valueA > valueB) {
    return 1;
  }
  return 0;
}

function extractValue(regex, value, index) {
  const extractValue2 = new RegExp(regex, "i");
  const _value = value.match(extractValue2);
  if (isNumber(index)) {
    return _value[index];
  }
  return _value.filter((_val, _index) => index.includes(_index));
}
function resolveLikeOperation(value) {
  switch (true) {
    case (value.startsWith("%") && value.endsWith("%")): {
      const _value = extractValue("%(.*)%", value, 1);
      return new RegExp(`^.*${_value}.*$`, "i");
    }
    case (value.startsWith("_") && value.endsWith("%")): {
      const _value = extractValue("_(.*)%", value, 1);
      return new RegExp(`^.${_value}.*$`, "i");
    }
    case value.endsWith("__%"): {
      const _value = extractValue("(.*)__%", value, 1);
      return new RegExp(`^${_value}\\s?\\w{2}.*$`, "i");
    }
    case value.endsWith("_%"): {
      const _value = extractValue("(.*)_%", value, 1);
      return new RegExp(`^${_value}\\s?\\w.*$`, "i");
    }
    case value.endsWith("%"): {
      const _value = extractValue("(.*)%", value, 1);
      return new RegExp(`^${_value}.*$`, "i");
    }
    case value.startsWith("%"): {
      const _value = extractValue("%(.*)", value, 1);
      return new RegExp(`^.*${_value}$`, "i");
    }
    case value.includes("%"): {
      const [start, end] = extractValue("(.*)%(.*)", value, [1, 2]);
      return new RegExp(`^${start}.*${end}$`, "i");
    }
    default: {
      return new RegExp(`^.*${value}.*$`, "i");
    }
  }
}
function compareValues(property, value, operator) {
  switch (operator) {
    case "==":
      return property == value;
    default:
    case "===":
      return property === value;
    case "!=":
    case "<>":
      return property != value;
    case "!==":
      return property !== value;
    case "<":
      return property < value;
    case "<=":
      return property <= value;
    case ">":
      return property > value;
    case ">=":
      return property >= value;
    case "LIKE": {
      if (!isString(property) || !isString(value)) {
        return false;
      }
      const operation = resolveLikeOperation(value);
      return !!property.match(operation);
    }
  }
}

class Collection {
  constructor(models = [], options = {}) {
    this.models = [];
    this._registry = {};
    this._options = options;
    this._boot();
    if (models) {
      this.add(models);
    }
  }
  get length() {
    return this.count();
  }
  static _createModel(record, modelType) {
    if (isArray(record)) {
      return record.map((r) => this._createModel(r, modelType));
    }
    if (isModel(record)) {
      return record;
    }
    const modelConstructor = modelType || this.model;
    assert(!!modelConstructor, ["Model type is not defined."]);
    return new modelConstructor(record);
  }
  [Symbol.iterator]() {
    let index = -1;
    return {
      next: () => {
        index += 1;
        return {
          value: this.models[index],
          done: index >= this.models.length
        };
      }
    };
  }
  add(model) {
    if (isArray(model)) {
      return model.map((m) => this.add(m)).filter((m) => !!m);
    }
    if (isPlainObject(model)) {
      return this.add(this._self()._createModel(model, this._options.model));
    }
    assert(isModel(model), [
      "Expected a model, plain object, or array of either."
    ]);
    if (this._hasModelInRegistry(model)) {
      return;
    }
    this.models.push(model);
    this.onAdd(model);
    return model;
  }
  average(key) {
    return this.avg(key);
  }
  avg(key) {
    return this.sum(key) / this.count();
  }
  chunk(size) {
    const chunks = [];
    let index = 0;
    do {
      const models = this.models.slice(index, index + size);
      const collection = this._createCollection(models);
      chunks.push(collection);
      index += size;
    } while (index < this.count());
    return chunks;
  }
  clone() {
    return this._createCollection(this.models);
  }
  count() {
    return this.models.length;
  }
  countBy(callback) {
    const group = this.groupBy(callback);
    return Object.keys(group).reduce((result, key) => {
      result[key] = group[key].length;
      return result;
    }, {});
  }
  each(callback) {
    return this.models.every((model, index) => {
      return callback(model, index, this.models) !== false;
    });
  }
  except(keys) {
    if (isNullish(keys) || isEmpty(keys)) {
      return this._createCollection(this.models);
    }
    const models = this.models.filter((model) => model.$id && !keys.includes(model.$id));
    return this._createCollection(models);
  }
  find(predicate) {
    if (isFunction(predicate)) {
      return this.models.find(predicate) || null;
    }
    if (isModel(predicate)) {
      return predicate.$id && this.find(predicate.$id) || null;
    }
    if (isArray(predicate)) {
      return predicate.map((id) => this.find(id)).filter((m) => !!m);
    }
    assert(isString(predicate) || isNumber(predicate), [
      "Invalid type of `predicate` on `find`."
    ]);
    return this.find((model) => {
      return model.$id === predicate;
    });
  }
  first() {
    if (this.isNotEmpty()) {
      return this.models[0];
    }
    return null;
  }
  forPage(page, chunk) {
    const models = this.models.slice(page * chunk - chunk, page * chunk);
    return this._createCollection(models);
  }
  groupBy(key) {
    const collection = {};
    this.models.forEach((model, index) => {
      var _a, _b;
      let resolvedKey;
      if (isFunction(key)) {
        resolvedKey = (_a = key(model, index)) != null ? _a : "";
      } else {
        resolvedKey = (_b = model[key]) != null ? _b : "";
      }
      if (isUndefined(collection[resolvedKey])) {
        collection[resolvedKey] = this._createCollection();
      }
      collection[resolvedKey].add(model);
    });
    return collection;
  }
  has(model) {
    const models = forceArray(model);
    for (const record of models) {
      if (this._indexOf(record) < 0) {
        return false;
      }
    }
    return true;
  }
  implode(key, glue) {
    return this.pluck(key).join(glue);
  }
  isEmpty() {
    return !this.models.length;
  }
  isNotEmpty() {
    return !this.isEmpty();
  }
  last() {
    if (this.isNotEmpty()) {
      return this.models[this.count() - 1];
    }
    return null;
  }
  map(callback) {
    return this.models.map(callback);
  }
  max(key) {
    const values = this.pluck(key).filter((value) => value !== void 0);
    return Math.max(...values);
  }
  median(key) {
    if (this.count() % 2 === 0) {
      return (this.models[this.count() / 2 - 1][key] + this.models[this.count() / 2][key]) / 2;
    }
    return this.models[Math.floor(this.count() / 2)][key];
  }
  min(key) {
    const values = this.pluck(key).filter((value) => value !== void 0);
    return Math.min(...values);
  }
  mode(key) {
    const values = [];
    let highestCount = 1;
    if (this.isEmpty()) {
      return null;
    }
    this.models.forEach((model) => {
      const tempValues = values.filter((value) => {
        return value.key === model[key];
      });
      if (!tempValues.length) {
        values.push({
          key: model[key],
          count: 1
        });
      } else {
        tempValues[0].count += 1;
        const {count} = tempValues[0];
        if (count > highestCount) {
          highestCount = count;
        }
      }
    });
    return values.filter((value) => value.count === highestCount).map((value) => value.key);
  }
  modelKeys() {
    return this.models.map((model) => model.$id);
  }
  nth(step, offset) {
    const models = this.models.slice(offset).filter((_model, index) => index % step === 0);
    return this._createCollection(models);
  }
  only(keys) {
    if (isNullish(keys) || isEmpty(keys)) {
      return this._createCollection(this.models);
    }
    const models = this.models.filter((model) => model.$id && keys.includes(model.$id));
    return this._createCollection(models);
  }
  partition(callback) {
    const arrays = [
      this._createCollection(),
      this._createCollection()
    ];
    this.models.forEach((model) => {
      if (callback(model)) {
        arrays[0].add(model);
      } else {
        arrays[1].add(model);
      }
    });
    return arrays;
  }
  pluck(key) {
    return this.models.map((model) => model[key]);
  }
  pop() {
    if (this.isNotEmpty()) {
      return this._removeModelAtIndex(this.count() - 1) || null;
    }
    return null;
  }
  random(length) {
    const collection = this.clone().shuffle();
    if (!length) {
      return collection.first();
    }
    return collection.take(length);
  }
  reduce(iteratee, initial) {
    if (arguments.length === 1) {
      initial = this.first() || void 0;
    }
    return this.models.reduce(iteratee, initial);
  }
  remove(model) {
    if (isFunction(model)) {
      return this.remove(this.models.filter(model));
    }
    if (isArray(model)) {
      return model.map((m) => this.remove(m)).filter((m) => !!m);
    }
    if (isPlainObject(model)) {
      const m = this.models.find((m2) => m2.$id === m2.$self().getIdFromRecord(model));
      return m ? this.remove(m) : void 0;
    }
    assert(isModel(model), [
      "Expected function, object, array, or model to remove."
    ]);
    return this._removeModel(model);
  }
  replace(models) {
    assert(isObject(models) || isArray(models), [
      "Expected a model, plain object, or array of either."
    ]);
    this.clear();
    return this.add(models);
  }
  reset(attributes) {
    for (const model of this.models) {
      model.$reset(attributes);
    }
  }
  shift() {
    if (this.isNotEmpty()) {
      return this._removeModelAtIndex(0) || null;
    }
    return null;
  }
  shuffle() {
    let j;
    let x;
    let i;
    for (i = this.count(); i; i -= 1) {
      j = Math.floor(Math.random() * i);
      x = this.models[i - 1];
      this.models[i - 1] = this.models[j];
      this.models[j] = x;
    }
    return this;
  }
  skip(count) {
    return this._createCollection(this.models.slice(count));
  }
  sort(callback) {
    this.models.sort(callback);
    return this;
  }
  sortBy(comparator) {
    this.models.sort((a, b) => {
      const valueA = resolveValue(a, comparator);
      const valueB = resolveValue(b, comparator);
      return sortNullish(valueA, valueB) || sortGreaterOrLessThan(valueA, valueB);
    });
    return this;
  }
  sortByDesc(comparator) {
    this.sortBy(comparator);
    this.models.reverse();
    return this;
  }
  split(size) {
    const modelsPerGroup = Math.round(this.count() / size);
    const collections = [];
    for (let iterator = 0; iterator < size; iterator += 1) {
      collections.push(this._createCollection(this.models.splice(0, modelsPerGroup)));
    }
    return collections;
  }
  sum(key) {
    let total = 0;
    for (const model of this.models) {
      let value;
      if (isFunction(key)) {
        value = key(model);
      } else {
        value = model[key];
      }
      total += isString(value) ? parseFloat(value) : value;
    }
    return parseFloat(total.toPrecision(12));
  }
  syncReference(attributes) {
    for (const model of this.models) {
      model.$syncReference(attributes);
    }
  }
  take(limit) {
    if (limit < 0) {
      return this._createCollection(this.models.slice(limit));
    }
    return this._createCollection(this.models.slice(0, limit));
  }
  toJSON() {
    return this.models;
  }
  where(key, operator, value) {
    const collection = this.clone();
    let comparisonOperator = operator;
    let comparisonValue = value;
    if (operator === void 0 || operator === true) {
      collection.models = collection.models.filter((model) => model[key]);
    } else if (operator === false) {
      collection.models = collection.models.filter((model) => !model[key]);
    } else {
      if (value === void 0) {
        comparisonValue = operator;
        comparisonOperator = "===";
      }
      collection.models = this.models.filter((model) => {
        return compareValues(model[key], comparisonValue, comparisonOperator);
      });
    }
    return collection;
  }
  clear() {
    this._clearModels();
  }
  onRemove(model) {
    model.$unregisterCollection(this);
    this._removeModelFromRegistry(model);
  }
  onAdd(model) {
    model.$registerCollection(this);
    this._addModelToRegistry(model);
  }
  _indexOf(model) {
    if (!this._hasModelInRegistry(model)) {
      return -1;
    }
    return this.models.findIndex((m) => m.$uid === model.$uid);
  }
  _removeModelFromRegistry(model) {
    this._registry[model.$uid] = false;
  }
  _hasModelInRegistry(model) {
    return !!this._registry[model.$uid];
  }
  _addModelToRegistry(model) {
    this._registry[model.$uid] = true;
  }
  _removeModelAtIndex(index) {
    if (index < 0) {
      return;
    }
    const model = this.models[index];
    this.models.splice(index, 1);
    this.onRemove(model);
    return model;
  }
  _removeModel(model) {
    return this._removeModelAtIndex(this._indexOf(model));
  }
  _clearModels() {
    const models = this.models;
    this.models = [];
    models.every((model) => {
      this.onRemove(model);
    });
  }
  _createCollection(models = [], options = {}) {
    return new this.constructor(models, {
      ...this._options,
      ...options
    });
  }
  _self() {
    return this.constructor;
  }
  _boot() {
    this._generateUid();
  }
  _generateUid() {
    Object.defineProperty(this, "$uid", {
      value: Uid.make("collection"),
      enumerable: false,
      configurable: true,
      writable: false
    });
  }
}

function resolveValue(model, predicate) {
  if (isFunction(predicate)) {
    return predicate(model);
  }
  return model[predicate];
}
function forceArray(data) {
  return isArray(data) ? data : [data];
}
function assert(condition, message) {
  if (!condition) {
    throw new Error(["[ELOQJS]"].concat(message).join(" "));
  }
}
function isFunction(value) {
  return typeof value === "function";
}
function isObject(value) {
  return typeof value === "object" && !isArray(value) && !isNull(value);
}
function isPlainObject(value) {
  if (!isObject(value) || getTag(value) != "[object Object]") {
    return false;
  }
  if (isNull(Object.getPrototypeOf(value))) {
    return true;
  }
  let proto = value;
  while (!isNull(Object.getPrototypeOf(proto))) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
}
function isArray(value) {
  return Array.isArray(value);
}
function isString(value) {
  return typeof value === "string";
}
function isNumber(value) {
  return typeof value === "number";
}
function isNull(value) {
  return value === null;
}
function isUndefined(value) {
  return value === void 0;
}
function isNullish(value) {
  return isUndefined(value) || isNull(value);
}
function isModel(value) {
  return isObject(value) && value instanceof Model;
}
function isModelClass(value) {
  return isFunction(value) && value.prototype instanceof Model;
}
function isCollection(value) {
  return isObject(value) && value instanceof Collection;
}
function isEmptyString(value) {
  return value === "";
}
function isEmpty(collection) {
  return size(collection) === 0;
}
function size(collection) {
  return isArray(collection) ? collection.length : Object.keys(collection).length;
}
function getTag(value) {
  if (value == null) {
    return isUndefined(value) ? "[object Undefined]" : "[object Null]";
  }
  return Object.prototype.toString.call(value);
}
function capitalize(value) {
  if (typeof value !== "string")
    return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function resolveCast({key, type, cast}) {
  if (isUndefined(cast)) {
    return cast;
  }
  if (isArray(type)) {
    if (isFunction(cast)) {
      return (value) => cast(value);
    }
    throw new Error(`Invalid cast for field "${key}": The cast must be a Function when multiple types are defined.`);
  }
  if (cast === true) {
    return (value) => castValue(type, value);
  }
  throw new Error(`Invalid cast for field "${key}": The cast must match the field type.`);
}
function castValue(cast, value) {
  if (isClass(cast) || cast === Date) {
    return new cast(value);
  }
  return cast(value);
}
function isClass(obj) {
  const isCtorClass = obj.constructor && obj.constructor.toString().substring(0, 5) === "class";
  if (obj.prototype === void 0) {
    return isCtorClass;
  }
  const isPrototypeCtorClass = obj.prototype.constructor && obj.prototype.constructor.toString && obj.prototype.constructor.toString().substring(0, 5) === "class";
  return isCtorClass || isPrototypeCtorClass;
}

function resolveDefault({
  key,
  type,
  defaultValue
}) {
  let _isPrimitive;
  if (isUndefined(defaultValue)) {
    return defaultValue;
  }
  if (isArray(type)) {
    _isPrimitive = type.every((_type) => isPrimitive(_type));
  } else {
    _isPrimitive = isPrimitive(type);
  }
  if (!_isPrimitive && !isFunction(defaultValue)) {
    throw new Error(`Invalid default value for field "${key}": Fields with type Object/Array must use a factory function to return the default value.`);
  }
  return defaultValue;
}
function getDefaultValue(value) {
  return isFunction(value) ? value() : value;
}
function isPrimitive(type) {
  return type === String || type === Boolean || type === Number || type === BigInt || type === Symbol;
}

function resolveMutator({
  key,
  mutator,
  fallback
}) {
  if (!isUndefined(mutator) && !isFunction(mutator)) {
    throw new Error(`Invalid mutator for field "${key}": The mutator must be a Function.`);
  }
  return mutator || fallback;
}

function resolveNullable({nullable}) {
  return nullable === true;
}

class Relation {
  constructor(model, belongsToModel, data, key, forceSingular) {
    this.model = model;
    this.belongsToModel = belongsToModel;
    this.data = data;
    this.key = key;
    this.forceSingular = forceSingular;
  }
}

const index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Relation: Relation
});

var RelationEnum;
(function(RelationEnum2) {
  RelationEnum2["HAS_ONE"] = "HasOne";
  RelationEnum2["HAS_MANY"] = "HasMany";
})(RelationEnum || (RelationEnum = {}));

function resolveRelationType({
  key,
  type,
  relation
}) {
  const relations = Object.values(RelationEnum);
  if (isModelClass(type) && !relations.includes(relation)) {
    const expected = relations.join(", ");
    const gotten = capitalize(typeof relation);
    throw new Error(`Invalid relation for field ${key}: Expected ${expected}, got ${gotten}.`);
  }
  return relation;
}
function resolveRelation(parent, related, relation, key, value) {
  switch (relation) {
    case RelationEnum.HAS_ONE: {
      const data = mutateHasOne(value, related);
      return new Relation(related, parent, data, key, true);
    }
    case RelationEnum.HAS_MANY: {
      const data = mutateHasMany(value, related);
      return new Relation(related, parent, data, key, false);
    }
    default: {
      const relations = Object.values(RelationEnum);
      const expected = relations.join(" | ");
      throw new Error(`Invalid relation for field ${key}: Expected "${expected}", got "${relation}".`);
    }
  }
}
function mutateHasOne(record, related) {
  if (isModel(record)) {
    return record;
  }
  return record ? new related(record) : null;
}
function mutateHasMany(records, related) {
  if (isCollection(records)) {
    return records;
  }
  records = isArray(records) ? records : [];
  const collection = new Collection([], {
    model: related
  });
  for (let record of records) {
    record = "data" in record ? record.data : record;
    collection.add(record);
  }
  return collection;
}

function resolveRequired({required}) {
  return required === true;
}

function resolveType({key, type}) {
  if (isNullish(type)) {
    throw new Error(`Invalid type for field ${key}: The type must be defined.`);
  }
  return type;
}
function validateType(value, type, relation) {
  if (isNullish(value)) {
    return false;
  }
  if (relation && isModelClass(type)) {
    switch (relation) {
      case RelationEnum.HAS_ONE: {
        return value instanceof type || isPlainObject(value);
      }
      case RelationEnum.HAS_MANY: {
        return isCollection(value) || isArray(value);
      }
      default: {
        return false;
      }
    }
  }
  if (isArray(type)) {
    return type.includes(value.constructor);
  }
  return value.constructor === type;
}
function getExpectedName(type, relation) {
  if (isModelClass(type) && relation === RelationEnum.HAS_MANY) {
    return `Collection of ${resolveName(type)}`;
  }
  if (isArray(type)) {
    return type.map((_type) => resolveName(_type)).join(", ");
  }
  return resolveName(type);
}
function getGottenName(value) {
  if (isNull(value)) {
    return "Null";
  }
  if (value && value.constructor) {
    return value.constructor.name;
  }
  return capitalize(typeof value);
}
function resolveName(type) {
  return type.name || type.constructor.name;
}

function resolveValidator({
  key,
  validator,
  fallback
}) {
  if (!isUndefined(validator) && !isFunction(validator)) {
    throw new Error(`Invalid validator for field "${key}": The validator must be a Function.`);
  }
  return validator || fallback;
}

class Field {
  constructor(key, field, model) {
    this.required = false;
    this.nullable = false;
    this.validator = () => true;
    this.mutator = (value) => value;
    if (!isString(key)) {
      throw new Error('The field "key" must be an string.');
    }
    if (isNullish(field)) {
      throw new Error("The field is not defined.");
    }
    this.model = model;
    this.key = key;
    this._boot(field);
  }
  _boot(field) {
    if (!isPlainObject(field)) {
      field = {
        type: field
      };
    }
    this.type = resolveType({key: this.key, type: field.type});
    this.relation = resolveRelationType({
      key: this.key,
      type: this.type,
      relation: field.relation
    });
    this.required = resolveRequired({
      required: field.required
    });
    this.nullable = resolveNullable({
      nullable: this.relation ? true : field.nullable
    });
    this.default = resolveDefault({
      key: this.key,
      type: this.type,
      defaultValue: field.default
    });
    this.validator = resolveValidator({
      key: this.key,
      validator: field.validator,
      fallback: this.validator
    });
    this.mutator = resolveMutator({
      key: this.key,
      mutator: field.mutator || this.model.mutators()[this.key],
      fallback: this.mutator
    });
    this.cast = resolveCast({
      key: this.key,
      type: this.type,
      cast: this.relation ? true : field.cast
    });
  }
  validate(value) {
    if (this.required && isNullish(value)) {
      throw new Error(`Missing required field: "${this.key}".`);
    }
    if (isUndefined(value)) {
      return true;
    }
    if (!validateType(value, this.type, this.relation) && !(isNull(value) && this.nullable)) {
      const expectedName = getExpectedName(this.type, this.relation);
      const gottenName = getGottenName(value);
      throw new Error(`Invalid field: type check failed for field "${this.key}". Expected ${expectedName}, got ${gottenName}.`);
    }
    if (!this.validator(value)) {
      throw new Error(`Invalid field: custom validator check failed for field "${this.key}".`);
    }
    return true;
  }
  make(value, model) {
    var _a;
    const nullish = this.nullable ? null : void 0;
    const fallback = (_a = getDefaultValue(this.default)) != null ? _a : nullish;
    value = !isUndefined(value) ? value : fallback;
    if (this.cast && !isNullish(value) && !this.relation) {
      value = this.cast(value);
    }
    if (this.mutator) {
      value = this.mutator(value);
    }
    const valid = this.validate(value);
    if (this.relation) {
      value = resolveRelation(model, this.type, this.relation, this.key, value);
    }
    return valid && value;
  }
}

class Map {
  constructor() {
    this.data = {};
  }
  get(key) {
    return this.data[key];
  }
  set(key, value) {
    this.data[key] = value;
  }
  delete(key) {
    delete this.data[key];
  }
  toArray() {
    return this.data;
  }
}

class AttrMap extends Map {
  constructor() {
    super(...arguments);
    this.reference = {};
    this.changes = {};
  }
  set(key, value) {
    this._setReference(key, value);
    super.set(key, value);
  }
  $get(key) {
    return this.reference[key];
  }
  $toArray() {
    return this.reference;
  }
  syncReference(attributes) {
    if (!attributes) {
      this.reference = {...this.data};
      return;
    }
    attributes = forceArray(attributes);
    for (const attribute of attributes) {
      this.reference[attribute] = this.data[attribute];
    }
  }
  syncChanges() {
    this.changes = this.getDirty();
  }
  reset(attributes) {
    if (!attributes) {
      this.data = {...this.reference};
      return;
    }
    attributes = forceArray(attributes);
    for (const attribute of attributes) {
      this.data[attribute] = this.reference[attribute];
    }
  }
  isDirty(attributes) {
    return this.hasChanges(this.getDirty(), forceArray(attributes || []));
  }
  isClean(attributes) {
    return !this.isDirty(attributes);
  }
  wasChanged(attributes) {
    return this.hasChanges(this.getChanges(), forceArray(attributes || []));
  }
  getDirty() {
    const dirty = {};
    for (const key in this.data) {
      if (this.$get(key) !== this.get(key)) {
        dirty[key] = this.get(key);
      }
    }
    return dirty;
  }
  getChanges() {
    return this.changes;
  }
  hasChanges(changes, attributes = []) {
    if (isEmpty(attributes)) {
      return Object.keys(changes).length > 0;
    }
    for (const attribute of attributes) {
      if (attribute in changes) {
        return true;
      }
    }
    return false;
  }
  _setReference(key, value) {
    if (!(key in this.reference)) {
      this.reference[key] = value;
    }
  }
}

const defaultOptions = {
  relations: true,
  isRequest: false,
  shouldPatch: false
};
function value(v) {
  if (isNull(v)) {
    return null;
  }
  if (isArray(v)) {
    return array(v);
  }
  if (isObject(v)) {
    return object(v);
  }
  return v;
}
function array(a) {
  return a.map((v) => value(v));
}
function object(o) {
  const obj = {};
  for (const key in o) {
    obj[key] = value(o[key]);
  }
  return obj;
}
function relation(relation2, isRequest = false) {
  if (isNull(relation2)) {
    return null;
  }
  function resolve(model) {
    if (isRequest) {
      return {
        [model.$primaryKey]: model.$id
      };
    }
    return model.$toJson();
  }
  if (isCollection(relation2)) {
    return relation2.models.map((model) => resolve(model));
  }
  return resolve(relation2);
}
function emptyRelation(relation2) {
  return isArray(relation2) ? [] : null;
}

class Model {
  constructor(attributes, collection = null, options = {}) {
    this.$saving = false;
    this.$deleting = false;
    this.$fatal = false;
    this.$ = {};
    this._localHooks = {};
    this._lastLocalHookId = 0;
    this._collections = new Map();
    this._attributes = new AttrMap();
    this._relationships = new AttrMap();
    this._options = new Map();
    var _a;
    this._boot(options);
    if (collection) {
      this.$registerCollection(collection);
    }
    const fill = (_a = this.$getOption("fill")) != null ? _a : true;
    fill && this.$fill(attributes);
  }
  get $id() {
    return this.$self().getIdFromRecord(this);
  }
  get $primaryKey() {
    return this.$self().primaryKey;
  }
  get $hasId() {
    return this.$self().isValidId(this.$id);
  }
  get $resource() {
    return this.$self().getResource();
  }
  get $entity() {
    return this.$self().entity;
  }
  get $collections() {
    return Object.values(this._collections.toArray());
  }
  static options() {
    return {};
  }
  static fields() {
    return {};
  }
  static setRegistry(key, attribute) {
    if (!this._registries[this.entity]) {
      this._registries[this.entity] = {};
    }
    this._registries[this.entity][key] = attribute;
    return this;
  }
  static clearBootedModels() {
    this._booted = {};
    this._schemas = {};
  }
  static clearRegistries() {
    this._registries = {};
  }
  static mutators() {
    return {};
  }
  static getFields() {
    this._boot();
    return this._schemas[this.entity];
  }
  static isPrimaryKey(key) {
    return this.primaryKey === key;
  }
  static getIdFromRecord(record) {
    const value = isModel(record) ? record._attributes.get(this.primaryKey) : record[this.primaryKey];
    return this.getIdFromValue(value);
  }
  static getIdFromValue(value) {
    if (this.isValidId(value)) {
      return value;
    }
    return null;
  }
  static parseId(data) {
    return data;
  }
  static getResource() {
    return this.resource || this.entity;
  }
  static hasId(record) {
    return this.isValidId(this.getIdFromRecord(record));
  }
  static isValidId(value) {
    if (isString(value) && !isEmptyString(value)) {
      return true;
    }
    if (isNumber(value)) {
      return true;
    }
    return false;
  }
  static hydrate(record) {
    return new this(record).$getAttributes();
  }
  static hasRelation(relationship) {
    return Object.values(this.getFields()).some((field) => field.relation && field.type === relationship);
  }
  static on(on, callback) {
    const id = ++this._lastGlobalHookId;
    if (!this._globalHooks[on]) {
      this._globalHooks[on] = [];
    }
    this._globalHooks[on].push({id, callback});
    return id;
  }
  static off(id) {
    return Object.keys(this._globalHooks).some((on) => {
      const hooks = this._globalHooks[on];
      const index = hooks.findIndex((h) => h.id === id);
      if (index === -1) {
        return false;
      }
      hooks.splice(index, 1);
      return true;
    });
  }
  static _initializeSchema() {
    this._schemas[this.entity] = {};
    const fields = this.fields();
    const _fields = {};
    for (const key in this.fields()) {
      _fields[key] = new Field(key, fields[key], this);
    }
    const registry = {
      ..._fields,
      ...this._registries[this.entity]
    };
    for (const key in registry) {
      const attribute = registry[key];
      this._schemas[this.entity][key] = isFunction(attribute) ? attribute() : attribute;
    }
  }
  static _boot() {
    if (!this._booted[this.entity]) {
      this._booted[this.entity] = true;
      this._initializeSchema();
    }
  }
  static _buildGlobalHooks(on) {
    const hooks = this._getGlobalHookAsArray(on);
    const staticHook = this[on];
    staticHook && hooks.push(staticHook.bind(this));
    return hooks;
  }
  static _getGlobalHookAsArray(on) {
    const hooks = this._globalHooks[on];
    return hooks ? hooks.map((h) => h.callback.bind(this)) : [];
  }
  static _getDefaultOptions() {
    return {
      fill: true,
      relations: true,
      overwriteIdentifier: false,
      patch: false,
      saveUnchanged: true
    };
  }
  $self() {
    return this.constructor;
  }
  $registerCollection(collection) {
    if (isArray(collection)) {
      for (const c of collection) {
        this.$registerCollection(c);
      }
      return;
    }
    assert(!isNullish(collection) && !isUndefined(collection.$uid), [
      "Collection is not valid."
    ]);
    this._collections.set(collection.$uid, collection);
  }
  $unregisterCollection(collection) {
    if (isArray(collection)) {
      for (const c of collection) {
        this.$unregisterCollection(c);
      }
      return;
    }
    assert(!isNullish(collection) && !isUndefined(collection.$uid), [
      "Collection is not valid."
    ]);
    this._collections.delete(collection.$uid);
  }
  $setOptions(options) {
    const _options = {
      ...this.$self()._getDefaultOptions(),
      ...this.$self().options(),
      ...options
    };
    for (const key in _options) {
      this._options.set(key, _options[key]);
    }
  }
  $getOptions() {
    return this._options.toArray();
  }
  $setOption(key, value) {
    return this._options.set(key, value);
  }
  $getOption(key, fallback) {
    var _a;
    return (_a = this._options.get(key)) != null ? _a : fallback;
  }
  $fields() {
    return this.$self().getFields();
  }
  $getField(attribute) {
    const fields = this.$fields();
    assert(attribute in fields, [
      `You must define the attribute "${attribute}" in fields().`
    ]);
    return fields[attribute];
  }
  $set(attribute, value) {
    if (isPlainObject(attribute)) {
      for (const key in attribute) {
        this.$set(key, attribute[key]);
      }
      return;
    }
    const defined = attribute in this;
    if (!defined) {
      this._registerAttribute(attribute);
      this._registerReference(attribute);
    }
    const previous = this._getAttribute(attribute);
    const field = this.$getField(attribute);
    value = field.make(value, this);
    this._setAttribute(attribute, value);
    const changed = defined && previous !== value;
    if (changed) {
      this.$emit("change", {attribute, previous, value});
    }
    return value;
  }
  $get(attribute, fallback) {
    let value = this._getAttribute(attribute);
    if (isUndefined(value)) {
      value = fallback;
    }
    return value;
  }
  $saved(attribute, fallback) {
    let value = this._getReference(attribute);
    if (isUndefined(value)) {
      value = fallback;
    }
    return value;
  }
  $fill(attributes = {}, options = {}) {
    var _a, _b;
    const fields = this.$fields();
    const fillRelation = (_b = (_a = options.relations) != null ? _a : this.$getOption("relations")) != null ? _b : true;
    for (const key in fields) {
      const field = fields[key];
      let value = attributes[key];
      if (field.relation && !fillRelation) {
        continue;
      }
      if (isUndefined(value)) {
        value = this._getAttribute(key);
      }
      this.$set(key, value);
    }
  }
  $update(attributes = void 0, options = {}) {
    if (!attributes || isObject(attributes) && isEmpty(attributes)) {
      this.$syncChanges();
      this.$syncReference();
    } else if (isPlainObject(attributes)) {
      this.$fill(attributes, options);
      this.$syncChanges();
      this.$syncReference();
    } else {
      const id = this.$self().parseId(attributes);
      if (this.$self().isValidId(id)) {
        if (this.$hasId && id !== this.$id) {
          if (!this.$shouldAllowIdentifierOverwrite()) {
            assert(true, ["Not allowed to overwrite model ID."]);
          }
        }
        this[this.$primaryKey] = id;
        this.$syncReference();
      } else {
        assert(true, [
          "Expected an empty response, object, or valid identifier."
        ]);
      }
    }
  }
  $serialize(options = {}) {
    const _option = {
      ...defaultOptions,
      ...options
    };
    const fields = this.$fields();
    const result = {};
    for (const key in fields) {
      const field = fields[key];
      if (!this.$self().readOnlyAttributes.includes(key)) {
        continue;
      }
      if (field.relation) {
        if (_option.shouldPatch && this._relationships.isClean(key)) {
          continue;
        }
        const value = this._relationships.get(key).data;
        result[key] = _option.relations ? relation(value, _option.isRequest) : emptyRelation(value);
      } else {
        if (_option.shouldPatch && this._attributes.isClean(key)) {
          continue;
        }
        const value$1 = this._attributes.get(key);
        result[key] = value(value$1);
      }
    }
    return result;
  }
  $getAttributes() {
    return this.$serialize({relations: false});
  }
  $toJson(model, options = {}) {
    return (model != null ? model : this).$serialize(options);
  }
  $addToAllCollections() {
    for (const collection of this.$collections) {
      collection.add(this);
    }
  }
  $removeFromAllCollections() {
    for (const collection of this.$collections) {
      collection.remove(this);
    }
  }
  $isDirty(attributes) {
    return this._attributes.isDirty(attributes) || this._relationships.isDirty(attributes);
  }
  $isClean(attributes) {
    return !this.$isDirty(attributes);
  }
  $wasChanged(attributes) {
    return this._attributes.wasChanged(attributes) || this._relationships.wasChanged(attributes);
  }
  $getDirty() {
    return {...this._attributes.getDirty(), ...this._relationships.getDirty()};
  }
  $getChanges() {
    return {
      ...this._attributes.getChanges(),
      ...this._relationships.getChanges()
    };
  }
  $syncReference(attributes) {
    const before = this._getReferences();
    this._attributes.syncReference(attributes);
    this._relationships.syncReference(attributes);
    const after = this._getReferences();
    this.$emit("syncReference", {
      attributes: attributes ? forceArray(attributes) : Object.keys(this.$fields()),
      before,
      after
    });
    return this;
  }
  $syncChanges() {
    const before = this.$getChanges();
    this._attributes.syncChanges();
    this._relationships.syncChanges();
    const after = this.$getChanges();
    this.$emit("syncChanges", {
      before,
      after
    });
    return this;
  }
  $clear() {
    const before = this._getAttributes();
    this.$clearAttributes();
    this.$clearState();
    const after = this._getAttributes();
    this.$emit("clear", {
      before,
      after
    });
  }
  $clearAttributes() {
    for (const key in this.$fields()) {
      this[key] = void 0;
    }
    this._attributes.syncReference();
    this._relationships.syncReference();
  }
  $clearState() {
    this.$saving = false;
    this.$deleting = false;
    this.$fatal = false;
  }
  $reset(attributes) {
    const before = this._getAttributes();
    this._attributes.reset(attributes);
    this._relationships.reset(attributes);
    const after = this._getAttributes();
    this.$emit("reset", {
      attributes: attributes ? forceArray(attributes) : Object.keys(this.$fields()),
      before,
      after
    });
  }
  $shouldPatch() {
    return Boolean(this.$getOption("patch"));
  }
  $shouldAllowIdentifierOverwrite() {
    return Boolean(this.$getOption("overwriteIdentifier"));
  }
  $emit(event, context = {}) {
    const hooks = [];
    hooks.push(...this.$self()._buildGlobalHooks(event));
    hooks.push(...this._buildLocalHooks(event));
    if (hooks.length === 0) {
      return;
    }
    context = defu_1(context, this._getDefaultEventContext());
    for (const hook of hooks) {
      const result = hook(context);
      if (result === false) {
        return false;
      }
    }
  }
  $on(on, callback) {
    const id = ++this._lastLocalHookId;
    if (!this._localHooks[on]) {
      this._localHooks[on] = [];
    }
    this._localHooks[on].push({id, callback});
    return id;
  }
  $off(id) {
    return Object.keys(this._localHooks).some((on) => {
      const hooks = this._localHooks[on];
      const index = hooks.findIndex((h) => h.id === id);
      if (index === -1) {
        return false;
      }
      hooks.splice(index, 1);
      return true;
    });
  }
  toJSON() {
    return this.$toJson();
  }
  _boot(options) {
    this.$self()._boot();
    this._generateUid();
    this.$setOptions(options);
  }
  _generateUid() {
    var _a;
    let uid = (_a = this.$uid) != null ? _a : Uid.make("model");
    uid = String(uid);
    Object.defineProperty(this, "$uid", {
      value: uid,
      enumerable: false,
      configurable: true,
      writable: false
    });
  }
  _registerAttribute(attribute) {
    Object.defineProperty(this, attribute, {
      get: () => this.$get(attribute),
      set: (value) => this.$set(attribute, value)
    });
  }
  _registerReference(attribute) {
    Object.defineProperty(this.$, attribute, {
      get: () => this.$saved(attribute),
      set: () => assert(false, ["The saved state of a property can't be overridden."])
    });
  }
  _setAttribute(attribute, value) {
    const field = this.$getField(attribute);
    if (field.relation) {
      this._relationships.set(attribute, value);
    } else {
      this._attributes.set(attribute, value);
    }
    return value;
  }
  _getAttribute(attribute) {
    const field = this.$getField(attribute);
    let value;
    if (field.relation) {
      value = this._relationships.get(attribute);
    } else {
      value = this._attributes.get(attribute);
    }
    return value;
  }
  _getAttributes() {
    const attributes = {};
    for (const field of Object.keys(this.$fields())) {
      attributes[field] = this._getAttribute(field);
    }
    return attributes;
  }
  _getReference(attribute) {
    const field = this.$getField(attribute);
    let value;
    if (field.relation) {
      value = this._relationships.$get(attribute);
    } else {
      value = this._attributes.$get(attribute);
    }
    return value;
  }
  _getReferences() {
    const references = {};
    for (const field of Object.keys(this.$fields())) {
      references[field] = this._getReference(field);
    }
    return references;
  }
  _getLocalHookAsArray(on) {
    const hooks = this._localHooks[on];
    return hooks ? hooks.map((h) => h.callback.bind(this)) : [];
  }
  _buildLocalHooks(on) {
    return this._getLocalHookAsArray(on);
  }
  _getDefaultEventContext() {
    return {model: this, entity: this.$entity};
  }
}
Model.primaryKey = "id";
Model.readOnlyAttributes = [];
Model._schemas = {};
Model._registries = {};
Model._booted = {};
Model._globalHooks = {};
Model._lastGlobalHookId = 0;

function use(plugin, options = {}) {
  const components = {
    Model,
    Collection,
    Relation
  };
  plugin.install(components, options);
}

const index = {
  use,
  Model: Model,
  Collection: Collection,
  Relation
};

exports.Collection = Collection;
exports.Model = Model;
exports.Relations = index$1;
exports.default = index;
