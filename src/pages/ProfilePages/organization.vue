<template>
  <div class="grid p-fluid animate__animated animate__fadeIn">
    <div class="col-12">
      <div class="card card-w-title">
        <div class="grid">
          <div class="field col-12 md:col-3">
            <InputText type="text" v-model="filterCategory.officialName" placeholder="نام تجاری" />
          </div>
          <div class="field col-12 md:col-3">
            <InputText type="text" v-model="filterCategory.brandNamem" placeholder="نام شرکت" />
          </div>
          <div class="field col-12 md:col-3">
            <Dropdown v-model="filterCategory.statusItem" :options="status" optionLabel="type" optionValue="value"
              placeholder="همه" />
          </div>
          <div class="field col-12 md:col-3">
            <Dropdown v-model="filterCategory.sortOrderAscending" :options="sortOrder" optionLabel="type"
              optionValue="value" placeholder="همه" />
          </div>
          <div class="field col-12 md:col-3">
            <span class="p-input-icon-left">
              <i v-if="!filterCategory.fromDate" style="font-size: 1.5rem" class="pi pi-calendar" />
              <i v-else @click="filterCategory.fromDate = null" style="font-size: 1.5rem" class="pi pi-calendar-times cursor-pointer" />
              <InputText dir="rtl" v-model="fromDateInput" type="text" id="fromCalendarInputId" placeholder="از تاریخ" />
            </span>
            <custom-date-picker auto-submit v-model="filterCategory.fromDate" :max="currentDate" format="YYYY-MM-DD"
              display-format="jYYYY/jMM/jDD" custom-input="#fromCalendarInputId" />
          </div>
          <div class="field col-12 md:col-3">
            <span class="p-input-icon-left">
              <i v-if="!filterCategory.toDate" style="font-size: 1.5rem" class="pi pi-calendar" />
              <i v-else @click="filterCategory.toDate = null" style="font-size: 1.5rem" class="pi pi-calendar-times cursor-pointer" />
              <InputText dir="rtl" v-model="ToDateInput" type="text" id="toCalendarInputId" placeholder="تا تاریخ" />
            </span>
            <custom-date-picker auto-submit v-model="filterCategory.toDate" :disabled="!filterCategory.fromDate" :max="currentDate" :min="fromDate"
              format="YYYY-MM-DD" display-format="jYYYY/jMM/jDD" custom-input="#toCalendarInputId" />
          </div>
          <div class="field col-12 md:col-2">
            <Button @click="filter()" class="justify-content-center">اعمال فیلتر</Button>
          </div>
        </div>
        <NoData v-if="nullResults"></NoData>
        <DataTable  v-else :value="authenticationRequests" :loading="loading.getData"
          :rows="10" class="overflow-hidden border-round-2xl shadow-1 mt-5 animate__animated animate__fadeIn"
          responsiveLayout="scroll">
          <Column field="agentFullName">
            <template #header>
              <small class="p-column-title">نام کاربری</small>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.agentFullName }}
            </template>
          </Column>
          <Column field="name">
            <template #header>
              <small class="p-column-title">نام تجاری</small>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column field="brandName">
            <template #header>
              <small class="p-column-title">نام شرکت</small>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.brandName }}
            </template>
          </Column>
          <Column field="agentPhoneNumber">
            <template #header>
              <small class="p-column-title">شماره تلفن شرکت</small>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.agentPhoneNumber }}
            </template>
          </Column>
          <Column field="createdAt">
            <template #header>
              <small class="p-column-title">ایجاد شده</small>
            </template>
            <template #body="slotProps">
              {{ new Date(slotProps.data.createdAt).toLocaleDateString("fa-IR") }}
            </template>
          </Column>
          <Column field="responseAt">
            <template #header>
              <small class="p-column-title">پاسخ داده شده</small>
            </template>
            <template #body="slotProps">
              {{ new Date(slotProps.data.responseAt).toLocaleDateString("fa-IR") }}
            </template>
          </Column>
          <Column field="status">
            <template #header>
              <small class="p-column-title">وضعیت</small>
            </template>
            <template #body="slotProps">
              <span v-if="slotProps.data.status == 0">در دست بررسی</span>
              <span v-if="slotProps.data.status == 1">رد شده</span>
              <span v-if="slotProps.data.status == 2">تایید شده</span>
            </template>
          </Column>
          <Column>
            <template #header>
              <small class="p-column-title">نمایش</small>
            </template>
            <template #body="slotProps">
              <Button icon="pi pi-eye" v-tooltip.top="'نمایش'" @click="showRequest(slotProps.data.id)"
                class="p-button-rounded p-button-secondary ml-2" />
            </template>
          </Column>
        </DataTable>
        <Paginator :rows="pageSize" :totalRecords="totalCount" aria-label="" @page="changePaging($event)"></Paginator>
      </div>
    </div>
  </div>
</template>
<script>
import { organizationProfileService } from "../../@core/services/index"
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Paginator from 'primevue/paginator';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import NoData from '../../@core/components/NoData.vue'


export default {
  components: {
    Button,
    InputText,
    Dropdown,
    Paginator,
    DataTable,
    Column,
    NoData
    },
  data() {
    return {
      authenticationRequests: [],
      nullResults: false,
      
      loading: {
        getData: false,
      },
      status: [
        { type: "همه", value: null },
        { type: "در دست بررسی", value: 'Pending' },
        { type: "رد شده", value: 'Rejected' },
        { type: "تایید شده", value: 'Accepted' },
      ],
      statusItem: null,
      sortOrder: [
        { type: "صعودی", value: false },
        { type: "نزولی", value: true },
      ],
      sortOrderAscending: false,
      officialName: null,
      brandName: null,
      pageIndex: 1,
      pageSize: 10,
      pageCount: 1,
      totalCount: null,
      fromDate: null,
      toDate: null,
      currentDate: "",
      fromDateInput: "",
      ToDateInput: "",
      filterCategory: {
        pageIndex: 1,
        pageSize: 20,
        officialName: null,
        brandNamem: null,
        statusItem: null,
        sortOrderAscending: null,
        fromDate: null,
        toDate: null

      }
    }
  },
  methods: {
    getDataAuthenticationRequests() {
        this.loading.getData = true;
        organizationProfileService.getOrganizationProfile({ ...this.filterCategory }).then(({ data }) => {
        this.pageSize = Number(data.pageSize);
        this.pageIndex = data.pageIndex;
        this.totalCount = Number(data.totalCount);
        this.pageCount = +data.pageCount;
        this.ticketed = [...data.data];
        this.authenticationRequests = [...data.data];
        if(this.totalCount === 0){
          this.nullResults = true
        }
        setTimeout(() => {
          this.loading.getData = false;
        }, 500);
      }).catch((error) => {
        console.log(error);
      })
    },
    showRequest(e) {
      this.$router.push(`show-organization-profile/${e}`);
    },
    changePaging({ page }) {
      ++page
      this.filterCategory.pageIndex = page
      this.getDataAuthenticationRequests()
    },

    
    filter() {
      this.getDataAuthenticationRequests();
      
    },
  },
  mounted() {
    
    this.getDataAuthenticationRequests();

  },
};
</script>
