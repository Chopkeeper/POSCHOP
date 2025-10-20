import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

interface NavItem {
    path: string;
    name: string;
    // Fix: Changed JSX.Element to React.ReactNode to resolve 'Cannot find namespace JSX' error.
    icon: React.ReactNode;
    allowedRoles: UserRole[];
}

const navItems: NavItem[] = [
    {
        path: '/dashboard',
        name: 'แดชบอร์ด',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
        allowedRoles: [UserRole.Admin]
    },
    {
        path: '/sales',
        name: 'ขายสินค้า (POS)',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
        allowedRoles: [UserRole.Admin, UserRole.Cashier]
    },
    {
        path: '/kitchen',
        name: 'จอแสดงผลในครัว',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.92,3.35a1,1,0,0,0-1-.13,7.28,7.28,0,0,0-3.23.89,1,1,0,0,0-.54,1.3l.07.14a3,3,0,0,0,1.3,1.38,1,1,0,0,0,1.11-.1,3.2,3.2,0,0,1,3.48-1.55,1,1,0,0,0,1-.68l.19-.68A1,1,0,0,0,17.92,3.35Z"/><path d="M11.23,6.33a1,1,0,0,0-1.11.1,3.2,3.2,0,0,1-3.48,1.55,1,1,0,0,0-1,.68l-.19.68a1,1,0,0,0,.38,1.13,1,1,0,0,0,1,.13,7.28,7.28,0,0,0,3.23-.89,1,1,0,0,0,.54-1.3l-.07-.14A3,3,0,0,0,11.23,6.33Z"/><path d="M20,12.38V12a1,1,0,0,0-1-1H5a1,1,0,0,0-1,1v.38a2,2,0,0,0,1,1.72V20a1,1,0,0,0,1,1h12a1,1,0,0,0,1-1V14.1a2,2,0,0,0,1-1.72Z"/></svg>,
        allowedRoles: [UserRole.Admin, UserRole.Kitchen]
    },
    {
        path: '/server',
        name: 'จอสำหรับพนักงานเสิร์ฟ',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.06,13.52a2.33,2.33,0,0,1,2.2,1.38,3.32,3.32,0,0,1,.4,1.91,3,3,0,0,1-3,3.19H7.34a3,3,0,0,1-3-3.19,3.32,3.32,0,0,1,.4-1.91,2.33,2.33,0,0,1,2.2-1.38" /><circle cx="12" cy="7.5" r="3.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3,12.23,4.12,4.4A2,2,0,0,1,6.08,3h11.84a2,2,0,0,1,1.95,1.4L21,12.23" /></svg>,
        allowedRoles: [UserRole.Admin, UserRole.Server]
    },
    {
        path: '/products',
        name: 'จัดการสินค้า',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
        allowedRoles: [UserRole.Admin]
    },
    {
        path: '/users',
        name: 'จัดการพนักงาน',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" /></svg>,
        allowedRoles: [UserRole.Admin]
    },
    {
        path: '/settings',
        name: 'ตั้งค่า',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        allowedRoles: [UserRole.Admin]
    }
];

const SideNav: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const navigate = useNavigate();
    const { currentUser, settings } = state;

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
    };

    if (!currentUser) return null;

    const availableNavItems = navItems.filter(item => item.allowedRoles.includes(currentUser.role));

    return (
        <aside className="w-64 bg-gray-800 text-white flex flex-col flex-shrink-0">
            <div className="h-20 flex items-center justify-center bg-gray-900">
                <h1 className="text-2xl font-bold">{settings.storeName}</h1>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-2">
                {availableNavItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => 
                            `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <p className="text-sm font-semibold">{currentUser.name}</p>
                <p className="text-xs text-gray-400">{currentUser.role}</p>
                <button
                    onClick={handleLogout}
                    className="w-full mt-4 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    ออกจากระบบ
                </button>
            </div>
        </aside>
    );
};

export default SideNav;