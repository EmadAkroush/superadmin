<template>
    <div class="card">
        <div v-for="(item, index) in dataUser" :key="index" class="m-2">
            <h4>آخرین درخواست</h4>
            <div class="logo-file mb-4">
                <img class="logo-file-pic h-full w-full"
                    :src="`http://37.156.144.29:5000/api/file/v1/File/Get${item.logoFileId}`">
            </div>
            <div class="grid p-3 background_user border-round-md shadow">
                <div class="col-12 md:col-3 p-3">
                    <span class="text-lg">تاریخ : </span>{{ new Date(item.responseAt).toLocaleDateString("fa-IR") }}
                </div>
                <div class="col-12 md:col-3 p-3">
                    <span class="text-lg">نام تجاری : </span>{{ item.name }}
                </div>
                <div class="col-12 md:col-3 p-3">
                    <span class="text-lg">نام شرکت : </span>{{ item.brandName }}
                </div>
                <div class="col-12 md:col-3 p-3">
                    <span class="text-lg">نام کاربری : </span>{{ item.agentProfile.firstName }}
                    {{ item.agentProfile.lastName }}
                </div>
                <div class="col-12 md:col-3 p-3">
                    <span class="text-lg">شماره تلفن شرکت : </span>{{ item.agentProfile.phoneNumber }}
                </div>
                <div class="col-12 md:col-3 p-3">
                    <span class="text-lg">کد ملی : </span>{{ item.agentProfile.nationalCode }}
                </div>
                <div class="col-12 md:col-3 p-3">
                    <span class="text-lg">سمت شغلی : </span>{{ item.agentProfile.jobPosition }}
                </div>
                <div class="col-12 md:col-3 p-3">
                    <span class="text-lg">شماره تلفن درخواست کننده : </span>{{ item.userRequested.phoneNumber }}
                </div>
                <div class="col-12 md:col-3 p-3">
                    <span class="ml-1">آگهی تغییرات شرکت : </span>
                    <a :href="`http://37.156.144.29:5000/api/file/v1/File/Get${item.noticeOfChangesFileId}`"><i
                            class="pi pi-download"></i></a>
                </div>
                <div class="col-12 md:col-3 p-3">
                    <span class="ml-1">نامه درخواست : </span>
                    <a :href="`http://37.156.144.29:5000/api/file/v1/File/Get${item.requestLetterFileId}`"><i
                            class="pi pi-download"></i></a>
                </div>
                <div v-if="item.userNewerRequestId" class="col-12 md:col-3 p-3">
                    <router-link @click="receiveAllRequests()" :to="`${item.userNewerRequestId}`" target='_blank'>آخرین
                        درخواست</router-link>
                </div>
                <div class="col-12 md:col-3 flex align-items-center p-3">
                    <div class="text-lg ml-2">وضعیت : </div>
                    <span class="text-lg" v-if="item.status == 0">در دست بررسی</span>
                    <span class="text-lg" v-if="item.status == 1">رد شده</span>
                    <span class="text-lg" v-if="item.status == 2">تایید شده</span>
                </div>
                <div v-if="item.rejectReason" class="col-12 p-3">
                    <span class="text-lg">دلیل رد شدن : </span>{{ item.rejectReason }}
                </div>
            </div>
            <div v-if="item.status == 0" class="grid mt-3">
            
                <div class="field col-12 md:col-1">
                    <Button @click="switching('1')" class="justify-content-center">تایید کردن</Button>
                </div>
                <div @click="statusRejectionMessage = true" class="field col-12 md:col-1">
                    <Button class="justify-content-center">رد
                        کردن</Button>
                </div>
            </div>
            <Dialog header="Header" v-model:visible="statusRejectionMessage">
                <template #header>
                    <h5 class="mt-2">دلیل رد کردن</h5>
                </template>
                <div>
                    <Textarea v-model="textRejectionMessage" :autoResize="true" placeholder="دلیل خود را وارد کنید ..."
                        rows="3" cols="60" />
                </div>
                <div class="field col-12 md:col-1">
                    <Button @click="switching('0')" class="justify-content-center"
                        :disabled="!textRejectionMessage">تایید</Button>
                </div>
            </Dialog>
        </div>
        <!----------------------------------- History ----------------------------------->
        <div v-if="statusHistory">
            <h4 v-if="dataUserHistory.length" class="mt-6 mb-4">تاریخچه درخواست ها</h4>
            <div v-for="(item, index) in dataUserHistory" :key="index" class="m-2">
                <div class="logo-file mb-4">
                    <img class="logo-file-pic h-full w-full"
                        :src="`http://37.156.144.29:5000/api/file/v1/File/Get${item.logoFileId}`">
                </div>
                <div class="grid p-3 background_user border-round-md shadow">
                    <div class="col-12 md:col-3 p-3">
                        <span class="text-lg">تاریخ : </span>{{ new Date(item.responseAt).toLocaleDateString("fa-IR") }}
                    </div>
                    <div class="col-12 md:col-3 p-3">
                        <span class="text-lg">نام تجاری : </span>{{ item.name }}
                    </div>
                    <div class="col-12 md:col-3 p-3">
                        <span class="text-lg">نام شرکت : </span>{{ item.brandName }}
                    </div>
                    <div class="col-12 md:col-3 p-3">
                        <span class="text-lg">نام کاربری : </span>{{ item.agentProfile.firstName }} {{
                            item.agentProfile.lastName }}
                    </div>
                    <div class="col-12 md:col-3 p-3">
                        <span class="text-lg">شماره تلفن شرکت : </span>{{ item.agentProfile.phoneNumber }}
                    </div>
                    <div class="col-12 md:col-3 p-3">
                        <span class="text-lg">کد ملی : </span>{{ item.agentProfile.nationalCode }}
                    </div>
                    <div class="col-12 md:col-3 p-3">
                        <span class="text-lg">سمت شغلی : </span>{{ item.agentProfile.jobPosition }}
                    </div>
                    <div class="col-12 md:col-3 p-3">
                        <span class="text-lg ml-1">آگهی تغییرات شرکت : </span>
                        <a :href="`http://37.156.144.29:5000/api/file/v1/File/Get${item.noticeOfChangesFileId}`"><i
                                class="pi pi-download"></i></a>
                    </div>
                    <div class="col-12 md:col-3 p-3">
                        <span class="text-lg ml-1">نامه درخواست : </span>
                        <a :href="`http://37.156.144.29:5000/api/file/v1/File/Get${item.requestLetterFileId}`"><i
                                class="pi pi-download"></i></a>
                    </div>
                    <div class="col-12 md:col-3 flex align-items-center p-3">
                        <div class="text-lg ml-2">وضعیت : </div>
                        <span class="text-lg">رد شده</span>
                    </div>
                    <div class="col-12">
                        <span class="text-lg">دلیل رد شدن : </span>{{ item.rejectReason }}
                    </div>
                </div>
            </div>
        </div>
        <Toast />
    </div>
