import React, { Suspense } from 'react'
/* Route */
import { createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from "react-router-dom"

/* Grouped Route */
import ACCOUNTS_ROUTE from "./Accounts"
import VacancyRoute from './Vacancy'
import BaseLoading from '../pages/loading'

/* Get Preserved Components Soon */

// const Homepage: any = import.meta.glob("../pages/page.tsx", { eager: true, import: "default" })
const Homepage: any = import.meta.glob("../pages/page.tsx")
const HomeRoute: RouteObject = Object.keys(Homepage).reduce((prev, key) => {
  // const HomeComponent = Homepage[key];
  const HomeComponent = React.lazy(Homepage[key])
  return {
    ...prev,
    id: "homepage",
    path: "/",
    // loader: async () => {
    //   const data = await fetch('https://jsonplaceholder.typicode.com/users', {
    //     method: 'GET',
    //     headers: {
    //       "Content-Type": "application/json"
    //     }
    //   });
    //   return data;
    // },
    element: (
      <Suspense fallback={<BaseLoading />}>
        <HomeComponent />
      </Suspense>
    )
  }
}, {})

const _APPROUTERS = createBrowserRouter([
  HomeRoute,
  ...ACCOUNTS_ROUTE,
  ...VacancyRoute
])

export default _APPROUTERS;