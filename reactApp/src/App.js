import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import NfaObject from "./pages/NfaObject";
import VendorObject from "./pages/VendorObject";
import ComparativeScreen3 from "./pages/ComparativeScreenPages/ComparativeScreen3";
import ComparativeScreen4 from "./pages/ComparativeScreenPages/ComparativeScreen4";
import VendorHome from "./pages/VendorHome";
import VendorObjectPage from "./pages/VendorObjectPage";
import Login from "pages/Login";
import Loading from "components/Loading";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Dashboard Landing Page */}
          <Route index element={<Dashboard />} />

          {/*Login Page */}
          <Route path="buyer/login" element={<Login />} />
          <Route path="approver/login" element={<Login />} />
          <Route path="admin/login" element={<Login />} />
          <Route path="vendor/login" element={<Login />} />
          <Route path="/loading" element={<Loading />} />


          {/* Buyer Routes */}
          <Route path="buyer" element={<Home role="buyer" />} />
          <Route path="buyer/:nfaNumber" element={<NfaObject role="buyer" />} />
          <Route
            path="buyer/:nfaNumber/vendor/:vendorCode"
            element={<VendorObject role="buyer" />}
          />

          {/* Approver Routes */}
          <Route path="approver" element={<Home role="approver" />} />
          <Route
            path="approver/:nfaNumber"
            element={<NfaObject role="approver" />}
          />
          <Route
            path="approver/:nfaNumber/vendor/:vendorCode"
            element={<VendorObject role="approver" />}
          />
          <Route
            path="approver/comparative/:nfaNumber"
            element={<ComparativeScreen3 />}
          />
          <Route
            path="approver/comparative/:nfaNumber/4"
            element={<ComparativeScreen4 />}
          />

          {/* Admin Routes */}
          <Route path="admin" element={<Home role="admin" />} />
          <Route path="admin/:nfaNumber" element={<NfaObject role="admin" />} />
          <Route
            path="admin/:nfaNumber/vendor/:vendorCode"
            element={<VendorObject role="admin" />}
          />

          {/* Vendor Routes */}
          <Route path="vendor" element={<Home role="vendor" />} />
          <Route path="vendor/:nfaNumber" element={<VendorHome />} />
          <Route path="vendor" element={<VendorHome />} />
          <Route path="/vendor/:vendorCode" element={<VendorObjectPage />} />
          {/* <Route
            path="vendor/:nfaNumber/vendor/:vendorCode"
            element={<VendorObject role="vendor" />}
          /> */}
          <Route
            path="vendor/:nfaNumber/vendor/:vendorCode"
            element={<VendorObjectPage />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
