
export const inventory_sublinks = [
	{ name: 'Brand New', path: '/', visible: true, className: "nav-link-header custom-disabled text-uppercase", nonLink: true },
	{ name: 'In Stock', path: '/brand_new_in_stock/', visible: true },
	{ name: 'Sold', path: '/brand_new_sold/', visible: true },
	{ name: 'Transfer', path: '/transfer/', visible: true },
	{ name: 'Outgoing', path: '/outgoing/', visible: true },
	{ name: 'Incoming', path: '/incoming/', visible: true },
	{ name: 'divider', path: '/', visible: true, className: 'divider custom-disabled', nonLink: true, divider: true },
	{ name: 'Secondhand', path: '/', visible: true, className: "nav-link-header custom-disabled text-uppercase", nonLink: true },
	{ name: 'In Stock', path: '/secondhand_in_stock/', visible: true },
	{ name: 'Sold', path: '/secondhand_sold/', visible: true },
	{ name: 'divider', path: '/', visible: true, className: 'divider custom-disabled', nonLink: true, divider: true },
	{ name: 'Search D.R.', path: '/search_dr/', visible: true },
	{ name: 'Duplicate Entries', path: '/duplicate_entries/', visible: true },
]

export const reports_sublinks = [
	{ name: 'Unsold', path: '/unsold_units/', visible: true },
	{ name: 'Sold', path: '/sold_units/', visible: true },
	{ name: 'No Clearance', path: '/no_clearance/', visible: true },
	{ name: 'No TBA\'s', path: '/no_tba/', visible: true },
	{ name: 'Warranty Claims', path: '/warranty_claims/', visible: true },
	{ name: 'Total (Unsold)', path: '/total_unsold/', visible: true },
	{ name: 'Total (Sold)', path: '/total_sold/', visible: true },
	{ name: 'Cash and Installments', path: '/cash_and_installments/', visible: true },
	{ name: 'For BIR', path: '/bir/', visible: true },
]

export const settings_sub_links = [
	{ name: 'Branches', path: '/branches/', visible: true },
	{ name: 'Brands', path: '/brands/', visible: true },
	{ name: 'Models', path: '/models/', visible: true },
	// { name: 'User Roles', path: '/user_roles/', visible: true },
	{ name: 'Customer Area', path: '/customer_area/', visible: true },
]

export const users_sub_links = [
	{ name: 'User List', path: '/users/', visible: true },
	{ name: 'Roles', path: '/user_roles/', visible: true },
	{ name: 'Permission List', path: '/user_permission_list/', visible: true },
	{ name: 'Assign Permissions', path: '/user_permissions/', visible: true },
]

