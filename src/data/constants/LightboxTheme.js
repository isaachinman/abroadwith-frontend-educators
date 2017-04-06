import { sunsetOrange, saturatedPurple } from 'styles/colors'

export default {
	// container
  container: { background: 'rgba(255, 255, 255, 1)' },

	// arrows
  arrow: {
    backgroundColor: 'rgba(235, 235, 235, 0.8)',
    fill: '#222',
    opacity: 0.6,
    transition: 'opacity 200ms',
    ':hover': {
      opacity: 1,
    },
  },
  arrow__size__medium: {
    borderRadius: 40,
    height: 40,
    marginTop: -20,
    '@media (min-width: 768px)': {
      height: 70,
      padding: 15,
    },
  },
  arrow__direction__left: { marginLeft: 10 },
  arrow__direction__right: { marginRight: 10 },

	// header
  close: {
    fill: sunsetOrange,
    opacity: 0.6,
    transition: 'all 200ms',
    ':hover': {
      opacity: 1,
    },
  },

	// footer
  footer: {
    color: 'black',
  },
  footerCount: {
    color: 'rgba(0, 0, 0, 0.6)',
  },

	// thumbnails
  thumbnail: {
  },
  thumbnail__active: {
    boxShadow: `0 0 0 2px ${saturatedPurple}`,
  },
}
