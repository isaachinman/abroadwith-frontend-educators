import moment from 'moment'

export default function uiDate(date) {
  return moment(date).format('DD-MM-YYYY')
}
