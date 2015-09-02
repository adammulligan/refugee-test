var TableView;

(function() {

var commaify = function(number) {
  if (isNaN(number) || number == null) return '';

  var tsep = ',',
    parts = number.toFixed().split('.'),
    fnums = parts[0],
    decimals = parts[1] ? '.' + parts[1] : '';

  return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
};


TableView = Backbone.View.extend({
  template: Handlebars.compile($('#table-template').html()),

  initialize: function(options) {
    this.options = options;

    this.data = options.data.slice(0, 10);
    this.data = _.map(this.data, function(val, key) {
      var a_country = _.findWhere(options.countries, {iso: val.a_name});
      var b_country = _.findWhere(options.countries, {iso: val.b_name});

      return {
        name: b_country.country + " ➢ " + a_country.country,
        value: commaify(+val.count)
      };
    });
  },

  render: function() {
    this.$el.html(this.template({
      title: this.options.title,
      data: this.data
    }));

    return this;
  }
});

d3.json("countries.json", function(countries) {
d3.json("refugees_30.json", function(data) {

new Chord(countries, data);

var topMigrantView = new TableView({
  title: "Top migration corridors",
  data: data,
  countries: countries
});

$('.table-container').append(topMigrantView.render().el);

});
});

})();
