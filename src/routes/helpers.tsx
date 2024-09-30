import React from "react"
import { RouteObject } from "react-router-dom"
import Loading from "../pages/loading"

type DynamicRouteProps = {
  pageComponent: any
  loadingComponent: any
}

function CreateDynamicRoute(props: DynamicRouteProps): RouteObject[] {
  const Routes: RouteObject[] = Object.keys(props.pageComponent).map(path => {
    const MainComponent = React.lazy(props.pageComponent[path])
    const loadingComponentPath = Object.keys(props.loadingComponent).filter(path => path.endsWith(path.replace("page.tsx", "loading.tsx")))
    const LoadingComponent = props.loadingComponent[loadingComponentPath.toString()]

    const RoutePath = path
                      .replace("../pages", "")
                      .replace("/page", "")
                      .replace(/\.(tsx|jsx)$/, "")
                      .replace(/\[([^\]]+)\]/g, ":$1")
    return {
      path: RoutePath,
      element: (
        <React.Suspense
          fallback={loadingComponentPath.length === 1 ? <LoadingComponent /> : <Loading />}
        >
          <MainComponent />
        </React.Suspense>
      )
    }
  })
  return Routes
}

export { CreateDynamicRoute }