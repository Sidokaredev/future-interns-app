/* Route */
import React, { Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import BaseLoading from '../pages/loading';

// const accountPages: any = import.meta.glob('../pages/accounts/**/page.tsx', { eager: true, import: 'default' })
const accountPages: any = import.meta.glob('../pages/accounts/**/page.tsx')

const ACCOUNTS_ROUTE: RouteObject[] = Object.keys(accountPages).map(path => {
  const AccountsComponent = React.lazy(accountPages[path]);
  /* Route Path */
  const AccountsRoutePath = path
      .replace('../pages', '')
      .replace('/page', '')
      .replace(/\.(tsx|jsx)$/, '')
      .replace(/\[([^\]]+)\]/g, ':$1');
  return {
    path: AccountsRoutePath,
    element: (
      <Suspense fallback={<BaseLoading />}>
        <AccountsComponent />
      </Suspense>
    )
  }
});
console.info("Accounts routes \t:", ACCOUNTS_ROUTE);

export default ACCOUNTS_ROUTE;
