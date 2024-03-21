<template>
  <div class="loadingComponent">
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <p class="message" v-if="message">{{ message }}</p>
  </div>
</template>
<script lang="ts">
export default {
  props: ['message'],
  data() {
    return {

    }
  }
}
</script>
<style scoped lang="scss">

@import '../scss/variables';
.loadingComponent{
  position: relative;
  width: 100%;
  height: 100%;
  background-color: transparent;
  .message{
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, 80px);
    text-transform: uppercase;
    letter-spacing: 3px;
  }
}
.lds-ring {
  display: inline-block;
  position: absolute;
  width: 80px;
  height: 80px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 10px;
  border: 8px solid $contrast;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: $contrast transparent transparent transparent;
}

.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}

.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}

.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>