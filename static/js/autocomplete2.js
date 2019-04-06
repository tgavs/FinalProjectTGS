const template = `
<div>
  <vue-bootstrap-typeahead
    v-model="query"
    :data="countries"
    placeholder="Enter a country"
  />
  <p class="lead">
    Selected Country: <strong>{{query}}</strong>
  </p>
</div>
`

new Vue({
    el: "#example-form-input",
    components: {
        VueBootstrapTypeahead
    },
    data() {
        return {
            query: '',
            countries: [
                'Canada',
                'United States',
                'Mexico'
            ]
        }
    }
})