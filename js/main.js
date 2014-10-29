//(function () {

/* models */
	//modelo paises
	var CountriesModel = Backbone.Model.extend();

	//modelo weather
	var WeatherModel = Backbone.Model.extend({
		default:{
			weather:[],
			wind:{},
			main:{},
			coord:{},
			sys:{},
			clouds:{},
		},
		initialize: function(option){
			this.capital = option.capital;
			this.alpha2Code = option.alpha2Code;
			this.fetch();
		},
		url: function(){
			return 'http://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(this.capital) + ','+ encodeURIComponent(this.alpha2Code);
		},
		data: function(){
			var info = {}
			info.weather = this.get('weather')[0]
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

	var ResultsCountries = Backbone.Collection.extend({
		model: CountriesModel,
        /**
	    * Sort by supplied attributes.  First param is sorted first, and
	    * last param is final subsort
	    * @param {String} sortAttributes
	    * @example collection.sortBy("last_name","first_name")
	    */
	    sortBy : function(sortAttributes){
	        var attributes = arguments;
                if(attributes.length){
                this.models = this._sortBy(this.models,attributes);
            }   
	    },
	    /**
	     * Recursive sort
	     */
	    _sortBy : function(models,attributes){
	        var attr,
	                that = this;
	        //base case
	        if(attributes.length === 1){
	            attr = attributes[0];
	            return _(models).sortBy(function(model){
	                return model.get(attr);
	            });
	        }
	        else{
	            attr = attributes[0];
	            attributes = _.last(attributes,attributes.length-1);

	            //split up models by sort attribute, 
	            //then call _sortBy with remaining attributes
	            models = _(models).chain().
	                sortBy(function(model){
	                    return model.get(attr);
	                }).
	                groupBy(function(model){
	                    return model.get(attr);
	                }).
	                toArray().
	                value();

	            _(models).each(function(modelSet,index){
	                models[index] = that._sortBy(models[index],attributes);
	            });
	            return _(models).flatten(); 
	        }
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
		},
	});

	//Region list render view
	var CountriesListView = Backbone.View.extend({
		el:'aside',
		template: _.template($('#selectOption').html()),
		initialize: function(){
			this.render();
			this.results = new ResultsCountries();
			this.listenTo( this.collection, 'add', this.renderCountries);
		},
		events:{
			'keyup #countries': 'searchValue',
			'click .btn-order': 'orderResult',
		},
		render: function (){
			$('section').html('');
			this.order = this.$('.btn-order.btn-primary').attr('id');
		},
		renderList: function(){
			$('section').html('');
			this.results.sortBy(this.order);
			this.results.each(function(item){
			 	var countryview = new CountryView({model:item});
			});
		},
		renderCountries: function( item ){
			var weather = new WeatherModel({
				capital: item.get('capital'),
				alpha2Code: item.get('alpha2Code')
			});
			//console.log(weather.toJSON());
			item.set({weather:weather.toJSON()});
			var countryview = new CountryView({model:item});
		},
		searchValue: function(event){
			event.preventDefault();
			var letters = this.$('#countries').val();
			if (letters.length > 1){
				this.results.reset(this.collection.customSearch(letters));
			}else{
				this.results.reset(this.collection.toArray());
			}
			this.renderList();
		},
		orderResult: function(event){
  			this.$('.btn-order').removeClass('btn-primary');
  			$(event.target).addClass('btn-primary');
  			this.order = $(event.target).attr('id');
  			if (!this.results.length) this.results.reset(this.collection.toArray());
  			this.renderList();
  		},
	});

	var CountryView = Backbone.View.extend({
		el:'section',
		template: _.template($('#countrydata').html()),
		initialize: function(){
			this.render();
		},
		render: function(){
			console.log(this.model.toJSON());
			console.log(this.model.get('weather'));
			this.$el.append( this.template( this.model.toJSON() ));
		}
	});


/* asignación de objectos*/
	//region
	var regionlistview = new RegionView();

	//test variable
	var countriecollection = new CountriesCollection({region:'americas'});
	var results = new ResultsCountries();
	results.reset(countriecollection.toArray());

//}());