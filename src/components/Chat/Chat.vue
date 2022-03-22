<template>
  <div class="md-layout md-gutter md-scrollbar">
    <div
      class="md-layout-item md-large-size-30 md-medium-size-50 md-small-size-100 md-xsmall-size-100"
    >
      <div class="viewport">
        <md-toolbar :md-elevation="1">
          <span class="md-title">{{$t("main.top_ten")}}</span>
        </md-toolbar>

        <md-list>
          <md-list-item v-for="(entry,index) in topTen" :key="index" :to="`/user/${entry.user_id}`">
            <md-avatar>
              <img v-bind:src="entry.user.avatar_thumbnail | render" />
            </md-avatar>

            <span class="md-list-item-text">{{entry.user.name}}</span>
          </md-list-item>
        </md-list>
      </div>
    </div>
    <div
      class="md-layout-item md-large-size-70 md-medium-size-70 md-small-size-100 md-xsmall-size-100"
    >
      <div class="make_scroller" @scroll="handleScroll">
        <md-list v-show="messages.length>0" >
          <md-list-item v-for="(message,index) in messages" :key="index" @click="startChat(message)" >
            <md-card class="message_card">
              <md-card-header>
                <md-card-header-text>
                  <!-- <md-avatar>
                    <img v-bind:src="message.media_thumbnail | render" alt="Avatar"  />
                  </md-avatar> -->

                  <div class="md-title">{{getUserName(message)}}</div>
                  <div class="md-subhead">{{message.quotation || "File"}}</div>
                </md-card-header-text>
                {{message.created_at | dateFormatter}}
              </md-card-header>
            </md-card>
          </md-list-item>
        </md-list>
        <md-empty-state
          v-show="messages.length==0"
          class="md-accent"
          md-rounded
          md-icon="group"
          :md-label="$t('main.no_users')"
          :md-description="$t('main.no_users_desc')">
        </md-empty-state>
      </div>
    </div>
    <chat-widget
    :active="chat_active"
    :participant="participant"
    style="z-index:9999;direction:ltr"
    ></chat-widget>
    <md-snackbar
      md-position="center"
      :md-duration="4000"
      :md-active.sync="showSnackbar"
      md-persistent
    >
      <span>{{errorMessage}}</span>
    </md-snackbar>
  </div>
</template>

<script>
import { APIURL } from "../../Constants";
import { validationMixin } from "vuelidate";
import ChatWidget from "../Partials/ChatWidget"
const rightPhone = value => (value.indexOf("05") == 0 && value.length == 10) || value.length==0;
import {
  numeric
} from "vuelidate/lib/validators";
// import "vue-range-component/dist/vue-range-slider.css";
// import VueRangeSlider from 'vue-range-component'
export default {
  name: "Chat",
  mixins: [validationMixin],
  components:{
    ChatWidget
  },
  data: () => ({
    chat_active:false,
    participant:null,
    topTen: [],
    messages: [],
    curr_page: 1,
    last_page: -1,
    country_name: null,
    countries:[],
    cities:[],
    search: {
      name: "",
      gender: "",
      city_name:"",
      phone:"",
    },
    showSnackbar: false,
    errorMessage: "",
    loader: {}
  }),
  validations: {
    search: {
      phone: {
        numeric,
        rightPhone
      },
    },
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },
    axiosParams() {
      const params = new URLSearchParams();
      params.append("per_page", "10");
      params.append("page", this.curr_page);
      return params;
    },
  },
  watch: {
    curr_page() {
      if (this.curr_page <= this.last_page) {
        this.searchUsers();
      }
    },
    country_name() {
      this.loader = this.$loading.show(this.$loader_options);
      this.getAllCities();
    }
  },
  methods: {
    handleScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
      if (scrollTop + clientHeight >= scrollHeight){
          console.log("hs")
          this.curr_page++;
      }
    },
    getTopTen() {
      this.$Progress.start();
      this.$http({
        url: APIURL + "top-ten"
      })
        .then(response => {
          // console.log(response.data.data);
          this.topTen.push(...response.data.data);
          this.$Progress.finish();
          this.loader.hide();
        })
        .catch(response => {
          console.log(response);
        });
    },
    getMessageList() {
      this.curr_page = 1;
      this.$Progress.start();
      this.$http({
        url: APIURL + "messages-list",
        params: this.axiosParams
      })
        .then(response => {
          this.messages.push(...response.data.data.data);
          this.last_page = response.data.data.last_page;
          this.$Progress.finish();
          this.loader.hide();
        })
        .catch(response => {
          console.log(response);
        });
    },
    getUserId(message){
      return message.from_user_id != this.$store.getters.curr_user.id ? message.from_user_id : message.to_user_id
    },
    getUserName(message){
      return message.from_user_id != this.$store.getters.curr_user.id ? message.from_user_name : message.to_user_name
    },
    startChat(message){
      this.participant = this.getUserId(message);
      this.chat_active = true;
    }
  },
  created() {
    this.loader = this.$loading.show(this.$loader_options);
    this.getTopTen();
    this.getMessageList();
  }
};
</script>

<style lang="scss" scoped>
.md-card {
  width: 100%;
  margin: 6px;
  display: inline-block;
  vertical-align: top;
  text-align: left;
}
.md-layout-item {
  margin-top: 8px;
  margin-bottom: 8px;
  text-align: center;
}
.md-list-item-content{
  padding: 0;
}
.md-layout.md-gutter {
  margin: 0 !important;
}
.rounded_button {
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
  height: 85%;
}
.search_btn{
  text-align: left;
}
</style>
<style>
.sc-launcher{
  z-index: 9999;
}
</style>