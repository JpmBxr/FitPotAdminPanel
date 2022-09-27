export const ApiEndPoint = {
  // #region Authentication Api End Point
  Authentication: {
    login: "webLogin",
    logout: "logout",
    changePassword: "changePassword",
  },
  // #endregion

  //#region  User End point
  // User: {
  //   getUser: "users",
  //   saveUser: "save",
  // },
  //#endregion

  //#region  Competition End point
  CompetitionType: {
    webGetCompetitionActivityWithoutPagination: "webGetCompetitionActivityWithoutPagination",
    webGetCompetitionCategoryWithoutPagination: "webGetCompetitionCategoryWithoutPagination",
    webGetCompetitionType: "webGetCompetitionType",
    webSaveCompetitionType: "webSaveCompetitionType",
    webUpdateCompetitionType: "webUpdateCompetitionType",
    webChangeCompetitionTypeStatus: "webChangeCompetitionTypeStatus",
    webDeleteCompetitionType: "webDeleteCompetitionType",
  },
  //#endregion
  //#region  Competition Master End point
  CompetitionMaster: {
    webGetCompetitionActivityWithoutPagination: "webGetCompetitionActivityWithoutPagination",
    webGetCompetitionCategoryWithoutPagination: "webGetCompetitionCategoryWithoutPagination",
    webGetCompetitionTypeWithoutPagination: "webGetCompetitionTypeWithoutPagination",
    webGetWeekdayWithoutPagination: "webGetWeekdayWithoutPagination",
    webGetCompetitionMaster: "webGetCompetitionMaster",
    webSaveCompetitionMaster: "webSaveCompetitionMaster",
    webUpdateCompetitionMaster: "webUpdateCompetitionMaster",
    webChangeCompetitionMasterStatus: "webChangeCompetitionMasterStatus",
    webDeleteCompetitionMaster: "webDeleteCompetitionMaster",
  },
  //#endregion
  //#region Devices
  Devices:{
    getDevices: "getDevices",
    saveDevices: "saveDevices",
    updateDevices:"updateDevices",
    changeDeviceStatus: "changeDeviceStatus",
    changeDeviceAuthStatus:"changeDeviceAuthStatus",
    deleteDevices: "deleteDevices",
  },
  //#endregion
  //#region Roles
  Roles:{
    webGetRoles: "webGetRoles",
    webSaveRoles: "webSaveRoles",
    webUpdateRoles:"webUpdateRoles",
    webChangeRoleStatus: "webChangeRoleStatus",
    webDeleteRoles: "webDeleteRoles",
  },
  //#endregion
  //#region User
  Users:{
    webGetRolesWithoutPagination: "webGetRolesWithoutPagination",
    getUsers: "getUsers",
    saveUsers: "saveUsers",
    updateUsers:"updateUsers",
    changeUsersStatus: "changeUsersStatus",
    deleteUsers: "deleteUsers",
  },
  //#endregion
  //#region Permissions
  Permissions:{
    getAllPermissions: "getAllPermissions",
    savePermissions: "savePermissions",
    updatePermissions:"updatePermissions",
    deletePermissions: "deletePermissions",
  },
  //#endregion

  //#region  Area End point
  BookingDetails: {
    getBookingDetails: "getBookingDetails",
    clinicWiseBooking: "clinicWiseBooking",
    upcomingBookingDetails: "upcomingBookingDetails",
  },
  //#endregion
};
