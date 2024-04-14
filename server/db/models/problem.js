class Problem {
  
  // All our model objects take in these basics (id is optional)
  constructor(db, id, options = {}) {
    this._db = db;
    this.id = id;
  }
}

module.exports = Problem;