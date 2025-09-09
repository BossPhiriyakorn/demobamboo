// features/auth/LoginWithLinePage.tsx
import React from 'react';
import * as Icons from '../../constants';

// A simple Line icon component for the button
const LineIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fill="#00c300" d="M224 0H32C14.328 0 0 14.328 0 32v192c0 17.672 14.328 32 32 32h192c17.672 0 32-14.328 32-32V32c0-17.672-14.328-32-32-32z"/>
        <path fill="#fff" d="M109.473 192V98.902h-13.3V82.16h38.54v109.84zm63.89 0v-46.77c0-23.27 12.33-32.93 25.4-32.93 11.2 0 19.33 7.53 19.33 19.89v60.09h13.53V132c0-20.91-13.89-35.4-33.22-35.4-15.42 0-25.18 9.4-28.57 16.55h-.48v-13.4h-12.9v92.13zm-92.41-58.42c-14.6 0-23.51 9.4-23.51 22.11s8.9 22.1 23.51 22.1c14.6 0 23.51-9.4 23.51-22.1.01-12.71-8.9-22.11-23.51-22.11m-38.33 22.11c0-21.28 15.2-35.4 38.33-35.4s38.33 14.12 38.33 35.4-15.2 35.4-38.33 35.4-38.33-14.12-38.33-35.4M32 119.83v22.3h13.53v-22.3z"/>
    </svg>
);


const LoginWithLinePage = () => {
    
    // Simulate redirecting to LINE for authorization
    const handleLineLogin = () => {
        // In a real app, this would be a redirect to LINE's authorization URL.
        // Here, we simulate the callback by reloading the page with a fake auth code.
        window.location.href = window.location.pathname + '?code=fake_line_code&state=fake_state';
    };

    return (
        <div 
            className="min-h-screen bg-cover bg-center flex items-center justify-center p-4" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516586711933-7c3905534346?q=80&w=1974&auto=format&fit=crop')" }}
        >
            <div className="absolute inset-0 bg-green-900/50 backdrop-blur-sm"></div>
            
            <div className="relative text-center bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md">
                 <Icons.FullPreciseLogo className="h-16 w-auto mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-slate-800 mb-2">แพลตฟอร์มส่งเสริมการปลูกไผ่</h1>
                <p className="text-slate-600 mb-10">กรุณาเข้าสู่ระบบผ่าน LINE เพื่อเริ่มต้นใช้งาน</p>

                <button
                    onClick={handleLineLogin}
                    className="w-full bg-[#00c300] hover:bg-[#00a900] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-3 text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                    <LineIcon className="w-8 h-8"/>
                    <span>เข้าสู่ระบบหรือลงทะเบียนด้วย LINE</span>
                </button>
            </div>
        </div>
    );
};

export default LoginWithLinePage;
