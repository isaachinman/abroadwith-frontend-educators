import { scale3d } from 'react-animations/lib/utils'

type CSSValue = string | number

type Keyframe = {
  [property: string]: CSSValue,
}

type Animation = {
  [keyframe: string]: Keyframe,
}

const pulse: Animation = {
  from: {
    transform: scale3d(1, 1, 1),
  },
  '50%': {
    transform: scale3d(0.95, 0.95, 0.95),
  },
  to: {
    transform: scale3d(1, 1, 1),
  },
}

export default pulse
