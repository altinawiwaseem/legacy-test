import { Route, Routes } from "react-router-dom";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import GetDataSteps from "./components/GetDataSteps/GetDataSteps";
import Home from "./components/Home/Home";
import ProtectedRoutes from "./components/ProtectedRoute/ProtectedRoutes";
import TestSession from "./components/TestSession/TestSession";
import { useContext } from "react";
import { TestContext } from "./components/Context/TestContext";
import { UserContext } from "./components/Context/UserContext";
import FetchSessionData from "./components/FetchSessionData/FetchSessionData";

function App() {
  const { stepsData } = useContext(TestContext);
  const { user } = useContext(UserContext);
  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route element={<Home />} path="/" exact />
          <Route
            element={<TestSession data={stepsData} user={user} />}
            path="/testsession"
            exact
          />
          <Route element={<FetchSessionData />} path="/search" exact />
        </Route>
      </Routes>

      {/* <GetDataSteps /> */}
    </div>
  );
}

export default App;
