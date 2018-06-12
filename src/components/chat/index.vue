<template lang="pug">
  .chat
    transition(name="chat-bg")
      .chat-bg(
        v-if="getChatTrigger"
        @click="chatOver"
      )
    transition(name="chat-tab")
      .chat-module(v-if="getChatTrigger")
        .chat-module__header
          h2.chat-module__capt chat
          .chat-module__close(@click="chatOver")
            a.chat-module__close-but(href="#")
        .chat-module__messages(ref="messages")
          ul.chat-module__messages-list(ref="messlist")
            li.chat-module__messages-items(v-for="item in col")
              .chat-module__messages-body
                span.chat-module__messages-name fanyShu
                p.chat-module__messages-text lorem asjfasdjka dsajdklasjdlas daslkjdlasjd adsaljs;djas;f as;dasj;dajs faksjfa fasj fasjd afsdj
        form.chat-module__add-message
          textarea.chat-module__inp.chat-module__text(
            type="text"
            name="username"
            placeholder="Message"
          )
          button.chat-module__send(@click="sendMess") send
</template>

<script>
export default {
  data () {
    return {
      col: 14,
      scroll: true,
    }
  },

  updated () {
    if (typeof this.$refs.messages !== 'undefined') {
      if (this.scroll) {
        this.scrollDown()
      }
    }
  },

  computed: {
    getChatTrigger () { return this.$store.state.triggers.chat }
  },

  methods: {
    chatOver (e) {
      e.preventDefault()
      this.$store.commit('updateChatTrigger', false)
    },

    scrollDown () {
      this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
    },

    sendMess (e) {
      e.preventDefault()
      this.col++
    }
  }
}
</script>

<style lang="scss">
@import './index';
.chat {
  position: absolute;
  z-index: 400;
  width: 100vw;
  height: 100vh;
  &.index {
    display: none
  }
  &-bg {
    position: fixed;
    width: 100vw;
    height: 100vh;
  }
  &-module {
    position: fixed;
    padding: 20px 10px;
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
    &__messages {
      margin: 20px 10px;
      width: 100%;
      height: 100%;
      display: flex;
      border-radius: $radius;
      overflow-y: auto;
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
        text-align: end;
        border-radius: $radius;
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
