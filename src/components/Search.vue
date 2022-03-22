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
      <md-card class="md-layout-item md-size-100">
        <md-card-content>
          <form novalidate class="md-layout md-gutter" @submit.prevent="validateUserData">
            <div class="md-layout-item md-large-size-50">
              <md-field>
                <label for="name">{{$t("auth.name")}}</label>
                <md-input
                  name="name"
                  id="name"
                  autocomplete="family-name"
                  v-model="search.name"
                  type="text"
                />
              </md-field>
            </div>
            <div class="md-layout-item md-large-size-50">
              <md-field :class="getValidationClass('phone')">
                    <label for="phone">{{ $t("auth.phone") }}</label>
                    <md-input
                      name="phone"
                      id="phone"
                      autocomplete="family-name"
                      v-model="search.phone"
                      type="number"
                    />
                    <span class="md-error" v-if="!$v.search.phone.rightPhone">{{$t("auth.validation.rightPhone",{msg:$t("auth.phone")})}}</span>
                    <span class="md-error" v-else-if="!$v.search.phone.numeric">{{$t("auth.validation.numeric",{msg:$t("auth.phone")})}}</span>
              </md-field>
            </div>
            <div class="md-layout-item md-large-size-50">
                <md-field>
                  <label for="country">{{$t("auth.gender")}}</label>
                  <md-select v-model="search.gender" name="gender" id="gender" md-dense>
                    <md-option value="">{{$t('auth.no_filter')}}</md-option>
                    <md-option value="1">{{$t("auth.male")}}</md-option>
                    <md-option value="0">{{$t("auth.female")}}</md-option>
                  </md-select>
                </md-field>
            </div>
            <div class="md-layout-item md-large-size-25">
              <md-field>
                <label for="country_name">{{$t("auth.country")}}</label>
                <md-select v-model="country_name" name="country_name" id="country_name">
                  <md-option
                    v-for="(country,index) in countries"
                    :value="country"
                    :key="index"
                  >{{country}}</md-option>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item md-large-size-25">
              <md-field>
                <label for="city_name">{{$t("auth.city")}}</label>
                <md-select v-model="search.city_name" name="city_name" id="city_name">
                  <md-option
                    v-for="(city,index) in cities"
                    :value="city"
                    :key="index"
                  >{{city}}</md-option>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item md-large-size-50 search_btn">
              <md-button class="md-raised md-primary" type="submit">{{$t("main.search")}}</md-button>
            </div>
          </form>
        </md-card-content>
      </md-card>
      <div class="make_scroller" @scroll="handleScroll">
        <md-list v-show="searchEntries.length>0" >
          <md-list-item v-for="(searchEntry,index) in searchEntries" :key="index" :to="`/user/${searchEntry.id}`">
            <md-avatar>
              <img v-bind:src="searchEntry.avatar_thumbnail | render" />
            </md-avatar>

            <span class="md-list-item-text">{{searchEntry.name}}</span>

            <md-button :to="`/user/${searchEntry.id}`" class="md-icon-button md-list-action">
              <md-icon class="md-primary">chevron_right</md-icon>
            </md-button>
          </md-list-item>
        </md-list>
        <md-empty-state
          v-show="searchEntries.length==0"
          class="md-accent"
          md-rounded
          md-icon="group"
          :md-label="$t('main.no_users')"
          :md-description="$t('main.no_users_desc')"
      ></md-empty-state>
      </div>
    </div>
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
import JSONHeader,{ APIURL } from "../Constants";
import { validationMixin } from "vuelidate";
const rightPhone = value => (value.indexOf("05") == 0 && value.length == 10) || value.length==0;
import {
  numeric
} from "vuelidate/lib/validators";
// import "vue-range-component/dist/vue-range-slider.css";
// import VueRangeSlider from 'vue-range-component'
export default {
  name: "Home",
  mixins: [validationMixin],
  data: () => ({
    topTen: [],
    searchEntries: [],
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
  components: {
    // VueRangeSlider
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },
    axiosParams() {
      const params = new URLSearchParams();
      params.append("per_page", "10");
      params.append("search_keyword", this.search.name);
      params.append("gender", this.search.gender);
      params.append("page", this.curr_page);
      params.append("city_name", this.search.city_name);
      params.append("phone", this.search.phone);
      return params;
    }
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
    getValidationClass(fieldName) {
      const field = this.$v.search[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    validateUserData() {
      this.$v.search.$touch();
      if (!this.$v.search.$invalid) {
        console.log(this.search);
        this.$Progress.start();
        this.filterSearch();
      } else {
        this.errorMessage='Something went wrong';
      }
    },
    getAllCountries() {
      this.$http({
        url: APIURL + "country-city-list",
        headers: JSONHeader
      }).then(response => {
        // console.log(response.data.data);
        this.countries = response.data.data;
        this.$Progress.finish();
        this.loader.hide();

      });
    },
    getAllCities() {
      this.$http({
        url: APIURL + "country-city-list",
        method:"POST",
        data:{
          country_name:this.country_name
        },
        headers: JSONHeader
      }).then(response => {
        // console.log(response.data.data);
        this.cities = response.data.data;
        this.$Progress.finish();
        this.loader.hide();
      });
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
    renderData(clear, resp) {
      if (clear) this.searchEntries = resp.data;
      else this.searchEntries.push(...resp.data);
      this.last_page = resp.meta.last_page;
    },
    filterSearch() {
      this.curr_page = 1;
      this.$Progress.start();
      this.$http({
        url: APIURL + "get-user-filter",
        params: this.axiosParams
      })
        .then(response => {
          this.renderData(true, response.data);
          this.$Progress.finish();
          this.loader.hide();
        })
        .catch(response => {
          console.log(response);
        });
    },
    searchUsers() {
      this.$Progress.start();
      this.$http({
        url: APIURL + "get-user-filter",
        params: this.axiosParams
      })
        .then(response => {
          this.renderData(false, response.data);
          this.$Progress.finish();
          this.loader.hide();
        })
        .catch(response => {
          console.log(response);
        });
    }
  },
  created() {
    this.loader = this.$loading.show(this.$loader_options);
    this.getTopTen();
    this.getAllCountries();
  }
};
</script>

<style lang="scss" scoped>
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
  height: 50%;
}
.search_btn{
  text-align: left;
}
</style>