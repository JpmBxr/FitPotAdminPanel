import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const roles = {
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
          text: "Name",
          value: "name",
          width: "25%",
          sortable: true,
          align: "start",
        },

        {
          text: "Status",
          value: "is_role_active",
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
      entity: "Roles",
      // search
      searchText: "",
      // add edit

      totalItemsInDB: 0,
      item: {},
      addEditDialog: false,
      isFormAddEditValid: false,
      isAddEdit: true,
      addUpdateButtonText: "Add Roles",
      addEditText: "Add",
      isLoaderActive: false,
      isDialogLoaderActive: false,

      tableItems: [],
      activityItems: [],
      categoryItems: [],
      tableDataLoading: false,

      //end

      //excel
      excelFields: {
        Id: "id",
        Name: "name",
        Role_Status: "is_role_active",
      },
      excelFileName:
        "Roles" + "_" + moment().format("DD/MM/YYYY") + ".xls",
     
      //end
    };
  },
  //#endregion
  //#region  created section
  created() {
    //#region  Web Get Roles list
    this.getRolesList();
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
        this.getRolesList();
      },
      deep: true,
    },
    //#endregion
  },
  //#endregion

  //#region Method section
  methods: {
    //#region To Web Get Roles List
    getRolesList() {
      this.tableDataLoading = true;
      let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
      sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
      sortBy = sortBy.length == 0 ? `id` : sortBy[0];
      ApiService.get(ApiEndPoint.Roles.webGetRoles, {
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
        this.getRolesList();
      }, 500);
    },

    //#endregion

    //#region  show add/edit dialog
    showAddEditDialog(passedItem) {
      if (passedItem == null && this.isAddEdit == true) {
        this.addEditText = `Add  ${this.entity}`;
        this.addEditDialog = true;
        this.addUpdateButtonText = " Add ";
      } else {
        this.item = Object.assign({}, passedItem);
        this.addEditText = `Edit ${this.entity} : ` + passedItem.name;
        this.addEditDialog = true;
        this.addUpdateButtonText = "Update";
      }
    },

    //#endregion

    //#region  add/edit item
    addEditItem() {
      if (this.$refs.holdingFormAddEdit.validate()) {
        if (this.isAddEdit) {
          // save

          this.isDialogLoaderActive = true;
          ApiService.post(ApiEndPoint.Roles.webSaveRoles, {
            roleName: this.item.roleName,
          
          })
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.result == "success") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getRolesList();
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
          ApiService.post(ApiEndPoint.Roles.webUpdateRoles, {
            id: this.item.id,
            roleName: this.item.roleName,
            
          })
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.result == "success") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getRolesList();
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
        `Change  ${this.entity} : ${passedItem.name} Status`,
        "Are you sure to change the status",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;

        ApiService.post(
          ApiEndPoint.Roles.webChangeRoleStatus,
          {
            id: passedItem.id,
            is_role_active: passedItem.is_role_active,

          }
        )
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.result == "success") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getRolesList();
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
        if (passedItem.is_role_active == false) {
          passedItem.is_role_active = true;
        } else {
          passedItem.is_role_active = false;
        }
      }
    },
    //#endregion

    //#region Delete Item
    async deleteItem(passedItem) {
      const result = await Global.showConfirmationAlert(
        `Delete ${this.entity} ${passedItem.name}`,
        "Are you sure to delete",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;
        ApiService.post(ApiEndPoint.Roles.webDeleteRoles, {
          id: passedItem.id,
        })
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.result == "success") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getRolesList();
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
