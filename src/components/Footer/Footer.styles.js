import { darkBlue, headerBluePurple } from 'styles/colors'

export default {
  compactGrid: {
    maxWidth: '100%',
  },
  topRow: {
    borderBottom: '1px solid rgba(250,250,250,.6)',
    textAlign: 'center',
    padding: '20px 0',
    '@media (max-width: 991px)': {
      display: 'none',
    },
  },
  topLink: {
    color: 'white',
    margin: 15,
  },
  bottomRow: {
    padding: 15,
    background: 'white',
    color: darkBlue,
  },
  relative: {
    position: 'relative',
  },
  select: {
    marginBottom: 10,
    backgroundColor: 'transparent',
    borderRadius: 0,
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    padding: 0,
    borderTop: 'none',
    borderRight: 'none',
    borderBottom: '1px solid white',
    borderLeft: 'none',
    color: 'white',
    width: 120,
  },
  caretDown: {
    pointerEvents: 'none',
    position: 'absolute',
    top: 10,
    left: 105,
  },
  footer: {
    marginTop: 20,
    color: 'white',
    backgroundColor: darkBlue,
  },
  mainContent: {
    padding: '100px 20px',
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '@media (max-width: 991px)': {
      display: 'block',
      maxWidth: 500,
      margin: '0 auto',
    },
  },
  flexContainerCompact: {
    display: 'block',
    maxWidth: 500,
    margin: '0 auto',
  },
  flexChild: {
    width: '25%',
    '@media (max-width: 991px)': {
      display: 'inline-block',
      verticalAlign: 'top',
      width: '50%',
      marginBottom: 30,
      padding: '0 5px',
    },
  },
  flexChildCompact: {
    display: 'inline-block',
    verticalAlign: 'middle',
    width: '50%',
    marginBottom: 30,
    padding: '0 5px',
  },
  helpMeIcon: {
    color: headerBluePurple,
    paddingLeft: 5,
    transform: 'translate(0px, 5px)',
  },
  footerLink: {
    color: 'white',
  },
  socialIcon: {
    color: headerBluePurple,
    margin: '0 10px',
    ':hover': {
      color: 'white',
    },
  },
  socialIcons: {
    textAlign: 'center',
    '@media (max-width: 991px)': {
      marginTop: 20,
      textAlign: 'left',
      width: '100%',
    },
  },
  socialIconsCompact: {
    marginTop: 20,
    textAlign: 'left',
    width: '50%',
  },
  helpMeBtn: {
    cursor: 'pointer',
  },
}
