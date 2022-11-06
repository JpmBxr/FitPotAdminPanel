export const globalMixin = {
  data() {
    return {
       //Field is required
      validationRulesRequired: [
        (v) =>
          (Array.isArray(v) && v.length === 0) || !v
            ? "Field is required"
            : null,
      ],
      // mobile is required
      validationRulesMobile: [
        (v) => !!v || "Provide valid Mobile number",
        (v) => /^(\d{10})$/.test(v) || "Mobile number must be of 10 digits",
        (v) =>
          /^[6-9]\d{9}$/.test(v) || "Mobile number must start with 6/7/8/9",
      ],
      // mobile is optional
      validationRules_alternatecontact: [
        (v) => {
          if (v) {
            return /^(\d{10})$/.test(v) || "Mobile number must be of 10 digits";
          } else {
            return true;
          }
        },
      ],
      //Email is required
      validationRules_email: [
        (v) => !!v || "Email is required",
        (v) =>
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Please provide a valid email",
      ],
      //Email is optional
      validationRules_optionalemail: [
        (v) => {
          if (v) {
            return (
              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
              "Please provide a valid Email"
            );
          } else {
            return true;
          }
        },
      ],
      //Zip Codeis optional
      validationRules_zipCodeWithMax6Char: [
        (v) => !!v || "Please provide a valid Zip Code",
        (v) => /^(\d{6})$/.test(v) || "Zip Code must be of 6 digits",
      ],

      validationRules_otpWithMax6Char: [
        (v) => !!v || "Provide valid OTP",
        (v) => /^(\d{6})$/.test(v) || "OTP must be of 6 characters",
      ],
    };
  },
  methods: {
    // #region Accept digit
    acceptDigit(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    
    // #region accept Not Character 
    acceptNotCharacter(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode  ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    // #endregion

    // #region Accept charcter with space
    acceptCharacterWithSpace(evt) {
      var regex = new RegExp("^[a-zA-z ]+$");
      var key = String.fromCharCode(!evt.charCode ? evt.which : evt.charCode);
      if (!regex.test(key)) {
        evt.preventDefault();
        return false;
      }
    },
    // #endregion
    
  },
};
