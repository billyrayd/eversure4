
import Login from "views/Login";
import ResetPassword from "views/ResetPassword";

/* --- Inventory System --- */
import LandingPage from "views/Inventory/LandingPage";
/* dashboard */
import Dashboard from "views/Inventory/Dashboard/Dashboard";
import Notifications from "views/Inventory/Dashboard/Notifications";
/* inventory */
import AddBrandNewUnit from "views/Inventory/Inventory/AddBrandNewUnit";
import BrandNewInStock from "views/Inventory/Inventory/BrandNewInStock";
import BrandNewSold from "views/Inventory/Inventory/BrandNewSold";
import BrandNewTransfer from "views/Inventory/Inventory/BrandNewTransfer";
import BrandNewOutgoing from "views/Inventory/Inventory/BrandNewOutgoing";
import BrandNewIncoming from "views/Inventory/Inventory/BrandNewIncoming";
import SecondhandInStock from "views/Inventory/Inventory/SecondhandInStock";
import SecondhandSold from "views/Inventory/Inventory/SecondhandSold";
import SearchDr from "views/Inventory/Inventory/SearchDr";
import DuplicateEntries from "views/Inventory/Inventory/DuplicateEntries";
/* payments */
import Payments from "views/Inventory/Payments/Payments";
/* reports */
import UnsoldUnits from "views/Inventory/Reports/UnsoldUnits";
import SoldUnits from "views/Inventory/Reports/SoldUnits";
import NoClearance from "views/Inventory/Reports/NoClearance";
import NoTba from "views/Inventory/Reports/NoTba";
import WarrantyClaims from "views/Inventory/Reports/WarrantyClaims";
import TotalUnsold from "views/Inventory/Reports/TotalUnsold";
import TotalSold from "views/Inventory/Reports/TotalSold";
import CashAndInstallments from "views/Inventory/Reports/CashAndInstallments";
import Bir from "views/Inventory/Reports/Bir";
/* users */
import UsersList from "views/Inventory/Users/UsersList";
import UserRoles from "views/Inventory/Users/UserRoles";
import UserPermissionList from "views/Inventory/Users/UserPermissionList";
import UserPermissions from "views/Inventory/Users/UserPermissions";
/* settings */
import Brands from "views/Inventory/Settings/Brands";
import Models from "views/Inventory/Settings/Models";
import Branches from "views/Inventory/Settings/Branches";
import Roles from "views/Inventory/Settings/Roles";
import Areas from "views/Inventory/Settings/Areas";

import Elements from "views/Inventory/Elements";

/* --- Accounting System --- */
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


/* --- Old Records System --- */
import OldRecordsLandingPage from "views/OldRecords/OldRecordsLandingPage";

var unauthenticated = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/reset_password/",
    name: "ResetPassword",
    component: ResetPassword,
  },

]

var authenticated = [
  {
    path: "/",
    name: "LandingPage",
    component: LandingPage,
  },

  /* === dashboard */

  {
    path: "/dashboard/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/reset_password_notifications/",
    name: "Notifications",
    component: Notifications,
  },

  /* == inventory */

  {
    path: "/add_brand_new_unit/",
    name: "AddBrandNewUnit",
    component: AddBrandNewUnit,
  },
  {
    path: "/brand_new_in_stock/",
    name: "In Stock",
    component: BrandNewInStock,
  },
  {
    path: "/brand_new_sold/",
    name: "BrandNewSold",
    component: BrandNewSold,
  },
  {
    path: "/transfer/",
    name: "BrandNewTransfer",
    component: BrandNewTransfer,
  },
  {
    path: "/outgoing/",
    name: "BrandNewOutgoing",
    component: BrandNewOutgoing,
  },
  {
    path: "/incoming/",
    name: "BrandNewIncoming",
    component: BrandNewIncoming,
  },
  {
    path: "/secondhand_in_stock/",
    name: "SecondhandInStock",
    component: SecondhandInStock,
  },
  {
    path: "/secondhand_sold/",
    name: "SecondhandSold",
    component: SecondhandSold,
  },
  {
    path: "/search_dr/",
    name: "SearchDr",
    component: SearchDr,
  },
  {
    path: "/duplicate_entries/",
    name: "DuplicateEntries",
    component: DuplicateEntries,
  },

  /* payments */

  {
    path: "/payments/",
    name: "Payments",
    component: Payments,
  },

  /* reports */

  {
    path: "/unsold_units/",
    name: "Unsold",
    component: UnsoldUnits,
  },
  {
    path: "/sold_units/",
    name: "SoldUnits",
    component: SoldUnits,
  },
  {
    path: "/no_clearance/",
    name: "NoClearance",
    component: NoClearance,
  },
  {
    path: "/no_tba/",
    name: "NoTba",
    component: NoTba,
  },
  {
    path: "/warranty_claims/",
    name: "WarrantyClaims",
    component: WarrantyClaims,
  },
  {
    path: "/total_unsold/",
    name: "TotalUnsold",
    component: TotalUnsold,
  },
  {
    path: "/total_sold/",
    name: "TotalSold",
    component: TotalSold,
  },
  {
    path: "/cash_and_installments/",
    name: "CashAndInstallments",
    component: CashAndInstallments,
  },
  {
    path: "/bir/",
    name: "Bir",
    component: Bir,
  },

  /* users */

  {
    path: "/users/",
    name: "Users",
    component: UsersList,
  },
  {
    path: "/user_roles/",
    name: "UserRoles",
    component: UserRoles,
  },
  {
    path: "/user_permission_list/",
    name: "UserPermissionList",
    component: UserPermissionList,
  },
  {
    path: "/user_permissions/",
    name: "UserPermissions",
    component: UserPermissions,
  },

  /* settings */

  {
    path: "/branches/",
    name: "Branches",
    component: Branches,
  },
  {
    path: "/brands/",
    name: "Brands",
    component: Brands,
  },
  {
    path: "/models/",
    name: "Models",
    component: Models,
  },
  {
    path: "/customer_area/",
    name: "Areas",
    component: Areas,
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