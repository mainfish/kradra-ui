import { useMemo, useReducer, useState } from 'react'
import { fieldChanged, submitFailed, submitStarted, submitSucceeded } from './loginFormActions'
import { initialLoginFormState, loginFormReducer } from './loginFormReducer'
import { validateLoginForm } from './loginFormValidation'
import { loginAction } from '../actions/loginAction'

export function useLoginForm() {
  const [state, dispatch] = useReducer(loginFormReducer, initialLoginFormState)
  const [isTouched, setIsTouched] = useState(false)

  const errors = useMemo(() => validateLoginForm(state.fields), [state.fields])
  const hasErrors = Object.keys(errors).length > 0

  const onChange = (field) => (event) => {
    const value = field === 'remember' ? Boolean(event.target.checked) : event.target.value
    dispatch(fieldChanged(field, value))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setIsTouched(true)

    if (hasErrors) {
      dispatch(submitFailed('Проверьте форму и попробуйте снова.'))
      return
    }

    dispatch(submitStarted())

    try {
      const result = await loginAction({
        username: state.fields.username,
        password: state.fields.password,
      })

      dispatch(result.ok ? submitSucceeded(result.message) : submitFailed(result.message))
    } catch {
      dispatch(submitFailed('Network error. Please try again.'))
    }
  }

  return {
    state,
    errors,
    isTouched,
    onChange,
    onSubmit,
  }
}
