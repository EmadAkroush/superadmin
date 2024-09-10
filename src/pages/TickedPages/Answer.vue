<template>
  <div class="grid p-fluid animate__animated animate__fadeIn">
    <div class="col-12">

      <div class="card card-w-title">
        <div>
          <!-- card message user and admin -->
          <div v-if="!!tickets.length">
            <div v-for="(item, index) in tickets" :key="index">
              <div class="flex m-2 flex-row-reverse">
                <div class="mr-2">
                  <Avatar icon="pi pi-user" size="large" class="avatar_user" />
                </div>
                <div class="user border p-3 background_user border-round-md shadow">
                  <div class="flex justify-content-between">
                    <div class="text-xl font-medium">{{ item.userName }} | کاربر</div>
                    <div>{{ new Date(item.createdAt).toLocaleTimeString("fa-IR") }} | {{ new
                      Date(item.createdAt).toLocaleDateString("fa-IR") }}</div>
                  </div>
                  <div class="p-3 text-base"><span class="text-lg">دسته بندی : </span>{{ item.category.title }}</div>
                  <div class="text-base"><span class="text-lg">موضوع : </span>{{ item.subject }}</div>
                  <div class="p-2 text-base"><span class="text-lg">متن تیک : </span>{{ item.text }}</div>
                  <div class="flex" v-if="!!item.attachedFiles.length">
                    فایل های پیوست :
                    <div v-for="(file, ind) in item.attachedFiles" :key="ind">
                      <div>
                        <a :href="`http://37.156.144.29:5000/api/file/v1/File/Get${file}`"><i
                            class="pi pi-download"></i>{{ index + 1 }}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-for="(items, index) in item.responses" :key="index">
                <div v-if="items.fromSupport == false" class=" m-2">
                  <div class="flex mt-2 flex-row-reverse">
                    <div class="mr-2">
                      <Avatar icon="pi pi-user" size="large" class="avatar_user" />
                    </div>
                    <div class="user h-75 border p-3 background_user border-round-md shadow">
                      <div class="flex justify-content-between">
                        <div class="text-xl font-medium">{{ items.userName }} | {{ items.supportJob }}</div>
                        <div>{{ new Date(items.createdAt).toLocaleTimeString("fa-IR") }} | {{ new
                          Date(items.createdAt).toLocaleDateString("fa-IR") }}</div>
                      </div>
                      <div class="p-2 text-base"><span class="text-lg"> پاسخ : </span>{{ items.text }}</div>
                      <div class="flex" v-if="!!items.attachedFiles.length">
                        فایل های پیوست :
                        <div v-for="(ite, index) in items.attachedFiles" :key="index" class="m-2">
                          <div>
                            <a :href="`http://37.156.144.29:5000/api/file/v1/File/Get${ite}`"><i
                                class="pi pi-download"></i>{{ index + 1 }}</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="items.fromSupport == true" class="flex mt-2 ">
                  <div class="ml-2">
                    <Avatar icon="pi pi-user-edit" size="large" class="avatar_admin text-white" />
                  </div>
                  <div class="admin border p-3 background_admin text-white border-round-md shadow">
                    <div class="flex justify-content-between">
                      <div class="text-xl font-medium">{{ items.userName }} | {{ items.supportJob }}</div>
                      <div> {{ new Date(items.createdAt).toLocaleTimeString("fa-IR") }} | {{ new
                        Date(items.createdAt).toLocaleDateString("fa-IR") }}</div>
                    </div>
                    <div class="p-2 text-base"><span class="text-lg"> پاسخ : </span>{{ items.text }}</div>
                    <div class="flex" v-if="!!items.attachedFiles.length">
                      فایل های پیوست :
                      <div v-for="(ite, index) in items.attachedFiles" :key="index" class="m-2">
                        <div>
                          <a :href="`http://37.156.144.29:5000/api/file/v1/File/Get${ite}`" class="text-white"><i
                              class="pi pi-download text-white"></i>{{ index + 1 }}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- box send message -->
          <div class="mt-6">
            <div class="flex justify-content-between">
              <Textarea v-model="message" :autoResize="true" placeholder="پیام ....." rows="4" cols="20" />
            </div>
            <div class="flex flex-wrap">
              <div v-for="(file, index) in files" :key="index" class="col-12 md:col-2 m-4">
                <div class="card show-image h-full p-2">
                  <Image v-if="file.type == 'image/jpeg' || file.type == 'image/png'"
                    :src="!!file.src ? file.src : file.picturePath" alt="Image" class="h-full prev-image" preview />
                  <a v-else :href="file.src">{{ file.name }}</a>
                  <Button icon="pi pi-trash" @click="removeNewFile(file, index)"
                    class="p-button-rounded p-button-danger trash-image-button" />
                </div>
              </div>
            </div>
            <div class="mt-4">
              <span class="m-2">
                <input type="file" ref="uploader_ref" @change="getFiles($event)" hidden />
                <Button label="آپلو فایل" icon="pi pi-file" :loading="loading" @click="$refs['uploader_ref'].click()"
                  iconPos="right" class="w-2" />
              </span>
              <span class="m-2">
                <Button label="ارسال" :disabled="!message.length" icon="pi pi-send" iconPos="right" class="w-2"
                  @click="sendMessage" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ticketService , fileService } from "../../@core/services/index"
