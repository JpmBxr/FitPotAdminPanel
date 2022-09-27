import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const competitionMaster = {
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
          text: "Competition Master",
          value: "comp_master_name",
          width: "15%",
          sortable: true,
          align: "start",
        },
        {
          text: "Competition Type",
          value: "comp_type_name",
          width: "12%",
          sortable: true,
          align: "start",
        },
        {
          text: "Activity",
          value: "comp_activity_name",
          width: "10%",
          sortable: true,
          align: "start",
        },
        {
          text: "Category",
          value: "comp_category_name",
          width: "10%",
          sortable: true,
          align: "start",
        },
        {
          text: "Days",
          value: "comp_master_days",
          width: "10%",
          sortable: true,
          align: "start",
        },
        {
          text: "Min Km Per Days",
          value: "comp_master_minimum_km_per_day",
          width: "12%",
          sortable: true,
          align: "start",
        },
        {
          text: "Total Km",
          value: "comp_master_total_km",
          width: "10%",
          sortable: true,
          align: "start",
        },
        {
          text: "Status",
          value: "comp_master_status",
          sortable: false,
          width: "8%",
          align: "start",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          width: "12%",
          align: "end",
        },
      ],

      pagination: {},
      entity: "Master",
      searchText: "", // search
      totalItemsInDB: 0,
      item: {},
      addEditDialog: false,
      isFormAddEditValid: false,
      isAddEdit: true,
      addUpdateButtonText: "Add Master",
      addEditText: "Add",
      isLoaderActive: false,
      isDialogLoaderActive: false,

      tableItems: [],
      activityItems: [],
      categoryItems: [],
      weekDayItems: [],
      restDayItems: [],
      competitionTypeItems: [],
      tableDataLoading: false,

      //end

      //excel
      excelFields: {
        CompetitionMaster: "comp_master_name",
        CompetitionType: "comp_type_name",
        Activity: "comp_activity_name",
        Category: "comp_category_name",
        Days: "comp_master_days",
        Min_Km_Per_Days: "comp_master_minimum_km_per_day",
        Total_Km: "comp_master_total_km",
        Status: "comp_type_status",
      },
      excelFileName: "Master" + "_" + moment().format("DD/MM/YYYY") + ".xls",
      //end
    };
  },
  //#endregion

  //#region  created section
  created() {
    //  get the Competition Master Details
    this.getCompetitionMasterList();
  },
  //#endregion

  //#region Computed section
  computed: {
    // For numbering the Data Table Rows
    dataTableRowNumbering() {
      return this.tableItems.map((items, index) => ({
        ...items,
        index: index + 1,
      }));
    },
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
        this.getCompetitionMasterList();
      },
      deep: true,
    },
    //#endregion
  },
  //#endregion

  //#region loading activity, week days, rest day on page load/ mount
   mounted() {
    // Show Add in dialog
    this.getActivity();
     this.getWeekDay();
     this.getRestDay();
  },
  //#endregion

  //#region Method section
  methods: {
    //#region To get the Competition Master List Details
    getCompetitionMasterList() {
      this.tableDataLoading = true;
      let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
      sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
      sortBy = sortBy.length == 0 ? `comp_master_id` : sortBy[0];
      ApiService.get(ApiEndPoint.CompetitionMaster.webGetCompetitionMaster, {
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
        this.getCompetitionMasterList();
      }, 500);
    },
    //#endregion

    //#region  show add/edit dialog
     showAddEditDialog(item) {
      // Show Add
      if (item == null && this.isAddEdit == true) {
        this.addEditText = `Add ${this.entity}`;
        this.addEditDialog = true;
        this.addUpdateButtonText = " Add ";
      } else {
        // Show Edit (Update)
        const comp_master_start_day = this.weekDayItems
          .filter((w) =>
            item?.comp_master_start_day.split(",").includes(String(w.id))
          )
          .map((d) => d);
        const comp_master_rest_day = this.restDayItems
          .filter((w) =>
            item?.comp_master_rest_day.split(",").includes(String(w.id))
          )
          .map((d) => d);
        this.item = {
          ...item,
          comp_master_start_day,
          comp_master_rest_day,
        };
        this.addEditText = `Edit ${this.entity} : ` + item.comp_master_name;
        this.addEditDialog = true;
        this.addUpdateButtonText = "Update";
       this.getCategory();
       this.getCompetitionType();
       

      }
    },
    //#endregion

    //#region  to load activity
    getActivity() {
      this.isDialogLoaderActive = true;
      ApiService.get(
        ApiEndPoint.CompetitionMaster
          .webGetCompetitionActivityWithoutPagination,
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
        ApiEndPoint.CompetitionMaster
          .webGetCompetitionCategoryWithoutPagination,
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

    //#region  to load Competition Type
    getCompetitionType() {
      this.isDialogLoaderActive = true;
      ApiService.get(
        ApiEndPoint.CompetitionMaster.webGetCompetitionTypeWithoutPagination,
        {
          comp_category_id: this.item.comp_category_id,
          comp_activity_id: this.item.comp_activity_id,
        }
      )
        .then((response) => {
          this.isDialogLoaderActive = false;
          this.competitionTypeItems = response.data.resultData;
        })
        .catch((error) => {
          this.isDialogLoaderActive = false;
          if (error.response.status != 401 && error.response.status != 403) {
            this.showErrorAlert(true, "error", "Something went wrong");
          }
        });
    },
    //#endregion

    //#region  to load Week Day
    async getWeekDay() {
      this.isDialogLoaderActive = true;
      try {
        const response = ApiService.get(
          ApiEndPoint.CompetitionMaster.webGetWeekdayWithoutPagination,
          {}
        );
        this.weekDayItems = response.data.resultData;
        this.isDialogLoaderActive = false;
      } catch (error) {
        this.isDialogLoaderActive = false;
        if (error.response.status != 401 && error.response.status != 403) {
          this.showErrorAlert(true, "error", "Something went wrong");
        }
      }
    },
    //#endregion

    //#region  to load Rest Day
    async getRestDay() {
      this.isDialogLoaderActive = true;
      try {
        const response = ApiService.get(
          ApiEndPoint.CompetitionMaster.webGetWeekdayWithoutPagination,
          {}
        );
        this.restDayItems = response.data.resultData;
        console.log("------->", response.data.resultData );
        this.isDialogLoaderActive = false;
      } catch (error) {
        this.isDialogLoaderActive = false;
        if (error.response.status != 401 && error.response.status != 403) {
          this.showErrorAlert(true, "error", "Something went wrong");
        }
      }
    },
    //#endregion

    //#region  add/edit item
    addEditItem() {
      if (this.$refs.holdingFormAddEdit.validate()) {
        if (this.isAddEdit) {
          // save
          this.isDialogLoaderActive = true;
          ApiService.post(
            ApiEndPoint.CompetitionMaster.webSaveCompetitionMaster,
            {
              comp_master_name: this.item.comp_master_name,
              comp_master_days: this.item.comp_master_days,
              comp_master_total_km: this.item.comp_master_total_km,
              comp_master_minimum_km_per_day:
                this.item.comp_master_minimum_km_per_day,
              comp_master_max_participant:
                this.item.comp_master_max_participant,
              comp_master_min_participant:
                this.item.comp_master_min_participant,
              comp_master_pot_value: this.item.comp_master_pot_value,
              comp_master_created_by: this.item.comp_master_created_by,
              comp_master_status: this.item.comp_master_status,
              comp_activity_id: this.item.comp_activity_id,
              comp_category_id: this.item.comp_category_id,
              comp_type_id: this.item.comp_type_id,
              daily_loyalty_point: this.item.daily_loyalty_point,
              achievers_loyalty_point: this.item.achievers_loyalty_point,
              comp_master_per_partition_value:
                this.item.comp_master_per_partition_value,
              comp_master_start_day: this.item.comp_master_start_day.toString(),
              comp_master_rest_day: this.item.comp_master_rest_day.toString(),
              comp_master_created_by: 1,
              comp_master_status: 1,
            }
          )
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
          ApiService.post(
            ApiEndPoint.CompetitionMaster.webUpdateCompetitionMaster,
            {
              comp_master_name: this.item.comp_master_name,
              comp_master_days: this.item.comp_master_days,
              comp_master_total_km: this.item.comp_master_total_km,
              comp_master_minimum_km_per_day:
                this.item.comp_master_minimum_km_per_day,
              comp_master_max_participant:
                this.item.comp_master_max_participant,
              comp_master_min_participant:
                this.item.comp_master_min_participant,
              comp_master_pot_value: this.item.comp_master_pot_value,
              comp_master_created_by: this.item.comp_master_created_by,
              comp_master_status: this.item.comp_master_status,
              comp_activity_id: this.item.comp_activity_id,
              comp_category_id: this.item.comp_category_id,
              comp_type_id: this.item.comp_type_id,
              daily_loyalty_point: this.item.daily_loyalty_point,
              achievers_loyalty_point: this.item.achievers_loyalty_point,
              comp_master_per_partition_value:
                this.item.comp_master_per_partition_value,

            //     "city_id",
            // typeof this.item.city_id === "object"
            //   ? this.item.city_id.map((d) => d.city_id).join(",")
            //   : this.item.city_id !== null
            //   ? this.item.city_id
            //   : null

              comp_master_start_day: this.item.comp_master_start_day.map((d) => d.city_id).join(","),
              comp_master_rest_day: this.item.comp_master_rest_day.map((d) => d.city_id).join(","),

              comp_master_id: this.item.comp_master_id,
              comp_master_created_by: 1,
              comp_master_status: 1,
            }
          )
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
        this.item = Object.assign(
          {},
          {
            activityItems: this.activityItems,
            weekDayItems: this.weekDayItems,
            restDayItems: this.restDayItems,
          }
        );
      }, 300);
    },
    //#endregion

    //#region  enable disable
    async enableDisableItem(passedItem) {
      const result = await Global.showConfirmationAlert(
        `Change  ${this.entity} : ${pasedItem.comp_master_name} Status`,
        "Are you sure to change the status",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;

        ApiService.post(
          ApiEndPoint.CompetitionMaster.webChangeCompetitionMasterStatus,
          {
            Id: item.comp_master_id,
            comp_master_status: item.comp_master_status,
          }
        )
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.success == "true") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getCompetitionMasterList();
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
        `Delete ${this.entity} ${passedItem.comp_master_name}`,
        "Are you sure to delete",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;
        ApiService.post(
          ApiEndPoint.CompetitionMaster.webDeleteCompetitionMaster,
          {
            comp_master_id: passedItem.comp_master_id,
          }
        )
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.success == "true") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getCompetitionMasterList();
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
