
var dataSymbols=[]

d3.json("/symbols/").then(function(SymbolsData){
    console.log(SymbolsData)

    SymbolsData.forEach()


})





Vue.component('auto-complete', {
    template: `
  	<div class="auto-complete">
   		 <input id="submitBox" :class="{ 'has-error': hasError}" type="text" v-model="input" @keydown.tab.prevent="complete()" @focus="focus(true)" @blur="focus(false)">
   		 <table v-if="focused">
    	    <tbody>
            	<tr v-for="(person, i) in data" v-if="filter(person)" @mousedown="complete(i)">
          	      <td>{{ person[field] }}</td>
        	    </tr>
      	  </tbody>
    	 </table>
		</div>
  `,

    props: {
        value: { type: String, required: false },
        data: { type: Array, required: true },
        field: { type: String, required: true }
    },

    methods: {
        complete(i) {
            if (i == undefined) {
                for (let row of this.data) {
                    if (this.filter(row)) {
                        this.select(row)
                        return
                    }
                }
            }


            this.select(this.data[i])
        },

        select(row) {
            this.input = row[this.field]
            this.selected = true
        },

        filter(row) {
            return row[this.field].toLowerCase().indexOf(this.input.toLowerCase()) != -1
        },

        focus(f) {
            this.focused = f
        }
    },

    data() {
        return {
            input: '',
            focused: false
        }
    },

    created() {
        this.input = this.value || ''
    }
})

new Vue({
    el: "#app",   
    data: {
        people: [],
    },

    created() {
        fetch('./api/symbols')
        .then(data => data.json())
        .then(json => console.log(json))
        .then(json => this.people=json)

       
    }

})