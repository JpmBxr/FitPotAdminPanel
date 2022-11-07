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
          text: "Fitness Step",
          value: "total_user_fitness_step",
          width: "35%",
          sortable: true,
          align: "start",
        },
        {
          text: "Calorie Burnt",
          value: "total_calorie_burnt",
          sortable: false,
          width: "30%",
          align: "start",
        },
        {
          text: "Total Distance",
          value: "total_distance",
          sortable: false,
          width: "30%",
          align: "end",
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
      item:{},
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
        total_user_fitness_step: "total_user_fitness_step",
        total_calorie_burnt: "total_calorie_burnt",
        total_distance: "total_distance",
      },
      excelFileName: "UserDeviceData" + moment().format("DD/MM/YYYY") + ".xls",
    };
  },

  //Created
  created() {
    this.getDetails();
  },
  //Mounted
  mounted() {
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
        user_id: this.item.user_id,
        from_date: this.from_date,
        to_date: this.to_date,

        itemsPerPage: itemsPerPage,
        sortColumn: sortBy,
        sortOrder: sortDesc,
        page: page,
        searchText: this.searchText,
      })
        .then((response) => {
          console.log(response.data.resultData.total);
          console.log("getDetails============>", response);
          this.tableDataLoading = false;
          this.tableItems = response.data.resultData;
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
