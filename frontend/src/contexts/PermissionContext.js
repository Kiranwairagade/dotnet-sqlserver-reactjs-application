// src/contexts/PermissionContext.js
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
        const userPermissions = await getUserPermissions(user.id);
        
        // Format permissions into a more usable structure
        const formattedPermissions = {};
        
        // First, add the simple permissions (from User.Permissions list)
        if (Array.isArray(userPermissions.permissions)) {
          userPermissions.permissions.forEach(module => {
            if (!formattedPermissions[module.toLowerCase()]) {
              formattedPermissions[module.toLowerCase()] = { 
                view: true, 
                create: false, 
                edit: false, 
                delete: false 
              };
            }
          });
        }
        
        // Then, add the detailed permissions (from UserPermissions table)
        if (Array.isArray(userPermissions.detailedPermissions)) {
          userPermissions.detailedPermissions.forEach(perm => {
            const module = perm.moduleName.toLowerCase();
            if (!formattedPermissions[module]) {
              formattedPermissions[module] = { 
                view: false, 
                create: false, 
                edit: false, 
                delete: false 
              };
            }
            
            formattedPermissions[module].view = perm.canRead;
            formattedPermissions[module].create = perm.canCreate;
            formattedPermissions[module].edit = perm.canUpdate;
            formattedPermissions[module].delete = perm.canDelete;
          });
        }

        // Ensure every logged-in user can view users
        formattedPermissions['users'] = { 
          ...formattedPermissions['users'] || {}, 
          view: true 
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
    if (!resourceType || !action) return false;
    
    // Admin has full access
    if (user?.role === 'Admin') return true;
    
    const resource = resourceType.toLowerCase();
    const actionLower = action.toLowerCase();
    
    return permissions[resource]?.[actionLower] || false;
  };

  return (
    <PermissionContext.Provider value={{ permissions, hasPermission, isLoading }}>
      {children}
    </PermissionContext.Provider>
  );
};