/**
 * test
 */

!function( window, $, undefined ) {

	//init
	$.ready( "dom", init );

	function init() {
		var contenedor = $.getId( "content-ejemplo" );

		new TrimImage( "img/imagenEjemplo.png", function( _self ) {
			var imagen = _self.image; //this tambien sirve

			contenedor.appendChild( addAttrs( TrimImage.trim( imagen ),       "ALL",    "TrimImage.trim()" ) );
			contenedor.appendChild( addAttrs( TrimImage.trimLeft( imagen ),   "LEFT",   "TrimImage.trimLeft()" ) );
			contenedor.appendChild( addAttrs( TrimImage.trimRight( imagen ),  "RIGHT",  "TrimImage.trimRight()" ) );
			contenedor.appendChild( addAttrs( TrimImage.trimTop( imagen ),    "TOP",    "TrimImage.trimTop()" ) );
			contenedor.appendChild( addAttrs( TrimImage.trimBottom( imagen ), "BOTTOM", "TrimImage.trimBottom()" ) );
		});
	}

	function addAttrs( image, title, text ) {
		image.className = "img-class";
		
		var frameImage = document.createElement( "div" );
		frameImage.className = "img-frame";

		var boxImage = document.createElement( "div" );
		boxImage.className = "img-box";

		var boxDescription = document.createElement( "div" );
		boxDescription.className = "description-box";

		boxImage.appendChild( image );
		frameImage.appendChild( boxImage );
		boxDescription.innerHTML += "<h3>" + title + "</h3>" + text;
		frameImage.appendChild( boxDescription );

		return frameImage;
	}
}( window, Utils.DOMUtils );