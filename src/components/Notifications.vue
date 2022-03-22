<template>
  <div
    class="md-layout md-gutter md-alignment-center md-scrollbar make_scroller"
    @scroll="handleScroll"
  >
    <div
      class="md-layout-item md-large-size-70 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
      v-for="(item,index) in list"
      :key="index"
      @click="showDetails(event,index)"
    >
      <md-card>
        <md-card-header>
          <div class="md-title">{{item.data.from}}</div>
          <div class="md-subhead">{{item.created_at | dateFormatter}}</div>
        </md-card-header>
        <md-card-content>{{item.data.title}}</md-card-content>
      </md-card>
      <md-snackbar
        md-position="center"
        :md-duration="4000"
        :md-active.sync="showSnackbar"
        md-persistent
      >
        <span>{{snackMessage}}</span>
      </md-snackbar>
    </div>
    <md-empty-state
          v-show="list.length==0"
          class="md-accent"
          md-rounded
          md-icon="notifications_active"
          :md-label="$t('main.no_notifications')"
          :md-description="$t('main.no_notifications_desc')"
    ></md-empty-state>
  </div>
</template>

<script>
import { APIURL } from "../Constants";

export default {
  name: "Settings",
  data: () => ({
    showSnackbar: false,
    snackMessage: "",
    list: [],
    curr_page: 1,
    last_page: -1,
    loader: {}
  }),
  computed: {
    axiosParams() {
      const params = new URLSearchParams();
      params.append("per_page", "10");
      params.append("curr_page", this.curr_page);
      return params;
    }
  },
  watch: {
    curr_page() {
      if (this.curr_page <= this.last_page) {
        this.getNotificationList();
      }
    }
  },
  methods: {
    getNotificationList() {
      this.$Progress.start();
      this.$http({
        url: APIURL + "notification-list",
        params: this.axiosParams
      })
        .then(response => {
          if (response.data.success) {
            console.log(response.data.data.data);
            this.list.push(...response.data.data.data);
            this.last_page = response.data.data.last_page;
          } else {
            this.snackMessage = response.data.message;
            this.showSnackbar = true;
          }
          this.$Progress.finish();
          this.loader.hide();
        })
        .catch(response => {
          console.log(response);
        });
    },
    handleScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
      if (scrollTop + clientHeight >= scrollHeight) {
        this.curr_page++;
      }
    },
    showDetails(event,index){
        console.log(index);
        this.$router.push(`/post/${this.list[index].data.post_id}`)
    }
  },
  created() {
    this.loader = this.$loading.show(this.$loader_options);
    this.getNotificationList();
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