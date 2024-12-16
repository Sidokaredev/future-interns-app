import React, { Suspense } from "react";
import { RouteObject } from "react-router-dom";
import BaseLoading from "../pages/loading";

const VacancyPage: any = import.meta.glob("../pages/vacancy/**/page.tsx");
const vacancyRoute: RouteObject[] = Object.keys(VacancyPage).map((path) => {
  const VacancyComponent = React.lazy(VacancyPage[path]);

  const VacancyRoutePath = path
    .replace("../pages", "") // for github pages only
    .replace("/page", "")
    .replace(/\.(tsx|jsx)$/, "")
    .replace(/\[([^\]]+)\]/g, ":$1");
  return {
    path: VacancyRoutePath,
    element: (
      <Suspense fallback={<BaseLoading />}>
        <VacancyComponent />
      </Suspense>
    ),
  };
});

export default vacancyRoute;
