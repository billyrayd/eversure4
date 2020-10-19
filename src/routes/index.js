
import Login from "views/Login";

/* Inventory */
import LandingPage from "views/Inventory/LandingPage";
import Dashboard from "views/Inventory/Dashboard/Dashboard";
import BrandNewInStock from "views/Inventory/Inventory/BrandNewInStock";
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
    path: "/elements/",
    name: "Elements",
    component: Elements,
  },
]

export default () => {
	return { authenticated, unauthenticated }
};