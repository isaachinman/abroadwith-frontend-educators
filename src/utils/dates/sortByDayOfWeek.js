import { formatTimeOfDay } from 'utils/times'

export default function sortByDayOfWeek(array) {

  // Set up reference object
  const weeklyObject = [
    { day: 'MONDAY', slots: [] },
    { day: 'TUESDAY', slots: [] },
    { day: 'WEDNESDAY', slots: [] },
    { day: 'THURSDAY', slots: [] },
    { day: 'FRIDAY', slots: [] },
    { day: 'SATURDAY', slots: [] },
    { day: 'SUNDAY', slots: [] },
  ]

  // Push the slots into their appropriate days
  array.map(t => {
    weeklyObject.filter(d => d.day === t.dayOfWeek)[0].slots.push({
      startTime: formatTimeOfDay(t.startTime),
      endTime: formatTimeOfDay(t.endTime),
    })
  })

  // Filter out days without any slots, and then sort slots by startTime
  return weeklyObject.filter(d => d.slots.length > 0).map(d => ({ day: d.day, slots: d.slots.sort((x, y) => new Date('1970/01/01 ' + x.startTime) - new Date('1970/01/01 ' + y.startTime)) }))

}
