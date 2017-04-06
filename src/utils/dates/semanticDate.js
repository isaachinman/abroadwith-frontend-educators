import moment from 'moment'

// Probably don't need to pass translate in and can import directly from i18n, needs refactoring (confirm SSR compat)
export default function semanticDate(translate, date) {

  const year = moment(date).format('YYYY')
  const month = moment(date).format('M')
  const day = moment(date).format('D')

  return translate('common.semantic_date', { month: translate(`common.months.m${month}`), day, year })
}
