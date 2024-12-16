import React from "react";
import { LoaderFunction, RouteObject } from "react-router-dom";
import Loading from "../pages/loading";

type DynamicRouteProps = {
  pageComponent: any;
  loadingComponent: any;
  loader?: LoaderFunction;
  preventLoaderList?: string[];
  privateLoader?: Record<string, LoaderFunction>;
};

function CreateDynamicRoute(props: DynamicRouteProps): RouteObject[] {
  const Routes: RouteObject[] = Object.keys(props.pageComponent).map((path) => {
    const MainComponent = React.lazy(props.pageComponent[path]);
    const loadingComponentPath = Object.keys(props.loadingComponent).filter(
      (path) => path.endsWith(path.replace("page.tsx", "loading.tsx"))
    );
    const LoadingComponent =
      props.loadingComponent[loadingComponentPath.toString()];

    const RoutePath = path
      .replace("../pages", "")
      .replace("/page", "")
      .replace(/\.(tsx|jsx)$/, "")
      .replace(/\[([^\]]+)\]/g, ":$1");
    return {
      path: RoutePath,
      element: (
        <React.Suspense
          fallback={
            loadingComponentPath.length === 1 ? (
              <LoadingComponent />
            ) : (
              <Loading />
            )
          }
        >
          <MainComponent />
        </React.Suspense>
      ),
      loader:
        props.privateLoader && RoutePath in props.privateLoader
          ? props.privateLoader[RoutePath] // when the privateLoader specified and route path match as a key in privateLoader. it means the matches route path key will the loader func value.
          : props.preventLoaderList &&
            props.loader &&
            !props.preventLoaderList.includes(RoutePath)
          ? props.loader // when loader specified and there are any matches route path within the preventLoaderList. it means loader applied to all routes except the listed route inside preventLoaderList.
          : !props.preventLoaderList && props.loader
          ? props.loader // when the loader specified and there are no prevetLoaderList specified. it means applying to all routes.
          : undefined,
    };
  });
  return Routes;
}

export { CreateDynamicRoute };
