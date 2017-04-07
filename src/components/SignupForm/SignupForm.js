import React, { Component } from 'react'
import { Col, ControlLabel, FormControl, FormGroup, Panel, Row } from 'react-bootstrap'
import Countries from 'data/constants/Countries'
import ReactTelInput from 'react-telephone-input'
import UserLanguages from 'data/constants/UserLanguages'
import { Typeahead } from 'react-bootstrap-typeahead'

// Styles
import styles from './SignupForm.styles'

export default class SignupForm extends Component {

  state = {
    formIsValid: false,
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

  handleAddressValueChange = (field, value) => {
    const newAddress = this.state.values.address
    newAddress[field] = value
    this.handleValueChange('address', newAddress)
  }

  handleValueChange = (field, value) => {
    const newValues = this.state.values
    newValues[field] = value
    this.setState({ values: newValues })
  }

  render() {

    const { values } = this.state
    const availableLanguages = Object.keys(UserLanguages).map(lang => {
      return (
        { value: lang, label: UserLanguages[lang].e }
      )
    })

    console.log(availableLanguages)

    console.log(this)

    return (
      <span>
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
              >
                <ControlLabel>Username*</ControlLabel>
                <FormControl
                  type='text'
                  value={values.username || ''}
                  placeholder='Username'
                  onChange={event => this.handleValueChange('username', event.target.value)}
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
        </Panel>
      </span>
    )
  }

}

SignupForm.propTypes = {}