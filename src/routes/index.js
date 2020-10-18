
import Login from "views/Login";

/* Inventory */
import Inventory from "views/Inventory/LandingPage";
import Dashboard from "views/Inventory/Dashboard";
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
    name: "Inventory",
    component: Inventory,
  },
  {
    path: "/Dashboard/",
    name: "Dashboard",
    component: Dashboard,
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