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

// Styles
import styles from './SignupForm.styles'

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

  getValidationState(field) {
    if (!Object.keys(this.state.formErrors).length) {
      return null
    }

    return this.state.formErrors[field] ? 'error' : 'success'
  }

  handleAddressValueChange = (field, value) => {
    const newAddress = this.state.values.address
    newAddress[field] = value
    this.handleValueChange('address', newAddress)
  }

  handleValueChange = (field, value) => {
    const newValues = this.state.values
    newValues[field] = value

    this.setState({
      values: newValues,
      formErrors: Object.assign({}, this.state.formErrors, this.handleInputValidation(field)),
    })
  }

  handleInputValidation(field) {
    const stateValue = this.state.values[field]
    const fieldValidations = {
      userName: ((value) => {
        return value !== null && value.length <= 3
      })(stateValue),
    }

    return fieldValidations[field] && { [field]: fieldValidations[field] }
  }

  handleSignup = () => {

    const signupObject = Object.assign({}, this.state.values)

    // Validate and process signup data here

    // If educator is type TUTOR, clear any school fields

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

  render() {

    const { signupStatus } = this.props

    const { values } = this.state
    const availableLanguages = Object.keys(UserLanguages).map(lang => {
      return (
        { value: lang, label: UserLanguages[lang].e }
      )
    })

    console.log(this.state.formErrors)

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

              <Col xs={12} sm={6}>
                <FormGroup
                  controlId='username'
                  validationState={this.getValidationState('userName')}
                >
                  <ControlLabel>Username*</ControlLabel>
                  <FormControl
                    type='text'
                    value={values.userName || ''}
                    placeholder='Username'
                    onChange={event => this.handleValueChange('userName', event.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={12} sm={6}>
                <FormGroup
                  controlId='password'
                >
                  <ControlLabel>Password*</ControlLabel>
                  <FormControl
                    type='text'
                    value={values.password || ''}
                    placeholder='Password'
                    onChange={event => this.handleValueChange('password', event.target.value)}
                  />
                </FormGroup>
              </Col>
              {values.type === 'SCHOOL' &&
              <span>
                <Col xs={12}>
                  <FormGroup
                    controlId='schoolName'
                  >
                    <ControlLabel>School Name*</ControlLabel>
                    <FormControl
                      type='text'
                      value={values.schoolName || ''}
                      placeholder='School Name'
                      onChange={event => this.handleValueChange('schoolName', event.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6}>
                  <FormGroup
                    controlId='schoolEmail'
                  >
                    <ControlLabel>School Email*</ControlLabel>
                    <FormControl
                      type='email'
                      value={values.schoolEmail || ''}
                      placeholder='School Email'
                      onChange={event => this.handleValueChange('schoolEmail', event.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col xs={12} sm={6}>
                  <FormGroup
                    controlId='schoolPhoneNumber'
                  >
                    <ControlLabel>School Phone*</ControlLabel>
                    <ReactTelInput
                      initialValue={values.schoolPhoneNumber || ''}
                      onChange={value => this.handleValueChange('schoolPhoneNumber', value)}
                      flagsImagePath='https://abroadwith.imgix.net/app/flags/flags.png'
                    />
                  </FormGroup>
                </Col>
              </span>
            }
              <Col xs={12} sm={6}>
                <FormGroup
                  controlId='contactPersonFirstName'
                >
                  <ControlLabel>Contact Person First Name*</ControlLabel>
                  <FormControl
                    type='text'
                    value={values.contactPersonFirstName || ''}
                    placeholder='Contact Person First Name'
                    onChange={event => this.handleValueChange('contactPersonFirstName', event.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={12} sm={6}>
                <FormGroup
                  controlId='contactPersonLastName'
                >
                  <ControlLabel>Contact Person Last Name*</ControlLabel>
                  <FormControl
                    type='text'
                    value={values.contactPersonLastName || ''}
                    placeholder='Contact Person Last Name'
                    onChange={event => this.handleValueChange('contactPersonLastName', event.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={12} sm={6}>
                <FormGroup
                  controlId='contactPersonEmail'
                >
                  <ControlLabel>Contact Person Email*</ControlLabel>
                  <FormControl
                    type='email'
                    value={values.contactPersonEmail || ''}
                    placeholder='Contact Person Email'
                    onChange={event => this.handleValueChange('contactPersonEmail', event.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col xs={12} sm={6}>
                <FormGroup
                  controlId='contactPersonPhoneNumber'
                >
                  <ControlLabel>Contact Person Phone*</ControlLabel>
                  <ReactTelInput
                    initialValue={values.contactPersonPhoneNumber || ''}
                    onChange={value => this.handleValueChange('contactPersonPhoneNumber', value)}
                    flagsImagePath='https://abroadwith.imgix.net/app/flags/flags.png'
                  />
                </FormGroup>
              </Col>
              <Col xs={12} sm={6}>
                <FormGroup
                  controlId='offeredLanguages'
                >
                  <ControlLabel>Offered Languages</ControlLabel>
                  <Typeahead
                    multiple
                    selected={values.offeredLanguages ? values.offeredLanguages : []}
                    onChange={data => this.handleValueChange('offeredLanguages', data)}
                    options={availableLanguages}
                  />
                </FormGroup>
              </Col>
              <Col xs={12} sm={6}>
                <FormGroup
                  controlId='websiteLink'
                >
                  <ControlLabel>Website Link</ControlLabel>
                  <FormControl
                    type='text'
                    value={values.websiteLink || ''}
                    placeholder='Website Link'
                    onChange={event => this.handleValueChange('websiteLink', event.target.value)}
                  />
                </FormGroup>
              </Col>
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
                >
                  <ControlLabel>City</ControlLabel>
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
                >
                  <ControlLabel>State</ControlLabel>
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
                >
                  <ControlLabel>Postal Code</ControlLabel>
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
                >
                  <ControlLabel>Country</ControlLabel>
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
                <Button bsStyle='primary' onClick={this.handleSignup}>Sign up</Button>
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
