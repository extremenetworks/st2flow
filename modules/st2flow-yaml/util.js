// @flow

// Some lodashy (and other) functions without all the dashy

function isPlainObject(data: any) {
  return Object.prototype.toString.call(data) === '[object Object]';
}

function pick(obj: Object, ...keys: Array<string| number>): Object {
  return keys.reduce((o, key) => {
    o[key] = obj[key];
    return o;
  }, {});
}

function omit(obj: Object, ...keys: Array<string| number>): Object {
  return Object.keys(obj).reduce((o, key) => {
    if (!keys.includes(key)) {
      o[key] = obj[key];
    }
    return o;
  }, {});
}

function get(obj: Object, key: string | Array<string | number>) {
  const arrKey = typeof key === 'string' ? splitKey(key) : key;

  return arrKey.reduce((o, key) => o[key], obj);
}

function splitKey(key: string | Array<string | number>): Array<any> {
  const arr = typeof key === 'string' ? key.split('.') : key.slice(0);
  return arr.length === 1 && arr[0] === '' ? [] : arr;
}

function defineExpando(obj: Object, key: string, value: any): void {
  Object.defineProperty(obj, key, {
    value,
    writable: false,
    configurable: false,
    enumerable: false,
  });
}

export {
  isPlainObject,
  pick,
  omit,
  get,
  splitKey,
  defineExpando,
};