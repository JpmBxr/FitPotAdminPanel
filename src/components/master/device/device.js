import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const device = {
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
          text: "Device Name",
          value: "device_name",
          width: "15%",
          sortable: true,
          align: "start",
        },
        {
          text: "Device Logo",
          value: "device_logo",
          width: "15%",
          sortable: true,
          align: "start",
        },
        {
          text: "Auth Required",
          value: "is_device_auth_required",
          width: "15%",
          sortable: true,
          align: "start",
        },
        {
          text: "Android Url",
          value: "device_app_android_url",
          width: "15%",
          sortable: true,
          align: "start",
        },
        {
          text: "Ios Url",
          value: "device_app_ios_url",
          width: "15%",
          sortable: true,
          align: "start",
        },
        {
          text: "Status",
          value: "device_status",
          sortable: false,
          width: "10%",
          align: "start",
        },

        {
          text: "Actions",
          value: "actions",
          sortable: false,
          width: "20%",
          align: "end",
        },
      ],

      pagination: {},
      entity: "Device",
      // search
      searchText: "",
      // add edit

      totalItemsInDB: 0,
      item: {},
      addEditDialog: false,
      isFormAddEditValid: false,
      isAddEdit: true,
      addUpdateButtonText: "Add Device",
      addEditText: "Add",
      isLoaderActive: false,
      isDialogLoaderActive: false,

      tableItems: [],
      deviceTypeItems: [
        {
          "value": "internal",
          "name": "internal"
        },
        {
          "value": "external",
          "name": "external"
        }
      ],
      deviceOsTypeItems: [
        {
          "value": "android",
          "name": "android"
        },
        {
          "value": "ios",
          "name": "ios"
        }
      ],
      imageRule: [],
      selectedDeviceImage: null,
      tableDataLoading: false,

      //end

      //excel
      excelFields: {
        Device_Name: "device_name",
        Device_Type: "device_type",
        Is_Device_Auth_Required: "is_device_auth_required",
        Device_App_Android_url: "device_app_android_url",
        Device_App_Ios_url: "device_app_ios_url",
        Status: "comp_type_status",
      },
      excelFileName:
        "Devices" + "_" + moment().format("DD/MM/YYYY") + ".xls",

      //end
    };
  },
  //#endregion
  //#region  created section
  created() {
    //#region get Devices List
    this.getDeviceList();
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
        this.getDeviceList();
      },
      deep: true,
    },
    //#endregion
    //#region 
    selectedDeviceImage(val) {
      this.selectedDeviceImage = val;
      this.imageRule =
        this.selectedDeviceImage != null
          ? [(v) => !v || v.size <= 1048576 || "File size should be 1MB"]
          : [];
    },
    //#endregion
  },
  //#endregion

  //#region Method section
  methods: {
    //#region To get the Devices List
    getDeviceList() {
      this.tableDataLoading = true;
      let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
      sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
      sortBy = sortBy.length == 0 ? `device_id` : sortBy[0];
      ApiService.get(ApiEndPoint.Devices.getDevices, {
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
        this.getDeviceList();
      }, 500);
    },

    //#endregion

  
    //#region  show add/edit dialog
    async showAddEditDialog(item) {
      // Show Add
      if (item == null && this.isAddEdit == true) {
        this.addEditText = `Add  ${this.entity}`;
        this.addEditDialog = true;
        this.addUpdateButtonText = " Add ";
      } else {
        // Show Edit (Update)

        this.item = Object.assign({}, {
          ...item,
          device_os_type: this.deviceOsTypeItems.filter((d) => item?.device_os_type.split(",").includes(String(d.value))).map(v => v)
        });
        this.addEditText = `Edit ${this.entity} : ` + item.device_name;
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
          let postData = new FormData();
          if (this.selectedDeviceImage != null) {
            postData.append("device_logo", this.selectedDeviceImage);
          }
          postData.append("device_name", this.item.device_name);
          postData.append("device_type", this.item.device_type);
          postData.append("device_auth_param", this.item.device_auth_param);
          postData.append("device_auth_url", this.item.device_auth_url);
          postData.append("device_app_android_url", this.item.device_app_android_url);
          postData.append("device_app_ios_url", this.item.device_app_ios_url);
          postData.append("device_os_type", this.item.device_os_type);
          postData.append("android_package_name", this.item.android_package_name);
          postData.append("ios_package_name", this.item.ios_package_name);
          postData.append("device_id", this.item.device_id);
          postData.append("is_device_auth_required", 0);
          postData.append("is_device_app_installation_required", 0);
          
          ApiService.post(ApiEndPoint.Devices.saveDevices, postData)
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.success == "true") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getDeviceList();
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
          let postData = new FormData();
          if (this.selectedDeviceImage != null) {
            postData.append("device_logo", this.selectedDeviceImage);
          }
          postData.append("device_name", this.item.device_name);
          postData.append("device_type", this.item.device_type);
          postData.append("device_auth_param", this.item.device_auth_param);
          postData.append("device_auth_url", this.item.device_auth_url);
          postData.append("device_app_android_url", this.item.device_app_android_url);
          postData.append("device_app_ios_url", this.item.device_app_ios_url);
          postData.append("device_os_type", this.item.device_os_type);
          postData.append("android_package_name", this.item.android_package_name);
          postData.append("ios_package_name", this.item.ios_package_name);
          postData.append("device_id", this.item.device_id);
          postData.append("is_device_auth_required", 0);
          postData.append("is_device_app_installation_required", 0);

          ApiService.post(ApiEndPoint.Devices.updateDevices, postData)
            .then((response) => {
              this.isDialogLoaderActive = false;
              this.close();
              if (response.data.success == "true") {
                Global.showSuccessAlert(true, "success", response.data.message);
                this.getDeviceList();
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

    //#region  enable disable for Auth Required Status
    async enableDisableItemsAuthStatus(passedItem) {
      const result = await Global.showConfirmationAlert(
        `Change  ${this.entity} : ${passedItem.device_name} Auth Required`,
        "Are you sure to change the Auth Required",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;

        ApiService.post(
          ApiEndPoint.Devices.changeDeviceAuthStatus,
          {
            device_id: passedItem.device_id,
            is_device_auth_required: passedItem.is_device_auth_required,
          }
        )
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.success == "true") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getDeviceList();
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
        if (passedItem.is_device_auth_required == false) {
          passedItem.is_device_auth_required = true;
        } else {
          passedItem.is_device_auth_required = false;
        }
      }
    },
    //#endregion

    //#region  enable disable Device Status
    async enableDisableItemDeviceStatus(passedItem) {
      const result = await Global.showConfirmationAlert(
        `Change  ${this.entity} : ${passedItem.device_name} Status`,
        "Are you sure to change the status",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;

        ApiService.post(
          ApiEndPoint.Devices.changeDeviceStatus,
          {
            device_id: passedItem.device_id,
            device_status: passedItem.device_status,
          }
        )
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.success == "true") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getDeviceList();
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
        if (passedItem.device_status == false) {
          passedItem.device_status = true;
        } else {
          passedItem.device_status = false;
        }
      }
    },
    //#endregion

    //#region Delete Item
    async deleteItem(passedItem) {
      const result = await Global.showConfirmationAlert(
        `Delete ${this.entity} ${passedItem.device_name}`,
        "Are you sure to delete",
        "warning"
      );
      if (result.isConfirmed) {
        this.isLoaderActive = true;
        ApiService.post(ApiEndPoint.Devices.deleteDevices, {
          device_id: passedItem.device_id,
        })
          .then((response) => {
            this.isLoaderActive = false;
            if (response.data.success == "true") {
              Global.showSuccessAlert(true, "success", response.data.message);
              this.getDeviceList();
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
