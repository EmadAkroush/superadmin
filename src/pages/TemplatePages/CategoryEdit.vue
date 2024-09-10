<template>
  <div class="grid p-fluid animate__animated animate__fadeIn">
    <div class="col-12">
      <div class="card card-w-title">
        <div class="grid">
          <div class="col-12 mb-2 lg:col-6 lg:mb-0">
            <form @submit.prevent="handleSubmit(!v$.$invalid)">
              <div class="col-12 mb-2 lg:col-12 lg:mb-0">
                <h5>نام جدید دسته بندی</h5>
                <span class="p-float-label mt-6">
                  <div class="p-float-label">
                    <InputText type="text" v-model="v$.newNameCategory.$model" :class="{
                      'p-invalid': v$.newNameCategory.$invalid && submitted,
                    }" />
                    <label for="username"> نام </label>
                  </div>
                  <small v-if="
                    (v$.newNameCategory.$invalid && submitted) ||
                    v$.newNameCategory.$pending.$response
                  " class="p-error">{{ v$.newNameCategory.required.$message.replace("Value", "newNameCategory") }}</small>
                </span>
              </div>
              <div class="col-12 mb-2 lg:col-4 lg:mb-0">
                <Button type="submit" @click="postdata()" label="ارسال درخواست" class="mr-2 mb-2 mt-4"></Button>
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
import { templateCategoryService } from "../../@core/services/index";
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from 'primevue/toast';


export default {
  components: {
    Button,
    InputText,
    Toast
    },
  setup: () => ({ v$: useVuelidate() }),
 
  data() {
    return {
      newNameCategory: this.$store.state.CategoryName,
      categoryId: "",
      submitted: false,
      toast: useToast()
    };
  },
  validations() {
    return {
      newNameCategory: {
        required: helpers.withMessage("نام نمی تواند خالی باشد", required),
      },
    };
  },
  methods: {
    async postdata() {
      const result = await this.v$.$validate();
      if (result) {
        templateCategoryService.editCategory(this.categoryId, {
          name: this.newNameCategory,
        }).then(() => {
          this.showSuccess();
          this.$router.push('/templatecategory')

        }).catch((error) => {
          console.log(error);
        }).finally(()=>{
          this.submitted = false;
        })
      }
    },
    handleSubmit(isFormValid) {
      this.submitted = true;

      if (!isFormValid) {
        return;
      }
    },
    restform() {
      this.newNameCategory = "";

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
  mounted() {
    this.categoryId = this.$route.params.category_id;
  },
};
</script>