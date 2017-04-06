import Moment from 'moment'
import { extendMoment } from 'moment-range'
import { apiDate } from 'utils/dates'

const moment = extendMoment(Moment)

export default (newTimeslot, array) => {

  const newRange = moment.range(moment(newTimeslot.startDate).startOf('day'), moment(newTimeslot.endDate).endOf('day'))
  let overlapOccurred = false

  const flattenedCalendar = array.map(preExistingTimeslot => {

    const existingRange = moment.range(moment(preExistingTimeslot.startDate).startOf('day'), moment(preExistingTimeslot.endDate).endOf('day'))

    if (newRange.overlaps(existingRange)) {

      // If there is an overlap, return a merged timeslot
      overlapOccurred = true
      const mergedRange = existingRange.add(newRange)
      return {
        startDate: apiDate(mergedRange.start),
        endDate: apiDate(mergedRange.end),
      }

    } else if (newRange.adjacent(existingRange)) {
      overlapOccurred = true
      if (newRange.start.isBefore(existingRange.start)) {
        return {
          startDate: apiDate(newRange.start),
          endDate: apiDate(existingRange.end),
        }
      }
      return {
        startDate: apiDate(existingRange.start),
        endDate: apiDate(newRange.end),
      }
    }

    return preExistingTimeslot

  })

  if (!overlapOccurred) {
    flattenedCalendar.push(newTimeslot)
  }

  return flattenedCalendar

}
