import { GetSession, SetSession } from '../pages/global-helpers'
import { LoaderFunction, redirect } from 'react-router-dom'
import RequestAPI from '../services/api/request'


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

    const [role, fail] = await RequestAPI.Send<string>(
      "/api/v1/accounts/user-role",
      {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + accessToken
        }
      }
    )

    if (fail) {
      return redirect("/") // just redirect user back to main page if the user account doens't have identity
    }

    switch (role) {
      case "candidate":
        const exceptCandidate = [
          "employers",
          "administrators",
          "universities",
        ]
        if (exceptCandidate.includes(requestPathname.split("/")[1])) {
          return redirect(requestPathname.replace(requestPathname.split("/")[1], "candidates"))
        }

        break;
      case "employer":
        const exceptEmployer = [
          "candidates",
          "administrators",
          "universities",
        ]
        if (exceptEmployer.includes(requestPathname.split("/")[1])) {
          return redirect(requestPathname.replace(requestPathname.split("/")[1], "employers"))
        }

        break;
      case "administrator":
        const exceptAdministrator = [
          "candidates",
          "employers",
          "universities",
        ];
        if (exceptAdministrator.includes(requestPathname.split("/")[1])) {
          return redirect(requestPathname.replace(requestPathname.split("/")[1], "administrators"))
        }

        break;

      default:
        break;
    }
  }
  SetSession('auth', accessToken)
  return null
}