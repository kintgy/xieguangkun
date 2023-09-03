const base = {
  defaultDuration: (type = 'day', diff = 0, simple = false) => {
    let date = new Date()
    let dateStart = new Date()
    let dateEnd = new Date()
    dateStart.setMilliseconds(0)
    dateStart.setSeconds(0)
    dateStart.setMinutes(0)
    dateStart.setHours(0)
    dateEnd.setMilliseconds(0)
    dateEnd.setSeconds(0)
    dateEnd.setMinutes(0)
    dateEnd.setHours(0)
    if ('year' === type) {
      if (diff > 0) {
        dateStart.setFullYear(date.getFullYear() - diff)
        dateEnd.setFullYear(date.getFullYear() - diff + 1)
      } else {
        dateEnd.setFullYear(date.getFullYear() + 1)
      }
      dateStart.setMonth(0)
      dateStart.setDate(1)
      dateEnd.setMonth(0)
      dateEnd.setDate(1)
      dateEnd.setTime(dateEnd.getTime() - 1)
    } else if ('season' === type) {
      let season = Math.floor(date.getMonth() / 3)
      dateStart.setDate(1)
      dateStart.setMonth(((season - diff) * 3))
      dateEnd.setDate(1)
      dateEnd.setMonth((season + 1 - diff) * 3)
      dateEnd.setTime(dateEnd.getTime() - 1)
    } else if ('day' === type) {
      dateStart.setDate(date.getDate() - diff)
      if (!diff) {
        dateEnd.setDate(date.getDate() + 1)
        dateEnd.setTime(dateEnd.getTime() - 1)
      } else {
        dateEnd.setDate(date.getDate())
        dateEnd.setTime(dateEnd.getTime() - 1)
      }
    } else if ('month' === type) {
      dateStart.setDate(1)
      dateStart.setMonth(date.getMonth() - diff)
      if (date.getTime() - dateStart.getTime() <= 24 * 3600 * 1000) {
        dateStart.setMonth(dateStart.getMonth() - 1)
      }

      dateEnd.setMonth(date.getMonth() + 1 - diff)
      dateEnd.setDate(1)
      dateEnd.setTime(dateEnd.getTime() - 1)
    } else if ('week' === type) {
      dateStart.setDate(date.getDate() - date.getDay() + 1 - (7 * diff))
      dateEnd.setDate(date.getDate() + (7 - date.getDay()) + 1 - (7 * diff))
      dateEnd.setTime(dateEnd.getTime() - 1)
    }

    return [simple ? dateStart.getTime() / 1000 : dateStart.getTime(), simple ? dateEnd.getTime() / 1000 : dateEnd.getTime()]
  },
  setTotalData: (data, total) => {
    if (!Array.isArray(total)) {
      for (let key in total) {
        if (undefined !== data[key]) total[key].value = data[key]
      }
      return total
    }

    total.forEach((col, idx) => {
      if (!col.hasOwnProperty.call('value')) {
        for (let key in col) {
          if (undefined !== data[key]) total[idx][key].value = data[key]
        }
      } else {
        if (undefined !== data[col]) total[idx][col].value = data[col]
      }
    })
    return total
  },
}

export default base
