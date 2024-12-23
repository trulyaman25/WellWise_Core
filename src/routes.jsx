import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from './sections/home/home';
import Register from './sections/auth/register/register';
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
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="/patient" element={<PatientDashboard />} />
				<Route path="/doctor" element={<DoctorDashboard />} />
				<Route path="/dispensary" element={<DispensaryDashboard />} />
			</Routes>

			{location.pathname === '/' && <Footer />}
		</>
	);
}

export default RouteConfig;
