<template>
  <div id="app">
    <component :is="layout">
      <router-view/>
      <vue-progress-bar></vue-progress-bar>
    </component>
  </div>
</template>

<script>
const default_layout = "default";
export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + "-layout";
    }
  },
  created() {
    // console.log(this.$store.state.user);
    // console.log(this.$route, this.$route.meta.layout);
  },
  updated() {
    // something defined here whatever the this.$route.path
    // console.log(this.$route, this.$route.meta.layout);
  },
  beforeMount() {
    if(this.$store.getters.getLang =='ar'){
      document.querySelector('body').classList.toggle('ar');
    }
  }
};
</script>


<style lang="scss">

</style>