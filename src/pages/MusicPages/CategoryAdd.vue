<template>
  <div class="grid p-fluid animate__animated animate__fadeIn">
    <div class="col-12">
      <div class="card card-w-title">
        <div class="grid">
          <div class="col-12 mb-2 lg:col-6 lg:mb-0">
            <div class="col-12 mb-2 lg:col-12 lg:mb-0">
              <form @submit.prevent="handleSubmit(!v$.$invalid)">
                <h5>نام دسته بندی</h5>
                <span class="p-float-label mt-6">
                  <div class="p-float-label">
                    <InputText id="username" class="mb-2" type="text" v-model="v$.nameCategory.$model" :class="{
                      'p-invalid': v$.nameCategory.$invalid && submitted,
                    }" />
                    <label for="username"> نام </label>
                  </div>
                  <small v-if="(v$.nameCategory.$invalid && submitted) || v$.nameCategory.$pending.$response"
                    class="p-error">{{ v$.nameCategory.required.$message.replace("Value", "nameCategory") }}</small>
                  <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                    <Button type="submit" @click="postdata()" label="ارسال درخواست" class="mr-2 mb-2 mt-4"></Button>
                  </div>
                </span>

              </form>
              <Toast class="my-toast" />
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
import { templateCategoryService } from "../../@core/services/index";
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import Button from 'primevue/button';

export default {
  setup: () => ({ v$: useVuelidate() }),
  components: {
    Button,
    InputText,
    Toast
    },
  data() {
    return {
      nameCategory: "",
      inputError: "",
      submitted: false,
      toast: useToast(),
    };
  },
  validations() {
    return {
      nameCategory: {
        required: helpers.withMessage("نام نمی تواند خالی باشد", required),
      },
    };
  },

  methods: {
    async postdata() {
      const result = await this.v$.$validate();
      if (result) {
        templateCategoryService.addCategory({
          name: this.nameCategory,
          type: 0,
        }).then(() => {
          this.restform();
          this.showSuccess();
        }).catch((error) => {
          console.log(error);
        }).finally(()=>{
          this.submitted = false;
        })
      }
    },
    showSuccess() {
      this.toast.add({
        severity: "success",
        summary: " اضافه شد ",
        detail: " دسته بندی مورد نظر اضافه شد ",
        life: 3000000,
      });
    },
    restform() {
      this.nameCategory = "";

    },
    handleSubmit(isFormValid) {
      this.submitted = true;

      if (!isFormValid) {
        return;
      }
    },

    validate() {
      if (this.nameCategory == "") {
        this.inputError = "پر کردن این فیلد اجباری است ";
      } else {
        this.inputError = "";
      }
    },
  },

};
</script>
<style scoped>
#warning {
  margin-top: 10px;
}
</style>
