import { roundTo } from 'utils/numbers'

export default function convertCurrency(rates, from, to, value) {

  // Convert price
  const toNewCurrency = value / rates[from]
  return (roundTo(toNewCurrency * rates[to], 2)).toFixed(2)

}
