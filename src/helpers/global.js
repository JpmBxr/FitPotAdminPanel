import Swal from "sweetalert2";
export const Global = {
  // #region Urls
  appBaseUrl: "https://fitpot.dreamplesk.com/public/api/",
  profileImageUrl:
    "https://fitpot.dreamplesk.com/public/storage/profile_images/",

  // #endregion

  getBaseUrl() {
    return this.appBaseUrl;
  },
  // #endregion

  // #region Error alert
  showErrorAlert(isToast, icon, text) {
    let content = "<strong><font color='white'>" + text + "</font></strong>";
    Swal.fire({
      toast: isToast,
      position: "top-end",
      icon: icon,
      html: content,
      iconColor: "white",
      showConfirmButton: false,
      timer: 3500,
      background: "red",
    });
  },
  // #endregion

  // #region Success alert
  showSuccessAlert(isToast, icon, text) {
    var content = "<strong><font color='white'>" + text + "</font></strong>";
    Swal.fire({
      toast: isToast,
      position: "top-end",
      icon: icon,
      html: content,
      iconColor: "white",
      showConfirmButton: false,
      timer: 3500,
      background: "green",
    });
  },
  // #endregion

  // #region Confirmation alert
  async showConfirmationAlert(title, text, icon) {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    });
  },
  //#endregion
  //#region  generate random passwotd
  generatePassword() {
    var length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  },
  //#endregion
  // #region All Keys
  tokenKey: "tokenKey",
  firstName: "firstName",
  lastName: "lastName",
  fullName: "fullName",
  profileImage: "profileImage",
  userId: "userId",
  companyName: "FitPot",
  poweredBy: "FitPot | Copyright © 2021 - 2022 | Powered by Logic N Mind",
  // #endregion
};
