<template>
  <div :class="containerClass" @click="onWrapperClick">
    <AppTopBar @menu-toggle="onMenuToggle" />
    <div class="layout-main-container">
      <div class="layout-main">
        <router-view />
      </div>
      <AppFooter />
    </div>
    <div class="layout-sidebar" @click="onSidebarClick">
      <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
    </div>

    <!-- <AppConfig :layoutMode="layoutMode" @layout-change="onLayoutChange" /> -->
    <transition name="layout-mask">
      <div class="layout-mask p-component-overlay" v-if="mobileMenuActive"></div>
    </transition>
  </div>
</template>

<script>
import AppTopBar from "@/@core/components/layouts/AppTopbar.vue";
import AppMenu from "@/@core/components/layouts/AppMenu.vue";
// import AppConfig from './AppConfig.vue';
import AppFooter from "./@core/components/layouts/AppFooter.vue";

export default {
  emits: ["change-theme"],
  data() {
    return {
      layoutMode: "static",
      staticMenuInactive: false,
      overlayMenuActive: false,
      mobileMenuActive: false,
      menu: [
        {
          items: [
            {
              label: "داشبورد",
              icon: "pi pi-fw pi-home",
              to: "/",
            },
          ],
        },
        {
          items: [
            {
              label: "تیکت",
              icon: "pi pi-fw pi-comment",
              to: "/ticket",
            },
          ],
        },
        {
          items: [
            {
              label: "درخواست های احراز هویت",
              icon: "pi pi-fw pi-comment",
              to: "/organization-profile",
            },
          ],
        },
        {
          items: [
            {
              label: " عملیات کارت ",
              icon: "pi pi-fw pi-comment",
              items: [
                {
                  label: "تمپلیت ها",
                  icon: "pi pi-id-card",
                  items: [
                    {
                      label: "اضافه کردن ",
                      icon: "pi pi-fw pi-plus",
                      to: "/templateadd",
                    },
                    {
                      label: "لیست",
                      icon: "pi pi-fw pi-align-justify",
                      to: "/templatelist",
                    },
                    {
                      label: "دست بندی ",
                      icon: "pi pi-fw pi-filter",
                      items: [
                        {
                          label: "لیست",
                          icon: "pi pi-fw pi-align-justify",
                          to: "/templatecategory",
                        },
                        {
                          label: "اضافه کردن ",
                          icon: "pi pi-fw pi-plus",
                          to: "/templatecategoryadd",
                        },

                      ],
                    },
                  ],
                },
                {
                  label: " موزیک ها ",
                  icon: "pi pi-id-card",
                  items: [
                    {
                      label: "اضافه کردن ",
                      icon: "pi pi-fw pi-plus",
                      to: "/musicadd",
                    },
                    {
                      label: "لیست",
                      icon: "pi pi-fw pi-align-justify",
                      to: "/musiclist",
                    },
                    {
                      label: "دست بندی ",
                      icon: "pi pi-fw pi-filter",
                      items: [
                        {
                          label: "لیست",
                          icon: "pi pi-fw pi-align-justify",
                          to: "/musiccategory",
                        },
                        {
                          label: "اضافه کردن ",
                          icon: "pi pi-fw pi-plus",
                          to: "/musiccategoryadd",
                        },

                      ],
                    },
                  ],
                },
              ],

            },


          ],

        },
        {
          items: [
            {
              label: " تراکنش ها  ",
              icon: "pi pi-fw pi-arrows-v",
              to: "/transaction",
            },
          ],
        },
        {
          items: [
            {
              label: " لیست گیفت کارد ها ",
              icon: "pi pi-fw pi-arrows-v",
              to: "/giftcard",
            },
          ],
        },

      ],
    };
  },
  watch: {
    $route() {
      this.menuActive = false;
      this.$toast.removeAllGroups();
    },
  },
  methods: {
    onWrapperClick() {
      if (!this.menuClick) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }

      this.menuClick = false;
    },
    onMenuToggle() {
      this.menuClick = true;

      if (this.isDesktop()) {
        if (this.layoutMode === "overlay") {
          if (this.mobileMenuActive === true) {
            this.overlayMenuActive = true;
          }

          this.overlayMenuActive = !this.overlayMenuActive;
          this.mobileMenuActive = false;
        } else if (this.layoutMode === "static") {
          this.staticMenuInactive = !this.staticMenuInactive;
        }
      } else {
        this.mobileMenuActive = !this.mobileMenuActive;
      }

      event.preventDefault();
    },
    onSidebarClick() {
      this.menuClick = true;
    },
    onMenuItemClick(event) {
      if (event.item && !event.item.items) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }
    },
    onLayoutChange(layoutMode) {
      this.layoutMode = layoutMode;
    },
    addClass(element, className) {
      if (element.classList) element.classList.add(className);
      else element.className += " " + className;
    },
    removeClass(element, className) {
      if (element.classList) element.classList.remove(className);
      else
        element.className = element.className.replace(
          new RegExp(
            "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
            "gi"
          ),
          " "
        );
    },
    isDesktop() {
      return window.innerWidth >= 992;
    },
    isSidebarVisible() {
      if (this.isDesktop()) {
        if (this.layoutMode === "static") return !this.staticMenuInactive;
        else if (this.layoutMode === "overlay") return this.overlayMenuActive;
      }

      return true;
    },
  },
  computed: {
    containerClass() {
      return [
        "layout-wrapper",
        {
          "layout-overlay": this.layoutMode === "overlay",
          "layout-static": this.layoutMode === "static",
          "layout-static-sidebar-inactive":
            this.staticMenuInactive && this.layoutMode === "static",
          "layout-overlay-sidebar-active":
            this.overlayMenuActive && this.layoutMode === "overlay",
          "layout-mobile-sidebar-active": this.mobileMenuActive,
          "p-input-filled": this.$primevue.config.inputStyle === "filled",
          "p-ripple-disabled": this.$primevue.config.ripple === false,
        },
      ];
    },
    logo() {
      return this.$appState.darkTheme
        ? "images/logo-white.svg"
        : "images/logo.svg";
    },
  },
  beforeUpdate() {
    if (this.mobileMenuActive)
      this.addClass(document.body, "body-overflow-hidden");
    else this.removeClass(document.body, "body-overflow-hidden");
  },
  components: {
    AppTopBar: AppTopBar,
    AppMenu: AppMenu,
    // 'AppConfig': AppConfig,
    AppFooter: AppFooter,
  },
};
</script>

<style lang="scss">
@import "@/@core/assets/styles/App.scss";
</style>
