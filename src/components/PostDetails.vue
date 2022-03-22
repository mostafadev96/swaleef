<template>
  <div class="md-layout md-gutter md-alignment-center md-scrollbar">
    <div
      v-if="post"
      class="md-layout-item md-large-size-100 md-medium-size-100 md-small-size-100 md-xsmall-size-100"
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
              @click="likePost()"
              v-if="post.my_reaction.length>0 && post.my_reaction[0].react =='Like'"
              class="md-icon-button md-raised rounded_button"
              style="background-color:var(--md-theme-default-accent)"
              disabled
            >
              <md-icon style="color:white">thumb_up</md-icon>
              <span style="color:white">{{$t("post.like")}}</span>
            </md-button>
            <md-button
              @click="likePost()"
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
              @click="disLikePost()"
              v-if="post.my_reaction.length>0  && post.my_reaction[0].react =='Dislike'"
              class="md-icon-button md-raised rounded_button"
              style="background-color:#FF0000"
              disabled
            >
              <md-icon style="color:#FFFFFF">thumb_down</md-icon>
              <span style="color:#FFFFFF">{{$t("post.dislike")}}</span>
            </md-button>
            <md-button
              @click="disLikePost()"
              v-else
              class="md-icon-button md-raised rounded_button"
            >
              <md-icon style="color:#FF0000">thumb_down</md-icon>
              <span style="color:#FF0000">{{$t("post.dislike")}}</span>
            </md-button>
          </md-badge>
          <md-button @click="comment()" class="md-icon-button md-raised rounded_button">
            <span style="color:var(--md-theme-default-accent)">{{$t("post.comment")}}</span>
          </md-button>
        </md-card-actions>
        <md-card-content v-if="isLoggedIn && post.post_comment.length>0">
          <md-card v-for="(comment,index) in post.post_comment" :key="index" class="last_comment">
            <md-card-header>
              <md-card-header-text>
                <md-avatar>
                  <img
                    v-bind:src="comment.user.avatar_thumbnail | render"
                    alt="Avatar"
                  />
                </md-avatar>

                <div class="md-title">{{comment.user.name}}</div>
                <div class="md-subhead" style="word-break: break-all;">{{comment.quotation}}</div>
              </md-card-header-text>
            </md-card-header>
          </md-card>
        </md-card-content>
        <md-card-content :id="'my_comment'" v-if="isLoggedIn">
          <md-field md-inline>
            <label>{{$t("post.your_comment")}}</label>
            <md-input v-model="my_comment" ref="my_comment"></md-input>
            <md-button
              @click="addComment()"
              class="md-icon-button md-primary"
              style="margin-right:auto;width:50px"
            >
              <md-icon>add</md-icon>
            </md-button>
          </md-field>
        </md-card-content>
      </md-card>
      <md-snackbar
        md-position="center"
        :md-duration="4000"
        :md-active.sync="showSnackbar"
        md-persistent
      >
        <span>{{errorMessage}}</span>
      </md-snackbar>
    </div>
  </div>
</template>

<script>
import { APIURL } from "../Constants";

export default {
  name: "Details",
  data: () => ({
    post: null,
    my_comment: "",
    showSnackbar: false,
    errorMessage: "",
    loader: {}
  }),
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },
  watch: {},
  methods: {
    likePost() {
      this.$http({
        url: APIURL + "like-post",
        method: "POST",
        data: {
          post_id: this.post.id,
          react: 1
        }
      })
        .then(response => {
          console.log(response.data);
          this.post.likes++;
          if (this.post.my_reaction.length > 0) {
            this.post.disLikes--;
          }
          this.post.my_reaction = [
            {
              react: "Like",
              post_id: this.post.id
            }
          ];
          this.errorMessage = "Post Liked!!";
          this.showSnackbar = true;
        })
        .catch(response => {
          console.log(response);
        });
    },
    disLikePost() {
      this.$http({
        url: APIURL + "like-post",
        method: "POST",
        data: {
          post_id: this.post.id,
          react: 0
        }
      })
        .then(response => {
          console.log(response.data);
          this.post.disLikes++;
          if (this.post.my_reaction.length > 0) {
            this.post.likes--;
          }
          this.post.my_reaction = [
            {
              react: "Dislike",
              post_id: this.post.id
            }
          ];
          this.errorMessage = "Post disliked!!";
          this.showSnackbar = true;
        })
        .catch(response => {
          console.log(response);
        });
    },
    comment() {
      let element = document.getElementById("my_comment");
      this.$refs.my_comment.$el.focus();
      element.scrollIntoView({ behavior: "smooth", block: "end" });
    },
    addComment() {
      if(this.my_comment.length==0){
        console.log("Hi")
        this.errorMessage=this.$t('post.empty_comment');
        this.showSnackbar=true;
        return;
      }
      this.$http({
        url: APIURL + "comment-post",
        method: "POST",
        data: {
          post_id: this.post.id,
          quotation: this.my_comment
        }
      })
        .then(response => {
          console.log(response.data);
          let curr_date = new Date().toLocaleString();
          let commentObj = {
            created_at: curr_date,
            id: -1,
            post_id: this.post.id,
            quotation: this.my_comment,
            updated_at: curr_date,
            user: {
              id: this.$store.getters.curr_user.id,
              name: this.$store.getters.curr_user.name,
              avatar: this.$store.getters.curr_user.avatar,
              avatar_thumbnail: this.$store.getters.curr_user.avatar_thumbnail
            },
            user_id: this.$store.getters.curr_user.id
          };
          this.post.post_comment.unshift(commentObj);
          this.my_comment = "";
        })
        .catch(response => {
          console.log(response);
        });
    },
    getPost(id) {
      this.$Progress.start();
      this.$http({
        url: APIURL + "get-post",
        method: "POST",
        data: {
          post_id: id
        }
      })
        .then(response => {
          console.log(response.data.data);
          this.post = response.data.data;
          this.loader.hide(); 
          this.$Progress.finish();
        })
        .catch(() => {
          this.$router.push(`/404`);
        });
    }
  },
  created() {
    this.loader = this.$loading.show(this.$loader_options);
    this.getPost(this.$route.params.id);
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