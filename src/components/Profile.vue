<template>
  <div
    class="md-layout md-gutter md-alignment-center md-scrollbar make_scroller"
    @scroll="handleScroll"
  >
    <div
      v-if="user"
      class="md-layout-item md-large-size-100 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
    >
      <md-card>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">{{user.name}}</div>
          </md-card-header-text>

          <md-card-media>
            <md-avatar class="md-large">
              <img :src="user.avatar | render" alt="People" />
            </md-avatar>
          </md-card-media>
        </md-card-header>
        <md-card-actions md-alignment="space-between">
          <md-button :to="`/friends_of_friends/${user_id}`" class="md-icon-button">
            <md-tooltip md-direction="top">{{ $t("main.friends_of_user", { user: user.name}) }}</md-tooltip>
            <md-icon>group</md-icon>
          </md-button>
          <md-button v-show="isLoggedIn && isFriend" @click="startChat()" class="md-icon-button">
            <md-tooltip md-direction="top">{{ $t("main.start_chat")}}</md-tooltip>
            <md-icon>chat_bubble_outline</md-icon>
          </md-button>
          <md-button v-show="isLoggedIn && isFriend" @click="removeFriend()" class="md-icon-button">
            <md-tooltip md-direction="top">{{ $t("main.remove_friend")}}</md-tooltip>
            <md-icon>person_remove</md-icon>
          </md-button>
          <md-button v-show="isLoggedIn && !isFriend" @click="addFriend()" class="md-icon-button">
            <md-tooltip md-direction="top">{{ $t("main.add_friend")}}</md-tooltip>
            <md-icon>person_add_alt_1</md-icon>
          </md-button>
          <!-- <md-button v-show="isLoggedIn && isFriend" @click="blockUser()" class="md-icon-button">
            <md-icon>not_interested</md-icon>
          </md-button> -->
        </md-card-actions>
      </md-card>
    </div>
    <div
      v-for="(post,index) in posts"
      :key="index"
      class="md-layout-item md-large-size-100 md-medium-size-100 md-small-size-100 md-xsmall-size-100" 
    >
      <md-card class="md-elevation-10" md-with-hover>
        <md-card-header>
          <md-card-header-text>
            <md-avatar>
              <img v-bind:src="post.user.avatar_thumbnail | render" alt="Avatar"  />
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
                <span>{{$t('post.view')}}</span>
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </md-card-header>

        <md-card-media v-if="post.media_type=='Image'">
          <img v-bind:src="post.media | render" alt="People" style="width:100%"/>
        </md-card-media>

        <md-card-content v-if="post.media_type=='No Media'">
          {{post.quotation}}
        </md-card-content>

        <md-card-actions v-if="isLoggedIn" class="post_actions">
          <md-badge
            class="md-accent md-square"
            style="color:white"
            md-position="top"
            :md-content="post.likes"
          >
            <md-button @click="likePost(index)" v-if="post.my_reaction.length>0 && post.my_reaction[0].react =='Like'" class="md-icon-button md-raised rounded_button" style="background-color:var(--md-theme-default-accent)" disabled>
              <md-icon style="color:white">thumb_up</md-icon>
              <span style="color:white">{{$t('post.like')}}</span>
            </md-button>
            <md-button @click="likePost(index)" v-else class="md-icon-button md-raised rounded_button" >
              <md-icon style="color:var(--md-theme-default-accent)">thumb_up</md-icon>
              <span style="color:var(--md-theme-default-accent)">{{$t('post.like')}}</span>
            </md-button>
          </md-badge>
          <md-badge
            id="dislike"
            class="md-accent md-square"
            style="color:white"
            md-position="top"
            :md-content="post.disLikes"
          >
            <md-button @click="disLikePost(index)" v-if="post.my_reaction.length>0  && post.my_reaction[0].react =='Dislike'" class="md-icon-button md-raised rounded_button" style="background-color:#FF0000" disabled>
              <md-icon style="color:#FFFFFF">thumb_down</md-icon>
              <span style="color:#FFFFFF">{{$t('post.dislike')}}</span>
            </md-button>
            <md-button @click="disLikePost(index)" v-else class="md-icon-button md-raised rounded_button">
              <md-icon style="color:#FF0000">thumb_down</md-icon>
              <span style="color:#FF0000">{{$t('post.dislike')}}</span>
            </md-button>
          </md-badge>
          <md-button @click="comment(index)" class="md-icon-button md-raised rounded_button">
            <span style="color:var(--md-theme-default-accent)">{{$t('post.comment')}}</span>
          </md-button>
        </md-card-actions>

        <md-card-content v-if="isLoggedIn && post.post_comment.length>0">
          <md-card class="last_comment">
            <md-card-header>
              <md-card-header-text>
                <md-avatar>
                  <img v-bind:src="post.post_comment[0].user.avatar_thumbnail | render" alt="Avatar" />
                </md-avatar>

                <div class="md-title">{{post.post_comment[0].user.name}}</div>
                <div class="md-subhead" style="word-break: break-all;">{{post.post_comment[0].quotation}}</div>
              </md-card-header-text>
            </md-card-header>
          </md-card>
        </md-card-content>
        <md-card-content :id="'my_comment'+index" v-if="isLoggedIn">
            <md-field md-inline>
              <label>{{$t('post.your_comment')}}</label>
              <md-input v-model="my_comment" ref="my_comment"></md-input>
              <md-button @click="addComment(index)" class="md-icon-button md-primary" style="margin-right:auto;width:50px">
              <md-icon>add</md-icon>
            </md-button>
            </md-field>
        </md-card-content>
      </md-card>
    </div>
    <chat-widget
    :active="chat_active"
    :participant="participant"
    style="z-index:9999;direction:ltr"
    ></chat-widget>
    <md-empty-state
        v-if="posts.length == 0"
        class="md-accent"
        md-rounded
        md-icon="article"
        :md-label="$t('main.no_posts')"
        :md-description="$t('main.no_posts_desc')"
      ></md-empty-state>
    <md-snackbar md-position="center" :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
        <span>{{errorMessage}}</span>
    </md-snackbar>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import JSONHeader, { APIURL } from "../Constants";
