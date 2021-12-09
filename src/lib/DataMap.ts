class DataMap<T extends { id: string }> {
  private values: { [key: string]: T };

  constructor() {
    this.values = {};
  }

  store(value: T) {
    this.values[value.id] = value;
  }

  all() {
    return this.values;
  }

  get(data: string | T) {
    return typeof data === 'string' ? this.values[data] : this.values[data.id];
  }

  remove(data: string | T) {
    const id = typeof data === 'string' ? data : data.id;
    delete this.values[id];
  }

  drop() {
    this.values = {};
  }
}

export { DataMap };
