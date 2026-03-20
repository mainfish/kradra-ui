export function validateLoginForm(fields) {
  const errors = {}

  const username = String(fields?.username || '').trim()
  const password = String(fields?.password || '')

  if (!username) errors.username = 'Username обязателен'
  if (!password) errors.password = 'Пароль обязателен'

  return errors
}
