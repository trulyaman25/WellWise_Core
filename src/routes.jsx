import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from './sections/home/home';
import Register from './sections/auth/register/register';
import PatientProfileBuilder from "./sections/auth/register/profileBuilder/patientProfileBuilder/patientProfile";
import DoctorProfileBuilder from "./sections/auth/register/profileBuilder/doctorProfileBuilder/doctorProfile";
import DispensaryProfileBuilder from './sections/auth/register/profileBuilder/dispensaryProfileBuilder/dispensaryProfile';
import Login from "./sections/auth/login/login";
import Header from "./sections/navigation/header/header";
import Footer from "./sections/navigation/footer/footer";
import PatientDashboard from './sections/dashboard/patientDashboard/patientDashboard';
import DoctorDashboard from "./sections/dashboard/doctorDashboard/doctorDashboard";
import DispensaryDashboard from './sections/dashboard/dispensaryDashboard/dispensaryDashboard';

function RouteConfig() {
	return (
		<Router>
			<RouteWithHeaderFooter />
		</Router>
	);
}

function RouteWithHeaderFooter() {
	const location = useLocation();

	return (
		<>
			{location.pathname === '/' && <Header />}

			<Routes>
				<Route path='/' element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/register/patient/profile/:uniqueID" element={<PatientProfileBuilder />}/>
				<Route path="/register/doctor/profile/:licenseNumber" element={<DoctorProfileBuilder />}/>
				<Route path="/register/dispensary/profile/:licenseNumber" element={<DispensaryProfileBuilder />}/>
				<Route path="/patient/:healthID" element={<PatientDashboard />} />
				<Route path="/doctor/:licenseNumber" element={<DoctorDashboard />} />
				<Route path="/dispensary/:licenseNumber" element={<DispensaryDashboard />} />
			</Routes>

			{location.pathname === '/' && <Footer />}
		</>
	);
}

export default RouteConfig;
