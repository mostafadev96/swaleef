<template>
<div class="md-layout md-gutter md-alignment-center">
    <div class="md-layout-item md-large-size-50 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
    <md-card>
      <router-link to="/">
        <md-card-media>
          <img src="../../assets/swalyf.png" alt="People">
        </md-card-media>
      </router-link>
      <md-card-content>
        <slot />        
      </md-card-content>
    </md-card>
  </div>
  </div>
</template>

<style lang="scss" scoped>
.md-layout{
  margin:auto!important;
}
.md-card-media{
  text-align: center;
}
  .md-card-media img {
    width: auto;
  }
</style>

<script>
export default {
  name: 'Reveal',
  data: () => ({
    menuVisible: false
  })
}
</script>