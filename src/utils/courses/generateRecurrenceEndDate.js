import moment from 'moment'

const daysOfTheWeek = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
}

export default function generateRecurrenceEndDate(startDate, numberOfWeeks, timeslots) {

  const lastWeeklyTimeslot = timeslots.reduce((acc, slot) => {
    if (daysOfTheWeek[slot.dayOfWeek] > daysOfTheWeek[acc]) {
      return slot.dayOfWeek
    }
    return acc
  }, 'MONDAY')

  const endDate = moment(startDate).day(lastWeeklyTimeslot).add(numberOfWeeks, 'weeks')

  return endDate.format('YYYY-MM-DD')

}
