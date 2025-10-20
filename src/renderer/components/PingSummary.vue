<template>
  <div class="summary">
    <h2>
      <span>Résumé</span>
      <span class="date">(Dernière mise à jour : <strong>{{ formattedDate }}</strong>)</span>
    </h2>
    <div class="container">
      <div class="item list" @click="filterList('all')" :class="{active: filterSelect == 'all'}">
        <div class="icon"><i class="fa-sharp fa-light fa-browser"></i></div>
        <h3>
          <strong>{{ testTotal }}</strong>
          <span>Apps testées</span>
        </h3>
      </div>
      <div class="item error" @click="filterList('error')" :class="{active: filterSelect == 'error'}">
        <div class="icon"><i class="fa-sharp fa-light fa-bug"></i></div>
        <h3>
          <strong>{{ nbrError }}</strong>
          <span>En erreur</span>
        </h3>
      </div>
      <div class="item success" @click="filterList('success')" :class="{active: filterSelect == 'success'}">
        <div class="icon"><i class="fa-sharp fa-light fa-thumbs-up"></i></div>
        <h3>
          <strong>{{ nbrSucces }}</strong>
          <span>Rien à signaler</span>
        </h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

export default {
  components:{},
  emits: ['filter'],
  props:['nbrSucces', 'nbrError', 'testTotal', 'lastUpdate'],
  setup() {
  },
  data() {
    return {
        filterSelect: 'all'
    };
  },
  methods: {
    filterList(type){
        this.filterSelect = type;
        this.$emit('filter', type);
    }
  },
  computed: {
    formattedDate() {
      if (!this.lastUpdate) return '';
      return this.lastUpdate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  watch: {},
  mounted() {
    
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/variables';

.summary{
  width:90%;
  margin:25px auto;
  padding: 50px;
  border-radius: 25px;
  background-color: rgba(0,0,0,0.2);
  h2{
    font-weight: 800;
    font-size:36px;
    margin-bottom:25px;
    color:white;
    padding-left:25px;
    border-left:5px solid $contrast;
    display: flex;
    align-items: baseline;
    gap: 10px;
    .date{
      font-size: 14px;
      font-weight: 300;
      color:$text_color_light;
      strong{
        font-weight: 500;
      }
    }
  }
}

.summary{
  .container{
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    .item{
      width:30%;
      padding: 30px;
      border-radius: 20px;
      background-color: rgba(255,255,255,0.05);
      display: flex;
      align-items:center;
      gap:20px;
      border-bottom:5px solid $bg_main;
      cursor: pointer;
      &.list{
        .icon{
            background-color: rgba($contrast, 1);
        }
        &.active{
            border-bottom:5px solid $contrast;
        }
      }
      &.error{
        .icon{
            background-color: rgba($red, 1);
        }
        &.active{
            border-bottom:5px solid $red;
        }
      }
      &.success{
        .icon{
            background-color: rgba($green, 1);
        }
        &.active{
            border-bottom:5px solid $green;
        }
      }
      h3{
        display: flex;
        flex-direction: column;
        gap:5px;
        strong{
          font-size: 36px;
          color:white;
        }
        span{
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 15px;
          color:$text_color_light;
        }
      }
      .icon{
        border-radius: 50%;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255,255,255,0.1);
        color:white;
        i{
          font-size: 24px;
        }
      }
      
    }
  }
}
</style>