import Avatar from 'primevue/avatar';
import Textarea from 'primevue/textarea';
import Image from 'primevue/image';
import Button from 'primevue/button';



export default {
  components: {
    Avatar, 
    Textarea, 
    Image,
    Button
    },

  data() {
    return {
      message: "",
      image: [],
      files: [],
      upload: [],
      tickets: [],
      ticketId: [],
      attachFile: [],
      fileMessage: [],
      deleteFile: null,
      loading: false,


    };
  },
  methods: {
    getTicket() {
      ticketService.getTicketDetails(this.ticketId).then(({ data }) => {
        this.tickets = [data];
      }).catch((error) => {
        console.log(error);
      })
    }, 
    getFiles(event) {
      this.loading = true;
      let target = event.target;
      let lastIndex = target.files.length - 1;
      target.files[lastIndex]["src"] = URL.createObjectURL(target.files[lastIndex]);
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
        item["id"] = data;
        this.files.push(item);
        console.log(this.files);
      }).catch((error) => {
        console.log(error);
      }).finally(() => {
        this.loading = false;
      })

    },
    sendMessage(){
      const message = {
        text: this.message,
        attachedFiles: this.files.map((_file) => _file.id),
      };
      ticketService.sendMessage(this.ticketId ,  message ).then(()=>{
        this.getTicket();
        this.message = "";
        this.files = [];
      }).catch((error)=>{
        console.log(error);
      })
    },
    removeNewFile(item){
      // this.attachFile = [...this.attachFile.filter((items , index)=> index != i)]
      this.files = [...this.files.filter((p) => p.id != item.id)];
      fileService.deleteFile({ id: item.id }).then(({data})=>{
        console.log("drt" , data);
      }).catch((error)=>{
        console.log(error);
      })
    }
    // async removeNewFile(item) {
    //   // this.attachFile = [...this.attachFile.filter((items , index)=> index != i)]
    //   this.files = [...this.files.filter((p) => p.id != item.id)];
    //   const { status, data } = await this.axios({ method: "post", url: "api/file/v1/File/Delete", data: { id: item.id } });
    //   if (status == 200) {
    //     console.log(data);
    //   }
    // },
  },
  mounted() {
    this.ticketId = this.$route.params.ticket_id;
    this.getTicket();
  },
};
</script>

<style lang="scss">
.admin {
  min-width: 25%;
  max-width: 60%;
}

.user {
  min-width: 25%;
  max-width: 60%;
}

.shadow {
  box-shadow: 0px 0px 2.2px rgba(0, 0, 0, 0.07), 0px 0px 5.3px rgba(0, 0, 0, 0.049), 0px 0px 10px rgba(0, 0, 0, 0.031), 0px 0px 17.9px rgba(0, 0, 0, 0.014), 0px 0px 33.4px rgba(0, 0, 0, 0.001), 0px 0px 80px rgba(0, 0, 0, -0.005);
}

.prev-image {
  img {
    width: 100%;
    height: 100%;
    max-height: 14rem;
    min-width: -webkit-fill-available;
    object-fit: cover;
    border-radius: 12px;
  }
}

.background_admin {
  background: #4c73f3;
}

.avatar_admin {
  background: #51629B;

}

.background_user {
  background-color: #eeeffb;
}

.avatar_user {
  background-color: #a7b4da;
}</style>
