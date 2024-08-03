import React, { Suspense } from "react";
import { RouteObject } from "react-router-dom";
import BaseLoading from "../pages/loading";

const VacancyPage: any = import.meta.glob("../pages/vacancy/**/page.tsx")
const VacancyRoute: RouteObject[] = Object.keys(VacancyPage).map(path => {
  const VacancyComponent = React.lazy(VacancyPage[path])

  const VacancyRoutePath = path
    .replace('../pages', '')
    .replace('/page', '')
    .replace(/\.(tsx|jsx)$/, '')
    .replace(/\[([^\]]+)\]/g, ':$1')

  return {
    path: VacancyRoutePath,
    element: (
      <Suspense fallback={<BaseLoading />}>
        <VacancyComponent />
      </Suspense>
    )
  }
})

console.info("Vacancy Route /t:", VacancyRoute)
export default VacancyRoute