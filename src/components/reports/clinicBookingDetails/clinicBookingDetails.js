import { Global } from "@/helpers/global";
import { globalMixin } from "../../../mixins/globalMixin";
import { ApiService } from "@/helpers/apiService";
import { ApiEndPoint } from "../../../helpers/apiEndPoint";
export const clinicBookingDetails = {
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
          text: "Booking Date",
          value: "in_clinic_booking_date",
          width: "10%",
          sortable: true,
          align: "start",
        },

        {
          text: "Clinic",
          value: "clinic_full_name",
          sortable: false,
          width: "15%",
          align: "start",
        },
        {
          text: "Doctor",
          value: "doctor_full_name",
          sortable: false,
          width: "10%",
          align: "start",
        },
        {
          text: "Total Booking",
          value: "total_booking",
          sortable: false,
          width: "5%",
          align: "start",
        },

        // {
        //   text: "Actions",
        //   value: "actions",
        //   sortable: false,
        //   width: "25%",
        //   align: "end",
        //   visible: false,
        // },

        ,
      ],
      tableItems: [],
      in_clinic_booking_is_active: null,
      clinic_id: null,
      doctor_id: null,
      doctorItems: [],
      clinicItems: [],
      bookingStatusItems: [
        { id: 1, status: "Active" },
        { id: 3, status: "Completed" },
        { id: 2, status: "Cancel" },
        { id: 4, status: "Absent" },
      ],
      show: true,
      isLoaderActive: false,
      pagination: {},
      module: "Reports",
      entity: "Clinic Booking Details",

      in_clinic_booking_to_date: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      menu_in_clinic_booking_to_date: false,
      in_clinic_booking_from_date: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      menu_in_clinic_booking_from_date: false,
      // search
      searchText: "",

      // add edit
      defaultItem: {},
      item: {},
      addEditDialog: false,
      isFormAddEditValid: false,
      tableDataLoading: false,
      totalItemsInDB: 0,
      isAddEdit: true,
      addUpdateButtonText: "Add User Skills",
      addEditText: "Add",
      //end

      //excel
      excelFields: {
        "Booking Date": "in_clinic_booking_date",
        Doctor: "doctor_full_name",
        Clinic: "clinic_full_name",
        "Total Booking": "total_booking",
      },
      excelFileName:
        "ClinicWiseBooking" + moment().format("DD/MM/YYYY") + ".xls",
      //end
    };
  },
  async created() {
    this.clinicItems = await this.getAll("clinicActiveDetails", {});
    this.getDetails();
  },
  computed: {
    // For numbering the Data Table Rows
    dataTableRowNumbering() {
      return this.tableItems.map((items, index) => ({
        ...items,
        index: index + 1,
      }));
    },
  },
  isLoaderActive() {},
  watch: {
    pagination: {
      handler() {
        this.getDetails();
      },
      deep: true,
    },
  },
  methods: {
    getAll(endPoint, payload) {
      return new ApiService.get(endPoint, payload)
        .then((response) => {
          return response.data.resultData;
        })
        .catch((error) => {
          if (error.response.status != 401 && error.response.status != 403) {
            this.showErrorAlert(true, "error", "Something went wrong");
          }
        });
    },
    async selectDoctor() {
      this.doctorItems = await this.getAll("doctorActiveDetails", {
        clinic_id: this.clinic_id,
      });
    },
    searchInfo() {
      clearTimeout(this._timerId);
      this._timerId = setTimeout(() => {
        this.getDetails();
      }, 500);
    },
    getDetails() {
      this.isLoaderActive = true;
      let { page, itemsPerPage, sortDesc, sortBy } = this.pagination;
      sortDesc = sortDesc.length > 0 && sortDesc[0] ? "desc" : "asc";
      sortBy = sortBy.length == 0 ? `clinic_id` : sortBy[0];
      ApiService.get(ApiEndPoint.BookingDetails.clinicWiseBooking, {
        in_clinic_booking_date: this.in_clinic_booking_from_date,
        clinic_id: this.clinic_id,
        in_clinic_booking_is_active: this.in_clinic_booking_is_active,
        itemsPerPage: itemsPerPage,
        sortColumn: sortBy,
        sortOrder: sortDesc,
        page: page,
        searchText: this.searchText,
      })
        .then((response) => {
          this.isLoaderActive = false;
          this.tableItems = response.data.resultData;
          this.totalItemsInDB = response.data.resultData.total;
        })
        .catch((error) => {
          this.isLoaderActive = false;
          if (error.response.status != 401 || error.response.status != 403) {
            Global.showErrorAlert(true, "error", "Something went wrong");
          }
        });
    },
  },
};
