export const initialLoginFormState = {
  fields: {
    username: '',
    password: '',
    remember: false,
  },
  message: '',
  isSuccess: false,
  isLoading: false,
}

export function loginFormReducer(state, action) {
  switch (action.type) {
    case 'fieldChanged': {
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: action.value,
        },
      }
    }

    case 'submitStarted': {
      return {
        ...state,
        message: '',
        isSuccess: false,
        isLoading: true,
      }
    }

    case 'submitSucceeded': {
      return {
        ...state,
        message: action.message,
        isSuccess: true,
        isLoading: false,
      }
    }

    case 'submitFailed': {
      return {
        ...state,
        message: action.message,
        isSuccess: false,
        isLoading: false,
      }
    }

    default:
      return state
  }
}
