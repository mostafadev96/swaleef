<template>
  <div>
    <md-steppers :md-active-step.sync="active" md-linear>
      <md-step id="first" md-label="Phone" :md-error="firstStepError" :md-done.sync="first">
        <form novalidate class="md-layout" @submit.prevent="validateUserData">
          <md-card class="md-layout-item md-size-100 md-small-size-100">
            <md-card-content>
              <md-field :class="getValidationNewPasswordClass('old_password')">
                <label for="old_password">{{ $t("auth.password")}}</label>
                <md-input
                  name="old_password"
                  id="old_password"
                  v-model="form.old_password"
                  type="password"
                  :disabled="sending"
                ></md-input>
                <span
                  class="md-error"
                  v-if="!$v.form.old_password.required"
                >{{ $t("auth.validation.required", { msg: $t("auth.password") }) }}</span>
              </md-field>
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
        md-label="Verification"
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
                    <label for="code">{{$t("auth.code")}}</label>
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
                    <span
                      class="md-error"
                      v-else-if="!$v.formVerification.code.sameCode"
                    >{{ $t("auth.validation.sameCode") }}</span>
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
        </form>
      </md-step>

      <md-step id="third" md-label="Reset" :md-done.sync="third">
        <form novalidate class="md-layout" @submit.prevent="validateNewPassword">
          <md-card class="md-layout-item md-size-100 md-small-size-100">
            <md-card-content>
              <md-field :class="getValidationNewPasswordClass('password')">
                <label for="password">{{ $t("auth.password") }}</label>
                <md-input
                  name="password"
                  id="password"
                  v-model="newPasswordVerification.password"
                  type="password"
                  :disabled="sending"
                ></md-input>
                <span
                  class="md-error"
                  v-if="!$v.newPasswordVerification.password.required"
                >{{ $t("auth.validation.required",{msg:$t("auth.password")}) }}</span>
              </md-field>
              <md-field :class="getValidationNewPasswordClass('repeatPassword')">
                <label for="repeatPassword">{{$t("auth.confirm_password")}}</label>
                <md-input
                  name="repeatPassword"
                  id="repeatPassword"
                  v-model="newPasswordVerification.repeatPassword"
                  type="password"
                  :disabled="sending"
                ></md-input>
                <span
                  class="md-error"
                  v-if="!$v.newPasswordVerification.repeatPassword.required"
                >{{ $t("auth.validation.required", { msg: $t("auth.password") }) }}</span>
                <span
                  class="md-error"
                  v-else-if="!$v.newPasswordVerification.repeatPassword.sameAsPassword"
                >{{ $t("auth.validation.same_password", { msg: $t("auth.password") }) }}</span>
              </md-field>
            </md-card-content>
          </md-card>

          <md-button
            class="md-layout-item md-size-50 md-small-size-100 md-raised md-primary"
            type="submit"
            :disabled="sending"
          >Continue</md-button>
        </form>
      </md-step>
      <md-step id="fourth" md-label="Done" :md-done.sync="fourth">
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
            >{{ $t("auth.password_changed") }}</span>
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
    <md-snackbar md-position="center" :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
      <span>{{errorMessage}}</span>
    </md-snackbar>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import JSONHeader,{ APIURL } from '../../Constants'

import {
  required,
  minLength,
  maxLength,
  sameAs,
  numeric
} from "vuelidate/lib/validators";
const rightPhone = (value) => value.indexOf('05') == 0 && value.length ==10;

export default {
  name: "StepperLinear",
  mixins: [validationMixin],
  data: () => ({
    active: "first",
    first: false,
    second: false,
    third: false,
    fourth: false,
    secondStepError: null,
    thirdStepError: null,
    firstStepError: null,
    errorMessage:"",
    showSnackbar: false,
    form: {
      phone: null
    },
    formVerification: {
      code: null
    },
    newPasswordVerification: {
      password: null,
      repeatPassword: null
    },
    userSaved: false,
    sending: false,
  }),
  validations: {
    form: {
      phone: {
        required,
        numeric,
        rightPhone
      }
    },
    formVerification: {
      code: {
        required,
        sameCode(value) {
          // standalone validator ideally should not assume a field is required
          if (value === "") return true;

          // simulate async call, fail for all logins with even length
          return new Promise(resolve => {
            this.axios
              .post("http://localhost:8000/yourPostApi", {
                code: this.formVerification.code
              })
              .then((/*response*/) => {
                resolve(false);
              });
            // .catch(function (error) {
            // });
          });
        }
      }
    },
    newPasswordVerification: {
      password: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(20)
      },
      repeatPassword: {
        required,
        sameAsPassword: sameAs("password")
      }
    }
  },
  methods: {
    setDone(id, index) {
      this[id] = true;

      this.secondStepError = null;

      if (index) {
        this.active = index;
      }
    },
    setError() {
      this.secondStepError = "This is an error!";
    },
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    getValidationNewPasswordClass(fieldName) {
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
    sendVerification() {
      let phone = this.form.phone = "+966" + this.form.phone.substring(1);
      this.axios
        .post(APIURL + "verify",{
          phone: phone,
          birthday: this.form.birthday,
        }, {
          headers: JSONHeader
        })
        .then((/*response*/) => {
          this["first"] = true;
          this.firstStepError = null;
          this.active = "second";
          this.sending = false;
          this.$Progress.finish();
        })
        .catch(function (error) {
          this.errorMessage = error.response.message;
          this.showSnackbar =true;
          this.$Progress.fail();
        });
    },
    resetPasswordApi() {
      let data = {
        ...this.form,
        ...this.formVerification,
        device_id:this.newPasswordVerification.password,
        notification_id:"20",
        device_type:"web",
        os_version:"web",
      }
      data.phone = this.form.phone = "+966" + this.form.phone.substring(1);
      this.axios
        .post(APIURL + "reset-password",data, {
          headers: JSONHeader
        })
        .then((response) => {
          if(response.data.success){
            this["third"] = true;
            this.thirdStepError = null;
            this.active = "fourth";
            this.sending = false;
            this.$Progress.finish();
            this.$router.push('/login')
          }
          else{
            this.message = response.data.message;
            this.showSnackbar =true;
            this.$Progress.fail();
          }
        })
        .catch((error) => {
          this.errorMessage = error.response.message;
          this.showSnackbar =true;
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
        this["second"] = true;
        this.secondStepError = null;
        this.active = "third";
        this.sending = false;
      } else {
        this.secondStepError = "Something went wrong";
      }
    },
    validateNewPassword() {
      this.$v.newPasswordVerification.$touch();

      if (!this.$v.newPasswordVerification.$invalid) {
        console.log(this.newPasswordVerification);
        this.$Progress.start();
        this.resetPasswordApi();
        
      } else {
        this.thirdStepError = "Something went wrong";
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