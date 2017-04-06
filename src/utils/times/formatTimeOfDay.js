export default function formatTimeOfDay(time) {
  return ((time).slice(0, -3)).replace(/^0+/, '')
}
