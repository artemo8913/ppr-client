import { pagesEnum, pagesPaths } from "pages";
import { RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";

const routesConfig: Record<pagesEnum, RouteObject> = {
  [pagesEnum.MAIN]: {
    element: (
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Non aliquam quae quisquam nulla delectus soluta laborum
        nemo exercitationem, animi temporibus id quibusdam dolorem libero, est aspernatur, explicabo modi ratione
        voluptatem! Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur est sapiente officia praesentium
        maxime quisquam magnam dolor! Deserunt impedit optio porro adipisci hic maiores corporis vitae odio harum,
        blanditiis consectetur? Lorem ipsum dolor sit amet consectetur adipisicing elit. Non aliquam quae quisquam nulla
        delectus soluta laborum nemo exercitationem, animi temporibus id quibusdam dolorem libero, est aspernatur,
        explicabo modi ratione voluptatem! Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur est
        sapiente officia praesentium maxime quisquam magnam dolor! Deserunt impedit optio porro adipisci hic maiores
        corporis vitae odio harum, blanditiis consectetur? Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
        aliquam quae quisquam nulla delectus soluta laborum nemo exercitationem, animi temporibus id quibusdam dolorem
        libero, est aspernatur, explicabo modi ratione voluptatem! Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Aspernatur est sapiente officia praesentium maxime quisquam magnam dolor! Deserunt impedit optio porro
        adipisci hic maiores corporis vitae odio harum, blanditiis consectetur? Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Non aliquam quae quisquam nulla delectus soluta laborum nemo exercitationem, animi temporibus
        id quibusdam dolorem libero, est aspernatur, explicabo modi ratione voluptatem! Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Aspernatur est sapiente officia praesentium maxime quisquam magnam dolor! Deserunt
        impedit optio porro adipisci hic maiores corporis vitae odio harum, blanditiis consectetur? adipisci hic maiores
        corporis vitae odio harum, blanditiis consectetur? Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
        aliquam quae quisquam nulla delectus soluta laborum nemo exercitationem, animi temporibus id quibusdam dolorem
        libero, est aspernatur, explicabo modi ratione voluptatem! Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Aspernatur est sapiente officia praesentium maxime quisquam magnam dolor! Deserunt impedit optio porro
        adipisci hic maiores corporis vitae odio harum, blanditiis consectetur? adipisci hic maiores corporis vitae odio
        harum, blanditiis consectetur? Lorem ipsum dolor sit amet consectetur adipisicing elit. Non aliquam quae
        quisquam nulla delectus soluta laborum nemo exercitationem, animi temporibus id quibusdam dolorem libero, est
        aspernatur, explicabo modi ratione voluptatem! Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Aspernatur est sapiente officia praesentium maxime quisquam magnam dolor! Deserunt impedit optio porro adipisci
        hic maiores corporis vitae odio harum, blanditiis consectetur?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Non aliquam quae quisquam nulla delectus soluta laborum
        nemo exercitationem, animi temporibus id quibusdam dolorem libero, est aspernatur, explicabo modi ratione
        voluptatem! Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur est sapiente officia praesentium
        maxime quisquam magnam dolor! Deserunt impedit optio porro adipisci hic maiores corporis vitae odio harum,
        blanditiis consectetur? Lorem ipsum dolor sit amet consectetur adipisicing elit. Non aliquam quae quisquam nulla
        delectus soluta laborum nemo exercitationem, animi temporibus id quibusdam dolorem libero, est aspernatur,
        explicabo modi ratione voluptatem! Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur est
        sapiente officia praesentium maxime quisquam magnam dolor! Deserunt impedit optio porro adipisci hic maiores
        corporis vitae odio harum, blanditiis consectetur? Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
        aliquam quae quisquam nulla delectus soluta laborum nemo exercitationem, animi temporibus id quibusdam dolorem
        libero, est aspernatur, explicabo modi ratione voluptatem! Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Aspernatur est sapiente officia praesentium maxime quisquam magnam dolor! Deserunt impedit optio porro
        adipisci hic maiores corporis vitae odio harum, blanditiis consectetur? Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Non aliquam quae quisquam nulla delectus soluta laborum nemo exercitationem, animi temporibus
        id quibusdam dolorem libero, est aspernatur, explicabo modi ratione voluptatem! Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Aspernatur est sapiente officia praesentium maxime quisquam magnam dolor! Deserunt
        impedit optio porro adipisci hic maiores corporis vitae odio harum, blanditiis consectetur? adipisci hic maiores
        corporis vitae odio harum, blanditiis consectetur? Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
        aliquam quae quisquam nulla delectus soluta laborum nemo exercitationem, animi temporibus id quibusdam dolorem
        libero, est aspernatur, explicabo modi ratione voluptatem! Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Aspernatur est sapiente officia praesentium maxime quisquam magnam dolor! Deserunt impedit optio porro
        adipisci hic maiores corporis vitae odio harum, blanditiis consectetur? adipisci hic maiores corporis vitae odio
        harum, blanditiis consectetur? Lorem ipsum dolor sit amet consectetur adipisicing elit. Non aliquam quae
        quisquam nulla delectus soluta laborum nemo exercitationem, animi temporibus id quibusdam dolorem libero, est
        aspernatur, explicabo modi ratione voluptatem! Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Aspernatur est sapiente officia praesentium maxime quisquam magnam dolor! Deserunt impedit optio porro adipisci
        hic maiores corporis vitae odio harum, blanditiis consectetur?
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Non aliquam quae quisquam nulla delectus soluta laborum
        nemo exercitationem, animi temporibus id quibusdam dolorem libero, est aspernatur, explicabo modi ratione
        voluptatem! Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur est sapiente officia praesentium
        maxime quisquam magnam dolor! Deserunt impedit optio porro adipisci hic maiores corporis vitae odio harum,
        blanditiis consectetur? Lorem ipsum dolor sit amet consectetur adipisicing elit. Non aliquam quae quisquam nulla
        delectus soluta laborum nemo exercitationem, animi temporibus id quibusdam dolorem libero, est aspernatur,
        explicabo modi ratione voluptatem! Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur est
        sapiente officia praesentium maxime quisquam magnam dolor! Deserunt impedit optio porro adipisci hic maiores
        corporis vitae odio harum, blanditiis consectetur? Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
        aliquam quae quisquam nulla delectus soluta laborum nemo exercitationem, animi temporibus id quibusdam dolorem
        libero, est aspernatur, explicabo modi ratione voluptatem! Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Aspernatur est sapiente officia praesentium maxime quisquam magnam dolor! Deserunt impedit optio porro
        adipisci hic maiores corporis vitae odio harum, blanditiis consectetur? Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Non aliquam quae quisquam nulla delectus soluta laborum nemo exercitationem, animi temporibus
        id quibusdam dolorem libero, est aspernatur, explicabo modi ratione voluptatem! Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Aspernatur est sapiente officia praesentium maxime quisquam magnam dolor! Deserunt
        impedit optio porro adipisci hic maiores corporis vitae odio harum, blanditiis consectetur? adipisci hic maiores
        corporis vitae odio harum, blanditiis consectetur? Lorem ipsum dolor sit amet consectetur adipisicing elit. Non
        aliquam quae quisquam nulla delectus soluta laborum nemo exercitationem, animi temporibus id quibusdam dolorem
        libero, est aspernatur, explicabo modi ratione voluptatem! Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Aspernatur est sapiente officia praesentium maxime quisquam magnam dolor! Deserunt impedit optio porro
        adipisci hic maiores corporis vitae odio harum, blanditiis consectetur? adipisci hic maiores corporis vitae odio
        harum, blanditiis consectetur? Lorem ipsum dolor sit amet consectetur adipisicing elit. Non aliquam quae
        quisquam nulla delectus soluta laborum nemo exercitationem, animi temporibus id quibusdam dolorem libero, est
        aspernatur, explicabo modi ratione voluptatem! Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Aspernatur est sapiente officia praesentium maxime quisquam magnam dolor! Deserunt impedit optio porro adipisci
        hic maiores corporis vitae odio harum, blanditiis consectetur?
      </div>
    ),
    path: pagesPaths.main,
  },
  [pagesEnum.ABOUT]: { element: <div>About</div>, path: pagesPaths.about },
  [pagesEnum.NOT_FOUND]: { element: <div>Not found</div>, path: pagesPaths.not_found },
};

const routesObjects = Object.values(routesConfig);

function AppRoutes() {
  return <RouterProvider router={createBrowserRouter(routesObjects)} />;
}
export { AppRoutes };
