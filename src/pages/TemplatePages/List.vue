<template>
  <div class="grid p-fluid animate__animated animate__fadeIn">
    <div class="col-12">
      <div class="card card-w-title">
        <div class="grid">
          <div class="field col-12 md:col-3">
            <p>جستجو در تمپلیت ها</p>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText type="text" v-model="searchQuery.Query" placeholder="جستجو...." />
            </span>
          </div>
          <div class="field col-12 md:col-3">
            <p>فیلتر وضعیت کاربران</p>
            <Dropdown v-model="searchQuery.IsActive" :options="templatestatus" optionLabel="type" optionValue="value"
              placeholder="همه" />
          </div>
          <div class="field col-12 md:col-3">
            <p>فیلتر از تاریخ</p>
            <span class="p-input-icon-left">
              <i v-if="!FromDate" style="font-size: 1.5rem" class="pi pi-calendar" />
              <i v-else @click="FromDate = null" style="font-size: 1.5rem" class="pi pi-calendar-times cursor-pointer" />
              <InputText dir="rtl" v-model="FromDateInput" type="text" id="fromCalendarInputId" placeholder="از تاریخ" />
            </span>
            <custom-date-picker auto-submit v-model="FromDate" :max="currentDate" format="YYYY-MM-DD"
              display-format="jYYYY/jMM/jDD" custom-input="#fromCalendarInputId" />
          </div>
          <div class="field col-12 md:col-3">
            <p>تا تاریخ</p>
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
        <DataTable  :value="templatedata"  :loading="loading.getData"  :rows="10" v-else
          class="overflow-hidden border-round-2xl shadow-1 mt-5 animate__animated animate__fadeIn"
          responsiveLayout="scroll">
          <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
            <template #header>
              <small class="p-column-title"> تصویر تمپلیت </small>
            </template>
            <template #body="slotProps">
              <img :src="
                this.href +
                slotProps.data.fileId
              " :alt="slotProps.data.name" class="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
            </template>
          </Column>
          <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
            <template #header>
              <small class="p-column-title">نام تمپلیت </small>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.name }}
            </template>
          </Column>
          <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
            <template #header>
              <small class="p-column-title">نام دسته بندی تمپلیت </small>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.category.name }}
            </template>
          </Column>
          <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
            <template #header>
              <small class="p-column-title"> فعال هست </small>
            </template>
            <template #body="slotProps">
              <span v-if="slotProps.data.isActive == true"> فعال </span>
              <span v-if="slotProps.data.isActive == false"> غیرفعال </span>
            </template>
          </Column>
          <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
            <template #header>
              <small class="p-column-title"> تاریخ ایجاد </small>
            </template>
            <template #body="slotProps">
              {{
                new Date(slotProps.data.createdAt).toLocaleDateString("fa-IR")
              }}
            </template>
          </Column>
          <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
            <template #header>
              <small class="p-column-title"> ویرایش وضعیت </small>
            </template>
            <template #body="slotProps">
              <Button label=" تغییر  " class="mr-2 mb-2" @click="statusData(slotProps.data.id)" />
            </template>
          </Column>
          <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
            <template #header>
              <small class="p-column-title"> ویرایش تمپلیت </small>
            </template>
            <template #body="slotProps">
              <Button label=" ویرایش " class="mr-2 mb-2" @click="updateTemplate(slotProps.data)" />
            </template>
          </Column>
          <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
            <template #header>
              <small class="p-column-title"> حذف تمپلیت</small>
            </template>
            <template #body="slotProps">
              <Button label=" حذف " class="mr-2 mb-2" @click="deleteData(slotProps.data.id)" />
            </template>
          </Column>
        </DataTable>
        <Toast />
        <Paginator :rows="searchQuery.pageIndex" :totalRecords="totalCount" aria-label="" @page="changePaging($event)">
        </Paginator>


        <Dialog header="تاییدیه" v-model:visible="displayConfirmation" :style="{ width: '350px' }" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span> آیا مطمئن هستید که می خواهید این دسته بندی را حذف کنید </span>
          </div>
          <template #footer>
            <Button label="خیر" icon="pi pi-times" @click="closeConfirmation" class="p-button-text" />
            <Button label="بله" icon="pi pi-check" @click="closeConfirmationYes" class="p-button-text" autofocus />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>