import ChatWidget from "./Partials/ChatWidget"
import {
  required,
  minLength,
  maxLength,
} from "vuelidate/lib/validators";
export default {
  name: "Profile",
  mixins: [validationMixin],
  data: () => ({
    chat_active:false,
    participant:null,
    posts: [],
    my_comment: "",
    curr_page: 1,
    last_page: -1,
    user:null,
    isFriend:0,
    showSnackbar: false,
    errorMessage: "",
    loader: {},
    cities: [],
    countries:[],
    showUpdateProfile: false,
    showCreatePost: false,
    form: {
      name: null,
      birthday: null,
      city_name: null,
      country_name: null,
      gender: "1"
    },
  }),
  components:{
    ChatWidget
  },
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
      country_name: {
        required
      },
      city_name: {
        required
      },
      gender: {
        required
      }
    }
  },
  computed: {
    axiosParams() {
      const params = new URLSearchParams();
      params.append("per_page", "10");
      params.append("page", this.curr_page);
      params.append("user_id", this.$route.params.id);
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
    viewPost(index) {
      this.$router.push(`post/${this.posts[index].id}`)
    },
    likePost(index) {
      this.$http({
        url: APIURL + "like-post",
        method: 'POST',
        data:{
            post_id:this.posts[index].id,
            react:1
        }
      })
        .then(response => {
          console.log(response.data);
          this.posts[index].likes++;
          if(this.posts[index].my_reaction.length>0){
            this.posts[index].disLikes--;
          }
          this.posts[index].my_reaction =[
            {
              react:'Like',
              post_id:this.posts[index].id
            }
          ];
          this.errorMessage='Post Liked!!';
          this.showSnackbar=true;
        })
        .catch(response => {
          console.log(response);
        });
    },
    disLikePost(index) {
      this.$http({
        url: APIURL + "like-post",
        method: 'POST',
        data:{
            post_id:this.posts[index].id,
            react:0
        }
      })
        .then(response => {
          console.log(response.data);
          this.posts[index].disLikes++;
          if(this.posts[index].my_reaction.length>0){
            this.posts[index].likes--;
          }
          this.posts[index].my_reaction =[
            {
              react:'Dislike',
              post_id:this.posts[index].id
            }
          ];
          this.errorMessage='Post disliked!!';
          this.showSnackbar=true;
        })
        .catch(response => {
          console.log(response);
        });
      },
    comment(index){
      let element = document.getElementById("my_comment"+index);
      this.$refs.my_comment[index].$el.focus()
      element.scrollIntoView({behavior: "smooth", block: "end"});
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
        url: APIURL + "get-user-posts",
        params: this.axiosParams
      })
        .then(response => {
          if(response.data.success){
            console.log(response.data.data.data);
            this.posts.push(...response.data.data.data);
            this.last_page = response.data.data.last_page;
          }
          
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
    getProfile(user_id){
      this.$http.get(APIURL + "get-profile",{
            params: {
              user_id
            }
        })
        .then(response => {
          if(response.data.success){
            console.log(response.data.data.user);
            this.user = {...response.data.data.user};
            this.participant = this.user.id;
            this.isFriend = response.data.data.friend_status;
            this.getPosts();
          }
          else{
            this.$Progress.finish();
            this.loader.hide();
            this.$router.go(-1);
          }
          
        })
        .catch(response => {
          console.log(response)
        });
    },
    removeFriend(){
      this.$http({
        url: APIURL + "unfriend",
        method: "POST",
        data: {
          friend_id: this.user.id,
        }
      })
        .then(response => {
          console.log(response.data);
          this.isFriend = 0;
          this.errorMessage = `You are no longer have friend called ${this.user.name}`;
          this.showSnackbar = true;
        })
        .catch(response => {
          console.log(response);
        });
    },
    addFriend(){
      this.$http({
        url: APIURL + "send-friend-request",
        method: "POST",
        data: {
          recipient_id: this.user.id,
        }
      })
        .then(response => {
          console.log(response.data);
          this.isFriend = 0;
          this.errorMessage = `You are no longer have friend called ${this.user.name}`;
          this.showSnackbar = true;
        })
        .catch(response => {
          console.log(response);
        });
    },
    blockUser(){
      this.$http({
        url: APIURL + "block",
        method: "POST",
        data: {
          user_id: this.user.id,
          action:0
        }
      })
      .then(response => {
          console.log(response.data);
          this.isFriend = 0;
          this.errorMessage = `You are no longer have friend called ${this.user.name}`;
          this.showSnackbar = true;
      })
      .catch(response => {
          console.log(response);
      });
    },
    startChat(){
      this.participant = this.$route.params.id;
      this.chat_active = true;
    }
  },
  created() {
    console.log('created');
    this.user_id = this.$route.params.id;
    if (this.$store.getters.isLoggedIn && this.user_id == this.$store.getters.curr_user.id) {
      this.$router.push('/my_profile')
    }
    else{
      this.loader = this.$loading.show(this.$loader_options);
      this.getProfile(this.$route.params.id);
    }
  },
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