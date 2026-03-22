export const ROUTES = Object.freeze({
    ROOT: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    ADMIN: '/admin',
})

export const AUTH_REDIRECT_DELAY_MS = 500

export function isAuthModalPath(pathname) {
    return pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER
}