<script>
import { useToast } from "primevue/usetoast";
import { templateService } from "../../@core/services/index"
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Paginator from 'primevue/paginator';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import NoData from '../../@core/components/NoData.vue'


export default {
  components: {
    Button,
    InputText,
    Dropdown,
    Paginator,
    Toast,
    DataTable,
    Column,
    Dialog,
    NoData
    },
  data() {
    return {
      date: "2022-10-10",
      toast: useToast(),
      nullResults: false,
      loading: {
        getData: false,
      },

      displayConfirmation: false,
      displaydialog: false,
      displayStatus: false,
      countUnderTemplate: 0,
      ToDateInput: "",
      ToDate: "",
      href: "",
      currentDate: "",
      FromDate: "",
      FromDateInput: "",
      templatedata: [],
      fullName: "",
      pageSize: 10,
      totalCount: 50,
      ticket: "",
      display: {},
      countUnder: "",
      searchQuery: { pageIndex: 1, pageSize: 20, IsActive: null, Query: null },
      templatestatus: [
        { type: "همه", value: '' },
        { type: "فعال  ", value: true },
        { type: " غیر فعال ", value: false },
      ],
    };
  },
  methods: {
    getsdata() {
      this.loading.getData = true;
      templateService.getTemplate({ ...this.searchQuery }).then(({ data }) => {
        this.templatedata = [...data.data]
        console.log("data" , data.totalCount );
        if(data.totalCount === 0){
          this.nullResults = true
        }
        setTimeout(() => {
          this.loading.getData = false;
        }, 500);
      }).finally(() => {

      });
    }, 
    deleteData(id) {
      templateService.deleteTemplate(id).then(() => {
        this.templatedata = this.templatedata.filter((item) => item.id != id);
        console.log("hold", id);
        this.showSuccess()
        this.submitted = false;
      }).catch((error) => {
        console.log(error);
        this.showError()
      }).finally(() => {

      });


    },
    statusData(id){
      templateService.statusTemplate(id).then(()=> {
        let find = this.templatedata.findIndex((item) => item.id == id);
        this.templatedata[find].isActive = !this.templatedata[find].isActive;
        this.showWarn()
      }).catch((error)=>{
         console.log(error);
         this.showError()
      })
    },
    showSuccess() {
      this.toast.add({
        severity: "success",
        summary: " حذف شد",
        detail: " دسته بندی مورد نظر حذف شد ",
        life: 3000,
      });
      
    },
    showWarn() {
      this.toast.add({ severity: 'warn', summary: 'تغییر وضعیت', detail: 'وضعیت تملیت تغییر کرد', life: 3000 });
    },
    showError() {
      this.toast.add({ severity: 'error', summary: 'خطا', detail: ' عملیات با خطا مواجه شد', life: 3000 });
    },
    closeConfirmation() {
      this.displayConfirmation = false;
    },
    open() {
      this.displaydialog = true;
    },
    openStatus() {
      this.displayStatus = true;
    },

    close() {
      this.displaydialog = false;

    },
    changePaging({ page }) {

      ++page
      this.searchQuery.pageIndex = page
      this.getsdata()
    },

    updateTemplate(data) {
      this.$router.push(`/templateedit/${data.id}`);
      this.$store.state.TemplateEdit = {
        name: data.name,
        fileId: data.fileId,
        categoryname: data.category,
        categoryid: data.category.id,
        color: data.color
      };
    },

    filter() {
      this.getsdata()
    },
  },

  mounted() {
    this.getsdata()
  },
  beforeMount(){
    this.href = process.env.VUE_APP_BASE_URL_File
  }
};
</script>