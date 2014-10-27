//(function () {

/* models */
	//modelo paises
	var CountriesModel = Backbone.Model.extend();

	//modelo weather
	var WeatherModel = Backbone.Model.extend({
		initialize: function(option){
			this.capital = option.capital;
			this.alpha2Code = option.alpha2Code;
			this.fetch();
		},
		url: function(){
			return 'http://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(this.capital) + ','+ encodeURIComponent(this.alpha2Code);
		}

	});

/* collections */
	//Collecion paises
	var CountriesCollection = Backbone.Collection.extend({
		model: CountriesModel,
		initialize: function(option){
			this.region = option.region;
			this.fetch();
		},
		url: function() {
			return 'http://restcountries.eu/rest/v1/region/' + encodeURIComponent(this.region);
		},
		customSearch: function(filters){
			return this.filter(function(model) {
				var add = false;
				return _.any(model.values(), function(value) {
					if(!_.isObject(value)){
				        if (_.isNumber(value)){
				            value = value.toString();
				        }
				        if (_.isString(value)){
				            valuel = value.toLowerCase();
			            	if ((value.search(filters) !=-1 || valuel.search(filters) !=-1) && !add){
			            		add = true;
			            		return ~value.indexOf(filters)!== -1;
			            	}
				        }
			        }
				});
			});
  		}
	});

/* views */
	//Region list render view
	var RegionView = Backbone.View.extend({
		el:'#region',
		events:{
			'change': 'changeValue',
		},
		changeValue: function(){
			var region = $(this.el).val();
			if (region){
				var countriescollection = new CountriesCollection({region:region});
				var countrieslistview = new CountriesListView({collection:countriescollection});
			}
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
			'keyup': 'searchValue',
			'click .btn-order': 'order',
		},
		render: function (){
			$('section').html('');
		},
		renderList: function(){
			this.render();
			_.each(this.results, function(item){
			 	var countryview = new CountryView({model:item});
			});
		},
		renderCountries: function( item ){
			var countryview = new CountryView({model:item});
		},
		searchValue: function(e){
			e.preventDefault();
			var letters = $(this.el).val();
			if (letters.length > 1){
				this.results = this.collection.customSearch(letters);
			}else{
				this.results = this.collection.toArray();
			}
			this.renderList();
		},
		order: function(e){
			console.log(e);

		}
	});

	var CountryView = Backbone.View.extend({
		el:'section',
		template: _.template($('#countrydata').html()),
		initialize: function(){
			this.render();
		},
		render: function(){
			//console.log(this.model.toJSON());
			//console.log(this.weather);
			this.$el.append( this.template( this.model.toJSON() ));
		}
	});


/* asignación de objectos*/
	//region
	var regionlistview = new RegionView();

	//test variable
	//var countriecollection = new CountriesCollection({region:'americas'});

//}());