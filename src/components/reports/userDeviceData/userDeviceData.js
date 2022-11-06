import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const userDeviceData = {
  props: ["userPermissionDataProps"],
  mixins: [globalMixin],
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
          text: "Full Name ",
          value: "user_full_name",
          width: "15%",
          sortable: true,
          align: "start",
        },
        {
          text: "Mobile",
          value: "user_mobile",
          sortable: false,
          width: "15%",
          align: "start",
        },
        {
          text: "Competition Name",
          value: "comp_master_name",
          sortable: false,
          width: "20%",
          align: "start",
        },
        {
          text: "Total KM",
          value: "comp_master_total_km",
          sortable: false,
          width: "15%",
          align: "start",
        },
        {
          text: "Start Date",
          value: "comp_schedule_start_date",
          sortable: false,
          width: "15%",
          align: "start",
        },
        {
          text: "End Date",
          value: "comp_schedule_end_date",
          sortable: false,
          width: "15%",
          align: "start",
        },
       
      ],
      tableItems: [],
      totalItemsInDB: 0,
      tableDataLoading: "",
      pagination: {},
      module: "Reports",
      entity: "User Device Data",
      isLoaderActive: false,
      searchText: "",
      show: true,
      user_id: null,
      userItems: [],
      //from_date
      from_date: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      menu_from_date: false,
    
      //to_date
      to_date: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      menu_to_date: false,

      //excel
      excelFields: {
        user_full_name: "user_full_name",
        user_mobile: "user_mobile",
        comp_master_name: "comp_master_name",
        comp_master_total_km: "comp_master_total_km",
        comp_schedule_start_date: "comp_schedule_start_date",
        comp_schedule_end_date: "comp_schedule_end_date"
        
      },
      excelFileName: "UserDeviceData" + moment().format("DD/MM/YYYY") + ".xls",
    };
  },

  //Created
  created() {
    this.getDetails();
    this.getUser();
  },

  //Computed
  computed: {
    // For numbering the Data Table Rows
    dataTableRowNumbering() {
      return this.tableItems.map((items, index) => ({
        ...items,
        index: index + 1,
      }));
    },
  },

  //Watch
  watch: {
    pagination: {
      handler() {
        this.getDetails();
      },
      deep: true,
    },
  },

  //#region  methods
  methods: {
    //Get Subscribed User Report Details
    getDetails() {
      this.tableDataLoading = true;
      let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
      sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
      sortBy = sortBy.length == 0 ? `user_id` : sortBy[0];
      ApiService.get(ApiEndPoint.UserDeviceData.webGetUserDeviceDataReport, {
        user_id: this.user_id,
        from_date: this.from_date,
        to_date: this.to_date,

        itemsPerPage: itemsPerPage,
        sortColumn: sortBy,
        sortOrder: sortDesc,
        page: page,
        searchText: this.searchText,
      })
        .then((response) => {
          console.log("getDetails============>", response);
          this.tableDataLoading = false;
          this.tableItems = response.data.resultData.data;
          this.totalItemsInDB = response.data.resultData.total;
        })
        .catch((error) => {
          this.tableDataLoading = false;
          if (error.response.status != 401 && error.response.status != 403) {
            this.showErrorAlert(true, "error", "Something went wrong");
          }
        });
    },

     //#region  to load Clinic
     getUser() {
      this.isLoaderActive = true;
      ApiService.get(
        ApiEndPoint.UserDeviceData.webGetUserWithoutPagination,
        {}
      )
        .then((response) => {
          console.log("getUser=========>", response);
          this.isLoaderActive = false;
          this.userItems = response.data.resultData;
        })
        .catch((error) => {
          this.isLoaderActive = false;
          if (error.response.status != 401 && error.response.status != 403) {
            this.showErrorAlert(true, "error", "Something went wrong");
          }
        });
    },
    
    //Status Color
    getStatusColor(is_active) {
      if (is_active == "Active") return "success";
      else return "error";
    },

    //Search Info
    searchInfo() {
      clearTimeout(this._timerId);
      this._timerId = setTimeout(() => {
        this.getDetails();
      }, 500);
    },
  },
  //#endregion
};
