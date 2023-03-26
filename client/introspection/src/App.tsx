import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import RootRoute from './routes/RootRoute';
import LoginRoute from './routes/LoginRoute';


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
  return <div id="container"><RouterProvider router={router} /></div>;
}

export default App;
