/* global optionsStorage */

optionsStorage.syncForm('#options-form')

const optionsForm = document.querySelector('#options-form')
const fields = document.querySelectorAll('[data-default]')

document.addEventListener('click', (e) => {
  if (e.target.closest('#submit')) {
    e.preventDefault()
    const newSettings = {}
    fields.forEach((field) => {
      const { name, value, dataset } = field
      newSettings[name] = value
    })
    optionsStorage.set(newSettings)
  }

  // Reset fields based on data- attribute
  if (e.target.closest('#reset')) {
    e.preventDefault()
    fields.forEach((field) => {
      field.value = field.dataset.default
    })
  }
})
