<template>
  <div class="grid p-fluid animate__animated animate__fadeIn">
    <div class="col-12">
      <div class="card card-w-title">
        <div class="grid">
          <div class="col-12 mb-2 lg:col-4 lg:mb-0">
            <form @submit.prevent="handleSubmit(!v$.$invalid)">
              <h5>نام جدید طرح</h5>
              <span class="p-float-label">
                <div class="p-float-label">
                  <InputText id="username" type="text" v-model="v$.Name.$model" :class="{
                    'p-invalid': v$.Name.$invalid && submitted,
                  }" />

                  <label for="username"> نام </label>
                </div>
                <small v-if="
                  (v$.Name.$invalid && submitted) ||
                  v$.Name.$pending.$response
                " class="p-error">{{ v$.Name.required.$message.replace("Value", "Name") }}</small>
              </span>
              <h5>نام دسته بندی جدید</h5>
              <Dropdown v-model="categoryModel" change :options="dropdownValues" optionLabel="name" placeholder="انتخاب"
               >
                <template #footer>
                  <div class="flex justify-content-center align-items-center country-item">
                    <Paginator :rows="pageSize" :totalRecords="totalCount" aria-label="" @page="changePaging($event)">
                    </Paginator>
                  </div>

                </template>
              </Dropdown>


              <div class="col-6 mb-2 mt-4 lg:col-6 lg:mb-0">
                <div class="flex flex-wrap" v-if=displayNone>
                  <div class="card show-image h-full p-2">
                    <Image :src="this.href + resFile" alt="Image"
                      class="img-class" preview />
                    <Button icon="pi pi-trash" @click="removeFile()"
                      class="p-button-rounded p-button-danger trash-image-button" />
                  </div>
                </div>
                <h5>فایل جدید را آپلود کنید</h5>
                <span class="m-2">
                  <input type="file" ref="uploader_ref" @change="getFiles($event)" hidden />

                  <Button label="آپلود تصویر" icon="pi pi-file" @click="$refs['uploader_ref'].click()" iconPos="right"
                    class="" v-model="resFile" :disabled="fileselect" > 
                    <div class="btn-send">آپلود تصویر</div>
                    <div class="loading" v-if="loading">
                      <span class="spinner spinner--quarter"></span>
                    </div>
                  </Button>

                </span>

              </div>

              <div class="col-6 mb-2 lg:col-6 lg:mb-0">
                <Button type="submit" @click="editData()" label="ارسال درخواست " class="mr-2 mb-2 mt-4"></Button>

              </div>
            </form>
            <Toast />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { templateService, fileService, templateCategoryService } from "../../@core/services/index";
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Paginator from 'primevue/paginator';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Image from 'primevue/image';



