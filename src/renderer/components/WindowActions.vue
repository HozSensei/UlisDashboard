<template>
  <div class="windowsHeader">
    <div class="actionsWindows flex">
      <a @click="reload"><i class="fa-solid fa-rotate"></i></a>
      <a @click="minimised"><i class="fa-solid fa-window-minimize"></i></a>
      <a @click="maximised"><i class="fa-regular fa-window-maximize"></i></a>
      <a @click="closeWindow"><i class="fa-solid fa-xmark"></i></a>
    </div>
  </div>
</template>

<script lang="ts">

export default {
  setup() {
  },
  data() {
      return {
      };
  },
  methods: {
      closeWindow() {
          window.electronAPI.windowAction('close');
      },
      maximised() {
          window.electronAPI.windowAction('maximize');
      },
      minimised() {
          window.electronAPI.windowAction('minimize');
      },
      reload() {
        window.electronAPI.windowAction('reload');
      }
  },
  computed: {},
  watch: {},
  async mounted() {

  }
}
</script>

<style lang="scss" scoped>

@import '../scss/variables';

.windowsHeader{
  position: fixed;
  z-index: 20;
  -webkit-app-region: drag;
  height:$windowHeaderSize;
  width:100%;
  background-color:rgb(20, 20, 20);
  top:0px;
  left:0px;
  border-bottom:1px solid #323337;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .actionsWindows{display: flex;}
  i{
    display: block;
    margin:0 10px;
    transition:300ms ease-in-out all;
    height: 13px;
    width:auto;
  }
  a{
    -webkit-app-region: no-drag;
    cursor:pointer;
    display: block;
    color:white;
    &:hover{
      color:#b5b7bb;
    }
  }
}

</style>
