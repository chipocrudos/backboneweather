//(function () {

var region = [
		{value:'europe', name: 'Europa'},
		{value: 'americas', name: 'America'},
		{value:'asia', name: 'Asia'},
		{value:'africa', name: 'Africa'},
		{value:'oceania', name: 'Oceania'},
	]


/* models */
	//modelo region
	var RegionModel = Backbone.Model.extend({
		defaults: {
			value:'',
			 name: ''
		},
	});

	//modelo paises
	var CountriesModel = Backbone.Model.extend({
		//url: 'http://restcountries.eu/rest/v1/name/',
	});
/*
	//modelo ciudades
	var CitiesModel = Backbone.Model.extend({
	});
*/


/* collections */
	//Colleccion region
	var RegionCollection = Backbone.Collection.extend({
		model: RegionModel,
	});

	//Collecion paises
	var CountriesCollection = Backbone.Collection.extend({
		model: CountriesModel,
		initialize: function(option){
			//console.log(option.region);
			this.region = option.region;
			this.fetch();
		},
		url: function() {
			return 'http://restcountries.eu/rest/v1/region/' + encodeURIComponent(this.region);
		},
	});

/* views */
	
	//Region list render view
	var RegionListView = Backbone.View.extend({
		el:'#region',
		template: _.template($('#regionOption').html()),
		initialize: function(){
			this.render();
			this.listenTo( this.collection, 'add', this.renderRegion);
		},
		events:{
			'change': 'changeValue',
		},
		render: function() {
			this.collection.each(function( item ){
				this.renderRegion( item );
			}, this);
		},
		renderRegion: function( item ){
			this.$el.append( this.template(item.toJSON()) );
		},
		changeValue: function(){
			var countriescollection = new CountriesCollection({region: $(this.el).val()});
			var countrieslistview = new CountriesListView({collection:countriescollection});
		}
	});

	//Region list render view
	var CountriesListView = Backbone.View.extend({
		el:'#countries',
		template: _.template($('#selectOption').html()),
		initialize: function(){
			this.render();
			this.listenTo( this.collection, 'add', this.renderCountries);
		},
		events:{
			'change': 'changeValue',
		},
		render: function() {
			this.collection.each(function( item ){
				//this.renderCountries( item );
				console.log(item.toJSON());
			}, this);
		},
		renderCountries: function( item ){
			var translations = item.get('translations');

			console.log(item.get('name'));
			console.log(translations);

			console.log(item.get('name') + ' ' + translations.es);
			//this.$el.append( this.template(item.toJSON()) );
		},
		changeValue: function(){
			console.log($(this.el).val());
			//var countriescollection = new CountriesCollection({region: $(this.el).val()});
			//var countrieslistview = new CountriesListView({collection:countrieslistview});
		}
	});




/* asignación de objectos*/
	//region
	var regioncollection = new RegionCollection(region);
	var regionlistview = new RegionListView({collection:regioncollection});

	//countries
	//var countriescollection = new CountriesCollection({region: ''});




//}());