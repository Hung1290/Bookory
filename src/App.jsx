import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./components/NotFound";
import './assets/styles/reset.scss'
import './assets/styles/global.scss'
import Login from "./pages/Login";
import Register from "./pages/Register";
import Book from "./pages/Book";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LayoutAdmin from "./components/Admin/Layout";
import { useSelector } from "react-redux";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";
import UserTable from "./pages/Admin/user/UserTable";
import BookTable from "./pages/Admin/book/BookTable";
import Order from "./pages/Order";
import OrderHistory from "./pages/OrderHistory";
import History from "./pages/Admin/order/History";
import { useState } from "react";

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const isLoading = useSelector(state => state.account.isAuthenticated)

  const Layout = () => {
    return (
      <div >
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div style={{ minHeight: '81vh', backgroundColor: '#efefef', padding: '20px 0' }}>
          <Outlet context={[searchTerm, setSearchTerm]} />
        </div>
        <Footer style={{ backgroundColor: '#f5f5f5' }} />
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "book/:slug",
          element: <Book />,
        },
        {
          path: "order",
          element:
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          ,
        },
        {
          path: "history",
          element:
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          ,
        }
      ]
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element:
            <ProtectedRoute>
              <UserTable />
            </ProtectedRoute>
        },
        {
          path: 'book',
          element:
            <ProtectedRoute>
              <BookTable />
            </ProtectedRoute>
        },
        {
          path: 'order',
          element:
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
        }
      ]
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <>
      {isLoading === true
        || location.pathname === '/login'
        || location.pathname === '/register'
        || location.pathname === '/'
        ?
        <RouterProvider router={router} />
        :
        <Loading />
      }
    </>
  )
}

export default App
