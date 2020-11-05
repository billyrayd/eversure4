export const customer_sub_links = [
	{ name: 'Brand New', path: '/accounting/', visible: true, className: "nav-link-header custom-disabled text-uppercase", nonLink: true },
	{ name: 'Installment', path: '/brandnew_customer_installment/', visible: true },
	{ name: 'Cash', path: '/brandnew_customer_cash/', visible: true },
	{ name: 'Fully Paid', path: '/brandnew_customer_fully_paid/', visible: true },
	{ name: 'Repossessed', path: '/brandnew_customer_repossessed/', visible: true },
	{ name: 'divider', path: '/', visible: true, className: 'divider custom-disabled', nonLink: true, divider: true },
	{ name: 'Secondhand', path: '/', visible: true, className: "nav-link-header custom-disabled text-uppercase", nonLink: true },
	{ name: 'Installment', path: '/secondhand_customer_installment/', visible: true },
	{ name: 'Cash', path: '/secondhand_customer_cash/', visible: true },
	{ name: 'Fully Paid', path: '/secondhand_customer_fully_paid/', visible: true },
	{ name: 'Repossessed', path: '/secondhand_customer_repossessed/', visible: true },
]

export const reports_sublinks = [
	{ name: 'Total Paid', path: '/reports_total_paid/', visible: true },
	{ name: 'Total Current Monthly Amortization', path: '/reports_total_current_monthly_amortization/', visible: true },
	{ name: 'Account No Payment (Brand New)', path: '/reports_account_no_payment_brandnew/', visible: true },
	{ name: 'Account No Payment (Secondhand)', path: '/reports_account_no_payment_secondhand/', visible: true },
	{ name: 'Customer List Per Area', path: '/reports_customer_list_per_area/', visible: true },
	{ name: 'Customers Who Paid', path: '/reports_customers_who_paid/', visible: true },
	{ name: 'New Customers', path: '/reports_new_customers/', visible: true },
	{ name: 'Fully Paid Customers', path: '/reports_fully_paid_customers/', visible: true },
	{ name: 'Customers with Repossessed Units', path: '/reports_customers_with_repossessed_units/', visible: true },
]