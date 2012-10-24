!(function () {
  
 "use strict";
 
  var createMarker = function ( map, point ) {
    return new google.maps.Marker({
      position: point
      ,map: map
    });
  };
  
  var createCircle = function ( map, point, radius) {
    var circle =  new google.maps.Circle({
        center: point,
        radius: radius,
        strokeColor: "#000000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#000000",
        fillOpacity: 0.35,
        map: map
    })
    ,handleMouseEnter = function ( event ) {
      circle.setEditable( true );
    }
    ,handleMouseLeave = function ( event ) {
      circle.setEditable( false );
    }
    google.maps.event.addListener( circle, 'mouseover', handleMouseEnter );
    google.maps.event.addListener( circle, 'mouseout' , handleMouseLeave );
    return circle;
  };
  
  var RadiusPicker = function ( el, options ) {
    if(!(this instanceof RadiusPicker)){
       return new RadiusPicker( el, options );
    };
    var it = $(this)
      , el  = $(el).get(0)
      , lat = options.latitude
      , lon = options.longitude
      , radius = (options.km ?  options.km*1000 : options.miles ? options.miles*1609 : options.radius||0)
      , center = new google.maps.LatLng( lat, lon )
      , value = null;
    var mapOptions = { 
        center: center
        , zoom: 10
        , disableDefaultUI: true
        , zoomControl: true
        , zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
          , position: google.maps.ControlPosition.LEFT_BOTTOM 
        }
        , mapTypeId: google.maps.MapTypeId.ROADMAP
      }, map, circle, marker,onchange;
      map = new google.maps.Map( el , mapOptions );
      marker = createMarker( map, center );
      circle = createCircle( map, center, radius );
      map.fitBounds( circle.getBounds() );
      onchange = function (  ) {
        var pos = circle.getCenter()
          , meters = circle.getRadius()
          , radius = options.km ? meters/1000 : options.miles ? meters/1609 : meters
          , radkey = options.km ? 'km' : options.miles ? 'miles' : 'radius'
          , data = {latitude: pos.lat(), longitude: pos.lng() };
        data[radkey] = radius;
        value = data;
        it.trigger( 'change', data );
        map.fitBounds( circle.getBounds() );
      };
      google.maps.event.addListener( circle, 'center_changed', onchange );
      google.maps.event.addListener( circle, 'radius_changed', onchange ); 
      onchange()
      it.getValue = function () { return value; }
      return it;
  };
  
  $.fn.radiusPicker = function ( opts ) {
    return $(this).each( function () {
        var $picker = $(this);
        $picker.one( 'shown', function () {
          var picker = new RadiusPicker( $picker.find('.radiuspicker-map'), opts );
          $picker.data('value', picker.getValue() );
          $picker.on('shown', function () {
            $picker.data('value', picker.getValue() );
          });
          $picker.on('hidden', function () {
            var before  = $picker.data('value');
            var current = picker.getValue();
            var changed = false;
            for( var k in current ){
              if(before[k] !== current[k]){
                changed = true;
                break;
              };
            };
            if( changed ){
              $picker.data('value', current );
              $picker.trigger('change', current );
            };
          });

        })
        return this;
    });
  };

}).call(this);
