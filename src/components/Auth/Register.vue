<template>
  <div>
    <md-steppers :md-active-step.sync="active" md-linear>
      <md-step id="first" md-label="User Data" :md-error="firstStepError" :md-done.sync="first">
        <form novalidate class="md-layout" @submit.prevent="validateUserData">
          <md-card class="md-layout-item md-size-100 md-small-size-100">
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('name')">
                    <label for="name">{{ $t("auth.name") }}</label>
                    <md-input
                      name="name"
                      id="name"
                      autocomplete="given-name"
                      v-model="form.name"
                      :disabled="sending"
                    />
                    <span class="md-error" v-if="!$v.form.name.required">{{ $t("auth.validation.required", { msg: $t("auth.name") }) }}</span>
                    <span class="md-error" v-else-if="!$v.form.name.minlength">{{ $t("auth.validation.minlength", { msg: $t("auth.name"),length:3 }) }}</span>
                    <span class="md-error" v-else-if="!$v.form.name.maxlength">{{ $t("auth.validation.maxlength", { msg: $t("auth.name"),length:20 }) }}</span>
                  </md-field>
                </div>

                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('phone')">
                    <label for="phone">{{ $t("auth.phone") }}</label>
                    <md-input
                      name="phone"
                      id="phone"
                      autocomplete="family-name"
                      v-model="form.phone"
                      :disabled="sending"
                      type="number"
                    />
                    <span class="md-error" v-if="!$v.form.phone.required">{{ $t("auth.validation.maxlength", { msg: $t("auth.phone")}) }}</span>
                    <span class="md-error" v-else-if="!$v.form.phone.rightPhone">{{ $t("auth.validation.rightPhone", { msg: $t("auth.phone")}) }}</span>
                    <span class="md-error" v-else-if="!$v.form.phone.numeric">{{ $t("auth.validation.numeric", { msg: $t("auth.phone")}) }}</span>
                  </md-field>
                </div>
              </div>

              <md-field :class="getValidationClass('email')">
                <label for="email">{{ $t("auth.email") }}</label>
                <md-input
                  type="email"
                  name="email"
                  id="email"
                  autocomplete="email"
                  v-model="form.email"
                  :disabled="sending"
                />
                <span class="md-error" v-if="!$v.form.email.required">{{ $t("auth.validation.required", { msg: $t("auth.email")}) }}</span>
                <span class="md-error" v-else-if="!$v.form.email.email">{{ $t("auth.validation.email") }}</span>
              </md-field>

              <md-field :class="getValidationClass('password')">
                <label for="password">{{ $t("auth.password") }}</label>
                <md-input
                  name="password"
                  id="password"
                  v-model="form.password"
                  type="password"
                  :disabled="sending"
                ></md-input>
                <span class="md-error" v-if="!$v.form.password.required">{{ $t("auth.validation.required", { msg: $t("auth.password") }) }}</span>
              </md-field>
              <md-field :class="getValidationClass('confirm_password')">
                <label for="confirm_password">{{ $t("auth.confirm_passowrd") }}</label>
                <md-input
                  name="confirm_password"
                  id="confirm_password"
                  v-model="form.confirm_password"
                  type="password"
                  :disabled="sending"
                ></md-input>
                <span
                  class="md-error"
                  v-if="!$v.form.confirm_password.required"
                >{{ $t("auth.validation.required", { msg: $t("auth.confirm_passowrd") }) }}</span>
                <span
                  class="md-error"
                  v-else-if="!$v.form.confirm_password.sameAsPassword"
                >{{ $t("auth.validation.same_password", { msg: $t("auth.confirm_passowrd") }) }}</span>
              </md-field>
              <md-field :class="getValidationClass('birthday')">
                <md-datepicker
                  v-model="form.birthday"
                  :disabled="sending"
                  name="birthday"
                  id="birthday"
                  md-immediately
                  :md-model-type="String"
                >
                  <label>{{ $t("auth.birthday") }}</label>
                </md-datepicker>
                <span class="md-error" v-if="!$v.form.birthday.required">{{ $t("auth.validation.required", { msg: $t("auth.birthday") }) }}</span>
              </md-field>
              <md-field :class="getValidationClass('country_name')">
                <label for="country_name">{{ $t("auth.country") }}</label>
                <md-select v-model="form.country_name" name="country_name" id="country_name">
                  <md-option
                    v-for="(country,index) in countries"
                    :value="country"
                    :key="index"
                  >{{country}}</md-option>
                </md-select>
                <span class="md-error" v-if="!$v.form.country_name.required">{{ $t("auth.validation.required", { msg: $t("auth.country") }) }}</span>
              </md-field>
              <md-field :class="getValidationClass('city_name')">
                <label for="city_name">{{ $t("auth.city") }}</label>
                <md-select v-model="form.city_name" name="city_name" id="city_name">
                  <md-option
                    v-for="(city,index) in cities"
                    :value="city"
                    :key="index"
                  >{{city}}</md-option>
                </md-select>
                <span class="md-error" v-if="!$v.form.city_name.required">{{ $t("auth.validation.required", { msg: $t("auth.city") }) }}</span>
              </md-field>
              <md-radio class="md-primary" v-model="form.gender" value="1">{{ $t("auth.male") }}</md-radio>
              <md-radio class="md-primary" v-model="form.gender" value="0">{{ $t("auth.female") }}</md-radio>
            </md-card-content>
          </md-card>

          <md-button
            class="md-layout-item md-size-50 md-small-size-100 md-raised md-primary"
            type="submit"
            :disabled="sending"
          >{{ $t("auth.continue") }}</md-button>
        </form>
      </md-step>

      <md-step
        id="second"
        md-label="Phone Verification"
        :md-error="secondStepError"
        :md-done.sync="second"
      >
        <form novalidate class="md-layout" @submit.prevent="validateVerificationCode">
          <md-card class="md-layout-item md-size-100 md-small-size-100">
            <md-card-header>
              <div class="md-title">{{ $t("auth.check_code") }}</div>
            </md-card-header>

            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getCodeValidationClass('code')">
                    <label for="code">{{ $t("auth.code") }}</label>
                    <md-input
                      name="code"
                      id="code"
                      autocomplete="given-name"
                      v-model="formVerification.code"
                      :disabled="sending"
                    />
                    <span
                      class="md-error"
                      v-if="!$v.formVerification.code.required"
                    >{{ $t("auth.validation.required", { msg: $t("auth.code") }) }}</span>
                  </md-field>
                </div>
              </div>
            </md-card-content>
          </md-card>

          <md-button
            class="md-layout-item md-size-50 md-small-size-100 md-raised md-primary"
            type="submit"
            :disabled="sending"
          >{{ $t("auth.continue") }}</md-button>
          <md-snackbar :md-active.sync="userSaved">{{ $t("auth.last_user", { lastUser }) }}</md-snackbar>
        </form>
      </md-step>

      <md-step id="third" md-label="Last Step" :md-done.sync="third">
        <md-card>
          <md-card-content
            class="md-layout md-alignment-center-center"
            style="padding:20px 28px 12px 28px;text-align:center"
          >
            <span
              class="md-layout-item md-size-100 md-small-size-100 md-display-2 md-accent-font success_message"
            >{{ $t("auth.congratulations") }}</span>
            <span
              class="md-layout-item md-size-100 md-small-size-100 md-display-1 md-accent-font success_message"
            >{{ $t("auth.account_verified") }}</span>
          </md-card-content>
          <md-card-content
            class="md-layout md-alignment-center-center"
            style="padding:20px 28px 12px 28px;text-align:center"
          >
            <md-avatar
              class="md-layout-item md-size-30 md-small-size-40 md-avatar-icon md-accent"
              style="margin auto"
            >
              <md-icon class="md-size-4x" style="color:white">done</md-icon>
            </md-avatar>
          </md-card-content>
          <md-card-content
            class="md-layout md-alignment-center-center"
            style="padding:20px 28px 12px 28px;text-align:center"
          >
            <md-button
              class="md-layout-item md-size-40 md-small-size-100 md-icon-button md-raised success_message md-primary"
            >
              <span style="color:white">{{ $t("auth.start_swalyf") }}</span>
            </md-button>
          </md-card-content>
        </md-card>
      </md-step>
    </md-steppers>
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
import { validationMixin } from "vuelidate";
import JSONHeader, { APIURL } from "../../Constants";
import {
  required,
  email,
  minLength,
  maxLength,
  sameAs,
  numeric
} from "vuelidate/lib/validators";
const rightPhone = value => value.indexOf("05") == 0 && value.length == 10;
export default {
  name: "StepperLinear",
  mixins: [validationMixin],
  data: () => ({
    active: "first",
    first: false,
    second: false,
    third: false,
    secondStepError: null,
    firstStepError: null,
    errorMessage: "",
    showSnackbar: false,
    loader: {},
    cities: [],
    countries:[],
    form: {
      name: null,
      email: null,
      phone: null,
      password: null,
      confirm_password: null,
      birthday: null,
      city_name: null,
      country_name: null,
      gender: "1"
    },
    formVerification: {
      code: null
    },
    userSaved: false,
    sending: false,
    lastUser: null
  }),
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(20)
      },
      email: {
        required,
        email
      },
      phone: {
        required,
        numeric,
        rightPhone
      },
      password: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(20)
      },
      confirm_password: {
        required,
        sameAsPassword: sameAs("password")
      },
      birthday: {
        required
      },
      country_name: {
        required
      },
      city_name: {
        required
      },
      gender: {
        required
      }
    },
    formVerification: {
      code: {
        required,
        
      }
    }
  },
  beforeCreate: function() {
    if (this.$store.getters.isLoggedIn) {
      this.$router.push("/");
    }
  },
  mounted() {
    this.loader = this.$loading.show(this.$loader_options);
    this.$Progress.start();
    this.getAllCountries();
  },
  computed: {
    countryName() {
      return this.form.country_name;
    }
  },
  watch: {
    countryName() {
      this.loader = this.$loading.show(this.$loader_options);
      this.getAllCities();
    }
  },
  methods: {
    getAllCountries() {
      this.$http({
        url: APIURL + "country-city-list",
        headers: JSONHeader
      }).then(response => {
        console.log(response.data.data);
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
          country_name:this.form.country_name
        },
        headers: JSONHeader
      }).then(response => {
        console.log(response.data.data);
        this.cities = response.data.data;
        this.$Progress.finish();
        this.loader.hide();
      });
    },
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    getCodeValidationClass(fieldName) {
      const field = this.$v.formVerification[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    saveUser() {
      let data = {
        ...this.form,
        ...this.formVerification,
        device_id: "20",
        notification_id: "20",
        device_type: "web",
        os_version: "web"
      };
      data.phone = this.form.phone = "+966" + this.form.phone.substring(1);
      this.$store
        .dispatch("register", data)
        .then(response => {
          if (response.data.success) {
            this["second"] = true;
            this.secondStepError = null;
            this.active = "third";
            this.sending = false;
            this.$Progress.finish();
          } else {
            this.message = response.data.message;
            this.showSnackbar = true;
            this.$Progress.fail();
          }
        })
        .catch(err => {
          this.errorMessage = err.response.message;
          this.showSnackbar = true;
          this.$Progress.fail();
        });
    },
    sendVerification() {
      let phone = (this.form.phone = "+966" + this.form.phone.substring(1));
      this.$http({
        url: APIURL + "verify",
        body: {
          phone: phone,
          birthday: this.form.birthday
        },
        headers: JSONHeader
      })
        .then((/*response*/) => {
          this["first"] = true;
          this.firstStepError = null;
          this.active = "second";
          this.sending = false;
          this.$Progress.finish();
        })
        .catch(function(error) {
          this.errorMessage = error.response.message;
          this.showSnackbar = true;
          this.$Progress.fail();
        });
    },
    validateUserData() {
      this.$v.form.$touch();

      if (!this.$v.form.$invalid) {
        console.log(this.form);
        this.$Progress.start();
        this.sendVerification();
      } else {
        this.firstStepError = "Something went wrong";
      }
    },
    validateVerificationCode() {
      this.$v.formVerification.$touch();

      if (!this.$v.formVerification.$invalid) {
        console.log(this.formVerification);
        this.$Progress.start();
        this.saveUser();
      } else {
        this.secondStepError = "Something went wrong";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.md-stepper {
  padding: 16px 1px;
}
.md-avatar {
  min-width: 150px;
  min-height: 150px;
  border-radius: 50%;
}
.success_message {
  margin: 10px 0;
}
.md-icon-button {
  width: 70px !important;
  border-radius: 20px !important;
}
</style>