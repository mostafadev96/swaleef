<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar class="md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <md-button class="md-icon-button menu-button" @click="menuVisible = !menuVisible">
              <md-icon>menu</md-icon>
            </md-button>

            <span class="md-title">My Title</span>
          </div>

          <div class="md-toolbar-section-end">
            <md-menu md-size="big" md-align-trigger>
              <md-button class="md-icon-button" md-menu-trigger>
                <md-avatar>
                  <img src="https://vuematerial.io/assets/examples/avatar.png" alt="Avatar" />
                </md-avatar>
              </md-button>

              <md-menu-content>
                <router-link to="/">
                  <md-menu-item>
                    <md-icon>account_circle</md-icon>
                    <span class="md-list-item-text">Profile</span>
                  </md-menu-item>
                </router-link>
                <router-link to="/">
                  <md-menu-item>
                    <md-icon>settings</md-icon>
                    <span class="md-list-item-text">Settings</span>
                  </md-menu-item>
                </router-link>
                <router-link to="/">
                  <md-menu-item>
                    <md-icon>subdirectory_arrow_left</md-icon>
                    <span class="md-list-item-text">Log out</span>
                  </md-menu-item>
                </router-link>
              </md-menu-content>
            </md-menu>
          </div>
        </div>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible" md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
            <img src="./assets/swalyf.png" alt="Avatar" style="width:165px"/>
        </md-toolbar>

        <md-list>
          <router-link to="/">
            <md-list-item>
              <md-icon>home</md-icon>
              <span class="md-list-item-text">Home</span>
            </md-list-item>
          </router-link>

          <router-link to="/">
            <md-list-item>
              <md-icon>search</md-icon>
              <span class="md-list-item-text">Search</span>
            </md-list-item>
          </router-link>

          <router-link to="/">
            <md-list-item>
              <md-icon>group</md-icon>
              <span class="md-list-item-text">Friends</span>
              <md-badge class="md-primary md-square" md-content="6" />
            </md-list-item>
          </router-link>

          <router-link to="/">
            <md-list-item>
              <md-icon>settings</md-icon>
              <span class="md-list-item-text">Settings</span>
            </md-list-item>
          </router-link>

          <router-link to="/">
            <md-list-item>
              <md-icon>notifications</md-icon>
              <span class="md-list-item-text">Notifications</span>
              <md-badge class="md-square" md-content="6" />
            </md-list-item>
          </router-link>

          <router-link to="/">
            <md-list-item>
              <md-icon>subdirectory_arrow_right</md-icon>
              <span class="md-list-item-text">Log in</span>
            </md-list-item>
          </router-link>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view></router-view>
        <div class="phone-viewport">
          <md-bottom-bar md-sync-route>
            <md-bottom-bar-item to="/components/bottom-bar" exact md-label="Home" md-icon="home"></md-bottom-bar-item>
            <md-bottom-bar-item to="/components/bottom-bar/posts" md-label="Posts" md-icon="/assets/icon-whatshot.svg"></md-bottom-bar-item>
            <md-bottom-bar-item to="/components/bottom-bar/favorites" md-label="Favorites" md-icon="favorite"></md-bottom-bar-item>
          </md-bottom-bar>
        </div>
      </md-app-content>
      
    </md-app>
  </div>
</template>

<style lang="scss" scoped>
.md-app {
  height: 100vh;
  border: 1px solid rgba(#000, 0.12);
}

.md-app-content {
  padding: 20px;
}

// Demo purposes only
.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}
.md-primary {
  background-color: #2f2483 !important;
}
.md-menu-content{
  max-height: 43vh;
}
span{
  color:#2f2483!important
}
@media (max-width: 1280px) {
  .menu-button {
    display: block;
  }
}
@media (min-width: 1281px) {
  .menu-button {
    display: none;
  }
}
.phone-viewport {
    width: 322px;
    height: 200px;
    display: inline-flex;
    align-items: flex-end;
    overflow: hidden;
    border: 1px solid rgba(#000, .26);
    background: rgba(#000, .06);
  }
</style>

<script>
export default {
  name: "App",
  data: () => ({
    menuVisible: false
  })
};
</script>