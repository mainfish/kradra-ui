export function fieldChanged(field, value) {
  return {
    type: 'fieldChanged',
    field,
    value,
  }
}

export function submitStarted() {
  return {
    type: 'submitStarted',
  }
}

export function submitSucceeded(message) {
  return {
    type: 'submitSucceeded',
    message,
  }
}

export function submitFailed(message) {
  return {
    type: 'submitFailed',
    message,
  }
}