</template>
  
<script>
import { organizationProfileService } from "../../@core/services/index"
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import Textarea from 'primevue/textarea';

export default {
    components: {
    Button,
    Dialog,
    Toast,
    Textarea
    },
    data() {
        return {
            loading: false,
            dataUser: [],
            dataUserHistory: [],
            companyId: [],
            pageIndex: 1,
            pageSize: 10,
            textRejectionMessage: null,
            statusRejectionMessage: false,
            statusHistory: null,
            filterCategory: {
                pageIndex: 1,
                pageSize: 20,
            }
        };
    },
    methods: {
        getData() {
            organizationProfileService.getOrganizationProfileDetails(this.userId).then(({ data }) => {
                this.dataUser = [data];
                this.dataUser[0].userNewerRequestId === null ? this.statusHistory = true : this.statusHistory = false
            }).catch((error) => {
                console.log(error);
            })
        },
        getDataHistory() {
            organizationProfileService.getDataHistory(this.userId , { ...this.filterCategory }).then(({data})=>{
                this.dataUserHistory = [...data.data];
            }).catch((error)=>{
                console.log(error);
            })
        },
        switching(status){
            if (status == '1') {
                organizationProfileService.switchingDataAccept(this.userId).then(()=>{
                    this.toast()
                    this.getData()
                })
            }
            if (status == '0') {
                organizationProfileService.switchingDataReject(this.userId).then(()=>{
                    this.toast()
                    this.getData()
                    this.statusRejectionMessage = false

                })
            }
        },
     
        // async switching(status) {
        //     if (status == '1') {
        //         await this.axios({
        //             method: "patch",
        //             url: `/api/identityprovider/v1/admin/organizationProfile/authenticationRequest/${this.userId}/accept`,
        //         });
        //         this.toast()
        //         this.getData()
        //     }
        //     if (status == '0') {
        //         await this.axios({
        //             method: "patch",
        //             url: `/api/identityprovider/v1/admin/organizationProfile/authenticationRequest/${this.userId}/reject`,
        //             data: { reason: this.textRejectionMessage }
        //         });
        //         this.statusRejectionMessage = false
        //         this.toast()
        //         this.getData()
        //     }
        // },
        toast() {
            this.$toast.add({ severity: 'success', summary: 'تایید شد', detail: 'تغییر وضعیت با موفقیت انجام شد', life: 5000 });
        },
    },
    mounted() {
        this.userId = this.$route.params.ticket_id;
        this.getData();
        this.getDataHistory();
    },
};
</script>
  
<style lang="scss">
.shadow {
    box-shadow: 0px 0px 2.2px rgba(0, 0, 0, 0.07),
        0px 0px 5.3px rgba(0, 0, 0, 0.049), 0px 0px 10px rgba(0, 0, 0, 0.031),
        0px 0px 17.9px rgba(0, 0, 0, 0.014), 0px 0px 33.4px rgba(0, 0, 0, 0.001),
        0px 0px 80px rgba(0, 0, 0, -0.005);
}

.background_user {
    background-color: #eeeffb;
}

.logo-file {
    width: 60px;
    height: 60px;

    &-pic {
        object-fit: cover;
        border-radius: 50%;
    }
}
</style>
  