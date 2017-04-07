// Absolute imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { IndexLink } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Login, Logo } from 'components'
import { Modal, Navbar as BootstrapNavbar, Nav, NavItem } from 'react-bootstrap'
import { logout } from 'redux/modules/auth'
import FontAwesome from 'react-fontawesome'
import Radium from 'radium'
import { openLoginModal, closeLoginModal } from 'redux/modules/ui/modals'


// Relative imports
import styles from './Navbar.styles'

@connect(state => ({
  jwt: state.auth.jwt,
  token: state.auth.token,
  modals: state.ui.modals,
}))
@Radium
export default class Navbar extends Component {

  handleLogout = () => {
    this.props.dispatch(logout())
  }

  render() {

    const { jwt, modals } = this.props

    return (
      <span style={styles.navbarContainer}>
        <BootstrapNavbar
          collapseOnSelect
          fixedTop
          onToggle={navExpanded => this.setState({ navExpanded })}
        >
          <BootstrapNavbar.Header>
            <BootstrapNavbar.Brand>
              <div style={styles.brand}>
                <IndexLink to='/' tabIndex={-1}>
                  <Logo size={148} color='blue' />
                </IndexLink>
              </div>
            </BootstrapNavbar.Brand>
            <div style={styles.mobileToggle}>
              <BootstrapNavbar.Toggle>
                <FontAwesome size='2x' name={this.state.navExpanded ? 'caret-up' : 'bars'} />
              </BootstrapNavbar.Toggle>
            </div>
          </BootstrapNavbar.Header>

          <BootstrapNavbar.Collapse>

            {/* Desktop logged-out navbar */}
            {!jwt &&
              <span style={styles.desktopNavbar}>
                <Nav navbar pullRight>
                  <LinkContainer to='/signup'>
                    <NavItem>Sign up</NavItem>
                  </LinkContainer>
                  <NavItem onClick={() => this.props.dispatch(openLoginModal())}>Log in</NavItem>
                </Nav>
              </span>
            }

            {/* Desktop logged-in navbar */}
            {jwt &&
              <span style={styles.desktopNavbar}>
                <Nav navbar pullRight>
                  {/* Add logged-in UI here */}
                </Nav>
              </span>
            }

            {/* Mobile logged out navbar */}
            {!jwt &&
              <span style={styles.mobileNavbar}>
                <Nav>
                  <LinkContainer to='/signup'>
                    <NavItem>Sign up</NavItem>
                  </LinkContainer>
                  <NavItem onClick={() => this.props.dispatch(openLoginModal())}>Log in</NavItem>
                </Nav>
              </span>
            }

            {/* Mobile logged-in navbar */}
            {jwt &&
              <span style={styles.mobileNavbar}>
                <Nav>
                  {/* Add logged-in UI here */}
                </Nav>
              </span>
            }


          </BootstrapNavbar.Collapse>
        </BootstrapNavbar>

        <Modal
          bsSize='small'
          onHide={() => this.props.dispatch(closeLoginModal())}
          show={modals.loginModal.open}
        >
          <Login compact />
        </Modal>

      </span>
    )

  }

}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  jwt: PropTypes.object,
  token: PropTypes.string,
  logout: PropTypes.func,
  dispatch: PropTypes.func,
  modals: PropTypes.object,
  user: PropTypes.object,
}
