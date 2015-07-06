'use strict';

let intersectRect = require('./intersect-rect')
  , EventEmitter = require('events').EventEmitter
  ;

class Node extends EventEmitter {
  constructor(graph, name) {
    super();

    this.name = name;

    this.graph = graph;
    this.graph.setNode(name, this);

    Object.observe(this, changes => {
      this.emit('change', changes);
    });
  }

  select() {
    this.graph.select(this.name);
  }

  isSelected() {
    return this.graph.isSelected(this.name);
  }

  connectTo(target, type) {
    return this.graph.connect(this.name, target, type);
  }

  get center() {
    return {
      x: this.x + (this.width / 2),
      y: this.y + (this.height / 2),
      width: this.width,
      height: this.height
    };
  }

  intersect(node) {
    return intersectRect(this.center, node.center);
  }
}

module.exports = Node;
