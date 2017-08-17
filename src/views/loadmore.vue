<template>
  <div class="box">
    <load-more
      ref="loadmore"
      :auto-fill="false"
      :top-method="loadTop" 
      :bottom-method="loadBottom" 
      :bottom-all-loaded="true" 
    >
      <ul>
        <li v-for="i in 200" :key="i+1">{{i}}</li>
      </ul>
    </load-more>
  </div>
</template>

<script>
import LoadMore from '../components/pull-drop-refresh'
export default {
  components: { LoadMore },
  data () {
    return {}
  },
  methods: {
    loadBottom () {},
    loadTop () {}
  }
}
</script>

<style>
  .box {
    height: 500px;
    overflow-y: auto;
  }
</style>
