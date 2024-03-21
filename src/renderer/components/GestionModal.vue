<template>
  <div class="gestionModal">
    <div class="contentModal">
      <form>
        <fieldset v-for="(item, index) in newObject.listApps" :key="index">
            <input type="text" v-model="item.title" placeholder="Titre">
            <input type="text" v-model="item.url" placeholder="Url">
            <div class="toggle" @click="item.notif = !item.notif">
                <i class="fa-solid fa-bell" v-if="item.notif"></i>
                <i class="fa-solid fa-bell-slash" v-else></i>
            </div>
            <button type="button" @click="removeItem(index)" class="remove"><i class="fa-solid fa-trash"></i></button>
        </fieldset>
        <div class="btn-container">
            <button @click="allNotification(false)" type="button" class="notification"><i class="fa-solid fa-bell-slash"></i></button>
            <button @click="allNotification(true)" type="button" class="notification"><i class="fa-solid fa-bell"></i></button>
            <button @click="saveElements" type="button" class="save">Sauvegarder</button>
            <button @click="addElement" type="button" class="add">Ajouter</button>
        </div>
      </form>
    </div>
    <div class="hover" @click="$emit('close')"></div>
  </div>
</template>

<script lang="ts">

export default {
  props:['data'],
  setup() {
  },
  data() {
    return {
      newObject: this.data
    };
  },
  methods: {
    addElement(){
      this.newObject.listApps.push({ title: '', url: '' });
    },
    removeItem(index){
      this.newObject.listApps.splice(index, 1);
    },
    saveElements(){
      window.electronAPI.saveApps(JSON.stringify(this.newObject));
      this.$emit('close');
    },
    allNotification(value){
        this.newObject.listApps.forEach( app => {
            app.notif = value;
        })
        window.electronAPI.saveApps(JSON.stringify(this.newObject));
    }
  },
  computed: {},
  watch: {},
  mounted() {
  }
}
</script>

<style lang="scss" scoped>

@import '../scss/variables';

.gestionModal{
  position: absolute;
  z-index: 2;
  top:30px;
  height: calc(100% - 30px);
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  .contentModal{
    position: relative;
    z-index: 2;
    width: 90%;
    max-width: 1024px;
    border:1px solid $bg_secondary;
    background-color: $bg_main;
    border-radius: 10px;
    min-height: 500px;
    max-height: 80vh;
    overflow-y: scroll;
    padding: 50px 0;
    .toggle{
        text-align: center;
        width:20px;
        cursor: pointer;
        .fa-solid.fa-bell{ color:white; }
    }
    form{
      fieldset{
        width: 90%;
        margin:auto;
        padding: 15px 0;
        border-bottom:1px solid rgba(255,255,255,0.1);
        display: flex;
        align-items: center;
        gap:10px;
        input{ 
          flex: 1;
          background-color: rgba(255,255,255,0.1);
          border:0px;
          border-radius: 5px;
          color:white;
          padding: 15px;
        }
        .remove{
          cursor: pointer;
          background: none;
          border:0;
          font-size:18px;
          i{color: $red;}
        }
      }
      .btn-container{
        width: 90%;
        margin: auto;
        padding: 15px 0;
        justify-content: right;
        display: flex;
        gap:10px;
        .add, .save, .notification{
          cursor: pointer;
          background-color: $contrast;
          border:0px;
          color:white;
          display: inline-block;
          text-transform: uppercase;
          letter-spacing: 5px;
          padding: 10px 30px;
          border-radius: 10px;
        }
        .notification{
            letter-spacing: 2px;
            background-color: $bg_secondary;
        }
        .save{
          background-color: $green;
        }
      }
    }
  }
  .hover{
    position: absolute;
    width:100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
    left:0;
    z-index: 1;
    top:0;
  }
}

</style>
