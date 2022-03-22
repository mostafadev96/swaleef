<template>
  <div class="md-layout md-gutter md-alignment-center md-scrollbar make_scroller">
    <div
      class="md-layout-item md-large-size-70 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
    >
      <md-list>
        <md-list-item>
          <span class="md-list-item-text md-accent-font">{{$t('main.my_posts')}}</span>
          <label class="language-switcher">
            <input type="checkbox" v-model="my_posts" />
            <span class="slider round"></span>
            <span class="select-ar">{{$t('main.public')}}</span>
            <span class="select-en">{{$t('main.private')}}</span>
          </label>
        </md-list-item>
        <md-list-item>
          <span class="md-list-item-text md-accent-font">{{$t('main.dob')}}</span>
          <label class="language-switcher">
            <input type="checkbox" v-model="dob" />
            <span class="slider round"></span>
            <span class="select-ar">{{$t('main.public')}}</span>
            <span class="select-en">{{$t('main.private')}}</span>
          </label>
        </md-list-item>
        <md-list-item>
          <span class="md-list-item-text md-accent-font">{{$t('main.wall_filter')}}</span>
          <label class="language-switcher">
            <input type="checkbox" v-model="wall_filter" />
            <span class="slider round"></span>
            <span class="select-ar">{{$t('main.public')}}</span>
            <span class="select-en">{{$t('main.private')}}</span>
          </label>
        </md-list-item>

        <router-link to="/block-list">
          <md-list-item>
            <span class="md-list-item-text md-accent-font">{{$t('main.blocklist')}}</span>
            <md-icon class="md-size-2x" style="color:red">not_interested</md-icon>
          </md-list-item>
        </router-link>
        <md-list-item>
            <span class="md-list-item-text md-accent-font"></span>

            <md-button class="md-raised md-accent" style="margin:0;color:white" @click="saveSettings()">
                {{$t('auth.save')}}
            </md-button>

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
import { APIURL } from "../Constants";

export default {
  name: "Settings",
  data: () => ({
    showSnackbar: false,
    snackMessage: "",
    my_posts: "",
    wall_filter: "",
    dob: "",
    loader: {}
  }),
  computed: {},
  watch: {
    my_posts() {
      if(this.curr_page <= this.last_page){
        this.getPosts();
      }
    },
    wall_filter() {
      if(this.curr_page <= this.last_page){
        this.getPosts();
      }
    },
    dob() {
      if(this.curr_page <= this.last_page){
        this.getPosts();
      }
    }
  },
  methods: {
    getSettings() {
      this.$http({
        url: APIURL + "setting",
      })
        .then(response => {
          this.my_posts = response.data.data[0].timeline_privacy=="Public"?false:true;
          this.wall_filter = response.data.data[0].wall_filter=="Public"?false:true;
          this.dob = response.data.data[0].birthday_privacy=="Public"?false:true;
          this.loader.hide();
        })
        .catch(response => {
          console.log(response);
        });
    },
    saveSettings(){
    this.loader = this.$loading.show(this.$loader_options);
      this.$http({
        url: APIURL + "setting",
        method: 'POST',
        data:{
            birthday_privacy:this.dob?0:1,
            timeline_privacy:this.my_posts?0:1,
            wall_filter:this.wall_filter?0:1
        }
      })
        .then(response => {
          this.my_posts = response.data.data[0].timeline_privacy=="Public"?false:true;
          this.wall_filter = response.data.data[0].wall_filter=="Public"?false:true;
          this.dob = response.data.data[0].birthday_privacy=="Public"?false:true;
          this.loader.hide();
          this.snackMessage='Settings Saved Successfully';
          this.showSnackbar=true;
        })
        .catch(response => {
          console.log(response);
        });
    }
  },
  created() {
    this.loader = this.$loading.show(this.$loader_options);
    this.getSettings();
  }
};
</script>

<style lang="scss" scoped>
// Variables
$deep-blue: var(--md-theme-default-accent);
$speed3: cubic-bezier(0.26, 0.48, 0.08, 0.9);

// Size var
// Update this value to change the language switcher size
$height: 50px;
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
    font-size: #{$height / 4.5};
    top: #{$height / 3.2};
    color: #000;
  }
  .select-ar {
    left: #{$height / 3.5};
  }
  .select-en {
    right: #{$height / 5};
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
</style>