<template>
  <div>
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :icons="icons"
      :open="openChat"
      :showEmoji="true"
      :showFile="true"
      :showEdition="true"
      :showDeletion="true"
      :showTypingIndicator="showTypingIndicator"
      :showLauncher="true"
      :showCloseButton="true"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :messageStyling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage"
      @scrollToTop="handleScrollToTop"
      :style="[myStyle]"
    />
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
import { APIURL, URL } from "../../Constants";
import CloseIcon from "vue-beautiful-chat/src/assets/close-icon.png";
import OpenIcon from "vue-beautiful-chat/src/assets/logo-no-bg.svg";
import FileIcon from "vue-beautiful-chat/src/assets/file.svg";
import CloseIconSvg from "vue-beautiful-chat/src/assets/close.svg";

export default {
  name: "ChatWidget",
  props: ["active", "participant"],
  watch: {
    participant() {
      this.getParticipant();
    },
    active() {}
  },
  data() {
    return {
      curr_page: 1,
      last_page: -1,
      showSnackbar: false,
      errorMessage: "",
      icons: {
        open: {
          img: OpenIcon,
          name: "default"
        },
        close: {
          img: CloseIcon,
          name: "default"
        },
        file: {
          img: FileIcon,
          name: "default"
        },
        closeSvg: {
          img: CloseIconSvg,
          name: "default"
        }
      },
      participants: [], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl:
        "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png",
      messageList: [], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: false, // to determine whether the chat window should be open or closed
      showTypingIndicator: "", // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: "#2f2483",
          text: "#ffffff"
        },
        launcher: {
          bg: "#2f2483"
        },
        messageList: {
          bg: "#ffffff"
        },
        sentMessage: {
          bg: "#2f2483",
          text: "#ffffff"
        },
        receivedMessage: {
          bg: "#eaeaea",
          text: "#222222"
        },
        userInput: {
          bg: "#f4f7f9",
          text: "#565867"
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
    };
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },
    axiosParams() {
      const params = new URLSearchParams();
      params.append("per_page", "10");
      params.append("page", this.curr_page);
      return params;
    },
    myStyle: function() {
      return {
        display: this.active && this.participants.length > 0 ? "block" : "none"
      };
    }
  },
  methods: {
    sendMessage(message) {
      var formData = new FormData();
      if(message.type=="file"){
      formData.append("image",message.data.file);
      }
      else{
      formData.append("quotation", message.data.text);
      }
      formData.append("to_user_id", this.participant);
      this.$http
        .post(APIURL + "send-message", formData, {
          header: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          if (response.data.success) {
            this.messageList = [...this.messageList, this.handleIncomingOneMessage(response.data.data)];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onMessageWasSent(message) {
      this.sendMessage(message);
    },
    openChat() {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true;
      this.newMessagesCount = 0;
    },
    closeChat() {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false;
    },
    handleScrollToTop() {
      this.curr_page++;
      console.log("Hi on Top");
      if (this.curr_page <= this.last_page) {
        this.getMessages();
      }
    },
    handleOnType() {
      console.log("Emit typing event");
    },
    editMessage(message) {
      const m = this.messageList.find(m => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    },
    handleIncomingOneMessage(msg){
      let obj = {
          type: msg.media_thumbnail ? "file" : "text",
          author:
            msg.from_user_id != this.$store.getters.curr_user.id
              ? msg.from_user_id
              : "me"
        };
        if (!msg.media) {
          obj.data = {
            text: msg.quotation,
            meta: msg.created_at
          };
        } else {
          obj.data = {
            file: {
              name: "photo",
              url: URL + msg.media
            },
            meta: msg.created_at
          };
        }
        return obj;
    },
    handleIncomingMessages(data) {
      console.log("data ", data);
      let res = data.map(val => {
        let message = this.handleIncomingOneMessage(val);
        this.messageList = [message , ...this.messageList];
        return message;

      });
      return res;
    },
    markRead() {
      this.$http({
        url: APIURL + "mark-message-readed",
        method: "POST",
        data: {
          user_id: this.participant
        }
      })
        .then(response => {
          console.log(response);
        })
        .catch(response => {
          this.loader.hide();
          console.log(response);
        });
    },
    getMessages() {
      this.$Progress.start();
      this.$http({
        url: APIURL + "get-messages",
        method: "POST",
        data: {
          user_id: this.participant,
          page: this.curr_page,
          per_page: 5
        }
      })
        .then(response => {
          if(response.data.success){
            this.last_page = response.data.data.last_page;
            this.handleIncomingMessages(response.data.data.data)
          }
          this.loader.hide();
          this.$Progress.finish();
        })
        .catch(response => {
          this.loader.hide();
          console.log(response);
        });
    },
    getParticipant() {
      this.$http
        .get(APIURL + "get-profile", {
          params: {
            user_id: this.participant
          }
        })
        .then(response => {
          if (response.data.success) {
            console.log(response.data.data.user);
            this.participants = [
              {
                id: response.data.data.user.id,
                name: response.data.data.user.name,
                imageUrl: URL + response.data.data.user.avatar_thumbnail
              },
              {
                id: this.$store.getters.curr_user.id,
                name: this.$store.getters.curr_user.name,
                imageUrl: URL + this.$store.getters.curr_user.avatar_thumbnail
              }
            ];
            this.markRead();
            this.getMessages();
          } else {
            this.participants = [];
            this.errorMessage = "This user is blocked";
            this.showSnackbar = true;
            this.$Progress.finish();
            // this.$router.go(-1);
          }
        })
        .catch(response => {
          this.loader.hide();
          console.log(response);
        });
    }
  },
  created() {
    this.loader = this.$loading.show(this.$loader_options);
    this.getParticipant();
  }
};
</script>

<style lang="scss" scoped>
.md-card {
  width: 100%;
  margin: 6px;
  display: inline-block;
  vertical-align: top;
  text-align: left;
}
.md-layout-item {
  margin-top: 8px;
  margin-bottom: 8px;
  text-align: center;
}
.md-list-item-content {
  padding: 0;
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
  height: 85%;
}
.search_btn {
  text-align: left;
}
</style>