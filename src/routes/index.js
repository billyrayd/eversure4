
import Login from "views/Login";

/* --- Inventory --- */
import LandingPage from "views/Inventory/LandingPage";
import Dashboard from "views/Inventory/Dashboard/Dashboard";
import BrandNewInStock from "views/Inventory/Inventory/BrandNewInStock";
import Payments from "views/Inventory/Payments/Payments";
import BrandNewUnsold from "views/Inventory/Reports/BrandNewUnsold";
import UsersList from "views/Inventory/Users/UsersList";
import Brands from "views/Inventory/Settings/Brands";
import Elements from "views/Inventory/Elements";

/* --- Accounting --- */
/* landing page */
import AccountingLandingPage from "views/Accounting/AccountingLandingPage";
/* customers */
import BrandnewCustomerCash from "views/Accounting/Customers/BrandnewCustomerCash";
import BrandnewCustomerInstallment from "views/Accounting/Customers/BrandnewCustomerInstallment";
import BrandnewCustomerFullyPaid from "views/Accounting/Customers/BrandnewCustomerFullyPaid";
import BrandnewCustomerRepossessed from "views/Accounting/Customers/BrandnewCustomerRepossessed";
import SecondhandCustomerInstallment from "views/Accounting/Customers/SecondhandCustomerInstallment";
import SecondhandCustomerCash from "views/Accounting/Customers/SecondhandCustomerCash";
import SecondhandCustomerFullyPaid from "views/Accounting/Customers/SecondhandCustomerFullyPaid";
import SecondhandCustomerRepossessed from "views/Accounting/Customers/SecondhandCustomerRepossessed";
/* reports */
import ReportsTotalPaid from "views/Accounting/Reports/TotalPaid";
import ReportsTotalCurrentMa from "views/Accounting/Reports/TotalCurrentMonthlyAmortization";
import ReportsAccountNoPaymentBrandNew from "views/Accounting/Reports/AccountNoPaymentBrandNew";
import ReportsAccountNoPaymentSecondhand from "views/Accounting/Reports/AccountNoPaymentSecondhand";
import ReportsCustomerListPerArea from "views/Accounting/Reports/CustomerListPerArea";
import ReportsNewCustomers from "views/Accounting/Reports/NewCustomers";
import ReportsCustomersWhoPaid from "views/Accounting/Reports/CustomersWhoPaid";
import ReportsFullyPaidCustomers from "views/Accounting/Reports/FullyPaidCustomers";
import ReportsCustomersWithRepossessedUnits from "views/Accounting/Reports/CustomersWithRepossessedUnits";
/* overdue */
import Overdue from "views/Accounting/Overdue/Overdue";
/* financial statement */
import FinancialStatement from 'views/Accounting/FinancialStatement/FinancialStatement';
/* ledgers */
import Ledgers from 'views/Accounting/Ledgers/Ledgers';
/* accounts payable */
import AccountsPayable from 'views/Accounting/AccountsPayable/AccountsPayable'


/* --- Old Records --- */
import OldRecordsLandingPage from "views/OldRecords/OldRecordsLandingPage";

var unauthenticated = [
  {
    path: "/",
    name: "Login",
    icon: "nc-icon nc-bank",
    component: Login,
  },
]

var authenticated = [
  {
    path: "/",
    name: "LandingPage",
    component: LandingPage,
  },
  {
    path: "/dashboard/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/brand_new_in_stock/",
    name: "In Stock",
    component: BrandNewInStock,
  },
  {
    path: "/payments/",
    name: "Payments",
    component: Payments,
  },
  {
    path: "/brand_new_unsold/",
    name: "Unsold",
    component: BrandNewUnsold,
  },
  {
    path: "/users/",
    name: "Users",
    component: UsersList,
  },
  {
    path: "/brands/",
    name: "Brands",
    component: Brands,
  },
  {
    path: "/elements/",
    name: "Elements",
    component: Elements,
  },
  {
    path: "/accounting/",
    name: "AccountingLandingPage",
    component: AccountingLandingPage,
  },
  {
    path: "/brandnew_customer_installment/",
    name: "BrandnewCustomerInstallment",
    component: BrandnewCustomerInstallment,
  },
  {
    path: "/brandnew_customer_cash/",
    name: "BrandnewCustomerCash",
    component: BrandnewCustomerCash,
  },
  {
    path: "/brandnew_customer_fully_paid/",
    name: "BrandnewCustomerFullyPaid",
    component: BrandnewCustomerFullyPaid,
  },
  {
    path: "/brandnew_customer_repossessed/",
    name: "BrandnewCustomerRepossessed",
    component: BrandnewCustomerRepossessed,
  },
  {
    path: "/secondhand_customer_installment/",
    name: "SecondhandCustomerInstallment",
    component: SecondhandCustomerInstallment,
  },
  {
    path: "/secondhand_customer_cash/",
    name: "SecondhandCustomerCash",
    component: SecondhandCustomerCash,
  },
  {
    path: "/secondhand_customer_fully_paid/",
    name: "SecondhandCustomerFullyPaid",
    component: SecondhandCustomerFullyPaid,
  },
  {
    path: "/secondhand_customer_repossessed/",
    name: "SecondhandCustomerRepossessed",
    component: SecondhandCustomerRepossessed,
  },
  {
    path: "/reports_total_paid/",
    name: "ReportsTotalPaid",
    component: ReportsTotalPaid,
  },
  {
    path: "/reports_total_current_monthly_amortization/",
    name: "ReportsTotalCurrentMa",
    component: ReportsTotalCurrentMa,
  },
  {
    path: "/reports_account_no_payment_brandnew/",
    name: "ReportsAccountNoPaymentBrandNew",
    component: ReportsAccountNoPaymentBrandNew,
  },
  {
    path: "/reports_account_no_payment_secondhand/",
    name: "ReportsAccountNoPaymentSecondhand",
    component: ReportsAccountNoPaymentSecondhand,
  },
  {
    path: "/reports_customer_list_per_area/",
    name: "ReportsCustomerListPerArea",
    component: ReportsCustomerListPerArea,
  },
  {
    path: "/reports_new_customers/",
    name: "ReportsNewCustomers",
    component: ReportsNewCustomers,
  },
  {
    path: "/reports_customers_who_paid/",
    name: "ReportsCustomersWhoPaid",
    component: ReportsCustomersWhoPaid,
  },
  {
    path: "/reports_fully_paid_customers/",
    name: "ReportsFullyPaidCustomers",
    component: ReportsFullyPaidCustomers,
  },
  {
    path: "/reports_customers_with_repossessed_units/",
    name: "ReportsCustomersWithRepossessedUnits",
    component: ReportsCustomersWithRepossessedUnits,
  },
  {
    path: "/overdue/",
    name: "Overdue",
    component: Overdue,
  },
  {
    path: "/financial_statement/",
    name: "FinancialStatement",
    component: FinancialStatement,
  },
  {
    path: "/ledgers/",
    name: "Ledgers",
    component: Ledgers,
  },
  {
    path: "/accounts_payable/",
    name: "AccountsPayable",
    component: AccountsPayable,
  },

  {
    path: "/old_records/",
    name: "OldRecordsLandingPage",
    component: OldRecordsLandingPage,
  },
]

export default () => {
	return { authenticated, unauthenticated }
};