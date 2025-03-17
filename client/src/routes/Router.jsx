import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import PrivateRoute from "./PrivateRoute";
import Homepage from "../pages/homepage/Homepage";
import Posts from "../components/posts/Posts";
import Single from "../pages/single/Single";
import Write from "../pages/write/Write";
import Settings from "../pages/settings/Settings";
import TopBar from "../components/topbar/TopBar";


const Router = () => {
    return (
      <BrowserRouter>
      <TopBar/>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" Component={Homepage} />
            <Route path="/posts" Component={Posts} />
            <Route path="/write" Component={Write} />
            <Route path="/settings" Component={Settings} />
            <Route path="/post/:id" Component={Single} />
          </Route>
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
        </Routes>
      </BrowserRouter>
    );
  };
  
  export default Router;