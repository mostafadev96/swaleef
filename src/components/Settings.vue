<template>
  <div class="md-layout md-gutter md-alignment-center md-scrollbar make_scroller">
    <div
      class="md-layout-item md-large-size-70 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
    >
      <md-list style="height: 453px;">
        <md-list-item to="/my_profile">
          <span class="md-list-item-text md-accent-font">{{$t("main.profile")}}</span>
          <md-icon class="md-accent-font md-size-2x">account_circle</md-icon>
        </md-list-item>
        <md-list-item to="privacy">
          <span class="md-list-item-text md-accent-font">{{$t("main.privacy")}}</span>
          <md-icon class="md-accent-font md-size-2x">remove_red_eye</md-icon>
        </md-list-item>
        <md-list-item>
          <span class="md-list-item-text md-accent-font">{{$t("main.language")}}</span>
          <label class="language-switcher">
            <input type="checkbox" v-model="lang" @change="changeLang()" />
            <span class="slider round"></span>
            <span class="select-ar">EN</span>
            <span class="select-en">ع</span>
          </label>
        </md-list-item>
        <md-list-item to="change-number">
          <span class="md-list-item-text md-accent-font">{{$t("main.change_mobile")}}</span>
          <md-icon class="md-accent-font md-size-2x">smartphone</md-icon>
        </md-list-item>
        <md-list-item to="reset-password">
          <span class="md-list-item-text md-accent-font">{{$t("main.change_password")}}</span>
          <md-icon class="md-accent-font md-size-2x">lock</md-icon>
        </md-list-item>
        <md-list-item @click="logout()">
          <span class="md-list-item-text md-accent-font">{{$t("auth.logout")}}</span>
          <md-icon class="md-accent-font md-size-2x">subdirectory_arrow_left</md-icon>
        </md-list-item>
      </md-list>
      <md-snackbar
        md-position="center"
        :md-duration="4000"
        :md-active.sync="showSnackbar"
        md-persistent
      >
        <span>{{snackMessage}}</span>
      </md-snackbar>
    </div>
  </div>
</template>

<script>
// import { APIURL } from "../Constants";

export default {
  name: "Settings",
  data: () => ({
    notifications: false,
    showSnackbar: false,
    snackMessage: "",
    lang: false //false mean english
  }),
  computed: {},
  watch: {},
  methods: {
    changeLang() {
      let mylang = this.lang ? "ar" : "en";
      this.$store.dispatch("changeLanguage", mylang);
      this.$router.go();
    },
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/");
      });
    }
  },
  created() {
    console.log(this.$store.getters.getLang);
    this.lang = this.$store.getters.getLang == "en" ? false : true;
    console.log(this.lang);
  }
};
</script>

<style lang="scss" scoped>
// Variables
$deep-blue: var(--md-theme-default-accent);
$speed3: cubic-bezier(0.26, 0.48, 0.08, 0.9);

// Size var
// Update this value to change the language switcher size
$height: 35px;
.language-switcher {
  position: relative;
  display: inline-block;
  width: calc(#{$height} * 2);
  height: $height;

  // Closing Animation
  -webkit-transition: transform 0.17s $speed3;
  -moz-transition: transform 0.17s $speed3;
  -ms-transition: transform 0.17s $speed3;
  -o-transition: transform 0.17s $speed3;
  transition: transform 0.17s $speed3;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .select-ar,
  .select-en {
    position: absolute;
    font-size: #{$height / 2.5};
    top: #{$height / 4};
    color: #000;
  }
  .select-ar {
    left: #{$height / 3.5};
  }
  .select-en {
    right: #{$height / 4};
  }
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $deep-blue;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: $height;
  width: $height;
  left: 0;
  bottom: 0;
  background-color: white;
  box-shadow: 0 3px 64px rgba($deep-blue, 0.16);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: $deep-blue;
}

input:focus + .slider {
  box-shadow: none;
}

input:checked + .slider:before {
  -webkit-transform: translateX($height);
  -ms-transform: translateX($height);
  transform: translateX($height);
}

/* Rounded sliders */
.slider.round {
  border-radius: $height;
}

.slider.round:before {
  border-radius: 50%;
}

.md-card {
  width: 500px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
  text-align: left;
}
.md-layout-item {
  margin-top: 8px;
  margin-bottom: 8px;
  text-align: center;
}
.md-layout.md-gutter {
  margin: 0 !important;
}
.md-icon-button {
  width: 112px !important;
  border-radius: 20px !important;
}
.md-ripple {
  border-radius: 0 !important;
}
.md-raised {
  margin-right: 20px;
}
.post_actions {
  justify-content: center !important;
}
.last_comment {
  width: 450px;
  box-shadow: unset;
}
.md-badge.md-theme-default.md-primary {
  right: auto !important;
  left: -4px !important;
}
.md-badge-content {
  margin-right: 20px;
}
.comment_content {
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  padding-top: 12px !important;
  border-radius: 40px;
}
.make_scroller {
  overflow-y: scroll;
  height: 469px;
}
.md-list-item-button:hover{
  background: none;
}
.md-list-item-router:hover{
  background: none;
}
</style>