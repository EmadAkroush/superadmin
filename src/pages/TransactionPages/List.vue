<template>
    <div>
        <div class="grid p-fluid animate__animated animate__fadeIn">
            <div class="col-12">
                <div class="card card-w-title">
                    <div class="grid">
                        <div class="field col-12 md:col-3">
                            <p>
                                جستجو در تراکنش
                            </p>
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText type="text" v-model="filterCategory.Query" placeholder="جستجو...." />
                            </span>
                        </div>
                        <div class="field col-12 md:col-3">
                            <p>
                                شماره رهگیری
                            </p>
                            <span class="p-input-icon-left">

                                <InputText type="text" v-model="filterCategory.TrackingNumber" placeholder="جستجو...." />
                            </span>
                        </div>
                        <div class="field col-12 md:col-3">
                            <p>
                                نوع تراکنش
                            </p>
                            <Dropdown v-model="filterCategory.transaction" :options="transactionType" optionLabel="type"
                                optionValue="value" placeholder="همه" />
                        </div>
                        <div class="field col-12 md:col-3">
                            <p>
                                وضعیت تراکنش
                            </p>
                            <Dropdown v-model="filterCategory.Status" :options="transactionStatus" optionLabel="type"
                                optionValue="value" placeholder="همه" />
                        </div>
                        <div class="field col-12 md:col-3">
                            <p>
                                فیلتر از تاریخ
                            </p>
                            <span class="p-input-icon-left">
                                <i v-if="!filterCategory.FromDate" style="font-size: 1.5rem" class="pi pi-calendar" />
                                <i v-else @click="filterCategory.FromDate = null" style="font-size: 1.5rem"
                                    class="pi pi-calendar-times cursor-pointer" />
                                <InputText dir="rtl" v-model="FromDateInput" type="text" id="fromCalendarInputId"
                                    placeholder="از تاریخ" />
                            </span>
                            <custom-date-picker auto-submit v-model="filterCategory.FromDate" :max="currentDate"
                                format="YYYY-MM-DD" display-format="jYYYY/jMM/jDD" custom-input="#fromCalendarInputId" />
                        </div>
                        <div class="field col-12 md:col-3">
                            <p>
                                تا تاریخ
                            </p>
                            <span class="p-input-icon-left">
                                <i v-if="!filterCategory.ToDate" style="font-size: 1.5rem" class="pi pi-calendar" />
                                <i v-else @click="filterCategory.ToDate = null" style="font-size: 1.5rem"
                                    class="pi pi-calendar-times cursor-pointer" />
                                <InputText dir="rtl" v-model="ToDateInput" type="text" id="toCalendarInputId"
                                    placeholder="تا تاریخ" />
                            </span>
                            <custom-date-picker auto-submit v-model="filterCategory.ToDate"
                                :disabled="!filterCategory.FromDate" :max="currentDate" :min="FromDate" format="YYYY-MM-DD"
                                display-format="jYYYY/jMM/jDD" custom-input="#toCalendarInputId" />
                        </div>
                        <div class="field col-12 md:col-2 mt-auto">
                            <Button @click="filter()" class="justify-content-center">اعمال فیلتر</Button>
                        </div>
                    </div>
                    <NoData v-if="nullResults"></NoData>
                    <DataTable v-else :value="dataTransaction" :rows="10" :loading="loading.getData"
                        class="overflow-hidden border-round-2xl shadow-1   mt-5  animate__animated animate__fadeIn  "
                        responsiveLayout="scroll">
                        <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
                            <template #header>
                                <small class="p-column-title"> وضعیت تراکنش </small>
                            </template>
                            <template #body="slotProps">
                                <span v-if="slotProps.data.status === 0"> تراکنش موفق </span>
                                <span v-if="slotProps.data.status === 1"> تراکنش ناموفق </span>
                                <span v-if="slotProps.data.status === 2"> تراکنش درحال انجام </span>
                                <span v-if="slotProps.data.status === 3"> تراکنش برگشتی </span>


                            </template>
                        </Column>
                        <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
                            <template #header>
                                <small class="p-column-title"> توضیحات </small>
                            </template>
                            <template #body="slotProps">
                                {{ slotProps.data.description }}
                            </template>
                        </Column>
                        <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
                            <template #header>
                                <small class="p-column-title"> مبلغ </small>
                            </template>
                            <template #body="slotProps">
                                {{ slotProps.data.amount.toLocaleString('fa-IR') }}
                            </template>
                        </Column>
                        <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
                            <template #header>
                                <small class="p-column-title"> تاریخ ایجاد </small>
                            </template>
                            <template #body="slotProps">
                                {{
                                    new Date(slotProps.data.createdAt).toLocaleDateString("fa-IR")
                                }}
                            </template>
                        </Column>
                        <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
                            <template #header>
                                <small class="p-column-title"> نوع تراکنش </small>
                            </template>
                            <template #body="slotProps">
                                <span v-if="slotProps.data.type === 0"> شارژکیف پول </span>
                                <span v-if="slotProps.data.type === 1">خرید گیفت کارت</span>
                                <span v-if="slotProps.data.type === 2"> نقد کردن گیفت کارت </span>
                                <span v-if="slotProps.data.type === 3"> گیفت کارت های برگشتی </span>


                            </template>
                        </Column>

                        <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
                            <template #header>
                                <small class="p-column-title"> پلتفرم </small>
                            </template>
                            <template #body="slotProps">
                                <span v-if="slotProps.data.platform === 0"> اندروید </span>
                                <span v-if="slotProps.data.platform === 1"> وب </span>
                                <span v-if="slotProps.data.platform === 2"> ای او اس </span>


                            </template>
                        </Column>
                        <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
                            <template #header>
                                <small class="p-column-title"> شماره رهگیری </small>
                            </template>
                            <template #body="slotProps">
                                {{
                                    slotProps.data.trackingNumber
                                }}
                            </template>
                        </Column>
                        <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
                            <template #header>
                                <small class="p-column-title"> جزئیات تراکنش </small>
                            </template>
                            <template #body="slotProps">
                                <Button label=" جزئیات " class="mr-2 mb-2" @click="openDetails(slotProps.data.id)" />

                            </template>
                        </Column>

                    </DataTable>

                    <Paginator :rows="pageSize" :totalRecords="totalCount" aria-label="" @page="changePaging($event)">
                    </Paginator>
                    <Dialog class="pop-up-details" header=" جزئیات " v-model:visible="displayStatus"
                        :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
                        <span v-if="popUpData[0].type === 0">
                            <h5>
                                جزئیات تراکنش

                            </h5>
                            <p class="line-height-3 m-2">
                                موجودی حساب قبل از شارژ : {{
                                    popUpData[0].details.balanceBeforeCharge.toLocaleString('fa-IR') }}
                            </p>
                            <p class="line-height-3 m-2">
                                نوع تراکنش : <span v-if="popUpData[0].type === 0"> شارژکیف پول </span>
                                <span v-if="popUpData[0].type === 1">خرید گیفت کارت</span>
                                <span v-if="popUpData[0].type === 2"> نقد کردن گیفت کارت </span>
                                <span v-if="popUpData[0].type === 3"> گیفت کارت های برگشتی </span>
                            </p>
                            <p class="line-height-3 m-2">
                                مبلغ : {{ popUpData[0].amount.toLocaleString('fa-IR') }}
                            </p>

                            <p class="line-height-3 m-2">
                                شماره رهگیری : {{ popUpData[0].trackingNumber }}
                            </p>
                            <p class="line-height-3 m-2">
                                تاریخ ایجاد : {{
                                    new Date(popUpData[0].createdAt).toLocaleDateString("fa-IR")
                                }}
                            </p>


                        </span>

                        <span v-if="popUpData[0].type === 1">
                            <h5>
                                جزئیات گیفت کارت
                            </h5>
                            <p class="line-height-3 m-2">
                                متن روی کارت : {{ popUpData[0].details.cardText }}
                            </p>

                            <p class="line-height-3 m-2" v-for="(item, index) in popUpData[0].details.phoneNumbers"
                                v-bind:key="index">
                                شماره موبایل : {{ item }}
                            </p>
                            <hr>
                            <h5>
                                جزئیات تراکنش

                            </h5>
                            <p class="line-height-3 m-2">
                                نوع تراکنش : <span v-if="popUpData[0].type === 0"> شارژکیف پول </span>
                                <span v-if="popUpData[0].type === 1">خرید گیفت کارت</span>
                                <span v-if="popUpData[0].type === 2"> نقد کردن گیفت کارت </span>
                                <span v-if="popUpData[0].type === 3"> گیفت کارت های برگشتی </span>
                            </p>
                            <p class="line-height-3 m-2">
                                مبلغ : {{ popUpData[0].amount.toLocaleString('fa-IR') }}
                            </p>
                            <p class="line-height-3 m-2">
                                کارمزد : {{ popUpData[0].details.wage.toLocaleString('fa-IR') }}
                            </p>
                            <p class="line-height-3 m-2">
                                شماره رهگیری : {{ popUpData[0].trackingNumber }}
                            </p>
                            <p class="line-height-3 m-2">
                                تاریخ ایجاد : {{
                                    new Date(popUpData[0].createdAt).toLocaleDateString("fa-IR")
                                }}
                            </p>




                        </span>
                        <span v-if="popUpData[0].type === 2">
                            <h5>
                                جزئیات گیفت کارت
                            </h5>
                            <p class="line-height-3 m-2">
                                متن روی کارت : {{ popUpData[0].details.cardText }}
                            </p>

                            <p class="line-height-3 m-2">
                                مشخصات کاربر فرستنده
                            </p>
                            <p class="line-height-3 m-2">
                                نام : {{ popUpData[0].details.fromUser.name }}
                            </p>

                            <p class="line-height-3 m-2">
                                شماره تلفن : {{ popUpData[0].details.fromUser.phoneNumber }}
                            </p>

                            <p class="line-height-3 m-2">
                                تاریخ ارسال : {{
                                    new Date(popUpData[0].details.sendAt).toLocaleDateString("fa-IR")
                                }}
                            </p>
                            <hr>
                            <h5>
                                جزئیات تراکنش

                            </h5>
                            <p class="line-height-3 m-2">
                                نوع تراکنش : <span v-if="popUpData[0].type === 0"> شارژکیف پول </span>
                                <span v-if="popUpData[0].type === 1">خرید گیفت کارت</span>
                                <span v-if="popUpData[0].type === 2"> نقد کردن گیفت کارت </span>
                                <span v-if="popUpData[0].type === 3"> گیفت کارت های برگشتی </span>
                            </p>
                            <p class="line-height-3 m-2">
                                مبلغ : {{ popUpData[0].amount.toLocaleString('fa-IR') }}
                            </p>

                            <p class="line-height-3 m-2">
                                شماره رهگیری : {{ popUpData[0].trackingNumber }}
                            </p>
                            <p class="line-height-3 m-2">
                                تاریخ ایجاد : {{
                                    new Date(popUpData[0].createdAt).toLocaleDateString("fa-IR")
                                }}
                            </p>

                        </span>
                        <span v-if="popUpData[0].type === 3">
                            <h5>
                                جزئیات تراکنش

                            </h5>
                            <p class="line-height-3 m-2">
                                نوع تراکنش : <span v-if="popUpData[0].type === 0"> شارژکیف پول </span>
                                <span v-if="popUpData[0].type === 1">خرید گیفت کارت</span>
                                <span v-if="popUpData[0].type === 2"> نقد کردن گیفت کارت </span>
                                <span v-if="popUpData[0].type === 3"> گیفت کارت های برگشتی </span>
                            </p>
                            <p class="line-height-3 m-2">
                                مبلغ : {{ popUpData[0].amount.toLocaleString('fa-IR') }}
                            </p>

                            <p class="line-height-3 m-2">
                                شماره رهگیری : {{ popUpData[0].trackingNumber }}
                            </p>

                            <p class="line-height-3 m-2">
                                تاریخ انقضا : {{
                                    new Date(popUpData[0].details.ExpiredAt).toLocaleDateString("fa-IR")
                                }}
                            </p>

                            <p class="line-height-3 m-2" v-for="(item, index) in popUpData[0].details.phoneNumbers"
                                v-bind:key="index">
                                شماره تلفن : {{ item }}
                            </p>
                        </span>
                        <span v-if="popUpData[0].payment === null">

                        </span>
                        <span v-else>
                            <p class="line-height-3 m-2">
                                نام درگاه پرداخت : {{ popUpData[0].payment.gatewayName }}
                            </p>


                            <p class="line-height-3 m-2">
                                وضعیت تکمیل : <span v-if="popUpData[0].payment.isCompleted == true"> کامل شده </span>
                                <span v-if="popUpData[0].payment.isCompleted == false"> کامل نشده </span>
                            </p>


                            <p class="line-height-3 m-2">
                                روش پرداخت : <span v-if="popUpData[0].payment.methodType === 0"> از کیف پول </span>
                                <span v-if="popUpData[0].payment.methodType === 1"> از درگاه پرداخت </span>
                            </p>
                        </span>



                        <template #footer>
                            <Button label="باشه" @click="closeStatus()" icon="pi pi-check" class="p-button-outlined" />

                        </template>
                    </Dialog>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { transactionService } from "../../@core/services/index";
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';
import Dialog from 'primevue/dialog';
import NoData from '../../@core/components/NoData.vue'


