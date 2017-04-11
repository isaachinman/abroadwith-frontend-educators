// Absolute imports
import { Alert, Button, Col, Form, FormGroup, FormControl, InputGroup, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import { closeLoginModal } from 'redux/modules/ui/modals'
import { validateExists, validatePassword } from 'utils/validation'
import * as authActions from 'redux/modules/auth'
import FontAwesome from 'react-fontawesome'
import React, { Component, PropTypes } from 'react'

// Relative imports
import styles from './Login.styles'

@connect(state => ({
  jwt: state.auth.jwt,
  loginStatus: state.auth,
  loginModal: state.ui.modals.loginModal,
}))

export default class Login extends Component {

  state = {
    validatedFields: {
      email: {
        uiState: null,
      },
      password: {
        uiState: null,
      },
    },
  }

  closeModal = () => {

    const { dispatch, jwt, loginModal } = this.props

    if (jwt && jwt.rid && typeof loginModal.loggedInCallback === 'function') {
      loginModal.loggedInCallback()
    }

    dispatch(closeLoginModal())

  }

  handleEmailChange = (newValue) => {
    let newValidationObj = this.state.validatedFields // eslint-disable-line
    newValidationObj.email.value = newValue
    this.setState({ validatedFields: newValidationObj })
  }

  handlePasswordChange = (newValue) => {
    let newValidationObj = this.state.validatedFields // eslint-disable-line
    newValidationObj.password.value = newValue
    this.setState({ validatedFields: newValidationObj })
  }

  handleEmailLogin = (event) => {

    event.preventDefault()

    const { email, password } = this.state.validatedFields
    let formIsValid = true

    let modifiedValidation = this.state.validatedFields // eslint-disable-line

    Object.keys(modifiedValidation).map(field => {
      if (validateExists(modifiedValidation[field].value) === false) {
        modifiedValidation[field].uiState = 'error'
        formIsValid = false
      } else {
        modifiedValidation[field].uiState = null
      }
    })

    const passwordValidation = validatePassword(password.value)

    if (passwordValidation.valid === false) {
      modifiedValidation.password.message = passwordValidation.errors
      modifiedValidation.password.uiState = 'error'
      formIsValid = false
    } else {
      modifiedValidation.password.message = []
      modifiedValidation.password.uiState = null
    }

    this.setState({ validatedFields: modifiedValidation })

    if (formIsValid) {
      const { dispatch } = this.props
      dispatch(authActions.login(email.value, password.value, null, null, this.closeModal))
    } else {
      return false
    }

  }

  render() {

    const {
      compact,
      loginStatus,
    } = this.props

    const {
      email,
      password,
    } = this.state.validatedFields

    return (
      <div style={styles.loginPanel}>
        {loginStatus.error &&
          <Row>
            <Col sm={compact ? 12 : 4} smOffset={compact ? 0 : 4}>
              <Alert bsStyle='danger'>
                <h5>Login failed</h5>
              </Alert>
            </Col>
          </Row>
        }

        <Form horizontal onSubmit={this.handleEmailLogin}>

          <FormGroup controlId='formHorizontalEmail' validationState={email.uiState}>
            <Col xs={12} sm={compact ? 12 : 8} smOffset={compact ? 0 : 2}>
              <InputGroup>
                <InputGroup.Addon><FontAwesome name='at' /></InputGroup.Addon>
                <FormControl required type='email' placeholder='Email' onChange={event => this.handleEmailChange(event.target.value)} />
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup controlId='formHorizontalPassword' validationState={password.uiState}>
            <Col xs={12} sm={compact ? 12 : 8} smOffset={compact ? 0 : 2}>
              <InputGroup>
                <InputGroup.Addon><FontAwesome name='lock' /></InputGroup.Addon>
                <FormControl required type='password' placeholder='Password' onChange={event => this.handlePasswordChange(event.target.value)} />
              </InputGroup>
              <a style={{ fontSize: 12 }} className='pull-right' onClick={this.handleGoToResetPassword}>Forgot password?</a>
            </Col>
            {password.message && password.message.length > 0 &&
              <Col xs={12}>
                <Alert bsStyle='danger'>
                  {password.message}
                </Alert>
              </Col>
            }
          </FormGroup>

          <FormGroup>
            <Col sm={12}>
              <Button type='submit' bsStyle='primary' disabled={loginStatus.loggingIn} >
                {loginStatus.loggingIn ? <span>Loading</span> : <span>Log in</span>}
              </Button>
            </Col>
          </FormGroup>

        </Form>

        <Row>
          <Col xs={12} style={styles.signUp} className='text-muted'>
            Don't have an account? <a onClick={this.handleGoToSignup}>Sign up</a>
          </Col>
        </Row>
      </div>
    )
  }
}

Login.propTypes = {
  compact: PropTypes.bool,
  dispatch: PropTypes.func,
  jwt: PropTypes.object,
  login: PropTypes.func,
  loginStatus: PropTypes.object,
  loginModal: PropTypes.object,
}
