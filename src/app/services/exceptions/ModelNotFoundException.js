class ModelNotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = 'ModelNotFoundException';
  }
}

export default ModelNotFoundException;
