import moment from 'moment'
import validator from 'validator'

export default (birthday) => {
  return validator.isDate(birthday) && moment().diff(birthday, 'years') > 18
}
