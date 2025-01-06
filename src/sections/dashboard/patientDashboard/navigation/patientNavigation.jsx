import { NavLink, Link } from 'react-router-dom';
import WellWiseLogo from '/favicon.png';
import HomeIcon from '/icons/home.png';
import StethoscopeIcon from '/icons/stethoscope.png';
import BrainIcon from '/icons/brain.png';
import UserIcon from '/icons/user.png';
import LogOutIcon from '/icons/logout.png';

function PatientDashboardNavigation() {
    return (
        <nav className='flex flex-col justify-between items-center w-[160px] h-screen py-10 px-5'>
            <div id='wellWiseLogo'>
                <Link to=''>
                    <img src={WellWiseLogo} alt="Well Wise Logo" className='w-[100px] h-[100px]' />
                </Link>
            </div>

            <div id='NavigationLinks' className='w-full h-full flex flex-col justify-center items-center gap-10'>
                <NavLink to='home' className={({ isActive }) => `w-fit flex justify-center items-center p-4 rounded-3xl transition-colors duration-300 ${isActive ? 'bg-[#d4eceb]' : ''}`} >
                    <img src={HomeIcon} alt="Home Icon" className='w-[40px] h-[40px]' />
                </NavLink>

                <NavLink to='appointments' className={({ isActive }) => `w-fit flex justify-center items-center p-4 rounded-3xl transition-colors duration-300 ${isActive ? 'bg-[#d4eceb]' : ''}`} >
                    <img src={StethoscopeIcon} alt="Stethoscope Icon" className='w-[40px] h-[40px]' />
                </NavLink>

                <NavLink to='mentalhealth' className={({ isActive }) => `w-fit flex justify-center items-center p-4 rounded-3xl transition-colors duration-300 ${isActive ? 'bg-[#d4eceb]' : ''}`} >
                    <img src={BrainIcon} alt="Brain Icon" className='w-[40px] h-[40px]' />
                </NavLink>

                <NavLink to='profile' className={({ isActive }) => `w-fit flex justify-center items-center p-4 rounded-3xl transition-colors duration-300 ${isActive ? 'bg-[#d4eceb]' : ''}`} >
                    <img src={UserIcon} alt="Profile Icon" className='w-[40px] h-[40px]' />
                </NavLink>
            </div>

            <div>
                <Link to="/" className="flex flex-col justify-center items-center gap-3 transform transition-transform duration-200 hover:scale-95 ">
                    <img src={LogOutIcon} alt="Profile Image" className="w-[50px] h-[50px]" />
                </Link>
            </div>
        </nav>
    );
}

export default PatientDashboardNavigation;
