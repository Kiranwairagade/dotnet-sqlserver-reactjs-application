import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserPermissions } from '../services/userService';

const PermissionContext = createContext();

export const usePermission = () => useContext(PermissionContext);

export const PermissionProvider = ({ children }) => {
  const { currentUser, isAuthenticated, userRole } = useAuth();
  const [permissions, setPermissions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (isAuthenticated && currentUser) {
        try {
          const userPermissions = await getUserPermissions(currentUser.id);
          const formattedPermissions = userPermissions.reduce((acc, permission) => {
            if (!acc[permission.resourceType]) {
              acc[permission.resourceType] = { view: false, create: false, edit: false, delete: false };
            }
            acc[permission.resourceType][permission.action.toLowerCase()] = true;
            return acc;
          }, {});

          setPermissions(formattedPermissions);
        } catch (error) {
          console.error("Failed to fetch permissions:", error);
        }
      } else {
        setPermissions({});
      }
      setIsLoading(false);
    };

    fetchPermissions();
  }, [isAuthenticated, currentUser]);

  const hasPermission = (resourceType, action) => {
    if (!isAuthenticated) return false;
    if (userRole === 'Admin') return true; 
    return permissions[resourceType]?.[action.toLowerCase()] || false;
  };

  return (
    <PermissionContext.Provider value={{ permissions, hasPermission, isLoading }}>
      {children}
    </PermissionContext.Provider>
  );
};
