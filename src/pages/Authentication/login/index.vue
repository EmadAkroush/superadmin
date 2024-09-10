<template>
  <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <Toast />
    <div class="grid justify-content-center p-2 lg:p-0" style="min-width: 80%">
      <div class="col-12 mt-5 xl:mt-0 text-center">
        <!-- 'layout/images/logo-' + logoColor + '.svg' -->
        <img src="images/avatar/logo.jpg" class="mb-5 animate__animated animate__fadeIn" style="width: 81px; height: 60px" />
      </div>
      <div class="col-12 xl:col-6 animate__animated animate__fadeIn" style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 80%)">
        <div class="h-full w-full m-0 py-7 px-4" style="border-radius: 53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0))">
          <div class="text-center mb-5">
            <div class="text-900 text-3xl font-medium mb-3">خوش آمدید</div>
            <span class="text-600 font-medium">برای ادامه ورود نمایید</span>
          </div>
          <form @submit.prevent="login(!v$.$invalid)" class="w-full md:w-10 mx-auto">
            <label for="email1" class="block text-900 text-md font-medium my-3">نام کاربری</label>
            <InputText id="email1" v-model.trim="v$.phoneNumber.$model" type="text" class="w-full mb-0" dir="ltr" @input="v$.phoneNumber.$touch()" @blur="v$.phoneNumber.$touch()" :class="{ 'border-red-500 hover:border-red-500 focus:shadow-none': v$.phoneNumber.$error }" />
            <div v-if="v$.phoneNumber.$dirty">
              <small v-if="v$.phoneNumber.minLength.$invalid" ref="username_error_message" class="text-red-500">
                {{ v$.phoneNumber.minLength.$message }}
              </small>
            </div>
            <!-- {{$v.phoneNumber.$dirty}} -->
            <label for="userPassword" class="block text-900 font-medium text-md my-3">رمز عبور</label>
            <InputText id="userPassword" v-model.trim="v$.password.$model" type="password" class="w-full mb-3" dir="ltr" @input="v$.password.$touch()" @blur="v$.password.$touch()" :class="{ 'border-red-500 hover:border-red-500 focus:shadow-none': v$.password.$error }" />
            <div v-if="v$.password.$dirty">
              <small v-if="v$.password.minLength.$invalid" ref="password_error_message" class="text-red-500"> تعداد رقم های وارد شده کمتر از حد مجاز است </small>
              <small v-if="v$.password.required.$invalid" ref="password_error_message" class="text-red-500"> این فیلد الزامی است </small>
            </div>
            <div class="flex align-items-center justify-content-between my-5">
              <div class="flex align-items-center">
                <Checkbox v-model="checked" :binary="true" class="mr-2"></Checkbox>
                <label for="rememberme1" class="text-700 mr-1">مرا به خاطر داشته باش</label>
              </div>
              <!-- <router-link to="/forget-password" class="font-medium no-underline ml-2 text-right cursor-pointer">فراموشی رمز عبور</router-link> -->
            </div>
            <Button :disabled="v$.$invalid" :loading="loading" type="submit" label="ورود" class="w-full p-3"></Button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import InputText from 'primevue/inputtext';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
// let phone_exp =  new RegExp(/^(\+98|0098|98|0)?9\d{9}$/g);

// const contains = (value) => phone_exp.test(value);
export default {
  components: {
    Button,
    InputText,
    Toast,
    },
  name: "login",
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      phoneNumber: "",
      password: "",
      checked: false,
      loading: false,
      display: false,
      isFormCorrect: false,
    };
  },
  computed: {
    logoColor() {
      if (this.$appState.darkTheme) return "white";
      return "dark";
    },
  },
  methods: {
    async login(isValid) {
      if (isValid) {
        this.loading = true;
        const { status } = await this.$auth.login({
          userName: this.phoneNumber,
          password: this.password,
        });
        if (status === 200) {
          this.$toast.add({ severity: "success", summary: "ورود", detail: "خوش آمدید", life: 1000 });
          setTimeout(() => {
            this.loading = false;
            this.$router.push("/");
          }, 500);
        } else {
          this.$toast.add({ severity: "error", summary: "تایید", detail: "عملیات با خطا مواجه شد", life: 1000 });
          this.loading = false;
        }
      }
    },
  },
  async mounted() {
    // this.isFormCorrect = await this.v$.$validate()
    // const isFormCorrect = await this.v$.$validate()
  },
  validations() {
    return {
      phoneNumber: {
        minLength: helpers.withMessage("تعداد کاراکتر کمتر از 8 رقم می باشد", minLength(9)),
        required,
        $dirty: false,
      },
      password: {
        minLength: helpers.withMessage("تعداد کاراکتر کمتر از 8 رقم می باشد", minLength(9)),
        required,
        $autoDirty: true,
      },
    };
  },
};
</script>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}

.fadeIn {
  animation: fade-in 2s;
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
