import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const userDetails = {
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
          width: "10%",
          sortable: true,
          align: "start",
        },
        {
          text: "Mobile",
          value: "user_mobile",
          sortable: false,
          width: "10%",
          align: "start",
        },
        {
          text: "Email",
          value: "user_email",
          sortable: false,
          width: "15%",
          align: "start",
        },
        {
          text: "Age",
          value: "user_age",
          sortable: false,
          width: "10%",
          align: "start",
        },
        {
          text: "Height",
          value: "user_height",
          sortable: false,
          width: "10%",
          align: "start",
        },
        {
          text: "Weight",
          value: "user_weight",
          sortable: false,
          width: "10%",
          align: "start",
        },
        {
          text: "Subscribed",
          value: "is_subscribed",
          sortable: false,
          width: "10%",
          align: "start",
        },

        {
          text: "Subscription Type",
          value: "subscription_type",
          sortable: false,
          width: "15%",
          align: "start",
        },
        {
          text: "Status",
          value: "user_status",
          sortable: false,
          width: "5%",
          align: "end",
        },
      ],
      tableItems: [],
      totalItemsInDB: 0,
      tableDataLoading: "",
      pagination: {},
      module: "Reports",
      entity: "User Details",
      isLoaderActive: false,
      searchText: "",

      //excel
      excelFields: {
        user_full_name: "user_full_name",
        user_mobile: "user_mobile",
        user_email: "user_email",
        user_age: "user_age",
        user_height: "user_height",
        user_weight: "user_weight",
        is_subscribed: "is_subscribed",
        subscription_type: "subscription_type",
        user_status: "user_status"
      },
      excelFileName: "UserDetails" + moment().format("DD/MM/YYYY") + ".xls",
    };
  },

  //Created
  created() {
    this.getDetails();
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
    //Get User Report Details
    getDetails() {
      this.tableDataLoading = true;
      let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
      sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
      sortBy = sortBy.length == 0 ? `user_id` : sortBy[0];
      ApiService.get(ApiEndPoint.UsereDetails.webGetUserReport, {
        itemsPerPage: itemsPerPage,
        sortColumn: sortBy,
        sortOrder: sortDesc,
        page: page,
        searchText: this.searchText,
      })
        .then((response) => {
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
