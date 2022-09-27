import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const permissions = {
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
          text: "Module Name",
          value: "module_name",
          sortable: false,
          width: "25%",
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
      entity: "Permissions",
      // search
      searchText: "",
      // add edit

      totalItemsInDB: 0,
      item: {},
      addEditDialog: false,
      isFormAddEditValid: false,
      isAddEdit: true,
      addUpdateButtonText: "Add Permissions",
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
        Name: "name",
        Module_Name: "module_name",
    
        
      },
      excelFileName:
        "Permissions" + "_" + moment().format("DD/MM/YYYY") + ".xls",
     
      //end
    };
  },
  //#endregion
  //#region  created section
  created() {
    //#region  get All Permissions list
    this.getAllPermissions();
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
        this.getAllPermissions();
      },
      deep: true,
    },
    //#endregion
  },
  //#endregion

  //#region Method section
  methods: {
    //#region To get All Permissions
    getAllPermissions() {
      this.tableDataLoading = true;
      let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
      sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
      sortBy = sortBy.length == 0 ? `id` : sortBy[0];
      ApiService.get(ApiEndPoint.Permissions.getAllPermissions, {
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
        this.getAllPermissions();
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
          ApiService.post(ApiEndPoint.Permissions.savePermissions, {
            name: this.item.name,
          
          })
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.success == "true") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getAllPermissions();
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
          ApiService.post(ApiEndPoint.Permissions.updatePermissions, {
            id: this.item.id,
            name: this.item.name,
            
          })
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.success == "true") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getAllPermissions();
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

    //#region Delete Item
    async deleteItem(passedItem) {
      const result = await Global.showConfirmationAlert(
        `Delete ${this.entity} ${passedItem.name}`,
        "Are you sure to delete",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;
        ApiService.post(ApiEndPoint.Permissions.deletePermissions, {
          id: passedItem.id,
        })
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.success == "true") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getAllPermissions();
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
