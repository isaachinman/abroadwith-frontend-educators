import { applyAbroadwithFee, applyNumericalDiscount } from 'utils/prices'
import { convertCurrency } from 'utils/currencies'
import moment from 'moment'
import { roundTo } from 'utils/numbers'

export default function generateImmersionPricesForRoom(homestaySearch, homestay, activeRoom, activeRoomObj, uiCurrency, currencyRates) {

  // Determine weekly rates
  let stayRate = null
  let tandemRate = null
  let teacherRate = null

  // Determine length discounts
  let lengthDiscountApplicable = null

  if (homestay.data && homestaySearch.params.arrival && homestaySearch.params.departure) {
    const duration = moment(homestaySearch.params.departure).diff(moment(homestaySearch.params.arrival), 'days')
    if (duration >= 180) {
      const sixMonthDiscount = homestay.data.pricing.discounts.filter(discount => discount.name === 'sixMonthDiscount')
      if (sixMonthDiscount.length === 1) {
        lengthDiscountApplicable = sixMonthDiscount[0].amount
      }
    } else if (duration >= 90) {
      const threeMonthDiscount = homestay.data.pricing.discounts.filter(discount => discount.name === 'threeMonthDiscount')
      if (threeMonthDiscount.length === 1) {
        lengthDiscountApplicable = threeMonthDiscount[0].amount
      }
    } else if (duration >= 30) {
      const oneMonthDiscount = homestay.data.pricing.discounts.filter(discount => discount.name === 'oneMonthDiscount')
      if (oneMonthDiscount.length === 1) {
        lengthDiscountApplicable = oneMonthDiscount[0].amount
      }
    }
  }

  // Generating immersion prices is a bit tedious
  if (homestay.data) {

    if (homestay.data.immersions.stay && homestay.data.immersions.stay.isActive) {

      // Stay rate is just base price
      stayRate = activeRoomObj.price

      // Apply any applicable length discount
      if (lengthDiscountApplicable) stayRate = applyNumericalDiscount(stayRate, lengthDiscountApplicable)

      // Apply Abroadwith fee
      stayRate = applyAbroadwithFee(stayRate)

    }

    if (homestay.data.immersions.tandem && homestay.data.immersions.tandem.isActive) {

      // Tandem rate is the base price minus tandem discount
      tandemRate = roundTo(activeRoomObj.price * ((100 - homestay.data.immersions.tandem.languagesInterested[0].discount) / 100), 2)

      // Apply any applicable length discount
      if (lengthDiscountApplicable) tandemRate = applyNumericalDiscount(tandemRate, lengthDiscountApplicable)

      // Apply Abroadwith fee
      tandemRate = applyAbroadwithFee(tandemRate)

    }

    if (homestay.data.immersions.teacher && homestay.data.immersions.teacher.isActive) {

      // Teacher rate is base price plus the first teacher package
      teacherRate = roundTo((activeRoomObj.price + (homestay.data.immersions.teacher.hourly * homestay.data.immersions.teacher.packages[0])), 2)

      // Apply any applicable length discount
      if (lengthDiscountApplicable) teacherRate = applyNumericalDiscount(teacherRate, lengthDiscountApplicable)

      // Apply Abroadwith fee
      teacherRate = applyAbroadwithFee(teacherRate)

    }

    // Convert prices if necessary
    if (homestay.data.pricing.currency !== uiCurrency) {
      if (stayRate) stayRate = convertCurrency(currencyRates, homestay.data.pricing.currency, uiCurrency, stayRate)
      if (tandemRate) tandemRate = convertCurrency(currencyRates, homestay.data.pricing.currency, uiCurrency, tandemRate)
      if (teacherRate) teacherRate = convertCurrency(currencyRates, homestay.data.pricing.currency, uiCurrency, teacherRate)
    }

    // Round up
    if (stayRate) stayRate = Math.ceil(stayRate)
    if (tandemRate) tandemRate = Math.ceil(tandemRate)
    if (teacherRate) teacherRate = Math.ceil(teacherRate)

  }

  return {
    stayRate,
    tandemRate,
    teacherRate,
  }

}
