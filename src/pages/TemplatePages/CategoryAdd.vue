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
                    <InputText id="nameCategory" class="mb-2" v-model="v$.nameCategory.$model" :class="{
                      'p-invalid': v$.nameCategory.$invalid && submitted,
                    }" />
                    <label for="nameCategory"> نام </label>
                  </div>
                  <small v-if="
                    (v$.nameCategory.$invalid && submitted) ||
                    v$.nameCategory.$pending.$response
                  " class="p-error">{{ v$.nameCategory.required.$message.replace(  "Value", "nameCategory" )}}</small>
                  <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                    <Button type="submit" @click="postdata()" label="ارسال درخواست" class="mt-2" />
                  </div>
                </span>
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
// DRY: Dont repeat yourself
import { required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from 'primevue/usetoast';
import { templateCategoryService } from "../../@core/services/index";
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

//  :disabled="v$.$invalid"
export default {
  components: {
    Button,
    InputText,
    Toast
    },
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      nameCategory: "",
      inputError: "",
      submitted: false,
      Req: false,
      toast: useToast()
    };
  },
  validations() {
    return {
      nameCategory: {
        required: helpers.withMessage("نام نمی تواند خالی باشد", required),
      },
    };
  },
  mounted() { },
  methods: {
    async postdata(){
      const result = await this.v$.$validate();
      if (result) {
      templateCategoryService.addCategory(  {
            name: this.nameCategory,
            type: 1,
          }).then(()=>{
            this.submitted = false;
            this.restform();
            this.showSuccess();
          }).catch((error)=>{
            console.log(error);
          }).finally(()=>{
            this.submitted = false;
          })
      }
    },
    handleSubmit(isFormValid) {
      this.submitted = true;

      if (!isFormValid) {
        this.Req = true;
        return;
      }
    },
    restform() {
      this.nameCategory = "";

    },
 
  
    showSuccess() {
      this.toast.add({
        severity: "success",
        summary: " اضافه شد ",
        detail: "دسته بندی مورد نظر اضافه شد ",
        life: 3000,
      });
    },

   
  },

  computed: {},
};
</script>
<style scoped>
#warning {
  margin-top: 10px;
}
</style>