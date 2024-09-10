<template>
    <div>
        <DataTable :value="PropsGiftCardTable" :rows="10"
            class="overflow-hidden border-round-2xl shadow-1   mt-5  animate__animated animate__fadeIn  "
            responsiveLayout="scroll">
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
                    <small class="p-column-title"> زمان ایجاد </small>
                </template>
                <template #body="slotProps">
                    {{
                        new Date(slotProps.data.createdAt).toLocaleString("fa-IR")
                    }}

                </template>

            </Column>
            <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
                <template #header>
                    <small class="p-column-title"> از کاربر </small>
                </template>
                <template #body="slotProps">
                    {{ slotProps.data.fromUser.fullName }}
                </template>

            </Column>
            <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
                <template #header>
                    <small class="p-column-title"> شماره تماس </small>
                </template>
                <template #body="slotProps">
                    {{ slotProps.data.fromUser.phoneNumber }}
                </template>

            </Column>
            <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
                <template #header>
                    <small class="p-column-title"> وضعیت پرداخت </small>
                </template>
                <template #body="slotProps">
                    <span v-if="slotProps.data.isPaymentSuccessful == true"> تراکنش موفق</span>
                    <span v-if="slotProps.data.isPaymentSuccessful == false"> تراکنش ناموفق </span>
                </template>

            </Column>
            <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
                <template #header>
                    <small class="p-column-title"> زمان ارسال </small>
                </template>
                <template #body="slotProps">
                    {{
                        new Date(slotProps.data.createdAt).toLocaleString("fa-IR")
                    }}
                </template>

            </Column>
            <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
                <template #header>
                    <small class="p-column-title"> کدرهگیری </small>
                </template>
                <template #body="slotProps">
                    {{ slotProps.data.trackingNumber }}
                </template>
            </Column>
            <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
                <template #header>
                    <small class="p-column-title"> نوع گیفت کارت </small>
                </template>
                <template #body="slotProps">
                    <span v-if="slotProps.data.type == 0"> شخصی </span>
                    <span v-if="slotProps.data.type == 1"> سازمانی </span>

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
    </div>
</template>
<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';


export default {
    props: {
        PropsGiftCardTable: Array
    },
    components: {
        DataTable,
        Column,
        Button
    },
    methods: {
        openDetails(id) {
            this.$router.push(`/giftcard/${id}`);
        },
    }
} 
</script>