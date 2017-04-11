import React, { Component, PropTypes } from 'react'
import { Button, Col, ControlLabel, FormControl, FormGroup, Panel, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import Countries from 'data/constants/Countries'
import { login } from 'redux/modules/auth'
import ReactTelInput from 'react-telephone-input'
import UserLanguages from 'data/constants/UserLanguages'
import { signup } from 'redux/modules/signup'
import { SpinLoader } from 'components'
import { push } from 'react-router-redux'
import { Typeahead } from 'react-bootstrap-typeahead'
import { validatePassword } from 'utils/validation'
import isEmail from 'validator/lib/isEmail'
import FormInput from './subcomponents/FormInput'

// Styles
import styles from './SignupForm.styles'

const fieldValidations = {
  userName: (value) => value.length > 3,
  password: (value) => validatePassword(value).valid,
  schoolName: (value) => value.length > 1,
  schoolEmail: (value) => isEmail(value),
  schoolPhoneNumber: (value) => value.length > 6,
  contactPersonFirstName: (value) => value.length > 2,
  contactPersonLastName: (value) => value.length > 2,
  contactPersonEmail: (value) => isEmail(value),
  contactPersonPhoneNumber: (value) => value.length > 6,
  offeredLanguages: (value) => value.length > 0,
  street: (value) => value.length > 4,
  city: (value) => value.length > 2,
  zipCode: (value) => value.length > 4,
  state: (value) => value.length > 3,
  country: (value) => value.length === 2,
}

@connect(state => ({
  auth: state.auth,
  signupStatus: state.signupStatus,
}))

export default class SignupForm extends Component {

  state = {
    formIsValid: false,
    formErrors: {},
    values: {
      userName: null,
      schoolName: null,
      schoolEmail: null,
      schoolPhoneNumber: null,
      password: null,
      contactPersonFirstName: null,
      contactPersonLastName: null,
      contactPersonEmail: null,
      contactPersonPhoneNumber: null,
      offeredLanguages: [],
      address: {
        street: null,
        complement: null,
        city: null,
        country: null,
        neighbourhood: null,
        zipCode: null,
        state: null,
        lat: null,
        lng: null,
      },
      websiteLink: null,
      type: 'SCHOOL',
    },
  }

  componentDidUpdate = prevProps => {

    // Signup success just happened
    if (!prevProps.signupStatus.loaded && this.props.signupStatus.loaded) {

      const { dispatch } = this.props

      const loginObject = {
        email: this.state.values.contactPersonEmail,
        password: this.state.values.password,
      }

      // Log them in
      dispatch(login(loginObject, dispatch(push('/'))))

    }

  }

  /**
  * Check if the passed field is valid or not, based on the rules stored in fieldValidations
  * Returns error, sucess or null
  * @param {String} field - Id of the field to be validated
  */
  getValidationState(field) {
    const { formErrors, values } = this.state
    const newValues = this.transformObject(values)

    if (!Object.keys(formErrors).length || newValues[field] === null || formErrors[field] === undefined) {
      return null
    }

    return formErrors.hasOwnProperty(field) && formErrors[field] === true ? 'error' : 'success'
  }

  /**
  * Check if the object has object children and returns a plain object
  * @param {Object} obj - Object to be transformed
  */
  transformObject(obj) {
    const objectKey = obj && Object.keys(obj)
      .find(item => this.isObject(obj[item]))

    return objectKey ? Object.assign({}, obj, obj[objectKey]) : obj
  }

  /**
  * Check if the passed value is an array
  * @param {Object} val
  */
  isObject(val) {
    return val === Object(val) && !Array.isArray(val) && val !== null
  }

  handleAddressValueChange = (field, value) => {
    const newAddress = this.state.values.address
    newAddress[field] = value
    this.handleValueChange('address', newAddress, { childValue: field })
  }

  handleValueChange = (field, value, params) => {
    const input = params && params.childValue ? params.childValue : field
    const newValues = this.state.values
    newValues[field] = value

    this.setState({
      values: newValues,
      formErrors: Object.assign(
        {},
        this.state.formErrors,
        this.handleInputValidation(input)
      ),
    })
  }

  handleInputValidation(field, values = this.state.values) {
    const newValues = this.transformObject(values)

    return fieldValidations.hasOwnProperty(field)
      && newValues[field] !== null
      && { [field]: !fieldValidations[field](newValues[field]) }
  }

  isFormValid() {
    const newValues = this.transformObject(this.state.values)
    const newValidations = Object.assign({}, fieldValidations)

    if (newValues.type === 'TUTOR') {
      delete newValidations.schoolEmail
      delete newValidations.schoolName
      delete newValidations.schoolPhoneNumber
    }

    return !Object.keys(newValidations)
      .some(field => !newValidations[field](newValues[field] || ''))
  }

  handleSignup = () => {
    const signupObject = Object.assign({}, this.state.values)

    // If educator is type TUTOR, clear any school fields
    if (signupObject.type === 'TUTOR') {
      signupObject.schoolEmail = ''
      signupObject.schoolName = ''
      signupObject.schoolPhoneNumber = ''

      this.setState({
        values: signupObject,
      })
    }

    // Flatten offeredLanguages
    signupObject.offeredLanguages = this.state.values.offeredLanguages.map(lang => lang.value)

    // Geolocate address
    const newLocation = signupObject.address

    let queryString = ''
    Object.keys(newLocation).map(field => {
      const value = newLocation[field]
      if (field !== 'country' && typeof value === 'string' && value.length > 0) {
        queryString += value.split(/[ ,]+/).join('+') + ','
      }
    })

    if (newLocation.country) {
      queryString += Countries[newLocation.country].split(/[ ,]+/).join('+') + ','
    }

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${queryString}&key=AIzaSyBQW0Z5fmFm8snLhXDOVuD8YuegwCMigqQ`)
      .then(res => {
        if (res.ok) {
          res.json().then(data => {
            if (data.status === 'OK' && data.results.length > 0) {
              signupObject.address.lat = data.results[0].geometry.location.lat
              signupObject.address.lng = data.results[0].geometry.location.lng
            }

            // Trigger signup
            this.props.dispatch(signup(signupObject))

          })
        }
      })
  }

  /**
  * Render a form input
  *
  * @param {Object[]} fields - List of fields to be rendered.
  * @param {object} fields[].props - Properties to be passed to the element
  * @param {string} fields[].props.id - Key to bind the field to the state
  * @param {string} fields[].props.label - Label to be shown in the element
  * @param {string} fields[].props.type - Input's type
  * @param {object} fields[].customInput - a custom input to be passed as children
  * @param {object} fields[].props - any property needed for the custom input rendering
  */
  renderFields(fields) {
    const { values } = this.state

    return fields.map((input, idx) =>
      <Col key={idx} xs={12} sm={6}>
        <FormInput
          value={values[input.props.id] && typeof values[input.props.id] === 'string' ? values[input.props.id] : ''}
          onChange={event => this.handleValueChange(input.props.id, event.target.value)}
          validationState={this.getValidationState(input.props.id)}
          {...input.props}
        >
          { input.customInput && <input.customInput.element {...input.customInput.props} /> }
        </FormInput>
      </Col>
    )
  }

  renderContactFields() {
    const { values } = this.state
    const availableLanguages = Object.keys(UserLanguages).map(lang => {
      return (
        { value: lang, label: UserLanguages[lang].e }
      )
    })

    const fields = [
      {
        props: {
          id: 'contactPersonFirstName',
          label: 'Contact Person First Name',
        },
      },
      {
        props: {
          id: 'contactPersonLastName',
          label: 'Contact Person Last Name',
        },
      },
      {
        props: {
          id: 'contactPersonEmail',
          label: 'Contact Person Email',
        },
      },
      {
        props: {
          id: 'contactPersonPhoneNumber',
          label: 'Contact Person Phone',
        },
        customInput: {
          element: ReactTelInput,
          props: {
            initialValue: values.contactPersonPhoneNumber,
            flagsImagePath: 'https://abroadwith.imgix.net/app/flags/flags.png',
            onChange: value => this.handleValueChange('contactPersonPhoneNumber', value),
          },
        },
      },
      {
        props: {
          id: 'offeredLanguages',
          label: 'Offered Languages',
          notRequired: true,
        },
        customInput: {
          element: Typeahead,
          props: {
            multiple: true,
            selected: values.offeredLanguages ? values.offeredLanguages : [],
            onChange: data => this.handleValueChange('offeredLanguages', data),
            options: availableLanguages,
          },
        },
      },
      {
        props: {
          id: 'websiteLink',
          label: 'Website Link',
          notRequired: true,
        },
      },
    ]

    return this.renderFields(fields)
  }

  renderBasicFields() {
    const fields = [
      {
        props: {
          id: 'userName',
          label: 'Username',
        },
      },
      {
        props: {
          id: 'password',
          type: 'password',
          label: 'Password',
        },
      },
    ]

    return this.renderFields(fields)
  }

  renderSchoolFields() {
    const { values } = this.state
    const fields = [
      {
        props: {
          id: 'schoolName',
          label: 'School Name',
        },
      },
      {
        props: {
          id: 'schoolEmail',
          type: 'email',
          label: 'School Email',
        },
      },
      {
        props: {
          id: 'schoolPhoneNumber',
          label: 'School Phone Number',
        },
        customInput: {
          element: ReactTelInput,
          props: {
            initialValue: values.schoolPhoneNumber || '',
            flagsImagePath: 'https://abroadwith.imgix.net/app/flags/flags.png',
            onChange: value => this.handleValueChange('schoolPhoneNumber', value),
          },
        },
      },
    ]

    return this.renderFields(fields)
  }

  render() {
    const { signupStatus } = this.props
    const { values } = this.state

    return (
      <SpinLoader show={signupStatus.loading}>
        <div>
          <Panel style={styles.signupSectionPanel}>
            <Row>
              <Col xs={12}>
                <h4>Basic Details</h4>
              </Col>
              <Col xs={12}>
                <FormGroup
                  controlId='type'
                >
                  <ControlLabel>Educator Type*</ControlLabel>
                  <FormControl
                    componentClass='select'
                    onChange={event => this.handleValueChange('type', event.target.value)}
                  >
                    <option value='SCHOOL'>School</option>
                    <option value='TUTOR'>Tutor</option>
                  </FormControl>
                </FormGroup>
              </Col>
              {this.renderBasicFields()}

              {values.type === 'SCHOOL' &&
                <span>
                  {this.renderSchoolFields()}
                </span>
              }
              {this.renderContactFields()}
            </Row>
          </Panel>

          <Panel style={styles.signupSectionPanel}>
            <Row>
              <Col xs={12}>
                <h4>Address</h4>
              </Col>
              <Col xs={12}>
                <FormGroup
                  controlId='street'
                  validationState={this.getValidationState('street')}
                >
                  <ControlLabel>Address Line 1*</ControlLabel>
                  <FormControl
                    type='text'
                    value={values.address.street || ''}
                    placeholder='Address Line 1'
                    onChange={event => this.handleAddressValueChange('street', event.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={12} sm={7}>
                <FormGroup
                  controlId='complement'
                >
                  <ControlLabel>Address Line 2</ControlLabel>
                  <FormControl
                    type='text'
                    value={values.address.complement || ''}
                    placeholder='Address Line 2'
                    onChange={event => this.handleAddressValueChange('complement', event.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={12} sm={5}>
                <FormGroup
                  controlId='city'
                  validationState={this.getValidationState('city')}
                >
                  <ControlLabel>City*</ControlLabel>
                  <FormControl
                    type='text'
                    value={values.address.city || ''}
                    placeholder='City'
                    onChange={event => this.handleAddressValueChange('city', event.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={12} sm={4}>
                <FormGroup
                  controlId='state'
                  validationState={this.getValidationState('state')}
                >
                  <ControlLabel>State*</ControlLabel>
                  <FormControl
                    type='text'
                    value={values.address.state || ''}
                    placeholder='State'
                    onChange={event => this.handleAddressValueChange('state', event.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={12} sm={4}>
                <FormGroup
                  controlId='zipCode'
                  validationState={this.getValidationState('zipCode')}
                >
                  <ControlLabel>Postal Code*</ControlLabel>
                  <FormControl
                    type='text'
                    value={values.address.zipCode || ''}
                    placeholder='Postal Code'
                    onChange={event => this.handleAddressValueChange('zipCode', event.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={12} sm={4}>
                <FormGroup
                  controlId='country'
                  validationState={this.getValidationState('country')}
                >
                  <ControlLabel>Country*</ControlLabel>
                  <Typeahead
                    selected={values.address.country ? [Countries[values.address.country]] : []}
                    onChange={data => this.handleAddressValueChange('country', data.length > 0 ? data[0].value : null)}
                    options={Object.keys(Countries).map(country => {
                      return (
                        { value: country, label: Countries[country] }
                      )
                    })}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Button bsStyle='primary' onClick={this.handleSignup} disabled={!this.isFormValid()}>Sign up</Button>
              </Col>
            </Row>
          </Panel>
        </div>
      </SpinLoader>
    )
  }

}

SignupForm.propTypes = {
  auth: PropTypes.object,
  dispatch: PropTypes.func,
  signupStatus: PropTypes.object,
}
