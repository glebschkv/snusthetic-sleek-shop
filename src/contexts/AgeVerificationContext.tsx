import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AgeVerificationContextType {
  isVerified: boolean;
  showModal: boolean;
  verifyAge: () => void;
  closeModal: () => void;
  resetVerification: () => void;
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined);

const STORAGE_KEY = 'snusthetic_age_verified';
const SESSION_KEY = 'snusthetic_session_verified';

export const AgeVerificationProvider = ({ children }: { children: ReactNode }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if user has been verified in this session
    const sessionVerified = sessionStorage.getItem(SESSION_KEY);
    if (sessionVerified === 'true') {
      setIsVerified(true);
      return;
    }

    // Check if user has been verified before (localStorage for persistence)
    const localVerified = localStorage.getItem(STORAGE_KEY);
    if (localVerified === 'true') {
      setIsVerified(true);
      sessionStorage.setItem(SESSION_KEY, 'true');
      return;
    }

    // Show modal if not verified
    setShowModal(true);
  }, []);

  const verifyAge = () => {
    setIsVerified(true);
    setShowModal(false);
    localStorage.setItem(STORAGE_KEY, 'true');
    sessionStorage.setItem(SESSION_KEY, 'true');
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const resetVerification = () => {
    setIsVerified(false);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setShowModal(true);
  };

  return (
    <AgeVerificationContext.Provider
      value={{
        isVerified,
        showModal,
        verifyAge,
        closeModal,
        resetVerification,
      }}
    >
      {children}
    </AgeVerificationContext.Provider>
  );
};

export const useAgeVerification = () => {
  const context = useContext(AgeVerificationContext);
  if (context === undefined) {
    throw new Error('useAgeVerification must be used within an AgeVerificationProvider');
  }
  return context;
};