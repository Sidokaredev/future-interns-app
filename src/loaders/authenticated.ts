import { GetSession, SetSession } from '../pages/global-helpers'
import { LoaderFunction, redirect } from 'react-router-dom'
export const Authenticated: LoaderFunction = async ({ request }) => {
  const accessToken = GetSession('auth')
  const requestPathname = new URL(request.url).pathname.replace('/future-interns-app', '')
  if (!accessToken) {
    return redirect('/accounts/auth?redirect=' + requestPathname)
  } else {
    if (requestPathname == '/accounts/auth' || requestPathname == '/accounts/create') {
      history.back()
      return null
    }
    // check identity employer or candidate
  }

  SetSession('auth', accessToken)
  return null
}