import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Start from './Start.jsx'
import './index.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
      path: "/",
      element: <Start />,
  },
  {
      path: "/app/",
      element: <App />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
