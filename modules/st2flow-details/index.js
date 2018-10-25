import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import cx from 'classnames';

import { connect } from '@stackstorm/st2flow-model';

import AutoForm from '@stackstorm/module-auto-form';
import Editor from '@stackstorm/st2flow-editor';
import { Toggle } from '@stackstorm/module-forms/button.component';
import { Panel, Toolbar, ToolbarButton } from './layout';
import Property from './property';

import ArrayField from '@stackstorm/module-auto-form/fields/array';
import NumberField from '@stackstorm/module-auto-form/fields/number';
import IntegerField from '@stackstorm/module-auto-form/fields/integer';
import BooleanField from '@stackstorm/module-auto-form/fields/boolean';
import StringField from '@stackstorm/module-auto-form/fields/string';
import ObjectField from '@stackstorm/module-auto-form/fields/object';
import PasswordField from '@stackstorm/module-auto-form/fields/password';
import EnumField from '@stackstorm/module-auto-form/fields/enum';

import Meta from './meta-panel';

import style from './style.css';



class Transition extends Component {
  static propTypes = {
    transition: PropTypes.object.isRequired,
  }

  style = style

  render() {
    const { transition } = this.props;
    
    return (
      <div className={this.style.transition} >
        <div className={this.style.transitionLine} >
          <div className={this.style.transitionLabel}>
            When
          </div>
          <div className={this.style.transitionField}>
            <StringField value={transition.condition} />
          </div>
          <div className={this.style.transitionButton}>
            <i className="icon-cross" />
          </div>
        </div>
        <div className={this.style.transitionLine} >
          <div className={this.style.transitionLabel}>
            Publish
          </div>
          <div className={this.style.transitionField}>
            <Toggle />
          </div>
        </div>
        { transition.publish && (
          <div className={this.style.transitionLine} >
            <div className={this.style.transitionField}>
              <StringField /><StringField />
            </div>
            <div className={this.style.transitionField}>
              <i className="icon-plus2" />
            </div>
          </div>
        )}
        <div className={this.style.transitionLine} >
          <div className={this.style.transitionLabel}>
            Do
          </div>
          <div className={this.style.transitionField}>
            <StringField />
          </div>
          <div className={this.style.transitionButton}>
            <i className="icon-plus2" />
          </div>
        </div>
        <div className={this.style.transitionLine} >
          <div className={this.style.transitionLabel}>
            Color
          </div>
          <div className={this.style.transitionField}>
            <StringField />
          </div>
        </div>
      </div>
    );
  }
}

@connect(({ model }) => ({ model }))
class TaskDetails extends Component {
  static propTypes = {
    model: PropTypes.object,
    selected: PropTypes.string,
    actions: PropTypes.array,
    onBack: PropTypes.func.isRequired,
  }

  state = {
    section: undefined,
  }

  handleSectionSwitch(section) {
    this.setState({ section });
  }

  style = style

