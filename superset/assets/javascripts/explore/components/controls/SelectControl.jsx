import React from 'react';
import PropTypes from 'prop-types';
import Select, { Creatable } from 'react-select';
import ControlHeader from '../ControlHeader';

const propTypes = {
  choices: PropTypes.array,
  clearable: PropTypes.bool,
  description: PropTypes.string,
  freeForm: PropTypes.bool,
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  multi: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  showHeader: PropTypes.bool,
};

const defaultProps = {
  choices: [],
  clearable: true,
  description: null,
  freeForm: false,
  isLoading: false,
  label: null,
  multi: false,
  onChange: () => {},
  showHeader: true,
};

export default class SelectControl extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { options: this.getOptions(props) };
    this.onChange = this.onChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.choices !== this.props.choices) {
      const options = this.getOptions(nextProps);
      this.setState({ options });
    }
  }
  onChange(opt) {
    let optionValue = opt ? opt.value : null;
    // if multi, return options values as an array
    if (this.props.multi) {
      optionValue = opt ? opt.map(o => o.value) : null;
    }
    this.props.onChange(optionValue);
  }
  getOptions(props) {
    // Accepts different formats of input
    const options = props.choices.map((c) => {
      let option;
      if (Array.isArray(c)) {
        const label = c.length > 1 ? c[1] : c[0];
        option = {
          value: c[0],
          label,
        };
      } else if (Object.is(c)) {
        option = c;
      } else {
        option = {
          value: c,
          label: c,
        };
      }
      return option;
    });
    if (props.freeForm) {
      // For FreeFormSelect, insert value into options if not exist
      const values = options.map(c => c.value);
      if (props.value) {
        let valuesToAdd = props.value;
        if (!Array.isArray(valuesToAdd)) {
          valuesToAdd = [valuesToAdd];
        }
        valuesToAdd.forEach((v) => {
          if (values.indexOf(v) < 0) {
            options.push({ value: v, label: v });
          }
        });
      }
    }
    return options;
  }
  render() {
    //  Tab, comma or Enter will trigger a new option created for FreeFormSelect
    const selectProps = {
      multi: this.props.multi,
      name: `select-${this.props.name}`,
      placeholder: `Select (${this.state.options.length})`,
      options: this.state.options,
      value: this.props.value,
      autosize: false,
      clearable: this.props.clearable,
      isLoading: this.props.isLoading,
      onChange: this.onChange,
      optionRenderer: () => opt.label,
    };
    //  Tab, comma or Enter will trigger a new option created for FreeFormSelect
    const selectWrap = this.props.freeForm ?
      (<Creatable {...selectProps} />) : (<Select {...selectProps} />);
    return (
      <div>
        {this.props.showHeader &&
          <ControlHeader {...this.props} />
        }
        {selectWrap}
      </div>
    );
  }
}

SelectControl.propTypes = propTypes;
SelectControl.defaultProps = defaultProps;
