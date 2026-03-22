export function isServerUnavailableStatus(status) {
    return status === 0 || status === 408 || status >= 500
}

/**
 * Login: do NOT leak details (avoid enumeration).
 * User requirement: 404/400/409 => "Incorrect login or password"
 */
export function mapLoginErrorMessage(status) {
    if (status === 400 || status === 404 || status === 409 || status === 401) {
        return 'Incorrect login or password.'
    }

    if (isServerUnavailableStatus(status)) {
        return 'Server is unavailable. Please try again.'
    }

    return 'Login failed. Please try again.'
}

/**
 * Register: UX-friendly (409 -> username exists), others generic.
 * Если хочешь максимальную безопасность — можно тоже сделать generic на 409.
 */
export function mapRegisterErrorMessage(status) {
    if (status === 409) {
        return 'Username already exists.'
    }

    if (status === 400) {
        return 'Invalid registration data.'
    }

    if (isServerUnavailableStatus(status)) {
        return 'Server is unavailable. Please try again.'
    }

    return 'Registration failed. Please try again.'
}