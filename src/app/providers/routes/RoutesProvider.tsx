import { pagesEnum, pagesPaths } from "pages";
import { RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";

const routesConfig: Record<pagesEnum, RouteObject> = {
  [pagesEnum.MAIN]: { element: <div>Main</div>, path: pagesPaths.main },
  [pagesEnum.ABOUT]: { element: <div>About</div>, path: pagesPaths.about },
  [pagesEnum.NOT_FOUND]: { element: <div>Not found</div>, path: pagesPaths.not_found },
};

const routesObjects = Object.values(routesConfig);

function AppRoutes() {
  return <RouterProvider router={createBrowserRouter(routesObjects)} />;
}
export { AppRoutes };
