import React from 'react';

import bem from '../util/bem';

const st2Class = bem('viewer')
    , st2Icon = bem('icon')
    ;

export default class Handle extends React.Component {
  static propTypes = {
    type: React.PropTypes.string,
    onDrag: React.PropTypes.func
  }

  handleDragStart(e) {
    e.stopPropagation();

    if (this.props.onDrag) {
      this.props.onDrag(e);
    }
  }

  render() {
    const props = {
      className: st2Class('node-button') + ' ' + st2Icon(this.props.type),
      draggable: true,
      onDragStart: (e) => this.handleDragStart(e)
    };

    return <span {...props} />;
  }
}
