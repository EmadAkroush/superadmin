<template>
  <div class="grid p-fluid animate__animated animate__fadeIn">
    <div class="col-12">
      <div class="card card-w-title">
        <div class="grid">
          <div class="col-12 mb-2 lg:col-6 lg:mb-0">
            <form @submit.prevent="handleSubmit(!v$.$invalid)">
              <h5>تمپلیت کارت هدیه</h5>
              <span class="p-float-label">
                <div class="p-float-label">
                  <InputText id="nameTemplate" v-model="v$.nameTemplate.$model" :class="{
                    'p-invalid': v$.nameTemplate.$invalid && submitted,
                  }" />
                  <label for="nameTemplate"> نام </label>
                </div>

                <small v-if="
                  (v$.nameTemplate.$invalid && submitted) ||
                  v$.nameTemplate.$pending.$response
                " class="p-error">{{ v$.nameTemplate.required.$message.replace("Value", "nameTemplate") }}</small>
              </span>
              <h5>انتخاب دسته بندی</h5>
              <span class="p-float-label">
                <Dropdown v-model="v$.categoryId.$model" :options="templateId" optionLabel="name" placeholder=" انتخاب">
                  <template #footer>
                    <div class="flex justify-content-center align-items-center country-item">
                      <Paginator :rows="pageSize" :totalRecords="totalCount" aria-label="" @page="changePaging($event)">
                      </Paginator>
                    </div>

                  </template>
                </Dropdown>
                <!-- <span v-if="categoryId == ''" style="color: red">
                  حتما باید یک دسته بندی انتخاب شود
                </span> -->
                <small v-if="
                  (v$.categoryId.$invalid && submitted) ||
                  v$.categoryId.$pending.$response
                " class="p-error">{{ v$.categoryId.required.$message.replace("Value", "categoryId") }}</small>
              </span>
              <div class="mt-4">
                <h5>انتخاب رنگ لوگو</h5>
                <Dropdown v-model="selectedLogoColor" :options="templateLogoColor" optionLabel="name"
                  optionValue="value" />


                <small v-if="(v$.selectedLogoColor.$invalid && submitted) || v$.selectedLogoColor.$pending.$response"
                  class="p-error">{{
                    v$.selectedLogoColor.required.$message.replace("Value", "selectedLogoColor") }}</small>
              </div>
              <div class="col-12 mb-2 mt-4 lg:col-6 lg:mb-0">
                <span class="mt-8">
                  <input type="file" ref="uploader_ref" @change="getFiles($event)" hidden />
                  <Button label="آپلود عکس" icon="pi pi-file" @click="$refs['uploader_ref'].click()" iconPos="right"
                    class="" v-model="resFile">
                    <div class="btn-send">آپلود عکس</div>
                    <div class="loading" v-if="loading">
                      <span class="spinner spinner--quarter"></span>
                    </div>
                  </Button>
                  <!-- <span v-if="resFile == ''" style="color: red">
                    حتما باید یک فایل را انتخاب کنید
                  </span> -->
                  <small v-if="
                    (v$.resFile.$invalid && submitted) || v$.resFile.$pending.$response" class="p-error">{{
    v$.resFile.required.$message.replace("Value", "resFile") }}</small>
                </span>
              </div>
              <div class="col-12 mb-2 lg:col-6 lg:mb-0">
                <Button type="submit" label="ارسال" class="mb-2" @click="postdata()">
                </Button>
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
import { useToast } from 'primevue/usetoast';
import { templateService, fileService, templateCategoryService } from "../../@core/services/index";
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Paginator from 'primevue/paginator';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

export default {
  setup: () => ({ v$: useVuelidate() }),
  components: {
    Button,
    InputText,
    Dropdown,
    Paginator,
    Toast
    },
  data() {
    return {
      nameTemplate: "",
      categoryId: "",
      templateId: [],
      templateLogoColor: [
        { name: 'سفید', value: 0 },
        { name: 'سیاه', value: 1 },
        { name: 'سرمه ای', value: 2 },
      ],
      selectedLogoColor: "",
      resFile: "",
      files: [],
      categoryfilter: [],
      loading: false,
      submitted: false,
      toast: useToast(),
      pageSize: 10,
      totalCount: 30,
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
      nameTemplate: {
        required: helpers.withMessage("نام نمی تواند خالی باشد", required),
      },
      categoryId: {
        required: helpers.withMessage(
          "حتما باید یک دسته بندی انتخاب کنید",
          required
        ),
      },
      selectedLogoColor: {
        required: helpers.withMessage(
          "حتما باید یک رنگ را انتخاب کنید",
          required
        ),
      },
      resFile: {
        required: helpers.withMessage(
          "حتما باید یک فایل را انتخاب کنید",
          required
        ),
      },
    };
  },
  methods: {   
    postdata() {
      const result = this.v$.$validate();
      if (result) {
        templateService.postTemplate({
          name: this.nameTemplate,
          categoryId: this.categoryId.id,
          fileId: this.resFile,
          color: this.selectedLogoColor
        }).then(() => {
          this.restform()
          this.showSuccess()
        }).catch((error)=>{
          console.log(error);
        }).finally(()=>{
          this.submitted = false;
        })

      }
    },
    getCategoryData() {
      templateCategoryService.getCategory(this.filterCategory).then(({ data }) => {
        this.templateId = data.data
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
      let formData = new FormData();
      formData.append("Title", item.name);
      formData.append("ServiceType", "identityprovider");
      formData.append("IsPublic", true);
      formData.append("File", item);

      await fileService.createFile(formData).then(({ data }) => {
        this.resFile = data.slice(1);
        console.log("res file", this.resFile);
        item["id"] = data;
        this.files.push(item);
        console.log(this.files);
      }).catch((error) => {
        console.log(error);
      })
      this.loading = false;
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


    showSuccess() {
      this.toast.add({
        severity: "success",
        summary: " اضافه شد ",
        detail: " تمپلیت مورد نظر اضافه شد  ",
        life: 3000,
      });
    },
    restform() {
      this.nameTemplate = "";
      this.categoryId = "";
      this.selectedLogoColor = "";
    },

    sendTemplate() {
      console.log("my data is best practice in wo", this.categoryId.value);
    },
 

    validate() {
      if (
        this.nameTemplate.length > 0 &&
        this.categoryId != "" &&
        this.resFile != ""
      ) {
        return false;
      } else {
        return true;
      }
    },
  },

  mounted() {
    this.getCategoryData();
  },
};
</script>
<style>
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
