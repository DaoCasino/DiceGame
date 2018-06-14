<template lang="pug">
  .chat
    transition(name="chat-bg")
      .chat-bg(
        v-if="getChatTrigger"
        @click.prevent="chatOver"
      )
    transition(name="chat-tab")
      .chat-module(v-if="getChatTrigger")
        .chat-module__header
          h2.chat-module__capt chat
          .chat-module__close(@click.prevent="chatOver")
            a.chat-module__close-but(href="#")
        .chat-module__messages(ref="messages")
          transition(name="username-anim")
            .chat-module__username(v-if="usernameTrigger")
              span.chat-module__username-error(v-if="isError") Name is longer than 10 characters
              input.chat-module__username-inp(
                ref="username"
              )
              button.chat-module__username-send(
                @click.prevent="addUser"
              ) Go chat
          ul.chat-module__messages-list(ref="messlist")
            li.chat-module__messages-items(
              v-for="item in getMessages"
              ref="messitem"
            )
              .chat-module__messages-body
                span.chat-module__messages-name {{ item.name }}
                span.chat-module__messages-text {{ item.mess }}
        form.chat-module__add-message
          textarea.chat-module__inp.chat-module__text(
            type="text"
            name="username"
            placeholder="Message"
            @keydown.13.prevent="sendMess"
            ref="messtext"
          )
          button.chat-module__send(@click.prevent="sendMess") send
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      col: 14,
      name: '',
      scroll: true,
      isFlag: true,
      isError: false,
      usernameTrigger: true
    }
  },

  computed: mapState('chat', {
    getMessages    : state => state.allMess,
    getChatTrigger : state => state.trigger
  }),

  created () {
    this.chatRoom = this.$DCLib.chatInit()
    const mess    = JSON.parse(localStorage.getItem('chatmess'))

    if (typeof mess !== 'undefined' && mess !== null) {
      for (let item of mess) {
        this.updateAllMessage({
          name: item.name,
          mess: item.mess
        })
      }
    }
  },

  beforeMount () {
    const name = localStorage.getItem('username')

    if (typeof name !== 'undefined' && name !== null) {
      this.name            = name
      this.usernameTrigger = false
    }
  },

  mounted () {
    this.chatRoom.on('action::message', data => {
      this.updateAllMessage({
        name: data.message.name,
        mess: data.message.mess
      })
    })
  },

  updated () {
    if (typeof this.$refs.messages !== 'undefined') {
      if (this.scroll) {
        this.scrollDown()
      }
    }

    localStorage.setItem('chatmess', JSON.stringify(this.getMessages.slice(-15)))
  },

  methods: {
    ...mapMutations('chat', [
      'updateAllMessage',
      'updateChatTrigger'
    ]),

    chatOver () {
      this.updateChatTrigger(false)
      this.isFlag = true
    },

    scrollDown () {
      if (!this.isFlag && typeof this.$refs.messitem !== 'undefined'
      && this.$refs.messitem.length >= 3
      && this.$refs.messitem[this.$refs.messitem.length - 3].getBoundingClientRect().bottom > 900) {
        return
      }

      this.isFlag = false
      this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
    },

    addUser () {
      this.isError = (this.$refs.username.value.length > 10) ? true : false;

      if (this.$refs.username.value
      && this.$refs.username.value !== ''
      && !this.isError) {
        this.name = this.$refs.username.value

        localStorage.setItem('username', this.name)
        this.usernameTrigger = false
      }
    },

    sendMess () {
      if (this.$refs.messtext.value 
      && this.$refs.messtext.value !== ''
      && !this.usernameTrigger) {
        this.updateAllMessage({
          name: this.name,
          mess: this.$refs.messtext.value
        })
  
        this.chatRoom.sendMsg({
          action: 'message',
          message: {
            name: this.name,
            mess: this.$refs.messtext.value
          }
        })

        this.$refs.messtext.value = ''
      }
    }
  }
}
</script>

<style lang="scss">
@import './index';
.chat {
  position: absolute;
  width: 100vw;
  height: 100vh;
  &.index {
    display: none
  }
  &-bg {
    position: fixed;
    z-index: 400;
    width: 100vw;
    height: 100vh;
  }
  &-module {
    position: fixed;
    padding: 20px 10px;
    z-index: 400;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 350px;
    height: 100vh;
    @media screen and(max-width: 480px) {
      width: 100vw
    }
    &__header {
      position: relative;
      display: flex;
      justify-content: center;
      width: 100%;
    }
    &__close {
      position: absolute;
      right: 10px;
      width: 25px;
      height: 25px;
      &-but {
        position: absolute;
        width: 25px;
        height: 5px;
        border-radius: $radius;
        transform: translateY(7px) rotate(45deg);
        &:before {
          content: "";
          @extend .chat-module__close-but;
          position: absolute;
          right: 0;
          transform: rotate(-90deg);
        }
      }
    }
    &__username {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      z-index: 100;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: $radius;
      &-inp {
        margin-top: 20px;
        padding: 10px;
        height: 30px;
        text-align: center;
        border-radius: $radius
      }
      &-send {
        cursor: pointer;
        padding: 5px 10px;
        margin-top: 20px;
        border-radius: $radius
      }
    }
    &__messages {
      position: relative;
      margin: 20px 10px;
      width: 100%;
      height: 100%;
      display: flex;
      border-radius: $radius;
      overflow-y: auto;
      &:scrollbar {
        width: 0;
      }
      &-list {
        position: relative;
        padding-top: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        width: 100%;
        min-height: min-content;
      }
      &-body {
        margin: 0 10px 10px 10px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        min-width: 200px;
        border-radius: $radius;
      }
      &-text {
        display: inline-block;
        word-break: break-word;
        word-wrap: break-word;
        overflow-wrap: break-word;        
        -moz-user-select: -moz-all;
        -o-user-select: all;
        -khtml-user-select: all;
        -webkit-user-select: all;
        user-select: all
      }
    }
    &__add-message {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
    }
    &__inp {
      cursor: pointer;
      padding: 10px;
      width: 77%;
      height: 50px;
      border-radius: $radius;
      resize: none;
    }
    &__send {
      cursor: pointer;
      margin-left: auto;
      padding: 0 10px;
      height: 50px;
      border-radius: $radius;
    }
  }
}
</style>
