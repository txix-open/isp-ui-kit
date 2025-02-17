import React from 'react';
import { polyfill } from 'react-lifecycles-compat';
import { toType } from './../../helpers/util';
import dispatcher from './../../helpers/dispatcher';

//data type components
import {
  JsonBoolean,
  JsonDate,
  JsonFloat,
  JsonFunction,
  JsonInteger,
  JsonNan,
  JsonNull,
  JsonObject,
  JsonString,
  JsonUndefined,
} from './DataTypes';

import VariableEditor from './../VariableEditor';
import VariableMeta from './../VariableMeta';
import ArrayGroup from './../ArrayGroup';
import ObjectName from './../ObjectName';

//attribute store
import AttributeStore from './../../stores/ObjectAttributes';

//icons
import { CollapsedIcon, ExpandedIcon } from './../ToggleIcons';
import { CheckCircle, Edit, RemoveCircle as Remove } from './../icons';

//theme
import Theme from './../../themes/getStyle';
import stringifyVariable from '../../helpers/stringifyVariable';
import parseInput from '../../helpers/parseInput';
import AutosizeTextarea from 'react-textarea-autosize';

//increment 1 with each nested object & array
const DEPTH_INCREMENT = 1;
//single indent is 5px
const SINGLE_INDENT = 5;

class RjvObject extends React.PureComponent {
  constructor(props) {
    super(props);
    const state = RjvObject.getState(props);
    this.state = {
      ...state,
      prevProps: {},
      editMode: false,
      isFocused: false,
      editValue: '',
      parsedInput: {
        type: false,
        value: null,
      },
    };
  }

  static getState = (props) => {
    const size = Object.keys(props.src).length;
    const expanded =
      (props.collapsed === false ||
        (props.collapsed !== true && props.collapsed > props.depth)) &&
      (!props.shouldCollapse ||
        props.shouldCollapse({
          name: props.name,
          src: props.src,
          type: toType(props.src),
          namespace: props.namespace,
        }) === false) &&
      //initialize closed if object has no items
      size !== 0;
    const state = {
      expanded: AttributeStore.get(
        props.rjvId,
        props.namespace,
        'expanded',
        expanded,
      ),
      object_type: props.type === 'array' ? 'array' : 'object',
      parent_type: props.type === 'array' ? 'array' : 'object',
      size,
    };
    return state;
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { prevProps } = prevState;
    if (
      nextProps.src !== prevProps.src ||
      nextProps.collapsed !== prevProps.collapsed ||
      nextProps.name !== prevProps.name ||
      nextProps.namespace !== prevProps.namespace ||
      nextProps.rjvId !== prevProps.rjvId
    ) {
      const newState = RjvObject.getState(nextProps);
      return {
        ...newState,
        prevProps: nextProps,
      };
    }
    return null;
  }

  toggleCollapsed = () => {
    this.setState(
      {
        expanded: !this.state.expanded,
      },
      () => {
        AttributeStore.set(
          this.props.rjvId,
          this.props.namespace,
          'expanded',
          this.state.expanded,
        );
      },
    );
  };

  getObjectContent = (depth, src, props) => {
    return (
      <div class="pushed-content object-container">
        <div
          class="object-content"
          {...Theme(this.props.theme, 'pushed-content')}
        >
          {this.state.editMode
            ? this.getEditInput()
            : this.renderObjectContents(src, props)}
        </div>
      </div>
    );
  };

  getEllipsis = () => {
    const { size } = this.state;

    if (size === 0) {
      //don't render an ellipsis when an object has no items
      return null;
    } else {
      return (
        <div
          {...Theme(this.props.theme, 'ellipsis')}
          class="node-ellipsis"
          onClick={this.toggleCollapsed}
        >
          ...
        </div>
      );
    }
  };

  getObjectMetaData = (src) => {
    const { rjvId, theme } = this.props;
    const { size } = this.state;
    return (
      <VariableMeta
        size={size}
        isEdit={this.state.editMode}
        renderIcon={this.getEditIcon()}
        {...this.props}
      />
    );
  };

  getEditKeyIcon = () => {
    const { theme, name, namespace, src, rjvId, parent_type, editKeys } =
      this.props;
    if (!editKeys) {
      return false;
    }
    if (parent_type === 'array') {
      return false;
    }
    return (
      <div
        className="click-to-edit"
        style={{ verticalAlign: 'top' }}
        title={'Edit Key'}
      >
        <Edit
          class="click-to-edit-icon"
          {...Theme(theme, 'editVarIcon')}
          onClick={(e) => {
            e.stopPropagation();
            dispatcher.dispatch({
              name: 'UPDATE_VARIABLE_KEY_REQUEST',
              rjvId: rjvId,
              data: {
                name,
                namespace: [...namespace].splice(0, namespace.length - 1),
                existing_value: src,
                _removed: false,
                key_name: name,
              },
            });
          }}
        />
      </div>
    );
  };

