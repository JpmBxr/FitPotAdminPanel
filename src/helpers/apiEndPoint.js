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
    webGetDevices: "webGetDevices",
    webSaveDevices: "webSaveDevices",
    webUpdateDevices: "webUpdateDevices",
    webChangeDeviceStatus: "webChangeDeviceStatus",
    webChangeDeviceAuthStatus:"webChangeDeviceAuthStatus",
    webDeleteDevices: "webDeleteDevices",
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
    
    webGetUsers: "webGetUsers",
    webSaveUsers: "webSaveUsers",
    webUpdateUsers: "webUpdateUsers",
    webDeleteUsers: "webDeleteUsers",
    webChangeUsersStatus: "webChangeUsersStatus",
    webGetRolesWithoutPagination: "webGetRolesWithoutPagination",
  },
  //#endregion
  //#region Permissions
  Permissions:{
    webGetAllPermissions: "webGetAllPermissions",
    webSavePermissions: "webSavePermissions",
    webUpdatePermissions: "webUpdatePermissions",
    webDeletePermissions: "webDeletePermissions",
  },
  //#endregion

  //#region  Report
  UsereDetails: {
    webGetUserReport: "webGetUserReport",
  },

  SubscribedUser: {
    webGetSubscribedUserReport: "webGetSubscribedUserReport",
  },

  UserWiseComepetition: {
    webGetUserWiseComepetitionReport: "webGetUserWiseComepetitionReport",
  },

  UserDeviceData: {
    webGetUserDeviceDataReport: "webGetUserDeviceDataReport",
    webGetUserWithoutPagination: "webGetUserWithoutPagination",
  },
  //#endregion
};
