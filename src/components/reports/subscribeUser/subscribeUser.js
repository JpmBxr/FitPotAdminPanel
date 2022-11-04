import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const subscribeUser = {
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
          text: "Subscription",
          value: "subscription_name",
          sortable: false,
          width: "15%",
          align: "start",
        },
        {
          text: "Subscribed Date",
          value: "subscribed_date",
          sortable: false,
          width: "10%",
          align: "start",
        },
        {
          text: "Start Date",
          value: "subscription_start_date",
          sortable: false,
          width: "10%",
          align: "start",
        },
        {
          text: "End Date",
          value: "subscription_end_date",
          sortable: false,
          width: "10%",
          align: "start",
        },
        {
          text: "Wallet Balance",
          value: "wallet_balance_added_deducted_amount",
          sortable: false,
          width: "10%",
          align: "start",
        },

        {
          text: "Wallet Description",
          value: "wallet_description",
          sortable: false,
          width: "20%",
          align: "end",
        },
      ],
      tableItems: [],
      totalItemsInDB: 0,
      tableDataLoading: "",
      pagination: {},
      module: "Reports",
      entity: "Subscribed User",
      isLoaderActive: false,
      searchText: "",

      //excel
      excelFields: {
        user_full_name: "user_full_name",
        user_mobile: "user_mobile",
        subscription_name: "subscription_name",
        subscribed_date: "subscribed_date",
        subscription_start_date: "subscription_start_date",
        subscription_end_date: "subscription_end_date",
        wallet_balance_added_deducted_amount: "wallet_balance_added_deducted_amount",
        wallet_description: "wallet_description"
        
      },
      excelFileName: "SubscribedUser" + moment().format("DD/MM/YYYY") + ".xls",
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
    //Get Subscribed User Report Details
    getDetails() {
      this.tableDataLoading = true;
      let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
      sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
      sortBy = sortBy.length == 0 ? `user_id` : sortBy[0];
      ApiService.get(ApiEndPoint.SubscribedUser.webGetSubscribedUserReport, {
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
