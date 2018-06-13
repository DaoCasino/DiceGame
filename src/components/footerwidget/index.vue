<template lang="pug">
  footer.footer
    span.copyrite © 2017 DAO.Casino. All Rights Reserved
    ul.link-list
      li.list-item(v-for="item in links")
        a.link-url(
          :href="item.link"
          target="blank"
        ) {{ item.name }}
</template>

<script>
export default {
  name: 'FooterWidget',
  data () {
    return {
      links: [
        {name: 'Privacy Policy', link: 'https://dao.casino/privacy_policy.pdf'},
        {name: 'Terms and Conditions', link: 'https://dao.casino/terms_and_conditions.pdf'},
        {name: 'mailto:team@dao.casino', link: 'mailto:mailto:team@dao.casino'}
      ]
    }
  }
}
</script>

<style lang="scss">
@import './index';
.footer {
  position: relative;
  margin: 20px 0 20px 0;
  display: block;
  text-align: center
}

.link-list {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 500px) {
    flex-direction: column;
    text-align: center;
  }
}

.list-item {
  margin-right: 10px;
  &:last-child {
    margin-right: 0;
  }
  @media screen and (max-width: 500px) {
    margin-top: 10px;
  }
}
</style>
