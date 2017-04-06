// Absolute imports
import React, { Component, PropTypes } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'

import { connect } from 'react-redux'
import { closeVerifyEmailSentModal } from 'redux/modules/ui/modals'

@connect(state => ({
  user: state.privateData.user,
  verifyEmailSentModal: state.ui.modals.verifyEmailSentModal,
}))

export default class VerifyEmailSentModal extends Component {

  render() {

    console.log(this)
    const { dispatch, verifyEmailSentModal } = this.props

    return (
      <Modal show={verifyEmailSentModal.open} bsSize='small'>
        <Modal.Header>
          <Modal.Title>Verification email sent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={12}>
              <p>Please check your email for more details.</p>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => dispatch(closeVerifyEmailSentModal())} block>Hide alert</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

VerifyEmailSentModal.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.object,
  verifyEmailSentModal: PropTypes.object,
  verifications: PropTypes.object,

  token: PropTypes.string,
}
