import React, { Component, PropTypes } from 'react'
import { ControlLabel, FormControl, FormGroup } from 'react-bootstrap'

export default class FormInput extends Component {
  render() {
    const {
      id,
      type = 'text',
      label,
      value = '',
      onChange,
      validationState,
      notRequired,
    } = this.props

    return (
      <FormGroup
        controlId={id}
        validationState={validationState}
      >
        <ControlLabel>{label}{!notRequired && <span>*</span>}</ControlLabel>
        {!this.props.children ?
          <FormControl
            type={type}
            value={value}
            placeholder={label}
            onChange={onChange}
          /> :
          { ...this.props.children }}
      </FormGroup>
    )
  }
}

FormInput.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string || PropTypes.array,
  onChange: PropTypes.func,
  validationState: PropTypes.string,
  customInput: PropTypes.object,
  children: PropTypes.element,
  notRequired: PropTypes.bool,
}