export default {
  setup: () => ({ v$: useVuelidate() }),
  components: {
    Button,
    InputText,
    Dropdown,
    Paginator,
    Toast,
    Image
    },
  data() {
    return {
      pageSize: 10,
      totalCount: 30,
      mycount: 0,
      loading: false,
      fileselect: true,
      Templatedata: "",
      templateId: "",
      category: [],
      displayNone: true,
      dropdownValues: [],
      href: "",
      logoColorModel: this.$store.state.TemplateEdit.color,
      templateLogoColor: [
        { name: 'سفید', value: 0 },
        { name: 'سیاه', value: 1 },
        { name: 'سرمه ای', value: 2 },
      ],
      categoryModel: this.$store.state.TemplateEdit.categoryname,
      Name: this.$store.state.TemplateEdit.name,
      resFile: this.$store.state.TemplateEdit.fileId,
      files: [],
      submitted: false,
      toast: useToast(),
      filterCategory: {
        pageIndex: 1,
        PageSize: 10,
        Types: 1,
        IsActive: true

      }
    };
  },
  validations() {
    return {
      Name: {
        required: helpers.withMessage("نام نمی تواند خالی باشد", required),
      },

    };
  },
  methods: {
    async editData() {
      const result = this.v$.$validate();
      if (result) {
        await templateService.editTemplate(this.templateId, {
          name: this.Name,
          fileId: this.resFile,
          categoryId: this.categoryModel.id,
          color: this.logoColorModel
        }).then(() => {
          console.log("iopo", this.$store.state.TemplateEdit.categoryname);
          this.submitted = false;
          this.showSuccess();
          this.$router.push('/templatelist')
        }).catch((error) => {
          console.log(error);
          this.showError();
        }).finally(()=>{
          this.submitted = false;
        })
      }
    },
    getCategoryData() {
      templateCategoryService.getCategory(this.filterCategory).then(({ data }) => {
        this.dropdownValues = data.data
        

      }).catch((error) => {
        console.log(error);
      })
    },
    getFiles(event) {
      this.loading = true;
      let target = event.target;
      let lastIndex = target.files.length - 1;
      target.files[lastIndex]["src"] = URL.createObjectURL(
        target.files[lastIndex]
      );
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        target.files[lastIndex].binary = reader.result;
      });
      reader.readAsBinaryString(target.files[lastIndex]);

      this.uploadFile(target.files[lastIndex]);
    },
    async uploadFile(item) {
      console.log(item);
      let formData = await new FormData();
      formData.append("Title", item.name);
      formData.append("ServiceType", "identityprovider");
      formData.append("IsPublic", true);
      formData.append("File", item);
      console.log("formData", formData);
      await fileService.createFile(formData).then(({ data }) => {
        this.resFile = data.slice(1);
        console.log("res file", this.resFile);
        item["id"] = data;
        this.files.push(item);
        console.log(this.files);
      }).catch((error) => {
        console.log(error);
      }).finally(()=>{
        this.loading = false;
      })

    },
    changePaging({ page }) {

      ++page
      this.filterCategory.pageIndex = page
      this.getCategoryData()
    },
    handleSubmit(isFormValid) {
      this.submitted = true;

      if (!isFormValid) {
        return;
      }
    },
    removeFile() {
      this.resFile = ""
      this.displayNone = false
      this.fileselect = false
    },
    showSuccess() {
      this.toast.add({
        severity: "success",
        summary: " ویرایش شد",
        detail: " تمپلیت مورد نظر ویرایش شد ",
        life: 3000,
      });
    },
    showError() {
      this.toast.add({ severity: 'error', summary: 'خطا', detail: ' عملیات با خطا مواجه شد', life: 3000 });
    },
    restform() {
      this.categoryModel = "";
      this.Name = "";
    },
   
    validate() {
      if (this.Name.length > 0 || this.resFile != "") {
        return false;
      } else {
        return true;
      }
    },
  },

  mounted() {
    this.templateId = this.$route.params.template_id;
    
    this.getCategoryData();

  },
  beforeMount(){
    this.href = process.env.VUE_APP_BASE_URL_File
  }

};
</script>
<style>
.img-class img {
  width: 400px;
  height: 250px;
}
.btn-send {
  margin: 0 auto;
}

.loading {
  margin: 0 auto 0 0;

  width: 10%;

  display: flex;
  justify-content: space-around;
  align-items: center;
}

/* Keyframes Spin */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Spinner */
.spinner {
  --spinner-color: black;

  aspect-ratio: 1/1;
  border-radius: 50%;

  animation-name: spin;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.spinner--quarter {
  width: 48px;
  border: 5px solid var(--spinner-color);
  border-top-color: transparent;

  animation-duration: 1s;
}

.spinner--dotted {
  width: 48px;
  border: 5px dotted var(--spinner-color);

  animation-duration: 5s;
}

.spinner--hourglass {
  width: 58px;
  background: repeating-conic-gradient(transparent 0deg 90deg,
      var(--spinner-color) 90deg 180deg);

  animation-duration: 2s;
}
</style>