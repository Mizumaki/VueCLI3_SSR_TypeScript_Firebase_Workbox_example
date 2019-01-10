<template>
  <div>{{ item.title }}</div>
</template>

<script>
export default {
  asyncData ({ store, route }) {
    // アクションから Promise が返されます
    return store.dispatch('fetchItem', route.params.id)
  },

  computed: {
    // ストアの状態から item を表示します
    item () {
      return this.$store.state.items[this.$route.params.id]
    }
  }
}
</script>