  render() {
    const { model, selected, onBack, actions } = this.props;
    const { section = 'task' } = this.state;

    const task = selected && model.tasks.find(task => task.name === selected);
    const transitions = selected && model.transitions.filter(transition => transition.from.name === task.name);

    const [ actionRef ] = task.action.split(' ');
    const action = actions.find(({ref}) => ref === actionRef);

    return ([
      <Toolbar key="toolbar" secondary={true} >
        <ToolbarButton
          className="icon-chevron_left"
          onClick={() => onBack()}
        />
        <Task task={task} />
      </Toolbar>,
      <Toolbar key="subtoolbar" secondary={true} >
        <ToolbarButton stretch onClick={() => this.handleSectionSwitch('task')} selected={section === 'task'}>Task</ToolbarButton>
        <ToolbarButton stretch onClick={() => this.handleSectionSwitch('input')} selected={section === 'input'}>Input</ToolbarButton>
        <ToolbarButton stretch onClick={() => this.handleSectionSwitch('properties')} selected={section === 'properties'}>Properties</ToolbarButton>
        <ToolbarButton stretch onClick={() => this.handleSectionSwitch('transitions')} selected={section === 'transitions'}>Transitions</ToolbarButton>
      </Toolbar>,
      section === 'task' && (
        <Panel key="task">
          <StringField name="name" value={task.name} onChange={name => model.updateTask(task.name, { name })} />
          <StringField name="action" value={task.action} onChange={a => console.log(a)} />
        </Panel>
      ),
      section === 'input' && (
        <Panel key="input">
          <AutoForm
            spec={{
              type: 'object',
              properties: action.parameters,
            }}
            data={this.state.runValue}
            onChange={(runValue) => this.setState({ runValue })}
          />
        </Panel>
      ),
      section === 'properties' && (
        <Panel key="properties">
          <Property name="Join" description="Allows to synchronize multiple parallel workflow branches and aggregate their data." onChange={a => console.log(a)} />
          <Property name="With Items" description="Run an action or workflow associated with a task multiple times." value={true} onChange={a => console.log(a)} />
        </Panel>
      ),
      section === 'transitions' && (
        <Panel key="transitions">
          {
            transitions.map(transition => <Transition key={`${transition.from.name}-${transition.to.name}-${window.btoa(transition.condition)}`} transition={transition} />)
          }
          <div className={this.style.transitionInfo}>
            To add a transition, hover over a task box and drag the connector to the desired task box you want to transition to.
          </div>
        </Panel>
      ),
    ]);
  }
}

@connect(({ model }) => ({ model }))
class TaskList extends Component {
  static propTypes = {
    model: PropTypes.object,
    onSelect: PropTypes.func.isRequired,
  }

  style = style

  render() {
    const { model, onSelect } = this.props;

    return (
      <Panel className={this.style.taskPanel}>
        {
          model.tasks.map(task => (
            <Task
              key={task.name}
              task={task}
              onClick={() => onSelect(task)}
            />
          ))
        }
      </Panel>
    );
  }
}

class Task extends Component {
  static propTypes = {
    task: PropTypes.object.isRequired,
    onClick: PropTypes.func,
  }

  style = style

  handleClick(e) {
    if (!this.props.onClick) {
      return;
    }

    e.stopPropagation();

    this.props.onClick();
  }

  render() {
    const { task } = this.props;

    return (
      <div
        key={task.name}
        className={this.style.task}
        onClick={e => this.handleClick(e)}
      >
        <div className={this.style.taskName}>{ task.name }</div>
        <div className={this.style.taskAction}>{ task.action }</div>
      </div>
    );
  }
}

@connect(({ model, metaModel }) => ({ model, metaModel }))
export default class Details extends Component {
  static propTypes = {
    className: PropTypes.string,
    model: PropTypes.object,
    metaModel: PropTypes.object,
    actions: PropTypes.array,
    selected: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
  }

  state = {}

  style = style

  handleSectionSelect(section) {
    this.setState({ selected: section.title });
  }

  handleTaskSelect(task) {
    this.props.onSelect(task.name);
  }

  handleBack() {
    this.props.onSelect();
  }

  render() {
    const sections = [{
      title: 'metadata',
      className: 'icon-gear',
    }, {
      title: 'execution',
      className: 'icon-lan',
    }];

    const { selected: taskSelected, actions } = this.props;
    const { selected = 'metadata', asCode } = this.state;

    return (
      <div className={cx(this.props.className, this.style.component)}>
        <Toolbar>
          {
            sections.map(section => {
              return (
                <ToolbarButton
                  key={section.title}
                  className={section.className}
                  selected={selected === section.title}
                  onClick={() => this.handleSectionSelect(section)}
                />
              );
            })
          }
          <ToolbarButton className={cx(style.code, 'icon-code')} selected={asCode} onClick={() => this.setState({ asCode: !asCode })} />
        </Toolbar>
        {
          selected === 'metadata' && (
            asCode
              && <Editor model={this.props.metaModel} />
              || <Meta />
          )
        }
        {
          selected === 'execution' && (
            asCode
              && <Editor model={this.props.model} />
              || taskSelected
                && <TaskDetails onBack={() => this.handleBack()} selected={taskSelected} actions={actions} />
                || <TaskList onSelect={task => this.handleTaskSelect(task)} />
          )
        }
      </div>
    );
  }
}