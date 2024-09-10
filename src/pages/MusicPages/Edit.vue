<template>
  <div class="grid p-fluid animate__animated animate__fadeIn">
    <div class="col-12">
      <div class="card card-w-title">
        <div class="grid">
          <div class="col-12 mb-2 lg:col-4 lg:mb-0">
            <form @submit.prevent="handleSubmit(!v$.$invalid)">
              <h5>نام جدید موزیک</h5>
              <span class="p-float-label">
                <div class="p-float-label">
                  <InputText id="username" type="text" v-model="v$.Musicname.$model" :class="{
                    'p-invalid': v$.Musicname.$invalid && submitted,
                  }" />
                  <label for="username"> نام </label>
                </div>
                <small v-if="(v$.Musicname.$invalid && submitted) || v$.Musicname.$pending.$response" class="p-error">{{
                  v$.Musicname.required.$message.replace("Value", "Name") }}</small>
              </span>
              <h5> نام دسته بندی جدید </h5>
              <Dropdown v-model="MusicModel" :options="DropdownMusic" optionLabel="name" placeholder="انتخاب">
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
                    <audio controls>
                      <source :src="this.href + resFile" type="audio/ogg">

                    </audio>

                    <Button icon="pi pi-trash" @click="removeFile()"
                      class="p-button-rounded p-button-danger trash-image-button" />
                  </div>
                </div>
                <h5> موزیک جدید را آپلود کنید </h5>
                <span class="m-2">
                  <input type="file" ref="uploader_ref" @change="getFiles($event)" hidden />

                  <Button label="آپلود فایل" icon="pi pi-file" @click="$refs['uploader_ref'].click()" iconPos="right"
                    class="" v-model="resFile" :disabled="fileselect">
                    <div class="btn-send">آپلود موزیک</div>
                    <div class="loading" v-if="loading">
                      <span class="spinner spinner--quarter"></span>
                    </div>
                  </Button>
                  <!-- <span v-if="resFile == ''" style="color:red "> حتما باید یک فایل را انتخاب کنید </span> -->
                  <!-- <small v-if=" (v$.resFile.$invalid && submitted) | v$.resFile.$pending.$response " class="p-error">{{v$.resFile.required.$message.replace("Value", "resFile")}}</small> -->
                </span>
              </div>
              <div class="col-6 mb-2 lg:col-6 lg:mb-0">
                <Button type="submit" :disabled="sendRequst" @click="editData()" label="ارسال درخواست"
                  class="mr-2 mb-2 mt-4">

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
import { useToast } from "primevue/usetoast";
import { musicService, fileService, templateCategoryService } from "../../@core/services/index";
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Paginator from 'primevue/paginator';
import Button from 'primevue/button';
import toast from 'primevue/toast';

export default {
  components: {
    Button,
    InputText,
    Dropdown,
    Paginator,
    toast
    },
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      pageSize: 10,
      totalCount: 30,
      MusicModel: this.$store.state.MusicEdit.categoryname,
      DropdownMusic: [],
      fileselect: true,
      displayNone: true,
      Musicname: this.$store.state.MusicEdit.name,
      MusicData: "",
      musicId: "",
      musicIdtest: "",
      resFile: this.$store.state.MusicEdit.fileId,
      files: [],
      href: "",
      submitted: false,
      loading: false,
      toast: useToast(),
      filterCategory: {
        pageIndex: 1,
        PageSize: 10,
        Types: 0,
        IsActive: true
      },
      sendRequst: false
    };
  },
  validations() {
    return {
      Musicname: {
        required: helpers.withMessage("نام نمی تواند خالی باشد", required),
      },

    };
  },
  methods: {
    async editData() {
      const result = this.v$.$validate();
      if (result) {
        await musicService.editMusic(this.musicId, {
          name: this.Musicname,
          fileId: this.resFile,
          categoryId: this.MusicModel.id,
        }).then(() => {
          console.log("id data" , this.musicId);
          this.showSuccess();
          this.$router.push('/musiclist')
        }).catch((error) => {
          console.log(error);
          this.showError();

        })
      }
    },
    getCategoryData() {
      templateCategoryService.getCategory(this.filterCategory).then(({ data }) => {
        this.DropdownMusic = data.data

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
      }).finally(() => {
        this.loading = false;
      })
    },

    changePaging({ page }) {

      ++page
      this.filterCategory.pageIndex = page
      this.getCategoryData()
    },
    removeFile() {
      this.resFile = ""
      this.displayNone = false
      this.fileselect = false
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
        detail: " موزیک مورد نظر ادیت شد",
        life: 3000,
      });
    },
    showError() {
      this.toast.add({ severity: 'error', summary: 'خطا', detail: ' عملیات با خطا مواجه شد', life: 3000 });
    },
    restform() {
      this.Musicname = "";
      this.MusicModel = "";
    },
  
    // async Updatedata() {
    //   const result = await this.v$.$validate()
    //   if (result) {
    //     try {
    //       const { data, status } = await this.axios.put(
    //         `giftcard/api/v1/admin/sound/${this.musicId}`,
    //         {
    //           name: this.Musicname,
    //           fileId: this.resFile,
    //           categoryId: this.MusicModel.value,
    //         }
    //       );
    //       console.log("status", status);
    //       if (status === 200) {

    //         this.showSuccess();
    //         this.$router.push('/musiclist')
    //       } else {
    //         this.showError();
    //       }
    //       this.MusicData = data;
    //       console.log("data", this.MusicData);
    //       console.log("music model", this.MusicModel.value);
    //       console.log("res file", this.resFile);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // },
 

    validate() {
      if (this.Musicname.length > 0 || this.resFile != "") {
        return false;
      } else {
        return true;
      }
    },
  },
  mounted() {
    this.musicId = this.$route.params.Music_id;
    this.getCategoryData();
 
  },
  beforeMount(){
    this.href = process.env.VUE_APP_BASE_URL_File
  }
};
</script>
<style >
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
