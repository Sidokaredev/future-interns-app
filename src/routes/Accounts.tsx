/* Route */
import type { RouteObject } from 'react-router-dom';

const accountPages: any = import.meta.glob('../pages/accounts/**/page.tsx', { eager: true, import: 'default' });

const ACCOUNTS_ROUTE: RouteObject[] = Object.keys(accountPages).map(path => {
  const Component = accountPages[path];
  /* Route Path */
  const routePath = path
      .replace('../pages', '')
      .replace('/page', '')
      .replace(/\.(tsx|jsx)$/, '')
      .replace(/\[([^\]]+)\]/g, ':$1');
  return {
    path: routePath,
    element: <Component />
  }
});
console.info("Accounts routes \t:", ACCOUNTS_ROUTE);

export default ACCOUNTS_ROUTE;
