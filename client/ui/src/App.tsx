import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import RootRoute from './routes/RootRoute';
import LoginRoute from './routes/LoginRoute';
import useViewport from './hooks/viewport';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginRoute />,
  }
]);

function App() {

  const { width, height } = useViewport();

  return (
    <div id="container" style={{ 
      width: `${width}px`, 
      height: `${height}px` 
    }}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
