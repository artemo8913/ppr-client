import { pagesEnum, pagesPaths } from "pages";
import { RouteObject, RouterProvider, createBrowserRouter, Routes, Route } from "react-router-dom";

import { MainPage } from "pages/MainPage";

const routesConfig: Record<pagesEnum, RouteObject> = {
  [pagesEnum.MAIN]: {
    element: <MainPage />,
    path: pagesPaths.main,
  },
  [pagesEnum.ABOUT]: { element: <div>About</div>, path: pagesPaths.about },
  [pagesEnum.NOT_FOUND]: { element: <div>Not found</div>, path: pagesPaths.not_found },
};

const routesObjects = Object.values(routesConfig).map((el, id) => (
  <Route key={el.path + id} path={el.path} element={el.element} />
));

function AppRoutes() {
  return <Routes>{routesObjects}</Routes>;
}
export { AppRoutes };
