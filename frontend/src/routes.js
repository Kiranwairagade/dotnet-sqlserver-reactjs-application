const routes = {
    home: '/',
    login: '/login',
    signup: '/signup',
    dashboard: '/dashboard',
    products: '/products',
    productDetails: (id) => `/products/${id}`,
    categoryMaster: '/categories',
    brandMaster: '/brands',
    supplierMaster: '/suppliers',
    userManagement: '/users',
    permissionControl: '/permissions'
  };
  
  export default routes;