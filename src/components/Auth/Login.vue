<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateLogin">
          <md-card class="md-layout-item md-size-100">
            <md-card-content>
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                  <md-field :class="getValidationClass('phone')">
                    <md-icon>phone</md-icon>
                    <label for="phone">{{ $t("auth.phone") }}</label>
                    <md-input
                      name="phone"
                      id="phone"
                      autocomplete="family-name"
                      v-model="form.phone"
                      type="number"
                      :disabled="sending"
                    />
                    <span class="md-error" v-if="!$v.form.phone.required">{{ $t("auth.validation.numeric", { msg: $t("auth.phone") }) }}</span>
                    <span class="md-error" v-else-if="!$v.form.phone.rightPhone">{{ $t("auth.validation.rightPhone", { msg: $t("auth.phone") }) }}</span>
                    <span class="md-error" v-else-if="!$v.form.phone.numeric">{{ $t("auth.validation.numeric", { msg: $t("auth.phone") }) }}</span>
                  </md-field>
                </div>
              </div>
              <md-field :class="getValidationClass('password')">
                <md-icon>lock</md-icon>
                <label for="password">{{ $t("auth.password")}}</label>
                <md-input
                  name="password"
                  id="password"
                  v-model="form.password"
                  type="password"
                  :disabled="sending"
                ></md-input>
                <span class="md-error" v-if="!$v.form.password.required">{{ $t("auth.validation.required", { msg: $t("auth.password") }) }}</span>
              </md-field>
            </md-card-content>
          </md-card>

          <md-button
            class="md-layout-item md-size-100 md-raised md-primary" style="color:white;border-radius:25px"
            type="submit"
            :disabled="sending"
          >{{ $t("auth.login")}}</md-button>
          <md-button class="md-layout-item md-size-50 signup_forget_buttons md-accent" to="/register">{{ $t("auth.register")}}</md-button>
          <md-button class="md-layout-item md-size-50 signup_forget_buttons md-accent" to="/forget">{{ $t("auth.forget_password")}}</md-button>
        </form>
        <md-snackbar md-position="center" :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
          <span>{{errorMessage}}</span>
        </md-snackbar>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";

import {
  required,
  minLength,
  maxLength,
  numeric
} from "vuelidate/lib/validators";
// import Vue from 'vue'
// const rightPhone = (value) => value.indexOf('05') == 0 && value.length ==10;
export default {
  name: "Login",
  mixins: [validationMixin],
  beforeCreate: function () {
    if (this.$store.getters.isLoggedIn) {
      this.$router.push('/')
    }
  },
  data: () => ({
    form: {
      phone: null,
      password: null,
    },
    sending: false,
    errorMessage:"",
    showSnackbar: false,
  }),
  validations: {
    form: {
      phone: {
        required,
        numeric,
        // rightPhone
      },
      password: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(20)
      },
    },
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    loginApi() {
      let data = {
        ...this.form,
        device_id:"20",
        notification_id:"20",
        device_type:"web",
        os_version:"web",
      }
     data.phone = "+966" + this.form.phone.substring(1);
     this.$store.dispatch('login', data)
       .then((response) =>
        {
          if(response.data.success){
            // this.$session.start()
            // this.$session.set('jwt', response.data.data.token.access_token);
            // this.$session.set('user', response.data.data.user);
            // Vue.http.headers.common['Authorization'] = response.data.data.token.token_type + " " + response.body.token
            this.$Progress.finish();
            this.$router.go();
            
          }
          else{
            this.errorMessage = response.data.message;
            this.showSnackbar =true;
            this.$Progress.fail();
          }
        }
        )
       .catch((error) => {
        this.errorMessage = error.response.data.message;
        this.showSnackbar =true;
        this.$Progress.fail();
       })
    },
    validateLogin() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        console.log(this.form);
        this.$Progress.start();
        this.loginApi();
      } else {
        this.firstStepError = "Something went wrong";
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.md-stepper {
  padding: 16px 1px;
}
.signup_forget_buttons{
  margin: 6px 0px;text-transform: none;
}
</style>