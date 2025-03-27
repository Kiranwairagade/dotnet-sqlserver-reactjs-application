import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserPermissions } from '../services/userService';

// 1. Create Context
const PermissionContext = createContext();

// 2. Custom Hook
export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermission must be used within a PermissionProvider");
  }
  return context;
};

// 3. Provider Component
export const PermissionProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [permissions, setPermissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (token && user) {
        try {
          const userPermissions = await getUserPermissions(user.id, token); // Pass token if required
          const formattedPermissions = userPermissions.reduce((acc, permission) => {
            const resource = permission.resourceType;
            const action = permission.action.toLowerCase();
            if (!acc[resource]) {
              acc[resource] = { view: false, create: false, edit: false, delete: false };
            }
            acc[resource][action] = true;
            return acc;
          }, {});
          setPermissions(formattedPermissions);
        } catch (error) {
          console.error("Failed to fetch permissions:", error);
          setPermissions({});
        }
      } else {
        setPermissions({});
      }
      setIsLoading(false);
    };

    fetchPermissions();
  }, [user, token]);

  const hasPermission = (resourceType, action) => {
    if (!user) return false;
    if (user.role === 'Admin') return true; // Admin full access
    return permissions[resourceType]?.[action.toLowerCase()] || false;
  };

  return (
    <PermissionContext.Provider value={{ permissions, hasPermission, isLoading }}>
      {children}
    </PermissionContext.Provider>
  );
};
