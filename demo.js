$(function () {
    var location =  { latitude: 51.503226,longitude: -0.127051, km: 25 };
    var radiusPicker = $('#radiuspicker').radiusPicker( location );
    radiusPicker.on( 'change', function ( event, data ) {
      $('.modified .lat').text( data.latitude )
      $('.modified .lon').text( data.longitude )
      $('.modified .rad').text( data.km )            
    })
 });