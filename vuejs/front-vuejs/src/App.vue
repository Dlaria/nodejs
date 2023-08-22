<template>
  <div class="hello">

    <!-- Formulaire d'ajout de restaurant -->
    <h1>Ajout de restaurant</h1>
    <form v-on:submit.prevent="submit_rest()">
      <div class="rest_name">
        <label for="name">Nom du restaurant </label>
        <input type="text" name="name" id="rest_name" v-model="form_rest.name">
      </div>
      <div class="city">
        <label for="city">La ville </label>
        <input type="text" name="city" id="city" v-model="form_rest.city">
      </div>
      <div class="nbcouverts">
        <label for="nbcouverts">Nombre de couvert </label>
        <input type="number" name="nbcouverts" id="nbcouverts" v-model="form_rest.nbcouverts">
      </div>
      <div class="terrasse">
        <label for="terrasse">Terrasse </label>
        <select name="terrasse" id="terrasse" v-model="form_rest.terrasse">
          <option value="oui">oui</option>
          <option value="non">non</option>
        </select>
      </div>
      <div class="parking">
        <label for="parking">Parking </label>
        <select name="parking" id="parking" v-model="form_rest.parking">
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
    <form v-on:submit.prevent="submit_emp()">
      <div class="emp_firstname">
        <label for="firstname">Prénom </label>
        <input type="text" name="firstname" id="firstname" v-model="form_emp.firstname">
      </div>
      <div class="emp_lastname">
        <label for="lastname">Nom </label>
        <input type="text" name="lastname" id="lastname" v-model="form_emp.lastname">
      </div>
      <div class="hire_date">
        <label for="hire_date">Date d'embauche </label>
        <input type="date" name="hire_date" id="hire_date" v-model="form_emp.hire_date">
      </div>
      <label for="rest_id">Restaurant assigné </label>
      <select name="rest_id" id="rest_id" v-model="form_emp.rest_id">
        <option v-for="rest in rests" :key="rest.id" :value="rest.id">{{ rest.name }}</option>
      </select>
      <div class="buttonSubmit">
        <button id="submit_rest" type="submit">Ajouter</button>
      </div>
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

export default {
  name: 'MyAcceuil',
  data() {return{
            rests: [],
            employes: [],
            form_rest: {
              name: '',
              city: '',
              nbcouverts: '',
              terrasse: '',
              parking: ''
            },
            form_emp:{
              firstname: '',
              lastname: '',
              hire_date: '',
              rest_id: ''
            }
        }},
        methods: {
          submit_rest () {
            axios.post('http://127.0.0.1:5000/restaurant', this.form_rest)
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((error) => {
                    console.log(error);
                  })
          },
          submit_emp () {
            axios.post('http://127.0.0.1:5000/restaurant/'+ this.form_emp.rest_id + '/employes', this.form_emp)
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((error) => {
                    console.log(error);
                  })
          },
          mydelete(restId, empId = null) {
            if (empId === null) {
                axios({
                    method: 'DELETE',
                    url: "http://127.0.0.1:5000/restaurant/" + restId
                    }).then((response) => {
                        alert("Le restaurant à l'id " + restId + " a bien été supprimé");
                        console.log(response);
                    }).catch(error => {
                    console.log(error);
                });
            } else {
                axios({
                    method: 'DELETE',
                    url: "http://127.0.0.1:5000/restaurant/" + restId + "/employes/" + empId
                    }).then((response) => {
                        alert("L'employé du restaurant " + restId + " et à l'id " + empId + " a bien été supprimé");
                        console.log(response);
                    }).catch(error => {
                    console.log(error);
                });
            }
          }
        },
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
