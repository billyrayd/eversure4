
import Login from "views/Login";

/* Inventory */
import LandingPage from "views/Inventory/LandingPage";
import Dashboard from "views/Inventory/Dashboard/Dashboard";
import BrandNewInStock from "views/Inventory/Inventory/BrandNewInStock";
import Payments from "views/Inventory/Payments/Payments";
import BrandNewUnsold from "views/Inventory/Reports/BrandNewUnsold";
import UsersList from "views/Inventory/Users/UsersList";
import Brands from "views/Inventory/Settings/Brands";
import Elements from "views/Inventory/Elements";

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
]

export default () => {
	return { authenticated, unauthenticated }
};