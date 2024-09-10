<template>
  <div class="grid p-fluid animate__animated animate__fadeIn">
    <div class="col-12">
      <div class="card card-w-title">
        <div class="grid">
          <div class="field col-12 md:col-3">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText type="text" v-model="filterCategory.Query" placeholder="جستجو...." />
            </span>
          </div>
          <div class="field col-12 md:col-3">
            <Dropdown v-model="filterCategory.ticket" :options="ticketStatus" optionLabel="type" optionValue="value" placeholder="همه" />
          </div>
          <div class="field col-12 md:col-3">
            <span class="p-input-icon-left">
              <i v-if="!filterCategory.FromDate" style="font-size: 1.5rem" class="pi pi-calendar" />
              <i v-else @click="filterCategory.FromDate = null" style="font-size: 1.5rem" class="pi pi-calendar-times cursor-pointer" />
              <InputText dir="rtl" v-model="FromDateInput" type="text" id="fromCalendarInputId" placeholder="از تاریخ" />
            </span>
            <custom-date-picker auto-submit v-model="filterCategory.FromDate" :max="currentDate" format="YYYY-MM-DD"
              display-format="jYYYY/jMM/jDD" custom-input="#fromCalendarInputId" />
          </div>
          <div class="field col-12 md:col-3">
            <span class="p-input-icon-left">
              <i v-if="!filterCategory.ToDate" style="font-size: 1.5rem" class="pi pi-calendar" />
              <i v-else @click="filterCategory.ToDate = null" style="font-size: 1.5rem" class="pi pi-calendar-times cursor-pointer" />
              <InputText dir="rtl" v-model="ToDateInput" type="text" id="toCalendarInputId" placeholder="تا تاریخ" />
            </span>
            <custom-date-picker auto-submit v-model="filterCategory.ToDate" :disabled="!filterCategory.FromDate" :max="currentDate" :min="FromDate"
              format="YYYY-MM-DD" display-format="jYYYY/jMM/jDD" custom-input="#toCalendarInputId" />
          </div>
          <div class="field col-12 md:col-2">
            <Button @click="filter()" class="justify-content-center">اعمال فیلتر</Button>

          </div>
        </div>
        <NoData v-if="nullResults"></NoData>
        <DataTable v-else :value="ticketed" :loading="loading.getData" :rows="10"
          class="overflow-hidden border-round-2xl shadow-1 mt-5 animate__animated animate__fadeIn"
          responsiveLayout="scroll">
          <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
            <template #header>
              <small class="p-column-title">نام کاربری </small>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.userName }}
            </template>
          </Column>
          <Column field="category">
            <template #header>
              <small class="p-column-title">بخش</small>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.category.title }}
            </template>
          </Column>
          <Column field="subject">
            <template #header>
              <small class="p-column-title">عنوان تیکت</small>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.subject }}
            </template>
          </Column>
          <Column field="text">
            <template #header>
              <small class="p-column-title">متن تیکت</small>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.text }}
            </template>
          </Column>
          <Column headerStyle="width:14%; min-width:10rem;">
            <template #header>
              <small class="p-column-title">وضعیت تیکت</small>
            </template>
            <template #body="slotProps">
              <span v-if="slotProps.data.status == 0">ارسال شده</span>
              <span v-if="slotProps.data.status == 1">در دست بررسی</span>
              <span v-if="slotProps.data.status == 2">پاسخ داده شده</span>
            </template>
          </Column>
          <Column headerStyle="width:14%; min-width:10rem;">
            <template #header>
              <small class="p-column-title">آخرین بروز رسانی</small>
            </template>
            <template #body="slotProps">
              {{ new Date(slotProps.data.lastModifiedAt).toLocaleDateString("fa-IR") }}
            </template>
          </Column>
          <Column headerStyle="width:7%; min-width:8rem;">
            <template #header>
              <small class="p-column-title">پاسخ </small>

            </template>
            <template #body="slotProps">
              <Button icon="pi pi-pencil" v-tooltip.top="'پاسخ'" @click="answerTicket(slotProps.data.id)"
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
import { ticketService } from "../../@core/services/index"
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import NoData from '../../@core/components/NoData.vue'

export default {
  components: {
        InputText,
        Dropdown,
        Button,
        DataTable,
        Column,
        Paginator,
        NoData
    },
  data() {
    return {
      ticket: "",
      nullResults: false,
      FromDateInput: "",
      ToDateInput: "",
      fullName: "",
      currentDate: "",
      ticketStatus: [
        { type: "همه", value: null },
        { type: "ارسال شده", value: 0 },
        { type: "در دست بررسی", value: 1 },
        { type: "پاسخ داده شده", value: 2 },
      ],
      ticketed: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 50,
      pageCount: 1,
      FromDate: "",
      ToDate: "",
      loading: {
        getData: false,
      },
      filterCategory: {
        pageIndex: 1,
        pageSize: 20,
        FromDate: null,
        ToDate: null,
        ticket: null,
      }
    };
  },
  methods: {
    getData() {
      this.loading.getData = true;
      ticketService.getTicket({...this.filterCategory}).then(({data}) => {
        this.pageSize = Number(data.pageSize);
        this.pageIndex = data.pageIndex;
        this.totalCount = Number(data.totalCount);
        this.pageCount = +data.pageCount;
        this.ticketed = [...data.data];
        if(data.totalCount === 0){
          this.nullResults = true
        }
        setTimeout(() => {
          this.loading.getData = false;
        }, 500);
      })
    },
    changePaging(e) {
      this.getData(++e.page);
    },
    answerTicket(e) {
      this.$router.push(`/answer-ticket/${e}`);
    },
    filter() {
      this.getData();
    },
  },
  mounted() {
    this.getData();
  },
};
</script>
