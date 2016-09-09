<template>
  <div class="user-viqew">
    <spinner :show="!user"></spinner>
    <div v-if="user">
      <h1>User : {{ user.id }}</h1>
      <ul class="meta">
        <li><span class="label">Created:</span> {{ user.created | timeAgo }} ago</li>
        <li v-if="user.about" v-html="user.about" class="about"></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user () {
      return {
        id: 'xxx',
        created: new Date(),
      }
    }
  },
}
</script>

<style lang="stylus">
.a
  color: ccx
  .v 
    color: ccc
.user-view
  background-color #fff
  box-sizing border-box
  padding 2em 3em
  h1
    margin 0
    font-size 1.5em
  .meta
    list-style-type none
    padding 0
  .label
    display inline-block
    min-width 4em
  .about
    margin 1em 0
  .links a
    text-decoration underline
</style>
