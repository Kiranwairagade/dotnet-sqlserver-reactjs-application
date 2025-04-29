// src/components/common/PermissionCheck.js
import React from 'react';
import { usePermission } from '../../contexts/PermissionContext';

/**
 * Component that conditionally renders children based on user permissions
 * @param {Object} props
 * @param {string} props.moduleName - The module to check permissions for
 * @param {string} props.action - The action type (view, create, edit, delete)
 * @param {React.ReactNode} props.children - Content to render if permission exists
 * @param {React.ReactNode} props.fallback - Optional content to render if permission denied
 * @param {boolean} props.debug - Whether to show debug information
 */
const PermissionCheck = ({ 
  moduleName, 
  action, 
  children, 
  fallback = null,
  debug = false
}) => {
  const { hasPermission, isLoading } = usePermission();
  
  // While permissions are loading, don't render anything
  if (isLoading) {
    return debug ? <div>Loading permissions...</div> : null;
  }
  
  // For debugging purposes
  if (debug) {
    console.log(`PermissionCheck for ${moduleName}.${action}`);
  }
  
  // Map the action to match our permissions structure
  const actionMap = {
    'view': 'view',
    'read': 'view',
    'create': 'create', 
    'add': 'create',
    'edit': 'edit',
    'update': 'edit',
    'delete': 'delete',
    'remove': 'delete'
  };
  
  const mappedAction = actionMap[action.toLowerCase()] || action.toLowerCase();
  
  // Check if user has the required permission
  const permitted = hasPermission(moduleName.toLowerCase(), mappedAction);
  
  if (permitted) {
    return children;
  }
  
  // User doesn't have permission, render fallback or null
  return fallback || (debug ? 
    <div style={{color: 'red', padding: '5px', fontSize: '12px'}}>
      Permission denied: {moduleName}.{action}
    </div> : null);
};

export default PermissionCheck;