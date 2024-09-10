<template>
  <div>

    <DataTable :value="PropsMusicData" :rows="10" :loading="loadingData"
      class="overflow-hidden border-round-2xl shadow-1   mt-5  animate__animated animate__fadeIn  "
      responsiveLayout="scroll">
      <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
        <template #header>
          <small class="p-column-title"> فایل موزیک </small>
        </template>
        <template #body="slotProps">
          <audio controls preload="none">
            <source :src="
              this.href +
              slotProps.data.fileId
            " type="audio/ogg" :alt="slotProps.data.name" />
            <source src="horse.mp3" type="audio/mpeg" />
          </audio>
        </template>
      </Column>
      <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
        <template #header>
          <small class="p-column-title">نام تمپلیت </small>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.name }}
        </template>
      </Column>
      <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
        <template #header>
          <small class="p-column-title">نام دسته بندی تمپلیت </small>
        </template>
        <template #body="slotProps">
          {{ slotProps.data.category.name }}
        </template>
      </Column>
      <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
        <template #header>
          <small class="p-column-title"> فعال هست </small>
        </template>
        <template #body="slotProps">
          <span v-if="slotProps.data.isActive == true"> فعال </span>
          <span v-if="slotProps.data.isActive == false"> غیرفعال </span>
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
          <small class="p-column-title"> ویرایش وضعیت </small>
        </template>
        <template #body="slotProps">
          <Button label=" تغییر  " class="mr-2 mb-2" @click="$emit('sendData', slotProps.data.id)" />
        </template>
      </Column>
      <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
        <template #header>
          <small class="p-column-title"> ویرایش تمپلیت </small>
        </template>
        <template #body="slotProps">
          <Button label=" ویرایش " class="mr-2 mb-2" @click="updateTemplate(slotProps.data)" />
        </template>
      </Column>
      <Column field="fullName" headerStyle="width:14%; min-width:10rem;">
        <template #header>
          <small class="p-column-title"> حذف تمپلیت</small>
        </template>
        <template #body="slotProps">
          <Button label=" حذف " class="mr-2 mb-2" @click="deleteTemplate(slotProps.data.id)" />
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
    PropsMusicData: {
      type: Array,
      required: true,
      default: () => []
    },
    loadingData: Boolean
  },
  data() {
    return {
      href: "",
      MusicData: [],
      loading: {
        getData: false,
      },
    }
  },
  components: {
    Button,
    DataTable,
    Column,

  },
  methods: {
   
    // changeStatus(id) {
    //   musicService.statusMusic(id).then(() => {
    //     let find = this.Musicdata.findIndex(item => item.id == id)
    //     this.Musicdata[find].isActive = !(this.Musicdata[find].isActive)
    //     this.showWarn()
    //   }).catch((error) => {
    //     console.log(error);
    //     this.showError()
    //   })
    // },
  },
  mounted() {

  },
  beforeMount() {
    this.href = process.env.VUE_APP_BASE_URL_File

  }
}
</script>