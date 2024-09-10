<template>
    <div>
        <div class="grid p-fluid animate__animated animate__fadeIn">
            <div class="col-12">
                <div class="card card-w-title">
                    <div class="grid">
                        <div class="col-12 mb-2 mt-2 lg:col-8 lg:mb-0">
                            <div>
                                <h3> جزئیات پرداخت </h3>
                                <div class="grid">
                                    <div class="col-6">
                                        <div class="col">
                                            <span class=" m4"> مبلغ </span> :
                                            <span class=" m4"> {{ giftCardDetails.amount }} </span>
                                        </div>
                                        <div class="col">
                                            <span class=" m4"> منقضی شده است </span> :
                                            <span class=" m4" v-if="giftCardDetails.isExpirationTimePassed == true"> بله
                                            </span>
                                            <span class=" m4" v-if="giftCardDetails.isExpirationTimePassed == false"> خیر
                                            </span>
                                        </div>
                                        <div class="col">
                                            <span class=" m4"> کدرهگیری </span> :
                                            <span class=" m4"> {{ giftCardDetails.trackingNumber }} </span>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="col">
                                            <span class=" m4"> تاریخ انقضا </span> :
                                            <span class=" m4"> {{
                                                new Date(giftCardDetails.expireTime).toLocaleString("fa-IR")
                                            }} </span>
                                        </div>
                                        <div class="col">
                                            <span class=" m4"> وضعیت پرداخت </span> :
                                            <span class=" m4" v-if="giftCardDetails.isPaymentSuccessful == true"> موفق
                                            </span>
                                            <span class=" m4" v-if="giftCardDetails.isPaymentSuccessful == false"> ناموفق
                                            </span>
                                        </div>
                                        <div class="col">
                                            <span class=" m4"> کارمزد </span> :
                                            <span class=" m4"> {{ giftCardDetails.wage }} </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <hr>
                            <div>
                                <h3> ازکاربر </h3>
                                <div class="grid">
                                    <div class="col-6">
                                        <div class="col">
                                            <span class=" m4"> نام </span> :
                                            <span class=" m4"> {{ fromUser.fullName }} </span>
                                        </div>

                                    </div>
                                    <div class="col-6">

                                        <div class="col">
                                            <span class=" m4"> شماره تلفن </span> :
                                            <span class=" m4"> {{ fromUser.phoneNumber }} </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <hr>
                            <div>
                                <h3> جزئیات اس ام اس </h3>
                                <div class="grid">
                                    <div class="col-6">
                                        <div class="col">
                                            <span class=" m4"> زمان آخرین اسمس ارسال شده </span> :
                                            <span class=" m4"> {{ giftCardDetails.lastSmsSendTime }} </span>
                                        </div>
                                        <div class="col">
                                            <span class=" m4"> ارسال شده در تاریخ </span> :
                                            <span class=" m4"> {{ giftCardDetails.sendedAt }} </span>
                                        </div>
                                        <div class="col">
                                            <span class=" m4"> عنوان اس ام اس ارسال شده </span> :
                                            <span class=" m4"> {{ giftCardDetails.senderTitleInSms }} </span>
                                        </div>

                                    </div>
                                    <div class="col-6">

                                        <div class="col">
                                            <span class=" m4"> تعداد اسمس های ارسال شده </span> :
                                            <span class=" m4"> {{ giftCardDetails.numberOfSendedSms }} </span>
                                        </div>
                                        <div class="col">
                                            <span class=" m4"> برنامه زمانبندی ارسال اس ام اس </span> :
                                            <span class=" m4"> {{ giftCardDetails.scheduledTimeForSmsSend }} </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <hr>
                            <div>
                                <h3> دریافت کنندگان </h3>
                                <div class="grid" v-for="(item, index) in  giftCardDetails.recipients" :key="index">
                                    <div class="col-6">
                                        <div class="col">
                                            <span class=" m4"> نام </span> :
                                            <span class=" m4"> {{ item.name }} </span>
                                        </div>
                                        <div class="col">
                                            <span class=" m4"> شماره تلفن </span> :
                                            <span class=" m4"> {{ item.phoneNumber }} </span>
                                        </div>
                                        <div class="col">
                                            <span class=" m4"> شماره تلفنی که به آن انتقال داده شده است </span> :
                                            <span class=" m4"> {{ item.transferredToPhoneNumber }} </span>
                                        </div>
                                        <div class="col">
                                            <span class=" m4"> وضعیت </span> :
                                            <span class=" m4"> {{ item.status }} </span>
                                        </div>

                                    </div>

                                </div>

                            </div>
                            <hr>
                            <div>

                                <div class="grid">

                                    <div class="col-6">
                                        <h3> جزئیات تمپلیت </h3>
                                        <div class="col">
                                            <span class=" m4"> نام </span> :
                                            <span class=" m4"> {{ giftCardDetails.name }} </span>
                                        </div>
                                        <div class="col">
                                            <span class=" m4"> رنگ لوگو </span> :
                                            <span class=" m4" v-if="giftCardTemplate.color == 0"> سفید </span>
                                            <span class=" m4" v-if="giftCardTemplate.color == 1"> سیاه </span>
                                            <span class=" m4" v-if="giftCardTemplate.color == 2"> سرمه ای </span>

                                        </div>
                                        <div class="col">
                                            <span class=" m4"> تاریخ ایجاد </span> :
                                            <span class=" m4">
                                                {{
                                                    new Date(giftCardTemplate.createdAt).toLocaleString("fa-IR")
                                                }}
                                            </span>
                                        </div>
                                        <div class="col">

                                            <span class="img-class">
                                                <Image
                                                    :src="this.href + giftCardTemplate.fileId"
                                                    alt="Image" class="img-class " preview />
                                            </span>
                                        </div>


                                    </div>
                                    <div v-if="giftCardMusic == null">

                                    </div>
                                    <div class="col-6" v-else>
                                        <h3> جزئیات موزیک </h3>
                                        <div class="col">
                                            <span class=" m4"> نام </span> :
                                            <span class=" m4"> {{ giftCardMusic.name }} </span>
                                        </div>

                                        <div class="col">
                                            <span class=" m4"> تاریخ ایجاد </span> :
                                            <span class=" m4">
                                                {{
                                                    new Date(giftCardMusic.createdAt).toLocaleString("fa-IR")
                                                }}
                                            </span>
                                        </div>
                                        <div class="col">

                                            <div class="img-class">
                                                <audio
                                                    :src=" href + `${giftCardMusic.fileId}`"
                                                    controls preload="none">
                                                </audio>
                                            </div>

                                        </div>


                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { giftCardListService } from "../../@core/services/index";

export default {

    components: {

    },

    data() {
        return {
            giftCardId: '',
            giftCardDetails: '',
            giftCardTemplate: '',
            fromUser: '',
            giftCardMusic: '',
            href: "",

        }
    },
    methods: {
        getData() {
            giftCardListService.getGiftCardDetails(this.giftCardId).then(({ data }) => {
                this.giftCardDetails = data
                console.log("data", this.giftCardDetails);
                this.fromUser = this.giftCardDetails.fromUser
                this.giftCardTemplate = this.giftCardDetails.template
                this.giftCardMusic = this.giftCardDetails.sound
            }).catch((error) => {
                console.log(error);
            })
        }


    },
    mounted() {
        this.giftCardId = this.$route.params.details;
        this.getData()
    },
    beforeMount() {
        this.href = process.env.VUE_APP_BASE_URL_File
    }

}
</script>
<style>
.img-class img {
    width: 400px;
    height: 250px;
}
</style>