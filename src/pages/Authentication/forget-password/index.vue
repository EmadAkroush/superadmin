<template>
    <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
            <div class="col-12 mt-5 xl:mt-0 text-center">
                <img :src="'layout/images/logo-' + logoColor + '.svg'" alt="Sakai logo" class="mb-5 fadeIn"
                    style="width:81px; height:60px;">
            </div>
            <div class="col-12 xl:col-6 fadeIn"
                style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 30%);">
                <div class="h-full w-full m-0 py-7 px-4"
                    style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
                    <div class="text-center mb-5">
                        <!-- <img src="layout/images/avatar.png" alt="Image" height="50" class="mb-3"> -->
                        <div class="text-900 text-3xl font-medium mb-3">فراموشی رمز عبور</div>
                        <!-- <span class="text-600 font-medium">برای ادامه ورود نمایید</span> -->
                    </div>

                    <div class="w-full md:w-10 mx-auto">
                        <label for="email1" class="block text-900 text-md font-medium mb-2">نام کاربری</label>
                        <InputText id="email1" v-model="email" type="text" class="w-full mb-3" dir="ltr" />

                        <label for="password1" class="block text-900 font-medium text-md mb-2">رمز عبور</label>
                        <InputText id="password1" v-model="password" type="password" class="w-full mb-3" dir="ltr" />

                        <div class="flex align-items-center justify-content-between mb-5">
                            <div class="flex align-items-center">
                                <Checkbox id="rememberme1" v-model="checked" :binary="true" class="mr-2"></Checkbox>
                                <label for="rememberme1" class="text-600 mr-1">مرا به خاطر داشته باش</label>
                            </div>
                            <router-link to="/forgot-password"
                                class="font-medium no-underline ml-2 text-right cursor-pointer">فراموشی رمز
                                عبور</router-link>
                        </div>
                        <Button label="ورود " class="w-full p-3 text-lg"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
export default {
    name: "forget-pass",
    components: {
    Button,
    InputText
    },
    data() {
        return {
            email: '',
            password: '',
            checked: false
        }
    },
    computed: {
        logoColor() {
            if (this.$appState.darkTheme) return 'white';
            return 'dark';
        }
    }
}
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
}</style>