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
      if (!user || !token) {
        setPermissions({});
        setIsLoading(false);
        return;
      }

      try {
        const userPermissions = await getUserPermissions(user.id, token);
        const formattedPermissions = userPermissions.reduce((acc, { resourceType, action }) => {
          if (!acc[resourceType]) {
            acc[resourceType] = { view: false, create: false, edit: false, delete: false };
          }
          acc[resourceType][action.toLowerCase()] = true;
          return acc;
        }, {});

        // ✅ Ensure every logged-in user can view users
        formattedPermissions['users'] = {
          ...formattedPermissions['users'],
          view: true,
        };

        setPermissions(formattedPermissions);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
        setPermissions({ users: { view: true } }); // Default fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [user, token]);

  const hasPermission = (resourceType, action) => {
    if (user?.role === 'Admin') return true; // Admin has full access
    return permissions[resourceType]?.[action.toLowerCase()] || false;
  };

  return (
    <PermissionContext.Provider value={{ permissions, hasPermission, isLoading }}>
      {children}
    </PermissionContext.Provider>
  );
};
