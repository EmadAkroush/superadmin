<template>
  <div class="grid p-fluid animate__animated animate__fadeIn">
    <div class="col-12">
      <div class="card card-w-title">
        <div class="grid">
          <div class="field col-12 md:col-3">
            <p>
              جستجو در موزیک ها
            </p>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText type="text" v-model="searchQuery.Query" placeholder="جستجو...." />
            </span>
          </div>
          <div class="field col-12 md:col-3">
            <p>
              فیلتر وضعیت موزیک ها
            </p>
            <Dropdown v-model="searchQuery.IsActive" :options="templatestatus" optionLabel="type" optionValue="value"
              placeholder="همه" />
          </div>
          <div class="field col-12 md:col-3">
            <p>
              فیلتر از تاریخ
            </p>
            <span class="p-input-icon-left">
              <i v-if="!FromDate" style="font-size: 1.5rem" class="pi pi-calendar" />
              <i v-else @click="FromDate = null" style="font-size: 1.5rem" class="pi pi-calendar-times cursor-pointer" />
              <InputText dir="rtl" v-model="FromDateInput" type="text" id="fromCalendarInputId" placeholder="از تاریخ" />
            </span>
            <custom-date-picker auto-submit v-model="FromDate" :max="currentDate" format="YYYY-MM-DD"
              display-format="jYYYY/jMM/jDD" custom-input="#fromCalendarInputId" />
          </div>
          <div class="field col-12 md:col-3">
            <p>
              تا تاریخ
            </p>
            <span class="p-input-icon-left">
              <i v-if="!ToDate" style="font-size: 1.5rem" class="pi pi-calendar" />
              <i v-else @click="ToDate = null" style="font-size: 1.5rem" class="pi pi-calendar-times cursor-pointer" />
              <InputText dir="rtl" v-model="ToDateInput" type="text" id="toCalendarInputId" placeholder="تا تاریخ" />
            </span>
            <custom-date-picker auto-submit v-model="ToDate" :disabled="!FromDate" :max="currentDate" :min="FromDate"
              format="YYYY-MM-DD" display-format="jYYYY/jMM/jDD" custom-input="#toCalendarInputId" />
          </div>
          <div class="field col-12 md:col-2">
            <Button @click="filter()" class="justify-content-center">اعمال فیلتر</Button>
          </div>
        </div>
        <NoData v-if="nullResults"></NoData>
        <MusicTableList v-else :PropsMusicData=Musicdata :loadingData="loading.getData" @sendData="changeStatus($event)" ></MusicTableList>
        <Toast />
        <Paginator :rows="pageSize" :totalRecords="totalCount" aria-label="" @page="changePaging($event)"></Paginator>
     
      </div>
    </div>
  </div>
</template>
<script>
import { useToast } from "primevue/usetoast";
import { musicService } from "../../@core/services/index"
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Paginator from 'primevue/paginator';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import NoData from '../../@core/components/NoData.vue'
import MusicTableList from  '../../@core/components/pages/Music/MusicTableList.vue'

export default {
  components: {
        Button,
        InputText,
        Dropdown,
        Paginator,
        Toast,
        NoData,
        MusicTableList
      },
  data() {
    return {
    
      Musicdata: [],
      nullResults: false,
      toast: useToast(),
      Query: "",
      pageSize: 20,
      totalCount: 50,
      FromDate: "",
      FromDateInput: "",
      currentDate: "",
      ToDate: "",
      loading: {
        getData: false,
      },
      ToDateInput: "",
      searchQuery: { pageIndex: 1, pageSize: 20, IsActive: null, Query: null },
      templatestatus: [
        { type: "همه", value: null },
        { type: "فعال  ", value: true },
        { type: " غیر فعال ", value: false },
      ],

    };
  },
  methods: {
    getdata() {
      this.loading.getData = true;
      musicService.getMusic({ ...this.searchQuery }).then(({ data }) => {
        this.Musicdata = data.data;
        this.pageSize = Number(data.pageSize);
        this.pageIndex = data.pageIndex;
        this.totalCount = Number(data.totalCount);
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
    changeStatus(id) {
      musicService.statusMusic(id).then(() => {
        let find = this.Musicdata.findIndex(item => item.id == id)
        this.Musicdata[find].isActive = !(this.Musicdata[find].isActive)
        this.showWarn()
      }).catch((error) => {
        console.log(error);
        this.showError()
      })
    },
  
    deleteTemplate(id) {
      musicService.deleteMusic(id).then(() => {
        this.Musicdata = this.Musicdata.filter((item) => item.id != id)
        this.showSuccess()
      }).catch((error) => {
        console.log(error);
        this.showError()
      })
    },
    myMethos(id){
       console.log("this is good this is best" , id);
    },
    changePaging({ page }) {
      ++page
      this.searchQuery.pageIndex = page
      this.getdata()
    },
    

    showSuccess() {
      this.toast.add({
        severity: "success",
        summary: " حذف شد",
        detail: "   موزیک نظر حذف شد ",
        life: 3000,
      });
    },
    showWarn() {
      this.toast.add({ severity: 'warn', summary: 'تغییر وضعیت', detail: 'وضعیت موزیک تغییر کرد', life: 3000 });
    },
    showError() {
      this.toast.add({ severity: 'error', summary: 'خطا', detail: ' عملیات با خطا مواجه شد', life: 3000 });
    },
  


    updateTemplate(data) {
      this.$router.push(`/music-edit/${data.id}`);
      this.$store.state.MusicEdit = {
        name: data.name,
        fileId: data.fileId,
        categoryname: data.category,
        categoryid: data.category.id
      };

    },
    filter() {
      this.getdata()
    }
  },
  mounted() {
    this.getdata();
  },

};
</script>
