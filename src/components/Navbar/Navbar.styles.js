import { darkBlue } from 'styles/colors'

export default {
  brand: {
    '@media (max-width: 767px)': {
      marginLeft: 15,
    },
  },
  mobileToggle: {
    marginTop: 7,
    color: darkBlue,
  },
  mobileNavbar: {
    '@media (min-width: 767px)': {
      display: 'none',
    },
  },
  desktopNavbar: {
    '@media (max-width: 767px)': {
      display: 'none',
    },
  },
  unreadCountBadge: {
    position: 'absolute',
    top: 24,
    right: 0,
    fontSize: 8,
  },
}
