export default function (coordinate, radius) {

  const r = radius / 111300
  const u = Math.random()
  const v = Math.random()
  const w = r * Math.sqrt(u)
  const t = 2 * Math.PI * v
  const offset = w * Math.sin(t)

  return coordinate + offset

}
