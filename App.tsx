// App.tsx
// คอมโพเนนต์หลักของแอปพลิเคชัน ทำหน้าที่เป็นตัวจัดการการแสดงผลตามบทบาทของผู้ใช้

import React, { useState, useEffect, useCallback } from 'react';
import { UserRole } from './types';
import FarmerView from './features/farmer/FarmerView';
import FactoryView from './features/factory/FactoryView';
import AdminView from './features/admin/AdminView';
import FarmerRegistration, { RegistrationStatus } from './features/auth/FarmerRegistration';
import RoleSelector from './features/auth/RoleSelector'; // Restore RoleSelector
import Login from './features/auth/Login'; // Restore Login
import { initialPolicyContent, initialTermsContent } from './data/policyContent';

// Auth status type
export type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated';
export interface LineProfile {
    userId: string;
    displayName: string;
    pictureUrl: string;
}

// Simulating a loading spinner
const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
    </div>
);


function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus | null>(null);

  // Policy Content State remains the same
  const [policyContent, setPolicyContent] = useState(initialPolicyContent);
  const [termsContent, setTermsContent] = useState(initialTermsContent);

  const handleUpdatePolicies = useCallback((newPolicy: string, newTerms: string) => {
      setPolicyContent(newPolicy);
      setTermsContent(newTerms);
      alert('บันทึกนโยบายเรียบร้อยแล้ว');
  }, []);
  
  // Effect to check for an existing session on app load
  useEffect(() => {
    const sessionData = localStorage.getItem('userSession');
    if (sessionData) {
        const session = JSON.parse(sessionData);
        setRole(session.role);
        setAuthStatus('authenticated');
    } else {
        setAuthStatus('unauthenticated');
    }
  }, []);
  
  // --- Handlers for manual role selection flow ---

  const handleSelectRole = useCallback((selectedRole: UserRole) => {
    if (selectedRole === UserRole.FARMER) {
      // For testing, farmer logs in directly
      const newSession = { role: UserRole.FARMER };
      localStorage.setItem('userSession', JSON.stringify(newSession));
      setRole(UserRole.FARMER);
      setAuthStatus('authenticated');
    } else {
      // Admin and Factory go to login screen
      setRole(selectedRole);
    }
  }, []);

  const handleStartRegistration = useCallback(() => {
    setRegistrationStatus('registering');
  }, []);

  const handleTestNotApproved = useCallback(() => {
    setRegistrationStatus('not_approved');
  }, []);

  const handleLoginSuccess = useCallback(() => {
    if (role) {
      const newSession = { role };
      localStorage.setItem('userSession', JSON.stringify(newSession));
      setAuthStatus('authenticated');
    }
  }, [role]);
  
  const handleRegistrationSubmit = useCallback(() => {
    // In this flow, after submitting, we show the pending approval screen
    setRegistrationStatus('pending');
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('userSession');
    setRole(null);
    setRegistrationStatus(null);
    setAuthStatus('unauthenticated');
  }, []);
  
  const handleBackToRoleSelector = useCallback(() => {
    setRole(null);
    setRegistrationStatus(null);
  }, []);

  // Main render logic based on authentication status
  const renderView = () => {
    switch (authStatus) {
        case 'loading':
            return <LoadingSpinner />;

        case 'unauthenticated':
            if (registrationStatus) {
                return (
                    <FarmerRegistration
                        status={registrationStatus}
                        onSubmit={handleRegistrationSubmit}
                        onBackToRoleSelector={handleBackToRoleSelector}
                        onRetry={() => setRegistrationStatus('registering')}
                        policyContent={policyContent}
                        termsContent={termsContent}
                    />
                );
            }
            if (role === UserRole.ADMIN || role === UserRole.FACTORY) {
                return (
                    <Login
                        role={role}
                        onLoginSuccess={handleLoginSuccess}
                        onBack={handleBackToRoleSelector}
                    />
                );
            }
            return (
                <RoleSelector
                    onSelectRole={handleSelectRole}
                    onStartRegistration={handleStartRegistration}
                    onTestNotApproved={handleTestNotApproved}
                />
            );

        case 'authenticated':
            switch (role) {
                case UserRole.FARMER:
                    return <FarmerView onLogout={handleLogout} />;
                case UserRole.FACTORY:
                    return <FactoryView onLogout={handleLogout} />;
                case UserRole.ADMIN:
                    return <AdminView 
                                onLogout={handleLogout} 
                                policyContent={policyContent}
                                termsContent={termsContent}
                                onUpdatePolicies={handleUpdatePolicies}
                            />;
                default:
                    // Fallback if role is somehow null
                     return (
                        <RoleSelector
                            onSelectRole={handleSelectRole}
                            onStartRegistration={handleStartRegistration}
                            onTestNotApproved={handleTestNotApproved}
                        />
                    );
            }

        default:
             return (
                <RoleSelector
                    onSelectRole={handleSelectRole}
                    onStartRegistration={handleStartRegistration}
                    onTestNotApproved={handleTestNotApproved}
                />
            );
    }
  };

  return (
    <div className="bg-[#F0F5F9] min-h-screen">
      {renderView()}
    </div>
  );
}

export default App;
