import moment from 'moment'

export default function apiDate(date) {
  return moment(date).format('YYYY-MM-DD')
}
