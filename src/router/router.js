import { Global } from "@/helpers/global";
import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: {
        name: "Login",
      },
    },
    {
      path: "/login",
      name: "Login",
      component: require("../components/login/Login.vue").default,
    },

    {
      path: "/home",
      component: require("../components/home/Home.vue").default,
      name: "Home",
      meta: {
        requiresAuth: true,
      },
      children: [
        //#region Dashboard
        {
          path: "dashboard",
          component: require("../components/dashboard/Dashboard.vue").default,
          name: "Dashboard",
          meta: {
            requiresAuth: true,
          },
        },
        //#region Master

        {
          path: "master/competition/competition-type",
          component: require("../components/master/comp_type/CompetitionType.vue")
            .default,
          name: "Type",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "master/comp_master/competition-master",
          component: require("../components/master/comp_master/CompetitionMaster.vue")
            .default,
          name: "Master",
          meta: {
            requiresAuth: true,
          },
        },
        {
            path: "master/device/device",
            component: require("../components/master/device/Device.vue")
              .default,
            name: "Device",
            meta: {
              requiresAuth: true,
            },  
        },
        {
          path: "master/roles/roles",
          component: require("../components/master/roles/Roles.vue")
            .default,
          name: "Roles",
          meta: {
            requiresAuth: true,
          },  
        },
        {
          path: "master/users/users",
          component: require("../components/master/users/Users.vue")
            .default,
          name: "Users",
          meta: {
            requiresAuth: true,
          },  
        },
        {
          path: "master/permissions/permissions",
          component: require("../components/master/permissions/Permissions.vue")
            .default,
          name: "Permissions",
          meta: {
            requiresAuth: true,
          },  
        },

        //#endregion

        {
          path: "reports/bookingDetails/booking-details",
          component:
            require("../components/reports/bookingDetails/BookingDetails.vue")
              .default,
          name: "Area",
          meta: {
            requiresAuth: true,
          },
        },

        {
          path: "reports/clinicBookingDetails/clinic-booking-details",
          component:
            require("../components/reports/clinicBookingDetails/ClinicBookingDetails.vue")
              .default,
          name: "Area",
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "reports/upcomingClinicBookingDetails/upcoming-clinic-booking-details",
          component:
            require("../components/reports/upcomingClinicBookingDetails/UpcomingClinicBookingDetails.vue")
              .default,
          name: "Area",
          meta: {
            requiresAuth: true,
          },
        },

        //#endregion

        ,
      ],
    },
    {
      path: "*",
      component: require("../components/NotFound.vue").default,
    },
  ],
});

router.beforeEach((to, from, next) => {
  console.log(secureLS.get(Global.tokenKey));
  try {
    //* Check if the route requires authentication & user not logged in
    if (
      to.matched.some((route) => route.meta.requiresAuth) &&
      secureLS.get(Global.tokenKey) == ""
    ) {
      next({
        name: "Login",
      });
      return;
    }

    //* if logged in redirect to dashboard
    if (to.path === "/login" && secureLS.get(Global.tokenKey) != "") {
      next({
        name: "Dashboard",
      });
      return;
    }
    next();
  } catch (err) {
    secureLS.removeAll();
    router.push({ name: "Login" });
  }
});
export default router;
