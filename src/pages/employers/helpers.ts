export type BreadcrumbsProps = {
  label: string;
  pathname: string;
};

export default function BreadcrumbsCreator(
  params: Record<string, string>,
  currentPath: string
): BreadcrumbsProps[] {
  let pathname: string = "";

  if (Object.keys(params).length !== 0) {
    for (const key in params) {
      pathname = currentPath.replace("/" + params[key], "");
    }
  } else {
    pathname = currentPath;
  }

  return pathname
    .split("/")
    .slice(2)
    .map((path) => {
      return {
        label: path.charAt(0).toUpperCase() + path.slice(1),
        pathname:
          currentPath.substring(0, currentPath.lastIndexOf(path)) + path,
      };
    });
}
