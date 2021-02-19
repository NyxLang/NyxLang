function Environment(parent = null) {
  this.vars = Object.create(parent ? parent.vars : null);
  this.parent = parent;
}

Environment.prototype = {
  extend: function() {
    return new Environment(this);
  },

  lookup: function(name) {
    let scope = this;
    while (scope) {
      if (Object.prototype.hasOwnProperty.call(scope.vars, name)) {
        return scope;
      }
      scope = scope.parent;
    }
  },

  get: function(name) {
    if (name in this.vars) {
      return this.vars[name];
    }
    throw new Error(`Undefined identifier ${name}`);
  },

  set: function(name, value) {
    let scope = this.lookup(name);
    if (scope) {
      return (scope || this).vars[name] = value;
    }
    throw new Error(`Must define identifier ${name} before assigning a value`);
  },

  def: function(name, value) {
    return this.vars[name] = value;
  }
};

module.exports = Environment;