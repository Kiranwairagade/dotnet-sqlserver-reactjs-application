const sidebarItems = [
  { id: 'products', name: 'All Products' },
  { id: 'categories', name: 'Categories' },
  { id: 'brands', name: 'Brands' },
  { id: 'suppliers', name: 'Suppliers' }
];

export const getSidebarItems = async () => {
  return sidebarItems; // Returns updated list dynamically
};

// Function to add a new sidebar item
export const addSidebarItem = (id, name) => {
  sidebarItems.push({ id, name });
};
