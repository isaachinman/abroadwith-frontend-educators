import config from 'config'
import { darkBlue, warmPurple } from 'styles/colors'

export default {
  button: {
    color: 'white',
    borderColor: warmPurple,
    background: warmPurple,
  },
  hero: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),url(${config.img}/app/hero/hero_v2_homepage_large.jpg)`,
    '@media (max-width: 1000px)': {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),url(${config.img}/app/hero/hero_v2_homepage_large.jpg?w=1000)`,
    },
    '@media (max-width: 600px)': {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),url(${config.img}/app/hero/hero_v2_homepage_large.jpg?w=600)`,
    },
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundColor: darkBlue,
    '@media (max-width: 515px)': {
      paddingTop: 40,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    color: 'white',
    height: '60vh',
    minHeight: 420,
    '@media (max-width: 350px)': {
      minHeight: 460,
    },
    marginBottom: 30,
  },
  heroTextContent: {
    maxWidth: 600,
    margin: '0 auto',
    textShadow: '1px 2px 2px rgba(0, 0, 0, .2)',
  },
  heroInputRow: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    width: '100%',
    textAlign: 'center',
  },
  immersionPanel: {
    maxWidth: 400,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  relative: {
    position: 'relative',
  },
  centerAlign: {
    textAlign: 'center',
  },
  paddedGrid: {
    padding: '100px 15px 40px 15px',
  },
  immersionDescription: {
    minHeight: 160,
  },
  immersionBtn: {
    color: 'white',
    border: 'none',
    padding: '3px 15px',
  },
  hostBtnRow: {
    color: 'white',
    textAlign: 'center',
    padding: '20px 0',
  },
  hostBtn: {
    color: 'white',
    border: 'none',
    padding: '3px 15px',
    margin: '5px 10px',
  },
}
