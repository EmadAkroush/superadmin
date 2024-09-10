<template>
  <div class="grid p-fluid animate__animated animate__fadeIn">
    <div class="col-12">
      <div class="card card-w-title">
        <div class="grid">
          <div class="field col-12 md:col-3">
            <p>
              جستجو در دسته بندی موزیک
            </p>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText type="text" v-model="filterCategory.Query" placeholder="جستجو...." />
            </span>
          </div>
          <div class="field col-12 md:col-3">
            <p>
              فیلتر وضعیت کاربران
            </p>
            <Dropdown v-model="filterCategory.IsActive" :options="templatestatus" optionLabel="type" optionValue="value"
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
        <DataTable v-else :value="templatedata" :loading="loading.getData" :rows="10" class=" 
                overflow-hidden
                border-round-2xl
                shadow-1
                mt-5
                animate__animated animate__fadeIn
              " responsiveLayout="scroll">
          <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
            <template #header>
              <small class="p-column-title">نام کاربری </small>
            </template>
            <template #body="slotProps">
              {{ slotProps.data.name }}
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
              {{ new Date(slotProps.data.createdAt).toLocaleDateString('fa-IR') }}
            </template>
          </Column>
          <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
            <template #header>
              <small class="p-column-title"> تغییر وضعیت </small>
            </template>
            <template #body="slotProps">
              <Button label=" تغییر " class="mr-2 mb-2" @click="changeStatus(slotProps.data.id)" />
            </template>
          </Column>
          <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
            <template #header>
              <small class="p-column-title"> ویرایش تمپلیت </small>

            </template>
            <template #body="slotProps">
              <Button label=" ویرایش " class="mr-2 mb-2" @click="editTemplate(slotProps.data)" />

            </template>

          </Column>
          <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
            <template #header>
              <small class="p-column-title"> حذف دسته بندی</small>
            </template>
            <template #body="slotProps">
              <Button label=" حذف " class="mr-2 mb-2" @click="openConfirmation(slotProps.data.id)" />
            </template>
          </Column>
        </DataTable>
        <Toast />
        <Dialog header="خطا" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }"
          :modal="true">
          <p class="line-height-3 m-0">
            این دسته بندی دارای {{ totalCountcategory }} موزیک می باشد و نمی توان آن را حذف کرد
          </p>
          <template #footer>
            <Button label="باشه" @click="close" icon="pi pi-check" class="p-button-outlined" />
          </template>
        </Dialog>
        <Dialog header="خطا" v-model:visible="displayStatus" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }"
          :modal="true">
          <p class="line-height-3 m-0">
     
            این دسته بندی دارای {{ totalCountcategory }} موزیک می باشد و نمی توان آن را غیر فعال کرد
          </p>
          <template #footer>
            <Button label="باشه" @click="closeStatus()" icon="pi pi-check" class="p-button-outlined" />
          </template>
        </Dialog>
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

        <Paginator :rows="pageSize" :totalRecords="totalCount" aria-label="" @page="changePaging($event)"></Paginator>
      </div>
    </div>
  </div>
</template>
<script>
import { useToast } from "primevue/usetoast";
import { templateCategoryService, musicService } from "../../@core/services/index";
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Paginator from 'primevue/paginator';
import Button from 'primevue/button';
import toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import Column from 'primevue/column';
import NoData from '../../@core/components/NoData.vue'



export default {
  components: {
        Button,
        InputText,
        Dropdown,
        Paginator,
        toast,
        DataTable,
        Dialog,
        Column,
        NoData
      },
  data() {
    return {
      displayConfirmation: false,
      loading: {
        getData: false,
      },
      nullResults: false,
      display: false,
      displayStatus: false,
      ToDateInput: '',
      countUnder: '',
      ToDate: '',
      currentDate: '',
      FromDate: '',
      FromDateInput: '',
      templatedata: [],
      totalCount: 50,
      pageSize: 10,
      ticket: "",
      fullName: "",
      toast: useToast(),
      totalCountcategory: null,
      idConfirmation: '',
      filterCategory: {
        pageIndex: 1,
        PageSize: 10,
        Types: 0,
        IsActive: null,
        Query: null,
        
      },
      templatestatus: [
        { type: "همه", value: null },
        { type: "فعال  ", value: true },
        { type: " غیر فعال ", value: false },
      ],
    };
  },
  methods: {
    changePaging(e) {
      this.getdata(++e.page);
    },
    closeConfirmation() {
      this.displayConfirmation = false;
    },
    closeConfirmationYes() {
      this.displayConfirmation = false;
      let id = this.idConfirmation
      this.deleteCategory(id)

    },
    openConfirmation(id) {
      this.displayConfirmation = true;
      this.idConfirmation = id
    },
    open() {
      this.display = true;
    },
    openStatus() {
      this.displayStatus = true;
    },

    close() {
      this.display = false;

    },
    closeStatus() {
      this.displayStatus = false;

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
      this.toast.add({ severity: 'warn', summary: 'تغییر کرد ', detail: 'وضعیت دسته بندی تغییر کرد ', life: 3000 });
    },
    showError() {
      this.toast.add({ severity: 'error', summary: 'خطا', detail: ' عملیات با خطا مواجه شد', life: 3000 });
    },
    getCategoryData() {
      this.loading.getData = true;
      templateCategoryService.getCategory(this.filterCategory).then(({ data }) => {
        this.templatedata = data.data
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
    async changeStatus(id) {
      this.filterCategory.CategoryId = id
     await musicService.templateMusicId({ ...this.filterCategory }).then(({ data }) => {
        this.totalCountcategory = data.totalCount
        if (data.totalCount > 0) {
          this.openStatus()
        }
      }).catch((error) => {
        console.log(error);
      })
      if (this.totalCountcategory === 0) {
        await  templateCategoryService.changeActiveCategory(id).then(() => {
          this.showWarn()
          let find = this.templatedata.findIndex(item => item.id == id)
          this.templatedata[find].isActive = !(this.templatedata[find].isActive)
        }).catch((error) => {
          console.log(error);
        })
      }

    },
    async  deleteCategory(id){
      this.filterCategory.CategoryId = id
      await musicService.templateMusicId({ ...this.filterCategory }).then(({ data }) => {
        this.totalCountcategory = data.totalCount
        console.log("fghfghfh" , this.totalCountcategory);
        if (data.totalCount > 0) {
          this.open()
        }
      }).catch((error) => {
        console.log(error);
      })
      if (this.totalCountcategory == 0){
      await templateCategoryService.deleteCategory(id).then(()=>{
        this.templatedata = this.templatedata.filter((item) => item.id != id)
        this.showSuccess()
        console.log("ddd" , this.totalCountcategory);
      }).catch((error)=>{
        console.log(error);
        this.showError()
      })
      } 
    },


    filter() {
      this.getCategoryData();
      console.log("status", this.ticket);
    },
    editTemplate(data) {
    
      this.$router.push(`MusicCategoryEdit/${data.id}`)
      this.$store.state.CategoryName = data.name
    },


  },

  mounted() {
    this.getCategoryData();

  },

};
</script>