import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const users = {
  props: ["userPermissionDataProps"],
  mixins: [globalMixin],
  //#region  Data section
  data() {
    return {
      // Data Table
      tableLoadingDataText: "Loading data",
      tableHeader: [
        {
          text: "#",
          value: "index",
          width: "5%",
          sortable: false,
          align: "start",
        },
        {
          text: "Role",
          value: "role",
          width: "25%",
          sortable: true,
          align: "start",
        },
        {
          text: "Mobile",
          value: "user_mobile",
          width: "25%",
          sortable: true,
          align: "start",
        },
        {
          text: "Full Name",
          value: "user_full_name",
          width: "25%",
          sortable: true,
          align: "start",
        },

        {
          text: "Status",
          value: "user_status",
          sortable: false,
          width: "5%",
          align: "start",
        },

        {
          text: "Actions",
          value: "actions",
          sortable: false,
          width: "25%",
          align: "end",
        },
      ],

      pagination: {},
      entity: "Users",
      // search
      searchText: "",
      // add edit

      totalItemsInDB: 0,
      item: {},
      addEditDialog: false,
      isFormAddEditValid: false,
      isAddEdit: true,
      addUpdateButtonText: "Add Users",
      addEditText: "Add",
      isLoaderActive: false,
      isDialogLoaderActive: false,

      tableItems: [],
      userTypeItems: [],
      tableDataLoading: false,

      //end

      //excel
      excelFields: {
        Role: "role",
        User_mobile: "user_mobile",
        User_full_Name: "user_full_name",
        User_Status: "user_status",
      },
      excelFileName:
        "Users" + "_" + moment().format("DD/MM/YYYY") + ".xls",

      //end
    };
  },
  //#endregion
  //#region  created section
  created() {
    //#region get User List
    this.getUsersList();
    //#endregion
  },
  //#endregion
  //#region Computed section
  computed: {
    //#region  Numbering data table row
    dataTableRowNumbering() {
      return this.tableItems.map((items, index) => ({
        ...items,
        index: index + 1,
      }));
    },
    //#endregion
  },
  //#endregion
  //#region watch setion
  watch: {
    //#region  add/edit dialog
    addEditDialog(value) {
      return value ? true : this.close();
    },
    //#endregion
    //#region Pagination
    pagination: {
      handler() {
        this.getUsersList();
      },
      deep: true,
    },
    //#endregion
  },
  //#endregion

  mounted() {
    this.webGetRoles();
  },
  //#region Method section
  methods: {
    //#region To get User List
    getUsersList() {
      this.tableDataLoading = true;
      let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
      sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
      sortBy = sortBy.length == 0 ? `user_id` : sortBy[0];
      ApiService.get(ApiEndPoint.Users.webGetUsers, {
        itemsPerPage: itemsPerPage,
        sortColumn: sortBy,
        sortOrder: sortDesc,
        page: page,
        searchText: this.searchText,
      })
        .then((response) => {
          this.tableDataLoading = false;

          this.tableItems = response.data.resultData.data;
          console.log(response);
          this.totalItemsInDB = response.data.resultData.total;
        })
        .catch((error) => {
          this.tableDataLoading = false;
          if (error.response.status != 401 && error.response.status != 403) {
            this.showErrorAlert(true, "error", "Something went wrong");
          }
        });
    },

    //#endregion

    //#region  search
    searchInfo() {
      clearTimeout(this._timerId);
      this._timerId = setTimeout(() => {
        this.getUsersList();
      }, 500);
    },

    //#endregion

    //#region  show add/edit dialog
    showAddEditDialog(passedItem) {

      //Add
      if (passedItem == null && this.isAddEdit == true) {
        this.addEditText = `Add  ${this.entity}`;
        this.addEditDialog = true;
        this.addUpdateButtonText = " Add ";
      } else {
        //Update
        const [user_first_name, user_last_name] = passedItem?.user_full_name?.split(" ");
        const UserType = this.userTypeItems.find(u => u?.name.toLowerCase() === passedItem?.role.toLowerCase()).id;
        this.item = Object.assign({}, { ...passedItem, user_first_name, user_last_name, UserType });
        this.addEditText = `Edit ${this.entity} : ` + passedItem.comp_type_name;
        this.addEditDialog = true;
        this.addUpdateButtonText = "Update";

      }
    },

    //#endregion   

    //#region  to load Web Get Roles
    webGetRoles() {
      this.isDialogLoaderActive = true;
      ApiService.get(
        ApiEndPoint.Users.webGetRolesWithoutPagination,
        {}
      )
        .then((response) => {
          this.isDialogLoaderActive = false;
          this.userTypeItems = response.data.resultData;
        })
        .catch((error) => {
          this.isDialogLoaderActive = false;
          if (error.response.status != 401 && error.response.status != 403) {
            this.showErrorAlert(true, "error", "Something went wrong");
          }
        });
    },
    //#endregion

    //#region  add/edit item
    addEditItem() {
      if (this.$refs.holdingFormAddEdit.validate()) {
        if (this.isAddEdit) {
          // save

          this.isDialogLoaderActive = true;
          ApiService.post(ApiEndPoint.Users.webSaveUsers, {
            UserType: this.item.UserType,
            user_mobile: this.item.user_mobile,
            user_email: this.item.user_email,
            user_first_name: this.item.user_first_name,
            user_last_name: this.item.user_last_name,
            user_age: this.item.user_age,
          })
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.result == "success") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getUsersList();
              } else if (response.data.result == "error") {
                Global.showErrorAlert(true, "error", response.data.message);
              }
            })
            .catch((error) => {
              this.isDialogLoaderActive = false;

              if (
                error.response.status != 401 ||
                error.response.status != 403
              ) {
                Global.showErrorAlert(true, "error", "Something went wrong");
              }
            });
        } else {
          //update

          this.isDialogLoaderActive = true;
          ApiService.post(ApiEndPoint.Users.webUpdateUsers, {

            UserType: this.item.UserType,
            user_mobile: this.item.user_mobile,
            user_email: this.item.user_email,
            user_first_name: this.item.user_first_name,
            user_last_name: this.item.user_last_name,
            user_age: this.item.user_age,
            user_id: this.item.user_id,
          })
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.result == "success") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getUsersList();
              } else if (response.data.result == "error") {
                Global.showErrorAlert(true, "error", response.data.message);
              }
            })
            .catch((error) => {
              this.isDialogLoaderActive = false;
              if (
                error.response.status != 401 ||
                error.response.status != 403
              ) {
                Global.showErrorAlert(true, "error", "Something went wrong");
              }
            });
        }
      }
    },

    //#endregion

    //#region  to close the dialog
    close() {
      this.addEditDialog = false;
      setTimeout(() => {
        this.item = Object.assign({}, {});
      }, 300);
    },
    //#endregion

    //#region  enable disable
    async enableDisableItem(passedItem) {
      const result = await Global.showConfirmationAlert(
        `Change  ${this.entity} : ${passedItem.role} Status`,
        "Are you sure to change the status",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;

        ApiService.post(
          ApiEndPoint.Users.webChangeUsersStatus,
          {
            user_id: passedItem.user_id,
            user_status: passedItem.user_status,
          }
        )
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.result == "success") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getUsersList();
            } else if (response.data.result == "error") {
              Global.showErrorAlert(true, "error", response.data.message);
            }
          })
          .catch((error) => {
            this.isLoaderActive = false;

            if (error.response.status != 401 || error.response.status != 403) {
              Global.showErrorAlert(true, "error", "Something went wrong");
            }
          });
      } else {
        if (passedItem.user_status == false) {
          passedItem.user_status = true;
        } else {
          passedItem.user_status = false;
        }
      }
    },

    //#endregion

    //#region Delete Item
    async deleteItem(passedItem) {
      const result = await Global.showConfirmationAlert(
        `Delete ${this.entity} ${passedItem.role}`,
        "Are you sure to delete",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;
        ApiService.post(ApiEndPoint.Users.webDeleteUsers, {
          user_id: passedItem.user_id,
        })
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.success == "true") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getUsersList();
            } else if (response.data.result == "error") {
              Global.showErrorAlert(true, "error", response.data.message);
            }
          })
          .catch((error) => {
            this.isLoaderActive = false;

            if (error.response.status != 401 || error.response.status != 403) {
              Global.showErrorAlert(true, "error", "Something went wrong");
            }
          });
      }
    },

    //#endregion
  },
  //#endregion
};