  getBraceStart(object_type, expanded) {
    const { src, theme, iconStyle, parent_type } = this.props;

    if (parent_type === 'array_group') {
      return (
        <span>
          <span {...Theme(theme, 'brace')}>
            {object_type === 'array' ? '[' : '{'}
          </span>
          {expanded ? this.getObjectMetaData(src) : null}
        </span>
      );
    }

    const IconComponent = expanded ? ExpandedIcon : CollapsedIcon;

    return (
      <span>
        <span
          onClick={(e) => {
            this.toggleCollapsed();
          }}
          {...Theme(theme, 'brace-row')}
        >
          {this.getEditKeyIcon()}
          <div className="icon-container" {...Theme(theme, 'icon-container')}>
            <IconComponent {...{ theme, iconStyle }} />
          </div>
          <ObjectName {...this.props} />
          <span {...Theme(theme, 'brace')}>
            {object_type === 'array' ? '[' : '{'}
          </span>
        </span>
        {expanded ? this.getObjectMetaData(src) : null}
      </span>
    );
  }

  render() {
    // `indentWidth` and `collapsed` props will
    // perpetuate to children via `...rest`
    const {
      depth,
      src,
      namespace,
      name,
      type,
      parent_type,
      theme,
      jsvRoot,
      iconStyle,
      ...rest
    } = this.props;
    const { object_type, expanded } = this.state;

    let styles = {};
    if (!jsvRoot && parent_type !== 'array_group') {
      styles.paddingLeft = this.props.indentWidth * SINGLE_INDENT;
    } else if (parent_type === 'array_group') {
      styles.borderLeft = 0;
      styles.display = 'inline';
    }

    return (
      <div
        className="object-key-val"
        {...Theme(theme, jsvRoot ? 'jsv-root' : 'objectKeyVal', styles)}
      >
        {this.getBraceStart(object_type, expanded)}
        {expanded
          ? this.getObjectContent(depth, src, {
              theme,
              iconStyle,
              ...rest,
            })
          : this.getEllipsis()}
        <span className="brace-row">
          <span
            style={{
              ...Theme(theme, 'brace').style,
              paddingLeft: expanded ? '3px' : '0px',
            }}
          >
            {object_type === 'array' ? ']' : '}'}
          </span>
          {expanded ? null : this.getObjectMetaData(src)}
        </span>
      </div>
    );
  }

  renderObjectContents = (variables, props) => {
    const {
      depth,
      parent_type,
      index_offset,
      groupArraysAfterLength,
      namespace,
      src,
    } = this.props;
    const { object_type } = this.state;
    let theme = props.theme;
    let elements = [],
      variable;
    let keys = Object.keys(variables || {});
    if (this.props.sortKeys && object_type !== 'array') {
      keys = keys.sort();
    }
    if (object_type === 'array') {
      variables = variables.sort();
    }
    keys.forEach((name) => {
      variable = new JsonVariable(name, variables[name]);

      if (parent_type === 'array_group' && index_offset) {
        variable.name = parseInt(variable.name) + index_offset;
      }
      if (!variables.hasOwnProperty(name)) {
        return;
      } else if (variable.type === 'object') {
        elements.push(
          <JsonObject
            key={variable.name}
            depth={depth + DEPTH_INCREMENT}
            name={variable.name}
            src={variable.value}
            namespace={namespace.concat(variable.name)}
            parent_type={object_type}
            {...props}
          />,
        );
      } else if (variable.type === 'array') {
        let ObjectComponent = JsonObject;

        if (
          groupArraysAfterLength &&
          variable.value.length > groupArraysAfterLength
        ) {
          ObjectComponent = ArrayGroup;
        }

        elements.push(
          <ObjectComponent
            key={variable.name}
            depth={depth + DEPTH_INCREMENT}
            name={variable.name}
            src={variable.value}
            namespace={namespace.concat(variable.name)}
            type="array"
            parent_type={object_type}
            {...props}
          />,
        );
      } else {
        elements.push(
          <VariableEditor
            key={variable.name + '_' + namespace}
            variable={variable}
            singleIndent={SINGLE_INDENT}
            namespace={namespace}
            type={this.props.type}
            elements={elements.length}
            {...props}
          />,
        );
      }
    });
    return elements;
  };

  prepopInput = (src) => {
    const stringifiedValue = stringifyVariable(src);
    const detected = parseInput(stringifiedValue);
    this.setState({
      editMode: true,
      editValue: stringifiedValue,
      expanded: this.state.expanded
        ? this.state.expanded
        : !this.state.expanded,
      parsedInput: {
        type: detected.type,
        value: detected.value,
      },
    });
  };

