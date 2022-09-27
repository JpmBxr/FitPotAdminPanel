import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const competitionType = {
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
          text: "Competition Type",
          value: "comp_type_name",
          width: "25%",
          sortable: true,
          align: "start",
        },
        {
          text: "Activity",
          value: "comp_activity_name",
          width: "25%",
          sortable: true,
          align: "start",
        },
        {
          text: "Category",
          value: "comp_category_name",
          width: "25%",
          sortable: true,
          align: "start",
        },

        {
          text: "Status",
          value: "comp_type_status",
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
      entity: "Type",
      // search
      searchText: "",
      // add edit

      totalItemsInDB: 0,
      item: {},
      addEditDialog: false,
      isFormAddEditValid: false,
      isAddEdit: true,
      addUpdateButtonText: "Add Type",
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
        CompetitionType: "comp_type_name",
        Activity: "comp_activity_name",
        Category: "comp_category_name",
        Status: "comp_type_status",
      },
      excelFileName:
        "Type" + "_" + moment().format("DD/MM/YYYY") + ".xls",
     
      //end
    };
  },
  //#endregion
  //#region  created section
  created() {
    //get comp type list
    this.getCompetitionTypeList();
    
  },
  //#endregion

  //#region 
  mounted() {
    this.getActivity();
    this.getCategory();
    
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
        this.getCompetitionTypeList();
      },
      deep: true,
    },
    //#endregion
  },
  //#endregion

  //#region Method section
  methods: {
    //#region To get the comp type
    getCompetitionTypeList() {
      this.tableDataLoading = true;
      let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
      sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
      sortBy = sortBy.length == 0 ? `comp_type_id` : sortBy[0];
      ApiService.get(ApiEndPoint.CompetitionType.webGetCompetitionType, {
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
        this.getCompetitionTypeList();
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
        this.addEditText = `Edit ${this.entity} : ` + passedItem.comp_type_name;
        this.addEditDialog = true;
        this.addUpdateButtonText = "Update";
        this.getCategory();
      }
    },
    //#endregion

    //#region  to load activity
    getActivity() {
      this.isDialogLoaderActive = true;
      ApiService.get(
        ApiEndPoint.CompetitionType.webGetCompetitionActivityWithoutPagination,
        {}
      )
        .then((response) => {
          this.isDialogLoaderActive = false;
          this.activityItems = response.data.resultData;
        })
        .catch((error) => {
          this.isDialogLoaderActive = false;
          if (error.response.status != 401 && error.response.status != 403) {
            this.showErrorAlert(true, "error", "Something went wrong");
          }
        });
    },
    //#endregion

    //#region  to load category
    getCategory() {
      this.isDialogLoaderActive = true;
      ApiService.get(
        ApiEndPoint.CompetitionType.webGetCompetitionCategoryWithoutPagination,
        { comp_activity_id: this.item.comp_activity_id }
      )
        .then((response) => {
          this.isDialogLoaderActive = false;
          this.categoryItems = response.data.resultData;
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
          ApiService.post(ApiEndPoint.CompetitionType.webSaveCompetitionType, {
            comp_category_id: this.item.comp_category_id,
            comp_activity_id: this.item.comp_activity_id,
            comp_type_name: this.item.comp_type_name,
            comp_type_created_by: secureLS.get(Global.userId),
          })
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.success == "true") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getCompetitionTypeList();
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
          ApiService.post(ApiEndPoint.CompetitionType.webUpdateCompetitionType, {
            comp_type_id: this.item.comp_type_id,
            comp_category_id: this.item.comp_category_id,
            comp_activity_id: this.item.comp_activity_id,
            comp_type_name: this.item.comp_type_name,
            comp_type_updated_by: secureLS.get(Global.userId),
          })
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.success == "true") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getCompetitionTypeList();
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
        `Change  ${this.entity} : ${passedItem.comp_type_name} Status`,
        "Are you sure to change the status",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;

        ApiService.post(
          ApiEndPoint.CompetitionType.webChangeCompetitionTypeStatus,
          {
            Id: passedItem.comp_type_id,
            comp_type_status: passedItem.comp_type_status,
          }
        )
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.success == "true") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getCompetitionTypeList();
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
        if (passedItem.comp_type_status == false) {
          passedItem.comp_type_status = true;
        } else {
          passedItem.comp_type_status = false;
        }
      }
    },
    //#endregion

    //#region Delete Item
    async deleteItem(passedItem) {
      const result = await Global.showConfirmationAlert(
        `Delete ${this.entity} ${passedItem.comp_type_name}`,
        "Are you sure to delete",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;
        ApiService.post(ApiEndPoint.CompetitionType.webDeleteCompetitionType, {
          comp_type_id: passedItem.comp_type_id,
        })
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.success == "true") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getCompetitionTypeList();
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
