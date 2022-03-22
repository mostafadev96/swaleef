<template>
  <div>
    <div
      class="md-layout md-gutter md-alignment-center md-scrollbar make_scroller"
      @scroll="handleScroll"
    >
      <div
        class="md-layout-item md-large-size-100 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
      >
        <md-card>
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{$store.getters.curr_user.name}}</div>
            </md-card-header-text>

            <md-card-media>
              <md-avatar class="md-large">
                <img :src="$store.getters.curr_user.avatar | render" alt="People" />
              </md-avatar>
            </md-card-media>
          </md-card-header>
          <md-dialog :md-active.sync="showUpdateProfile" md-click-outside-to-close md-close-on-esc>
            <md-dialog-title>{{ $t("auth.update_profile") }}</md-dialog-title>
            <md-dialog-content>
              <md-card>
                <md-card-content class="md-layout md-gutter">
                  <md-field :class="getValidationClass('name')">
                    <label for="name">{{ $t("auth.name") }}</label>
                    <md-input name="name" id="name" autocomplete="given-name" v-model="form.name" />
                  </md-field>
                  <md-field :class="getValidationClass('email')">
                    <label for="email">{{ $t("auth.email") }}</label>
                    <md-input
                      type="email"
                      name="email"
                      id="email"
                      autocomplete="email"
                      v-model="form.email"
                    />
                    <span class="md-error" v-if="!$v.form.email.email">{{ $t("auth.validation.email") }}</span>
                  </md-field>
                  <md-field :class="getValidationClass('birthday')">
                    <md-datepicker
                      v-model="form.birthday"
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
                    <label for="city_name">{{$t("auth.city")}}</label>
                    <md-select v-model="form.city_name" name="city_name" id="city_name">
                      <md-option v-for="(city,index) in cities" :value="city" :key="index">{{city}}</md-option>
                    </md-select>
                    <span class="md-error" v-if="!$v.form.city_name.required">{{ $t("auth.validation.required", { msg: $t("auth.city") }) }}</span>
                  </md-field>
                  <md-field>
                    <label>{{$t("auth.bio")}}</label>
                    <md-textarea v-model="form.about"></md-textarea>
                  </md-field>
                  <md-field>
                    <label>{{$t("auth.avatar")}}</label>
                    <md-file @change="uploadImage" accept="image/*" />
                  </md-field>
                  <div class="md-layout-item md-large-size-50">
                    <md-radio class="md-primary" v-model="form.gender" value="1">{{$t("auth.male")}}</md-radio>
                    <md-radio class="md-primary" v-model="form.gender" value="0">{{$t("auth.female")}}</md-radio>
                  </div>
                  <div class="md-layout-item md-large-size-100">
                    <img
                      v-show="previewImage"
                      :src="previewImage"
                      ref="file"
                      style="width:100px:height:100px"
                    />
                  </div>
                </md-card-content>
              </md-card>
            </md-dialog-content>
            <md-dialog-actions>
              <md-button class="md-primary" @click="showUpdateProfile = false">{{$t("auth.close")}}</md-button>
              <md-button class="md-primary" @click="validateUserData()">{{$t("auth.save")}}</md-button>
            </md-dialog-actions>
          </md-dialog>
          <md-dialog :md-active.sync="showCreatePost" md-click-outside-to-close md-close-on-esc>
            <md-dialog-title>{{$t("post.create_post")}}</md-dialog-title>
            <md-dialog-content>
              <md-card>
                <md-card-content class="md-layout md-gutter">
                  <md-field :class="getValidationCreatePostClass('quotation')">
                    <label for="quotation">{{$t("post.quotation")}}</label>
                    <md-textarea v-model="createdPost.quotation"></md-textarea>
                    <span class="md-error" v-if="!$v.createdPost.quotation.required">{{ $t("auth.validation.required", { msg: $t("post.quotation") }) }}</span>
                    <span class="md-error" v-if="!$v.createdPost.quotation.minLength">{{ $t("auth.validation.minLength", { msg: $t("post.quotation"),length:10 }) }}</span>
                    <span class="md-error" v-if="!$v.createdPost.quotation.maxLength">{{ $t("auth.validation.maxLength", { msg: $t("post.quotation"),length:10000 }) }}</span>
                  </md-field>
                  <md-field>
                    <label>{{$t("post.photo")}}</label>
                    <md-file @change="postImageHandler" accept="image/*" />
                  </md-field>

                  <div class="md-layout-item md-large-size-100">
                    <img
                      v-show="previewPostImage"
                      :src="previewPostImage"
                      ref="file"
                      style="width:100%:height:100%"
                    />
                  </div>
                </md-card-content>
              </md-card>
            </md-dialog-content>
            <md-dialog-actions>
              <md-button class="md-primary" @click="showCreatePost = false">{{$t("auth.close")}}</md-button>
              <md-button class="md-primary" @click="validateCreatePost()">{{$t("auth.save")}}</md-button>
            </md-dialog-actions>
          </md-dialog>
          <md-card-actions md-alignment="space-between">
            <md-badge :md-content="friends_count" class="md-white-font">
              <md-button to="/friends" class="md-icon-button">
                <md-icon>group</md-icon>
              </md-button>
            </md-badge>
            <md-button @click="showCreatePost = true" class="md-icon-button">
              <md-icon>add_circle_outline</md-icon>
            </md-button>
            <md-button @click="showUpdateProfile = true" class="md-icon-button">
              <md-icon>create</md-icon>
            </md-button>
          </md-card-actions>
        </md-card>
      </div>
      <div
        v-for="(post,index) in posts"
        :key="index"
        class="md-layout-item md-large-size-100 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
      >
        <md-card class="md-elevation-10" md-with-hover>
          <md-card-header>
            <md-card-header-text>
              <md-avatar>
                <img v-bind:src="post.user.avatar_thumbnail | render" alt="Avatar" />
              </md-avatar>

              <div class="md-title">{{post.user.name}}</div>
              <div class="md-subhead">{{post.created_at | dateFormatter}}</div>
            </md-card-header-text>

            <md-menu v-if="isLoggedIn" md-size="big" md-direction="bottom-end">
              <md-button class="md-icon-button rounded_button" md-menu-trigger>
                <md-icon>more_horiz</md-icon>
              </md-button>
              <md-menu-content>
                <md-menu-item @click="viewPost(index)">
                  <span>{{$t("post.view")}}</span>
                </md-menu-item>
                <md-menu-item @click="editPost(index)">
                  <span>{{$t("post.edit")}}</span>
                </md-menu-item>
                <md-menu-item @click="deletePost(index)">
                  <span>{{$t("post.delete")}}</span>
                </md-menu-item>
              </md-menu-content>
            </md-menu>
          </md-card-header>

          <md-card-media v-if="post.media_type=='Image'">
            <img v-bind:src="post.media | render" alt="People" style="width:100%" />
          </md-card-media>

          <md-card-content v-if="post.media_type=='No Media'">{{post.quotation}}</md-card-content>

          <md-card-actions v-if="isLoggedIn" class="post_actions">
            <md-badge
              class="md-accent md-square"
              style="color:white"
              md-position="top"
              :md-content="post.likes"
            >
              <md-button
                @click="likePost(index)"
                v-if="post.my_reaction.length>0 && post.my_reaction[0].react =='Like'"
                class="md-icon-button md-raised rounded_button"
                style="background-color:var(--md-theme-default-accent)"
                disabled
              >
                <md-icon style="color:white">thumb_up</md-icon>
                <span style="color:white">{{$t("post.like")}}</span>
              </md-button>
              <md-button
                @click="likePost(index)"
                v-else
                class="md-icon-button md-raised rounded_button"
              >
                <md-icon style="color:var(--md-theme-default-accent)">thumb_up</md-icon>
                <span style="color:var(--md-theme-default-accent)">{{$t("post.like")}}</span>
              </md-button>
            </md-badge>
            <md-badge
              id="dislike"
              class="md-accent md-square"
              style="color:white"
              md-position="top"
              :md-content="post.disLikes"
            >
              <md-button
                @click="disLikePost(index)"
                v-if="post.my_reaction.length>0  && post.my_reaction[0].react =='Dislike'"
                class="md-icon-button md-raised rounded_button"
                style="background-color:#FF0000"
                disabled
              >
                <md-icon style="color:#FFFFFF">thumb_down</md-icon>
                <span style="color:#FFFFFF">{{$t("post.dislike")}}</span>
              </md-button>
              <md-button
                @click="disLikePost(index)"
                v-else
                class="md-icon-button md-raised rounded_button"
              >
                <md-icon style="color:#FF0000">thumb_down</md-icon>
                <span style="color:#FF0000">{{$t("post.dislike")}}</span>
              </md-button>
            </md-badge>
            <md-button @click="comment(index)" class="md-icon-button md-raised rounded_button">
              <span style="color:var(--md-theme-default-accent)">{{$t("post.comment")}}</span>
            </md-button>
          </md-card-actions>

          <md-card-content v-if="isLoggedIn && post.post_comment.length>0">
            <md-card class="last_comment">
              <md-card-header>
                <md-card-header-text>
                  <md-avatar>
                    <img
                      v-bind:src="post.post_comment[0].user.avatar_thumbnail | render"
                      alt="Avatar"
                    />
                  </md-avatar>

                  <div class="md-title">{{post.post_comment[0].user.name}}</div>
                  <div class="md-subhead" style="word-break: break-all;">{{post.post_comment[0].quotation}}</div>
                </md-card-header-text>
              </md-card-header>
            </md-card>
          </md-card-content>
          <md-card-content :id="'my_comment'+index">
            <md-field md-inline>
              <label>{{$t("post.your_comment")}}</label>
              <md-input v-model="my_comment" ref="my_comment"></md-input>
              <md-button
                @click="addComment(index)"
                class="md-icon-button md-primary"
                style="margin-right:auto;width:50px"
              >
                <md-icon>add</md-icon>
              </md-button>
            </md-field>
          </md-card-content>
        </md-card>
      </div>
      <md-empty-state
        v-if="posts.length == 0"
        class="md-accent"
        md-rounded
        md-icon="article"
        :md-label="$t('main.no_posts')"
        :md-description="$t('main.no_posts_desc')"
      ></md-empty-state>
    </div>
    <md-snackbar
      md-position="center"
      :md-duration="4000"
      :md-active.sync="showSnackbar"
      md-persistent
    >
      <span>{{errorMessage}}</span>
    </md-snackbar>
    <md-dialog :md-active.sync="showEditPost" md-click-outside-to-close md-close-on-esc>
      <md-dialog-title>{{$t("post.update_post")}}</md-dialog-title>
      <md-dialog-content>
        <md-card>
          <md-card-content class="md-layout md-gutter">
            <md-field :class="getValidationEditPostClass('quotation')">
                    <label for="quotation">{{$t("post.quotation")}}</label>
                    <md-textarea v-model="editedPost.quotation"></md-textarea>
                    <span class="md-error" v-if="!$v.editedPost.quotation.required">{{ $t("auth.validation.required", { msg: $t("post.quotation") }) }}</span>
                    <span class="md-error" v-if="!$v.editedPost.quotation.minLength">{{ $t("auth.validation.minLength", { msg: $t("post.quotation"),length:10 }) }}</span>
                    <span class="md-error" v-if="!$v.editedPost.quotation.maxLength">{{ $t("auth.validation.maxLength", { msg: $t("post.quotation"),length:10000 }) }}</span>
            </md-field>
            <md-field>
              <label>{{$t("post.photo")}}</label>
              <md-file @change="editedPostImageHandler" accept="image/*" />
            </md-field>

            <div class="md-layout-item md-large-size-100">
              <img
                v-show="previewEditedPostImage"
                :src="previewEditedPostImage"
                ref="file"
                style="width:100%:height:100%"
              />
            </div>
          </md-card-content>
        </md-card>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showEditPost = false">{{$t("main.close")}}</md-button>
        <md-button class="md-primary" @click="validateEditPost()">{{$t("main.save")}}</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog-confirm
      :md-active.sync="showDeletePostPrompt"
      :md-title="$t('post.delete_post')"
      :md-content="$t('post.remove_confirm')"
      :md-confirm-text="$t('post.agree')"
      :md-cancel-text="$t('post.disagree')"
      @md-cancel="onCancel"
      @md-confirm="onConfirm"
    />
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import JSONHeader, { APIURL } from "../Constants";
import {
  required,
  minLength,
  maxLength,
  email
} from "vuelidate/lib/validators";
export default {
  name: "Home",
  mixins: [validationMixin],
  data: () => ({
    posts: [],
    my_comment: "",
    curr_page: 1,
    last_page: -1,
    showSnackbar: false,
    errorMessage: "",
    loader: {},
    cities: [],
    countries: [],
    showUpdateProfile: false,
    showCreatePost: false,
    showEditPost: false,
    showDeletePostPrompt: false,
    currentUpdatedIndex: -1,
    deletedPostIndex: -1,
    form: {
      name: null,
      birthday: null,
      city_name: null,
      country_name: null,
      gender: "1",
      about: null,
      email: null,
      avatar: ""
    },
    createdPost: {
      quotation: "",
      image: "",
      video: ""
    },
    editedPost: {
      id: null,
      quotation: "",
      image: "",
      video: ""
    },
    friends_count: 0,
    previewImage: null,
    previewPostImage: null,
    previewEditedPostImage: null
  }),
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(20)
      },
      birthday: {
        required
      },
      email: {
        email
      },
      country_name: {
        required
      },
      city_name: {
        required
      },
      gender: {
        required
      },
      about: {
        minLength: minLength(10)
      }
    },
    createdPost: {
      quotation: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(10000)
      },
    },
    editedPost: {
      quotation: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(10000)
      },
    },
  },
  computed: {
    axiosParams() {
      const params = new URLSearchParams();
      params.append("per_page", "10");
      params.append("curr_page", this.curr_page);
      return params;
    },
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },
    countryName() {
      return this.form.country_name;
    }
  },
  watch: {
    curr_page() {
      if (this.curr_page <= this.last_page) {
        this.getPosts();
      }
    },
    countryName() {
      this.loader = this.$loading.show(this.$loader_options);
      this.getAllCities();
    }
  },
  methods: {
    handleScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
      if (scrollTop + clientHeight >= scrollHeight) {
        console.log("hs");
        this.curr_page++;
      }
    },
    likePost(index) {
      this.$http({
        url: APIURL + "like-post",
        method: "POST",
        data: {
          post_id: this.posts[index].id,
          react: 1
        }
      })
        .then(response => {
          console.log(response.data);
          this.posts[index].likes++;
          if (this.posts[index].my_reaction.length > 0) {
            this.posts[index].disLikes--;
          }
          this.posts[index].my_reaction = [
            {
              react: "Like",
              post_id: this.posts[index].id
            }
          ];
          this.errorMessage = "Post Liked!!";
          this.showSnackbar = true;
        })
        .catch(response => {
          console.log(response);
        });
    },
    disLikePost(index) {
      this.$http({
        url: APIURL + "like-post",
        method: "POST",
        data: {
          post_id: this.posts[index].id,
          react: 0
        }
      })
        .then(response => {
          console.log(response.data);
          this.posts[index].disLikes++;
          if (this.posts[index].my_reaction.length > 0) {
            this.posts[index].likes--;
          }
          this.posts[index].my_reaction = [
            {
              react: "Dislike",
              post_id: this.posts[index].id
            }
          ];
          this.errorMessage = "Post disliked!!";
          this.showSnackbar = true;
        })
        .catch(response => {
          console.log(response);
        });
    },
    comment(index) {
      let element = document.getElementById("my_comment" + index);
      this.$refs.my_comment[index].$el.focus();
      element.scrollIntoView({ behavior: "smooth", block: "end" });
    },
    addComment(index){
      if(this.my_comment.length==0){
        console.log("Hi")
        this.errorMessage=this.$t('post.empty_comment');
        this.showSnackbar=true;
        return;
      }
      this.$http({
        url: APIURL + "comment-post",
        method: 'POST',
        data:{
            post_id:this.posts[index].id,
            quotation:this.my_comment
        }
      })
        .then(response => {
          console.log(response.data);
          let curr_date = new Date().toLocaleString();
          let commentObj ={
            created_at: curr_date,
            id: -1,
            post_id: this.posts[index].id,
            quotation: this.my_comment,
            updated_at: curr_date,
            user: 
            {
              id: this.$store.getters.curr_user.id,
              name: this.$store.getters.curr_user.name,
              avatar: this.$store.getters.curr_user.avatar,
              avatar_thumbnail: this.$store.getters.curr_user.avatar_thumbnail
            },
            user_id: this.$store.getters.curr_user.id
          }
          this.posts[index].post_comment.unshift(commentObj);
          this.my_comment = "";
        })
        .catch(response => {
          console.log(response);
        });
    },
    getPosts() {
      this.$Progress.start();
      this.$http({
        url: APIURL + "my-posts",
        params: this.axiosParams
      })
        .then(response => {
          console.log(response.data.data.data);
          this.posts.push(...response.data.data.data);
          this.last_page = response.data.data.last_page;
          this.$Progress.finish();
          this.loader.hide();
          console.log(this.posts);
        })
        .catch(response => {
          console.log(response);
        });
    },
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
        method: "POST",
        data: {
          country_name: this.form.country_name
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
    getValidationCreatePostClass(fieldName) {
      const field = this.$v.createdPost[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    getValidationEditPostClass(fieldName) {
      const field = this.$v.editedPost[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    my_profile() {
      this.$http({
        url: APIURL + "my-profile"
      })
        .then(response => {
          console.log(response.data.data.user);
          this.form = (({
            name,
            about,
            avatar,
            birthday,
            city_name,
            country_name,
            gender,
            phone
          }) => ({
            name,
            about,
            avatar,
            birthday,
            city_name,
            country_name,
            gender,
            phone
          }))(response.data.data.user);
          if (this.form.gender == "Male") {
            this.form.gender = "1";
          } else {
            this.form.gender = "0";
          }
          this.form.avatar = "";
          this.friends_count = response.data.data.friend_count;
          this.$Progress.finish();
          this.loader.hide();
          console.log(this.posts);
        })
        .catch(response => {
          console.log(response);
        });
    },
    updateProfile() {
      var formData = new FormData();
      for (let item in this.form) {
        formData.append(item, this.form[item]);
      }
      this.$store
        .dispatch("updateProfile", formData)
        .then(response => {
          console.log(response);
          this.showUpdateProfile = false;
          this.$Progress.finish();
          this.loader.hide();
          this.$router.go();
        })
        .catch(err => {
          console.log(err);
          this.errorMessage = err.response.message;
          this.showSnackbar = true;
          this.$Progress.fail();
        });
    },
    createPost() {
      var formData = new FormData();
      for (let item in this.createdPost) {
        formData.append(item, this.createdPost[item]);
      }
      this.$http
        .post(APIURL + "create-post", formData, {
          header: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(resp => {
          let postObj = resp.data.data;
          postObj.likes = 0;
          postObj.disLikes = 0;
          postObj.comments = 0;
          postObj.post_comment = [];
          postObj.my_reaction = [];
          postObj.user = {
            id: this.$store.getters.curr_user.id,
            name: this.$store.getters.curr_user.name,
            avatar: this.$store.getters.curr_user.avatar,
            avatar_thumbnail: this.$store.getters.curr_user.avatar_thumbnail
          };
          this.posts.unshift(postObj);
          this.showCreatePost = false;

          this.loader.hide();
        })
        .catch(err => {
          console.log(err);
        });
    },
    deletePost(index) {
      this.deletedPostIndex = index;
      this.showDeletePostPrompt = true;
    },
    viewPost(index) {
      this.$router.push(`post/${this.posts[index].id}`);
    },
    deletePostApi() {
      this.loader = this.$loading.show(this.$loader_options);
      this.$http({
        url: APIURL + "delete-post",
        method: "POST",
        data: {
          id: this.posts[this.deletedPostIndex].id
        }
      })
        .then(response => {
          if (response.data.success == false) {
            this.errorMessage = response.data.message;
            this.showSnackbar = true;
          } else {
            this.errorMessage = "deleted successfully";
            this.showSnackbar = true;
            this.showDeletePostPrompt = false;
            console.log(this.deletedPostIndex);
            console.log(this.posts);
            this.posts.splice(this.deletedPostIndex, 1);
            console.log(this.posts);
            this.loader.hide();
          }
        })
        .catch(response => {
          console.log(response);
        });
    },
    editPost(index) {
      this.showEditPost = true;
      this.editedPost.id = this.posts[index].id;
      this.currentUpdatedIndex = index;
      this.editedPost.quotation = this.posts[index].quotation;
    },
    editPostAPI() {
      var formData = new FormData();
      for (let item in this.editedPost) {
        formData.append(item, this.editedPost[item]);
      }
      this.$http
        .post(APIURL + "edit-post", formData, {
          header: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(resp => {
          this.posts[this.currentUpdatedIndex].quotation =
            resp.data.data.quotation;
          this.posts[this.currentUpdatedIndex].media_thumbnail =
            resp.data.data.media_thumbnail;
          this.posts[this.currentUpdatedIndex].media = resp.data.data.media;
          this.posts[this.currentUpdatedIndex].media_type =
            resp.data.data.media_type;
          this.showEditPost = false;
          this.loader.hide();
        })
        .catch(err => {
          console.log(err);
        });
    },
    validateUserData() {
      this.$v.form.$touch();
      if (!this.$v.form.$invalid) {
        console.log(this.form);
        this.$Progress.start();
        this.updateProfile();
      } else {
        this.errorMessage = "Something went wrong";
        this.showSnackbar = true;
      }
    },
    validateCreatePost() {
      this.$v.createdPost.$touch();
      if (!this.$v.createdPost.$invalid) {
        console.log(this.createdPost);
        this.loader = this.$loading.show(this.$loader_options);
        this.createPost();
      } else {
        this.errorMessage = "Something went wrong";
        this.showSnackbar = true;
      }
    },
    validateEditPost() {
      this.$v.editedPost.$touch();
      if (!this.$v.editedPost.$invalid) {
        console.log(this.form);
        this.loader = this.$loading.show(this.$loader_options);
        this.editPostAPI(this.currentUpdatedIndex);
      } else {
        this.errorMessage = "Something went wrong";
        this.showSnackbar = true;
      }
    },
    editProfile() {
      this.$http({
        url: APIURL + "country-city-list",
        method: "POST",
        data: {
          country_name: this.form.country_name
        },
        headers: JSONHeader
      }).then(response => {
        console.log(response.data.data);
        this.cities = response.data.data;
        this.$Progress.finish();
        this.loader.hide();
      });
    },
    uploadImage(e) {
      this.loader = this.$loading.show(this.$loader_options);
      const image = e.target.files[0];
      const reader = new FileReader();
      this.form.avatar = image;
      reader.readAsDataURL(image);
      reader.onload = e => {
        this.previewImage = e.target.result;
        this.loader.hide();
      };
    },
    postImageHandler(e) {
      this.loader = this.$loading.show(this.$loader_options);
      const image = e.target.files[0];
      const reader = new FileReader();
      this.createdPost.image = image;
      reader.readAsDataURL(image);
      reader.onload = e => {
        this.previewPostImage = e.target.result;
        this.loader.hide();
      };
    },
    editedPostImageHandler(e) {
      this.loader = this.$loading.show(this.$loader_options);
      const image = e.target.files[0];
      const reader = new FileReader();
      this.editedPost.image = image;
      reader.readAsDataURL(image);
      reader.onload = e => {
        this.previewEditedPostImage = e.target.result;
        this.loader.hide();
      };
    },
    onConfirm() {
      this.deletePostApi();
    },
    onCancel() {
      this.showDeletePostPrompt = false;
    }
  },
  created() {
    this.loader = this.$loading.show(this.$loader_options);
    this.getPosts();
    this.getAllCountries();
    this.my_profile();
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
  height: 92%;
}
</style>