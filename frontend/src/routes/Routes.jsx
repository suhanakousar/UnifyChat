import {
BrowserRouter,
Route,
Routes as RouteComponent,
} from "react-router-dom";

import React from "react";
import Home from "../pages/Home";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import ChatRoom from "../pages/Room";
import Profile from "../pages/Profile";
import Error from "../pages/Error";
import { AuthProvider } from "../context/authContext";
import Help from "../pages/Help";
import { RequireAuth } from "../auth/RequireAuth";

export const Routes = () => {
return (
        <BrowserRouter>
                <RouteComponent>
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/Signin" element={<Signin />} />
                <Route path="/Signup" element={<Signup />} />
                <Route element={<RequireAuth />}>
                        <Route path="/Chat" element={<ChatRoom />} />
                        <Route path="/Chat/:chatId" element={<ChatRoom />} />
                        <Route path="/Profile" element={<Profile />} />
                </Route>
                <Route path="/Help" element={<Help />} />
                <Route path="*" element={<Error />} />
                </RouteComponent>
        </BrowserRouter>
);
};
