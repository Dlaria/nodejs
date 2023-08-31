<template>
  <div class="hello">
    <div class="forms">
      <!-- Formulaire d'ajout de restaurant -->
      <form v-on:submit.prevent="submit_rest()">
        <h1>Ajout de restaurant</h1>
        <div class="rest_name">
          <label for="name">Nom du restaurant </label>
          <!--  pattern="([A-Za-z éèç]{3,20})" === /([A-Za-z éèç]{3,20})/v dans vue -->
          <input type="text" name="name" id="rest_name" minlength="3" maxlength="20" v-model="form_rest.name" required>
        </div>
        <div class="city">
          <label for="city">La ville </label>
          <input type="text" name="city" id="city" minlength="3" maxlength="20" v-model="form_rest.city" required>
        </div>
        <div class="nbcouverts">
          <label for="nbcouverts">Nombre de couvert </label>
          <input type="number" name="nbcouverts" id="nbcouverts" v-model="form_rest.nbcouverts" minlength="2" required>
        </div>
        <div class="terrasse">
          <label for="terrasse">Terrasse </label>
          <select name="terrasse" id="terrasse" v-model="form_rest.terrasse" required>
            <option value="oui">oui</option>
            <option value="non">non</option>
          </select>
        </div>
        <div class="parking">
          <label for="parking">Parking </label>
          <select name="parking" id="parking" v-model="form_rest.parking" required>
            <option value="oui">oui</option>
            <option value="non">non</option>
          </select>
        </div>
        <div class="buttonSubmit">
          <input id="submit_rest" type="submit" value="Ajouter">
        </div>
      </form>

      <!-- Formulaire d'ajout d'employer -->
      <form v-on:submit.prevent="submit_emp()">
        <h1>Ajout d'un employer</h1>
        <div class="emp_firstname">
          <label for="firstname">Prénom </label>
          <input type="text" name="firstname" id="firstname" minlength="3" maxlength="20" v-model="form_emp.firstname" required>
        </div>
        <div class="emp_lastname">
          <label for="lastname">Nom </label>
          <input type="text" name="lastname" id="lastname" minlength="3" maxlength="20" v-model="form_emp.lastname" required>
        </div>
        <div class="hire_date">
          <label for="hire_date">Date d'embauche </label>
          <input type="date" name="hire_date" id="hire_date" v-model="form_emp.hire_date" required>
        </div>
        <div class="rest_id">
          <label for="rest_id">Restaurant assigné </label>
          <select name="rest_id" id="rest_id" v-model="form_emp.rest_id" required>
            <option v-for="rest in rests" :key="rest.id" :value="rest.id">{{ rest.name }}</option>
          </select>
        </div>
        <div class="buttonSubmit">
          <input id="submit_emp" type="submit" value="Ajouter">
        </div>
      </form>
    </div>

    <!-- Tableau d'affichage des restaurants et des employés -->
    <div>
      <h1 style="text-align:center;">Restaurants</h1>
      <table v-for="rest in rests" :key="rest.id">
        <tr>

          <!-- Restaurants -->
            <td>{{rest.name}}</td>
            <td>
              {{rest.city}} - {{rest.nbcouverts}} - {{rest.terrasse}} - {{rest.parking}}
              <a v-on:click="mydelete(rest.id)" style="color:red;font-size:25px;">X</a>
            </td>
        </tr>
        <tr>

          <!-- Employers -->
            <td style="width:100px;">Equipe</td>
            <td>
                <div v-for="emp in employes" :key="emp.restaurants_id">
                  <p v-if="rest.id == emp.restaurants_id">
                    {{ emp.firstname }} {{ emp.lastname }}
                    <a v-on:click="mydelete(rest.id, emp.id)" style="color:red;font-size:25px;">X</a>
                  </p>
                </div>
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
          // Fonction de vérification des chaînes de caractère des formulaires
          verif (obj) {
            let result = [],
            regex = /([A-Za-z- éèç]{3,20})/;

          for (let i in obj) {

            if (i !== 'nbcouverts' && i !== 'hire_date' && i !== 'rest_id'){

              result.push(`${obj[i]}`)
            }
          }
          // console.log(result);
          let m;
          for(let j=0;j<result.length;j++){

            m = regex.exec(result[j]);

            if (m !== null && result[j] === m[0]){

              m.forEach((match, groupIndex) => {
                console.log(`Found match, group ${groupIndex}: ${match}`);
              })
            }else{
              return false;
            }
          }
          },
          valid_data (obj) {
            let data = '';
            for (let i in obj) {

              // console.log(obj[i]);
              data = obj[i].toString();
              data = data.trim();
              let map = {
                '&' : '&amp;',
                '<' : '&lt;',
                '>' : '&gt;',
                '"' : '&quot;',
                "'" : '&#039;',
              };
              data = data.replace(/[&<>"']/g, function (m) { return map[m]; });
              obj[i] = data;
              // console.log(obj[i]);
            }
            return obj;
          },
          submit_rest () {
            if (this.verif(this.form_rest) !== false){
              this.valid_data(this.form_rest);
              axios.post('http://127.0.0.1:5000/restaurant', this.form_rest)
                    .then((res) => {
                      console.log(res);
                    })
                    .catch((error) => {
                      console.log(error);
                    })
              }
          },
          submit_emp () {
            if (this.verif(this.form_emp) !== false){

              axios.post('http://127.0.0.1:5000/restaurant/'+ this.form_emp.rest_id + '/employes', this.form_emp)
                    .then((res) => {
                      console.log(res);
                    })
                    .catch((error) => {
                      console.log(error);
                    })
            }
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
                  for (let i=0;i<this.rests.length;i++)
                  {
                        var restId = this.rests[i].id;
                        axios
                        .get("http://127.0.0.1:5000/restaurant/"+restId+"/employes")
                        .then(resp => {
                          for (let j=0;j<resp.data.length;j++){
                            this.employes.push(resp.data[j]);
                          }
                            // console.log(this.employes);  
                        })
                        
                    }
                })
                .catch(error => {
                    console.log(error);
                });   
        },
}
</script>