  getEditInput = () => {
    const { theme } = this.props;
    const { editValue } = this.state;
    return (
      <div>
        <AutosizeTextarea
          type="text"
          inputRef={(input) => input && input.focus()}
          value={editValue}
          class="variable-editor"
          onChange={(event) => {
            const value = event.target.value;
            const detected = parseInput(value);
            this.setState({
              editValue: value,
              parsedInput: {
                type: detected.type,
                value: detected.value,
              },
            });
          }}
          onKeyDown={(e) => {
            switch (e.key) {
              case 'Escape': {
                this.setState({
                  editMode: false,
                  editValue: '',
                });
                break;
              }
              case 'Enter': {
                if (e.ctrlKey || e.metaKey) {
                  this.submitEdit(true);
                }
                break;
              }
            }
            e.stopPropagation();
          }}
          placeholder="update this value"
          {...Theme(theme, 'edit-input')}
        />
        <div {...Theme(theme, 'edit-icon-container')}>
          <Remove
            class="edit-cancel"
            {...Theme(theme, 'cancel-icon')}
            onClick={() => {
              this.setState({ editMode: false });
            }}
          />
          <CheckCircle
            class="edit-check string-value"
            {...Theme(theme, 'check-icon')}
            onClick={() => {
              this.submitEdit(true);
            }}
          />
          <div>{this.showDetected()}</div>
        </div>
      </div>
    );
  };

  showDetected = () => {
    const { theme, variable, namespace, rjvId } = this.props;
    const { type, value } = this.state.parsedInput;
    const detected = this.getDetectedInput();
    if (detected) {
      return (
        <div>
          <div {...Theme(theme, 'detected-row')}>
            {detected}
            <CheckCircle
              class="edit-check detected"
              style={{
                verticalAlign: 'top',
                paddingLeft: '3px',
                ...Theme(theme, 'check-icon').style,
              }}
              onClick={() => {
                this.submitEdit(true);
              }}
            />
          </div>
        </div>
      );
    }
  };

  getDetectedInput = () => {
    const { parsedInput } = this.state;
    const { type, value } = parsedInput;
    const { props } = this;
    const { theme } = props;

    if (type !== false) {
      switch (type.toLowerCase()) {
        case 'object':
          return (
            <span>
              <span
                style={{
                  ...Theme(theme, 'brace').style,
                  cursor: 'default',
                }}
              >
                {'{'}
              </span>
              <span
                style={{
                  ...Theme(theme, 'ellipsis').style,
                  cursor: 'default',
                }}
              >
                ...
              </span>
              <span
                style={{
                  ...Theme(theme, 'brace').style,
                  cursor: 'default',
                }}
              >
                {'}'}
              </span>
            </span>
          );
        case 'array':
          return (
            <span>
              <span
                style={{
                  ...Theme(theme, 'brace').style,
                  cursor: 'default',
                }}
              >
                {'['}
              </span>
              <span
                style={{
                  ...Theme(theme, 'ellipsis').style,
                  cursor: 'default',
                }}
              >
                ...
              </span>
              <span
                style={{
                  ...Theme(theme, 'brace').style,
                  cursor: 'default',
                }}
              >
                {']'}
              </span>
            </span>
          );
        case 'string':
          return <JsonString value={value} {...props} />;
        case 'integer':
          return <JsonInteger value={value} {...props} />;
        case 'float':
          return <JsonFloat value={value} {...props} />;
        case 'boolean':
          return <JsonBoolean value={value} {...props} />;
        case 'function':
          return <JsonFunction value={value} {...props} />;
        case 'null':
          return <JsonNull {...props} />;
        case 'nan':
          return <JsonNan {...props} />;
        case 'undefined':
          return <JsonUndefined {...props} />;
        case 'date':
          return <JsonDate value={new Date(value)} {...props} />;
      }
    }
  };

  submitEdit = (submit_detected) => {
    const { namespace, rjvId, name } = this.props;
    const { editValue, parsedInput } = this.state;
    let new_value = editValue;
    if (submit_detected && parsedInput.type) {
      new_value = parsedInput.value;
    }
    this.setState({
      editMode: false,
    });
    dispatcher.dispatch({
      name: 'VARIABLE_UPDATED',
      rjvId: rjvId,
      data: {
        name: name,
        namespace: namespace,
        existing_value: editValue,
        new_value: new_value,
        variable_removed: false,
        object_update: true,
      },
    });
  };

  getEditIcon = () => {
    const { src, theme } = this.props;
    return (
      <div
        class="click-to-edit"
        style={{ verticalAlign: 'top' }}
        title={'Edit Value'}
      >
        <Edit
          class="click-to-edit-icon"
          {...Theme(theme, 'editVarIcon')}
          onClick={() => {
            this.prepopInput(src);
          }}
        />
      </div>
    );
  };
}

//just store name, value and type with a variable
class JsonVariable {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.type = toType(value);
  }
}

polyfill(RjvObject);

//export component
export default RjvObject;
