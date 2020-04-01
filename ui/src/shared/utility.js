export const removeEmpty = obj => {
  Object.entries(obj).forEach(([key, val]) => {
    if (val && typeof val === 'object') removeEmpty(val)
    else if (val == null) delete obj[key]
  })
}

export const removeAttribute = (obj, name) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    return key === name ? acc : { ...acc, [key]: value }
  }, {})
}

export const currencyConverter = value => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  })
  return formatter.format(+value)
}

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value)
}

export const randomID = () => {
  return (
    '_' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  )
}

export const removeDomainInEmail = (email) => {
  return email ? email.split('@')[0] : email
}

export const downloadCSV = (csv, filename) => {
  const fakeLink = document.createElement('a')
  fakeLink.style.display = 'none'
  document.body.appendChild(fakeLink)
  const blob = new Blob(['\ufeff', csv], { encoding: 'UTF-8', type: 'text/csv;charset=UTF-8' })
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // Manage IE11+ & Edge
    window.navigator.msSaveOrOpenBlob(blob, `${filename}.csv`)
  } else {
    fakeLink.setAttribute('href', URL.createObjectURL(blob))
    fakeLink.setAttribute('download', `${filename}.csv`)
    fakeLink.click()
  }
}
