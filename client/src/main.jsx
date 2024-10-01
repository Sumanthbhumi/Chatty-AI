import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/homePage/HomePage";
import DashboardPage from "./routes/dashboardPage/DashboardPage";
import ChatPage from "./routes/chatPage/ChatPage";
import SignUpPage from "./routes/signUpPage/SignUpPage";
import SignInPage from "./routes/signInPage/SignInPage";
import RootLayout from "./layouts/rootLayout/RootLayout";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/sign-up/*",
        element: <SignUpPage />,
      },
      {
        path: "/sign-in/*",
        element: <SignInPage />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            children: [
              {
                path: "/dashboard",
                element: <DashboardPage />,
              },
              {
                path: "/dashboard/chats/:chatId",
                element: <ChatPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
