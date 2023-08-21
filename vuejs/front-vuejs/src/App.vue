<template>
  <div class="hello">

    <!-- Formulaire d'ajout de restaurant -->
    <h1>Ajout de restaurant</h1>
    <form method="post">
      <div class="rest_name">
        <label for="rest_name">Nom du restaurant </label>
        <input type="text" name="rest_name" id="rest_name">
      </div>
      <div class="city">
        <label for="city">La ville </label>
        <input type="text" name="city" id="city">
      </div>
      <div class="nbcouverts">
        <label for="nbcouvert">Nombre de couvert </label>
        <input type="number" name="nbcouverts" id="nbcouverts">
      </div>
      <div class="terrasse">
        <label for="terrasse">Terrasse </label>
        <select name="terrasse" id="terrasse">
          <option value="oui">oui</option>
          <option value="non">non</option>
        </select>
      </div>
      <div class="parking">
        <label for="parking">Parking </label>
        <select name="parking" id="parking">
          <option value="oui">oui</option>
          <option value="non">non</option>
        </select>
      </div>
      <div class="buttonSubmit">
        <button id="submit_rest" type="submit">Ajouter</button>
      </div>
    </form>

    <!-- Formulaire d'ajout d'employer -->
    <h1>Ajout d'un employer</h1>
    <form method="post">
      <select name="" id="">
        <customSelect v-for="rest in rests" :key="rest.id" v-model="rest.name" />
      </select>
    </form>

    <!-- Tableau d'affichage des restaurants et des employés -->
    <h1>Restaurants</h1>
    <div>
      <table v-for="rest in rests" :key="rest.id">
        <tr>

          <!-- Restaurants -->
            <td>{{rest.name}}</td>
            <td>{{rest.city}} - {{rest.nbcouverts}} - {{rest.terrasse}} - {{rest.parking}} </td>
            <td><a v-on:click="mydelete(rest.id)" style="color:red;font-size:25px;">X</a></td>
        </tr>
        <tr>

          <!-- Employers -->
            <td style="width:100px;">Equipe</td>
            <td v-for="emp in employes" :key="emp.restaurants_id">
                <p v-if="rest.id == emp.restaurants_id">{{ emp.firstname }} {{ emp.lastname }}
                <a v-on:click="mydelete(rest.id, emp.id)" style="color:red;font-size:25px;">X</a></p>
            </td>
        </tr>
    </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import customSelect from './components/CustomSelect.vue'
//eslint-disable-next-line
import { ref } from 'vue'

export default {
  name: 'MyAcceuil',
  components: { customSelect },
  data() {return{
            rests: [],
            employes: []
        }},

        mounted() {
          axios.get("http://127.0.0.1:5000/restaurant")
                .then(res => {
                  this.rests = res.data;
                  this.employes = [];
                  for (let i=0;i<this.rests.length;i++)
                  {
                        var restId = this.rests[i].id;
                        axios
                        .get("http://127.0.0.1:5000/restaurant/"+restId+"/employes")
                        .then(resp => {
                            this.employes.push(resp.data);
                        })
                        
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
}
</script>

<style>

</style>
