import { validateExists } from 'utils/validation'

export default (password, options) => {

  console.log(options)

  let validationMessages = [] // eslint-disable-line
  let validity = true

  if (validateExists(password)) {

    if (password.length < 8) {
      validationMessages.push('TOO_SHORT')
    }

    if (password.length > 100) {
      validationMessages.push('TOO_LONG')
    }

    // This is very poorly thought out validation which is "legacy"
    if (typeof options === 'object') {

      if (password.indexOf(options.firstName) > -1) {
        validationMessages.push('CONTAINS_FIRST_NAME')
      }

      if (password.indexOf(options.lastName) > -1) {
        validationMessages.push('CONTAINS_LAST_NAME')
      }

    }

    let twoOfThreeConditions = 0

    // Condition 1: uppercase letter
    if (password.match(/[A-Z]/)) {
      twoOfThreeConditions++
    }

    // Condition 2: lowercase letter
    if (!(password.match(/[a-z]/))) {
      twoOfThreeConditions++
    }

    // Condition 3: number
    if (/\d/.test(password)) {
      twoOfThreeConditions++
    }

    if (twoOfThreeConditions > 2) {
      validationMessages.push('MUST_HAVE_TWO_OF_THREE')
    }

  } else {
    validationMessages.push('NO_VALUE')
  }

  if (validationMessages.length > 0) {
    validity = false
  }

  return {
    valid: validity,
    errors: validationMessages,
  }

}
