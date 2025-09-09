// features/auth/Login.tsx
// คอมโพเนนต์สำหรับหน้าจอเข้าสู่ระบบสำหรับ Admin และ Factory

import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types';
import * as Icons from '../../constants';

// Props
interface LoginProps {
    role: UserRole;
    onLoginSuccess: () => void;
    onBack: () => void;
}

const MOCK_CREDENTIALS = {
    [UserRole.ADMIN]: { username: 'admin', password: 'admin123' },
    [UserRole.FACTORY]: { username: 'factory', password: 'factory123' },
};

const Login: React.FC<LoginProps> = ({ role, onLoginSuccess, onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (role === UserRole.ADMIN) {
            setUsername('admin');
            setPassword('admin123');
        } else if (role === UserRole.FACTORY) {
            setUsername('factory');
            setPassword('factory123');
        }
    }, [role]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const expectedCredentials = MOCK_CREDENTIALS[role];

        if (expectedCredentials && username === expectedCredentials.username && password === expectedCredentials.password) {
            onLoginSuccess();
        } else {
            setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
             <div className="text-center mb-8">
                <Icons.PreciseLogo className="h-16 w-auto mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-slate-800">เข้าสู่ระบบสำหรับ{role}</h1>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-200 w-full max-w-md">
                <form onSubmit={handleLogin}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-bold text-slate-700 mb-1">ชื่อผู้ใช้</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#009DD4] focus:border-[#009DD4] transition"
                                placeholder="กรอกชื่อผู้ใช้"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-1">รหัสผ่าน</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#009DD4] focus:border-[#009DD4] transition"
                                placeholder="กรอกรหัสผ่าน"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="mt-4 text-center text-red-600 font-semibold">{error}</p>
                    )}

                    <div className="mt-8">
                        <button type="submit" className="w-full bg-[#54B948] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg border-b-4 border-green-700 hover:border-green-600 active:border-b-0 transition-all text-lg">
                            เข้าสู่ระบบ
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <button type="button" onClick={onBack} className="text-slate-600 hover:text-black font-semibold">
                            &larr; กลับไปหน้าเลือกบทบาท
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;