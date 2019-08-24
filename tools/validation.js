class Validation {
  constructor(value) {
    this.value = value
  }

  number(min, max) {
    return this.value >= min && this.value <= max
  }

  in(arr) {
    if (Array.isArray(arr)) {
      return arr.includes(this.value)
    }
  }
}

const Valid = function(val) {
  return new Validation(val)
}

module.exports = Valid