export default {
    components: {
        InputText,
        Dropdown,
        Button,
        DataTable,
        Column,
        Paginator,
        Dialog,
        NoData
    },

    data() {
        return {
            transactionStatus: [
                { type: "همه", value: null },
                { type: " تراکنش موفق ", value: 0 },
                { type: " تراکنش ناموفق  ", value: 1 },
                { type: " تراکنش درحال انجام ", value: 2 },
                { type: " تراکنش برگشتی ", value: 3 },
            ],
            nullResults: false,
            Status: "",
            currentDate: "",
            transaction: "",
            loading: {
                getData: false,
            },
            transactionType: [
                { type: "همه", value: null },
                { type: " شارژ کیف پول ", value: 0 },
                { type: " خرید گیفت کارت  ", value: 1 },
                { type: " نقدکردن گیفت کارت ", value: 2 },
                { type: " گیفت کارت های برگشتی", value: 3 },
            ],
            Query: "",
            ToDate: null,
            ToDateInput: "",
            FromDate: null,
            FromDateInput: "",
            dataTransaction: [],
            displayStatus: false,
            popUpData: [],
            pageSize: 10,
            totalCount: null,
            TrackingNumber: '',
            filterCategory: {
                pageIndex: 1,
                pageSize: 20,
                TrackingNumber: null,
                transaction: null,
                Status: null,
                FromDate: null,
                ToDate: null

            },
        }
    },
    methods: {
        getdata() {
            this.loading.getData = true;
            transactionService.getTransaction({ ...this.filterCategory }).then(({ data }) => {
                this.dataTransaction = data.data;
                this.totalCount = data.totalCount;
                if (data.totalCount === 0) {
                    this.nullResults = true
                }
                setTimeout(() => {
                    this.loading.getData = false;
                }, 500);

            }).catch((error) => {
                console.log(error);
            })
        },
        changePaging({ page }) {

            ++page
            this.filterCategory.pageIndex = page
            this.getdata()
        },
      
        closeStatus() {
            this.displayStatus = false

        },
        openDetails(id) {

            this.popUpData = this.dataTransaction.filter((item) => item.id === id)
            this.displayStatus = true
            console.log("mu id", this.popUpData.amount);

        },
        filter() {
            this.getdata();

        },


    },
    mounted() {
        this.getdata();


    },
}
</script>
<style>
.p-datatable-tbody {
    font-family: 'IranSans';
}

.pop-up-details {
    font-family: 'IranSans';
}
</style>