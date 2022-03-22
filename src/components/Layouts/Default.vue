<template>
  <div class="page-container">
    <md-speed-dial v-if="isLoggedIn" :class="speedClass" style="bottom:40%;z-index:100" md-direction="bottom">
      <md-speed-dial-target class="md-accent">
        <md-icon style="color:white">person</md-icon>
        <md-tooltip md-direction="left">{{$t("main.friends")}}</md-tooltip>
      </md-speed-dial-target>

      <md-speed-dial-content>
        <md-button to="recieved_requests" class="md-icon-button md-raised">
          <md-icon>arrow_back</md-icon>
          <md-tooltip md-direction="left">{{$t("main.recieved_friend_requests")}}</md-tooltip>
        </md-button>
        <md-button to="sent_requests" class="md-icon-button md-raised">
          <md-icon>arrow_forward</md-icon>
          <md-tooltip md-direction="left">{{$t("main.sent_friend_requests")}}</md-tooltip>
        </md-button>
        <md-button to="friends" class="md-icon-button md-raised">
          <md-icon>group</md-icon>
          <md-tooltip md-direction="left">{{$t("main.my_friends")}}</md-tooltip>
        </md-button>
      </md-speed-dial-content>
    </md-speed-dial>
    <div
      id="header"
      style="position:absolute; top:0px; left:0px; height:96px; right:0px;overflow:hidden;z-index:4"
    >
      <md-toolbar style="background-color:white">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <img src="../../assets/swalyf.png" style="height:80px;margin: 8px 0;" />
          </div>

          <div class="md-toolbar-section-end">
            <md-menu v-if="isLoggedIn" md-size="big" md-align-trigger>
              <md-list>
                <md-list-item>
                  <span
                    class="md-list-item-text header-avatar"
                  >{{$store.getters.curr_user.name}}</span>
                  <md-button class="md-icon-button" md-menu-trigger>
                    <md-avatar class="md-avatar-icon md-large md-accent">
                      <img
                        v-bind:src="this.$store.getters.curr_user.avatar_thumbnail | render"
                        alt="Avatar"
                      />
                    </md-avatar>
                  </md-button>

                  <md-menu-content class="my_menu">
                    <md-button to="/">
                      <md-menu-item>
                        <md-icon class="md-accent-font">account_circle</md-icon>
                        <span class="md-list-item-text md-accent-font">{{$t("main.profile")}}</span>
                      </md-menu-item>
                    </md-button>
                    <md-button to="/">
                      <md-menu-item>
                        <md-icon class="md-accent-font">settings</md-icon>
                        <span class="md-list-item-text md-accent-font">{{$t("main.settings")}}</span>
                      </md-menu-item>
                    </md-button>
                    <md-button @click="logout()">
                      <md-menu-item>
                        <md-icon class="md-accent-font">subdirectory_arrow_left</md-icon>
                        <span class="md-list-item-text md-accent-font">{{$t("auth.logout")}}</span>
                      </md-menu-item>
                    </md-button>
                  </md-menu-content>
                </md-list-item>
              </md-list>
            </md-menu>
            <md-button class="md-primary" v-else to="/login">{{$t("auth.login")}}</md-button>
          </div>
        </div>
      </md-toolbar>
    </div>
    <div
      id="content"
      class="md-scrollbar"
      style="position:absolute; top:100px; bottom:0; left:0px; right:0px; overflow:auto;"
    >
      <slot />
    </div>
    <div
      id="footer"
      style="position:absolute; bottom:0px; height:55px; left:0px; right:0px; overflow:hidden;z-index:4"
    >
      <md-bottom-bar md-sync-route>
        <md-bottom-bar-item to="/" exact :md-label="$t('main.home')" md-icon="home"></md-bottom-bar-item>
        <!-- <md-bottom-bar-item v-if="isLoggedIn" to="/search" md-label="Search" md-icon="search"></md-bottom-bar-item> -->
        <md-bottom-bar-item
          v-if="isLoggedIn"
          to="/my_profile"
          :md-label="$t('main.profile')"
          md-icon="account_circle"
        ></md-bottom-bar-item>
        <md-badge v-show="unreadMessages>0" class="md-primary" :md-content="unreadMessages" md-dense>
          <md-bottom-bar-item v-if="isLoggedIn" to="/chat" :md-label="$t('main.chat')" md-icon="chat"></md-bottom-bar-item>
        </md-badge>
        <md-bottom-bar-item v-show="unreadMessages==0" v-if="isLoggedIn" to="/chat" :md-label="$t('main.chat')" md-icon="chat"></md-bottom-bar-item>
        <md-bottom-bar-item v-if="isLoggedIn" to="/search" :md-label="$t('main.search')" md-icon="search"></md-bottom-bar-item>
        <md-bottom-bar-item
          v-if="isLoggedIn"
          to="/notifications"
          :md-label="$t('main.notifications')"
          md-icon="notifications_active"
        ></md-bottom-bar-item>
        <md-bottom-bar-item v-if="isLoggedIn" to="/settings" :md-label="$t('main.settings')" md-icon="settings"></md-bottom-bar-item>
      </md-bottom-bar>
    </div>
  </div>
</template>
<style>
.md-position-top{
  top:0px!important;
}
</style>
<style lang="scss" scoped>
.page-container {
  width: 100%;
  height: 100%;
}
.md-app {
  height: 90vh;
  border: 1px solid rgba(#000, 0.12);
}
.md-app-content {
  padding: 0;
}

.md-bottom-bar.md-type-fixed .md-bottom-bar-item {
  margin: 0 auto;
}
// Demo purposes only
.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}
.phone-viewport {
  width: 100%;
  height: 10vh;
  display: inline-flex;
  position: fixed;
  align-items: flex-end;
  overflow: hidden;
  border: 1px solid rgba(#000, 0.26);
  background: rgba(#000, 0.06);
}
.my_menu .md-button + .md-button {
  margin: 6px 8px !important;
}
.header-avatar{
  margin-right:12px;
}
</style>

<script>
import { APIURL } from "../../Constants";
export default {
  name: "Reveal",
  data: () => ({
    menuVisible: false,
    unreadMessages:0,
  }),
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },
    speedClass:function(){
      return this.$store.getters.getLang =='ar' ?"md-bottom-left":"md-bottom-right";
    }
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout").then(() => {
        this.$router.push("/");
      });
    },
    getUnreadCount() {
      this.$http.get(APIURL + "unread-all-message-count")
        .then(response => {
          if(response.data.success){
            this.unreadMessages = response.data.data.count
          }  
        })
        .catch(response => {
          console.log(response)
        });
    },
  },
  created() {
    console.log(this.$store.getters.avatar_thumbnail);
    this.$http.interceptors.response.use(undefined, function(err) {
      return new Promise(function() {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch("logout");
        }
        throw err;
      });
    });
    if(this.isLoggedIn){
      this.getUnreadCount();
    }
  }
};
</script>