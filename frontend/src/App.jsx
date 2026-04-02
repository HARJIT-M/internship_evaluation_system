import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import InternDashboard from "./pages/internside/interndashboard";
import TeamLeadDashboard from "./pages/teamleaderside/teamleaderdashboard";
import ProtectedRoute from "./utils/protectedroute";
import CreateProject from "./pages/teamleaderside/createproject";
import EvaluateProject from "./pages/teamleaderside/evaluateproject";
import EvaluateProjectInterns from "./pages/teamleaderside/evaluateprojectintern";
import EvaluateIntern from "./pages/teamleaderside/evaluateintern";
import InternRanking from "./pages/teamleaderside/internranking";
import AddTask from "./pages/teamleaderside/addtask";
import ViewTasks from "./pages/teamleaderside/viewtasks";
import TaskStatus from "./pages/internside/taskstatus";
import ViewEvaluation from "./pages/internside/viewevaluation";
import ViewProjects from "./pages/teamleaderside/viewproject";
import AdminDashboard from "./pages/adminside/admindashboard";

function App() {
  return (
    <HashRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* INTERN */}
        <Route
          path="/intern"
          element={
            <ProtectedRoute role="intern">
              <InternDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* INTERN TASK STATUS */}
        <Route
          path="/taskstatus"
          element={
            <ProtectedRoute role="intern">
              <TaskStatus />
            </ProtectedRoute>
          }
        />

        {/* INTERN EVALUATION STATUS */}
        <Route
          path="/viewevaluation"
          element={
            <ProtectedRoute role="intern">
              <ViewEvaluation />
            </ProtectedRoute>
          }
        />


        {/* VIEW PROJECTS */}
        <Route
          path="/viewproject"
          element={
            <ProtectedRoute role="teamlead">
              <ViewProjects />
            </ProtectedRoute>
          }
        />



        {/* TEAM LEAD DASHBOARD */}
        <Route
          path="/teamlead"
          element={
            <ProtectedRoute role="teamlead">
              <TeamLeadDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADD PROJECT */}
        <Route
          path="/createproject"
          element={
            <ProtectedRoute role="teamlead">
              <CreateProject />
            </ProtectedRoute>
          }
        />

        {/* STEP 1: LIST PROJECTS */}
        <Route
          path="/evaluateproject"
          element={
            <ProtectedRoute role="teamlead">
              <EvaluateProject />
            </ProtectedRoute>
          }
        />

        {/*STEP 2: LIST INTERNS IN PROJECT*/}
        <Route
          path="/evaluateproject/:projectId"
          element={
            <ProtectedRoute role="teamlead">
              <EvaluateProjectInterns />
            </ProtectedRoute>
          }
        />

        {/* STEP 3: EVALUATE INTERN */}
        <Route
          path="/evaluateintern/:projectId/:internId"
          element={
            <ProtectedRoute role="teamlead">
              <EvaluateIntern />
            </ProtectedRoute>
          }
        />

        {/* step 4 : intern ranking for teamleader */}
        <Route
          path="/internranking"
          element={
            <ProtectedRoute role="teamlead">
              <InternRanking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addtask"
          element={
            <ProtectedRoute role="teamlead">
              <AddTask />
            </ProtectedRoute>
          }
        />

        {/* VIEW TASKS */}
        <Route
          path="/viewtasks"
          element={
            <ProtectedRoute role="teamlead">
              <ViewTasks />
            </ProtectedRoute>
          }
        />



      </Routes>
    </HashRouter>
  );
}

export default App;
