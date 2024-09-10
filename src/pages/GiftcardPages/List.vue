<template>
  <div class="grid p-fluid animate__animated animate__fadeIn">
    <div class="col-12">
      <div class="card card-w-title">
        <div class="grid">

          <div class="field col-12 md:col-3">
            <p>
              شماره رهگیری
            </p>
            <span class="p-input-icon-left">

              <InputText type="text" v-model="filterCategory.TrackingNumber" placeholder="جستجو...." />
            </span>
          </div>

          <div class="field col-12 md:col-3">
            <p>
              وضعیت پرداخت
            </p>
            <Dropdown v-model="filterCategory.IsPaymentSuccessful" :options="pamentStatus" optionLabel="type" optionValue="value"
              placeholder="همه" />
          </div>

          <div class="field col-12 md:col-3">
            <p>
            نوع گیفت کارد
            </p>
            <Dropdown v-model="filterCategory.giftCard" :options="giftCardKind" optionLabel="type" optionValue="value"
              placeholder="همه" />
          </div>


          <div class="field col-12 md:col-3">
            <p>
              فیلتر از قیمت
            </p>
            <InputText type="text" v-model="filterCategory.priceFrom" />
          </div>

          <div class="field col-12 md:col-3">
            <p>
              تا قیمت
            </p>
            <InputText type="text" v-model="filterCategory.priceTo" />
          </div>


          <div class="field col-12 md:col-3">
            <p>
              فیلتر از تاریخ
            </p>
            <span class="p-input-icon-left">
              <i v-if="!filterCategory.FromDate" style="font-size: 1.5rem" class="pi pi-calendar" />
              <i v-else @click="filterCategory.FromDate = null" style="font-size: 1.5rem" class="pi pi-calendar-times cursor-pointer" />
              <InputText dir="rtl" v-model="FromDateInput" type="text" id="fromCalendarInputId" placeholder="از تاریخ" />
            </span>
            <custom-date-picker auto-submit v-model="filterCategory.FromDate" :max="currentDate" format="YYYY-MM-DD"
              display-format="jYYYY/jMM/jDD" custom-input="#fromCalendarInputId" />
          </div>
          <div class="field col-12 md:col-3">
            <p>
              تا تاریخ
            </p>
            <span class="p-input-icon-left">
              <i v-if="!filterCategory.ToDate" style="font-size: 1.5rem" class="pi pi-calendar" />
              <i v-else @click="filterCategory.ToDate = null" style="font-size: 1.5rem" class="pi pi-calendar-times cursor-pointer" />
              <InputText dir="rtl" v-model="ToDateInput" type="text" id="toCalendarInputId" placeholder="تا تاریخ" />
            </span>
            <custom-date-picker auto-submit v-model="filterCategory.ToDate" :disabled="!filterCategory.FromDate" :max="currentDate" :min="FromDate"
              format="YYYY-MM-DD" display-format="jYYYY/jMM/jDD" custom-input="#toCalendarInputId" />
          </div>

          <div class="field col-12 md:col-2 mt-auto">
            <Button @click="filter()" class="justify-content-center">اعمال فیلتر</Button>
          </div>
        </div>
        <NoData v-if="nullResults"></NoData>
        <GiftCardTableList v-else :PropsGiftCardTable=listgiftcard  :loading="loading.getData"></GiftCardTableList>
        <Paginator :rows="pageSize" :totalRecords="totalCount" aria-label="" @page="changePaging($event)">
        </Paginator>
      </div>
    </div>
  </div>
</template>
<script>
import { giftCardListService } from "@/@core/services";
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Paginator from 'primevue/paginator';
import Button from 'primevue/button';
import NoData from '../../@core/components/NoData.vue';
import GiftCardTableList from '@/@core/components/pages/GiftCard/GiftCardTableList.vue'


export default {
  components: {
    Button,
    InputText,
    Dropdown,
    Paginator,
    NoData ,
    GiftCardTableList
    },

  data() {
    return {
      pamentStatus: [
        { type: "همه", value: null },
        { type: " تراکنش موفق ", value: true },
        { type: " تراکنش ناموفق  ", value: false },

      ],
      giftCardKind: [
        { type: "همه", value: null },
        { type: "شخصی", value: 0 },
        { type: " سازمانی ", value: 1 },
      ],
      giftCard: '',
      loading: {
        getData: false,
      },
      Status: '',
      listgiftcard: [],
      pageSize: 20,
      nullResults: false,
      totalCount: null,
      TrackingNumber: "",
      priceTo: "",
      priceFrom: "",
      FromDate: null,
      ToDate: null,
      FromDateInput: "",
      currentDate: "",
      ToDateInput: "",
      filterCategory: {
        pageIndex: 1,
        pageSize: 20,
        TrackingNumber: null,
        giftCard: null,
        IsPaymentSuccessful: null,
        priceFrom: null,
        priceTo: null,
        FromDate: null,
        ToDate: null
      },

    }
  },
  methods: {
    async getdata() {
      this.loading.getData = true;
      await giftCardListService.getGiftCardList({ ...this.filterCategory }).then(({ data }) => {
        this.listgiftcard = data.data
        this.totalCount = data.totalCount
        if(this.totalCount === 0){
          this.nullResults = true
        }else {
          this.nullResults = false
        }
        setTimeout(() => {
          this.loading.getData = false;
        }, 500);
      }).catch((error) => {
        console.log(error);
      })
    },
    changePaging({ page }) {

      ++page
      this.filterCategory.pageIndex = page
      this.getdata()
    },
  
    filter() {
      this.getdata();
     
    },
  },
  mounted() {
    this.getdata();
  },

}

</script>

<style>
.p-datatable-tbody {
  font-family: 'IranSans';
}

.pop-up-details {
  font-family: 'IranSans';
}
</style>