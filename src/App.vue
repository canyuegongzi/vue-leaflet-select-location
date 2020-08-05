<style lang="stylus"></style>
<template lang="pug">
    div(id="root-view")
        router-view(id="root-main")
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

export default class App extends Vue {
    private created() {
        console.log("组件初始化");
    }
}
</script>
<style lang="stylus" scoped></style>
