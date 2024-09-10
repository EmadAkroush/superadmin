<template>
  <div>
    <div class="grid p-fluid animate__animated animate__fadeIn">
      <div class="col-12">
        <div class="card card-w-title">
          <div class="grid">
            <div class="col-12 mb-2 lg:col-6 lg:mb-0">
              <form @submit.prevent="handleSubmit(!v$.$invalid)">
                <h5>موزیک کارت هدیه</h5>
                <span class="p-float-label">
                  <div class="p-float-label">
                    <InputText id="username" type="text" v-model="nameMusic" />

                    <label for="username"> نام </label>
                  </div>
                  <small v-if="(v$.nameMusic.$invalid && submitted) || v$.nameMusic.$pending.$response" class="p-error">{{
                    v$.nameMusic.required.$message.replace("Value", "nameMusic") }}</small>
                </span>
                <h5>انتخاب دسته بندی</h5>
                <span class="p-float-label">

                  <Dropdown v-model="MusicId" :options="MusicOptions" optionLabel="name" placeholder=" انتخاب">
                    <template #footer>
                      <div class="flex justify-content-center align-items-center country-item">
                        <Paginator :rows="pageSize" :totalRecords="totalCount" aria-label="" @page="changePaging($event)">
                        </Paginator>
                      </div>

                    </template>
                  </Dropdown>
                  <!-- <span v-if="MusicId == ''" style="color: red">
                    حتما باید یک دسته بندی انتخاب شود
                  </span> -->
                  <small v-if="
                    (v$.MusicId.$invalid && submitted) ||
                    v$.MusicId.$pending.$response
                  " class="p-error">{{ v$.MusicId.required.$message.replace("Value", "MusicId") }}</small>
                </span>
                <div class="col-12 mb-2 mt-4 lg:col-6 lg:mb-0">
                  <span class="mt-8">
                    <input type="file" ref="uploader_ref" @change="getFiles($event)" hidden />
                    <Button label="آپلود موزیک " icon="pi pi-file" @click="$refs['uploader_ref'].click()" iconPos="right"
                      class="" v-model="resFile">
                      <div class="btn-send">آپلود موزیک</div>
                      <div class="loading" v-if="loading">
                        <span class="spinner spinner--quarter"></span>
                      </div>
                    </Button>
                    <small v-if="
                      (v$.resFile.$invalid && submitted) ||
                      v$.resFile.$pending.$response
                    " class="p-error">{{ v$.resFile.required.$message.replace("Value", "resFile") }}</small>
                  </span>
                </div>
                <div class="col-12 mb-2 lg:col-6 lg:mb-0">
                  <Button label="ارسال" class="mb-2" @click="postdata()" type="submit">
                  </Button>
                </div>
              </form>
              <Toast />
            </div>
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
import { musicService, fileService, templateCategoryService } from "../../@core/services/index";
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import toast from 'primevue/toast';
import Button from 'primevue/button';

export default {
  setup: () => ({ v$: useVuelidate() }),
  components: {
    Button,
    InputText,
    Dropdown,
    toast,
    },
  data() {
    return {
      pageSize: 10,
      totalCount: 30,
      data: "hold",
      MusicId: "",
      MusicOptions: [],
      nameMusic: "",
      resFile: "",
      files: [],
      categoryfilter: [],
      resFileFilter: "",
      loading: false,
      submitted: false,
      toast: useToast(),
      filterCategory: {
        pageIndex: 1,
        PageSize: 10,
        Types: 0,
        IsActive: true
      }
    };
  },
  validations() {
    return {
      nameMusic: {
        required: helpers.withMessage("نام نمی تواند خالی باشد", required),
      },

      resFile: {
        required: helpers.withMessage(
          "حتما باید یک دسته بندی را انتخاب کنید",
          required
        ),
      },
      MusicId: {
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
        musicService.postMusic({
          name: this.nameMusic,
          categoryId: this.MusicId.id,
          fileId: this.resFile,
        }).then(() => {
          this.submitted = false;
          this.restform()
          this.showSuccess()
        }).catch((error) => {
          console.log(error);
        })

      }
    },
    getCategoryData() {
      templateCategoryService.getCategory(this.filterCategory).then(({ data }) => {
        this.MusicOptions = data.data
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
        detail: " موزیک مورد نظر اضافه شد ",
        life: 3000,
      });
    },
    restform() {
      this.MusicId = "";
      this.nameMusic = "";
    },
    validate() {
      if (
        this.nameMusic.length > 0 &&
        this.MusicId != "" &&
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
