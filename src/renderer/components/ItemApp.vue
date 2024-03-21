<template>
  <div class="item">
    <h3 @click="toggle = !toggle"><span class="status" :class="statusClass">{{ item.status }}</span>{{ item.title }}</h3>
    <a :href="item.url" target="_blank">{{ item.url }}</a>
    <ul class="details" v-if="item.status == 200" v-show="toggle">
      <li v-for="(detail, key) in item.response">
        <template v-if="key == 'commit'">
            <strong>{{ key }}</strong><span><a :href="'https://gitlab-priv.uliege.be/ulis/ulis3/ulis-3/-/tree/' + detail" target="_blank">{{ detail }}</a></span>
        </template>
        <template v-else>
            <strong>{{ key }}</strong><span>{{ detail }}</span>
        </template>
    </li>  
    </ul>
    <div class="errors" v-else v-show="toggle">{{ item.response }}</div>
  </div>
</template>

<script lang="ts">

export default {
  components:{},
  props:['item'],
  setup() {
  },
  data() {
    return {
      toggle: false
    }
  },
  methods: {

  },
  computed: {
    statusClass(){
      return {
        error: this.item.status != 200,
        ok: this.item.status == 200
      }
    }
  },
  watch: {},
  mounted() {
    
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables';
.item{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 20px 30px;
    border-radius: 20px;
    background-color: rgba(255,255,255,0.05);
    &:not(:last-child){
      margin-bottom: 10px;
    }
    h3{
      cursor: pointer;
      color:white;
      font-weight: 800;
      display: flex;
      gap:15px;
      align-items: center;
      span{
        display: block;
        color:white;
        padding: 5px 20px;
        font-weight: 300;
        border-radius: 50px;
        &.ok{
          background-color: $green;
        }
        &.error{
          background-color: $red;
        }
      }
    }
    a{
      color: #3d95dd;
      text-decoration: none;
    }
    .details{
      width: 100%;
      column-count: 2;
      column-gap: 50px;
      margin-top:15px;
      li{
        display: flex;
        width: 100%;
        justify-content: space-between;
        border-top: 1px solid rgba(255,255,255,0.1);
        padding: 10px 0;
      }
    }
    .errors{
      width: 100%;
      margin-top:15px;
      color:$red;
    }
  }

</style>