import React, { Component, PropTypes } from 'react'
import DateRangePickerCore from 'react-dates/lib/components/DateRangePicker'
import scrollIntoView from 'scroll-into-view'

import styles from './DateRangePicker.styles.js'

export default class DateRangePicker extends Component {

  state = {
    focusedInput: null,
    startDate: null,
    endDate: null,
  }

  onFocusChange= (focusedInput) => {
    this.setState({ focusedInput }, () => {

      // Scroll datepicker into view if necessary
      if (focusedInput) {
        const node = document.querySelectorAll('.DateRangePicker__picker')[0]

        if (this.props.scrollToPosition) {
          scrollIntoView(node, {
            time: 150,
          })
        }

      }

    })
  }

  render() {

    const {
      inlineBlock,
      isDayBlocked,
      large,
      endDatePlaceholderText,
      startDatePlaceholderText,
      startDate,
      onDatesChange,
      endDate,
    } = this.props

    const {
      focusedInput,
    } = this.state

    // --------------------------------------------------------------------------------
    // This is our standardised method of applying conditional styles
    // --------------------------------------------------------------------------------
    let combinedStyles = styles.base
    const styleVariations = {
      inlineBlock,
    }
    Object.keys(styleVariations).forEach(variation => {
      if (styleVariations[variation]) {
        combinedStyles = Object.assign({}, combinedStyles, styles[variation])
      }
    })

    return (
      <div style={combinedStyles} className={large ? 'daterangepicker-large' : ''}>
        <DateRangePickerCore
          {...this.props}
          displayFormat='DD-MM-YYYY'
          isDayBlocked={isDayBlocked}
          orientation={this.props.orientation}
          onDatesChange={onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
          startDatePlaceholderText={startDatePlaceholderText}
          endDatePlaceholderText={endDatePlaceholderText}
        />
      </div>
    )
  }
}

DateRangePicker.propTypes = {
  endDate: PropTypes.object,
  orientation: PropTypes.string,
  onDatesChange: PropTypes.func,
  startDate: PropTypes.object,
  startDatePlaceholderText: PropTypes.string,
  endDatePlaceholderText: PropTypes.string,
  inlineBlock: PropTypes.bool,
  isDayBlocked: PropTypes.func,
  large: PropTypes.bool,
  scrollToPosition: PropTypes.bool,
}
