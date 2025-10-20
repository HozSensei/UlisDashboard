<template>
  <section class="container">
    <WindowActionsComponent></WindowActionsComponent>
    <section class="mainApp">
      <PingSummaryComponent :lastUpdate="lastUpdate" :nbrSucces="nbrSucces" :nbrError="nbrError" :testTotal="listApp.length > 0 ? listApp.length : '-'" @filter="changeFilter"></PingSummaryComponent>
      <div class="list-app">
        <h2>
            <div class="flex">
                <span>Applications</span>
                <div class="search"><input type="text" v-model="searchText" placeholder="Recherche..."></div>
            </div>
            <button @click="openGestion = true">Gestion</button>
        </h2>
        <div class="loadingContainer" v-if="loading">
            <LoadingComponent></LoadingComponent>
        </div>
        <template v-else>
            <div class="no-data" v-if="listFiltered.length == 0">
                <h3>Aucune application trouvée</h3>
            </div>
            <ItemAppComponent v-for="item in listFiltered" :item="item" v-else></ItemAppComponent>
        </template>
        
      </div>
    </section>

    <GestionModalComponent v-if="openGestion" @close="openGestion = false" :data="config"></GestionModalComponent>
    
  </section>
</template>


<script lang="ts">

import PingSummaryComponent from './components/PingSummary.vue'
import WindowActionsComponent from './components/WindowActions.vue'
import ItemAppComponent from './components/ItemApp.vue'
import GestionModalComponent from './components/GestionModal.vue'
import LoadingComponent from './components/LoadingComponent.vue';

interface ListApp {
    status: number, 
    url: string, 
    title: string, 
    response: string, 
    notif: boolean 
}

export default {
  components:{ WindowActionsComponent, PingSummaryComponent, ItemAppComponent, GestionModalComponent, LoadingComponent },
  setup() {
  },
  data() {
      return {
        listApp: [] as ListApp[],
        config: null,
        openGestion: false,
        loading: true,
        filterApp: 'all',
        searchText: '',
        lastUpdate: null as null | Date
      };
  },
  methods: {
    async pingApps(){
        try{
            const response = await window.electronAPI.ping()
            this.loading = false
            this.listApp = response.data
            this.lastUpdate = new Date()
            setTimeout(() => {
                this.pingApps()
            }, 60000);
        }
        catch(e){
            console.log(e)
        }   
    },
    changeFilter(type){
        this.filterApp = type;
    }
  },
  computed: {
    nbrSucces(){
        if(this.listApp.length > 0){
            return this.listApp.filter(e => e.status == 200) ? this.listApp.filter(e => e.status == 200).length : 0
        }else{
            return '-'
        }
    },
    nbrError(){
        if(this.listApp.length > 0){
            return this.listApp.filter(e => e.status != 200) ? this.listApp.filter(e => e.status != 200).length : 0
        }else{
            return '-'
        }
    },
    listFiltered(){
        let orderList = this.listApp.sort((a, b) => a.title.localeCompare(b.title));
        let toReturn = orderList
        if(this.filterApp == 'all'){
            toReturn = orderList
        }else if(this.filterApp == 'error'){
            toReturn = orderList.filter(e => e.status != 200)
        }else if(this.filterApp == 'success'){
            toReturn = orderList.filter(e => e.status == 200)
        }else{
            toReturn = orderList
        }
        if(this.searchText != ''){
            toReturn = toReturn.filter(e => e.title.toLowerCase().includes(this.searchText.toLowerCase()))
        }
        return toReturn
    }
  },
  watch: {},
  async mounted() {
        const load = await window.electronAPI.load()
        this.config = load;
        await this.pingApps();
  }
}
</script>

<style lang="scss" scoped>

@import './scss/variables';

.container{
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.loadingContainer{
    height: 300px;
}
.mainApp{
  position: relative;
  z-index: 1;
  top:30px;
  height: calc(100% - 30px);
  overflow-y: scroll;
}

.no-data{
    h3{
        font-size: 18px;
        padding: 20px 0;
    }
}

.list-app{
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
    justify-content: space-between;
    .flex{
        display: flex;
        align-items: center;
        gap: 20px;
    }
    button{
      cursor: pointer;
      background:none;
      border:0;
      background-color: $contrast;
      padding: 10px 20px;
      text-transform: uppercase;
      color:white;
      letter-spacing: 3px;
      border-radius: 10px;
    }
    .search{
        input{
            border:0;
            background-color: $bg_secondary;
            border-radius: 5px;
            padding: 10px 15px;
            font-size: 15px;
            color:white;
            &:focus{
                outline: none;
            }
            &::placeholder{
                color:rgba(255,255,255,0.5);
            }
        }
    }
  }
  
}

</style>
