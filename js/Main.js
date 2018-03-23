!(function(window, undefined) {
    const contenedor = document.getElementById('content-ejemplo');

    new TrimImage('img/imagenEjemplo.png', function() {
        var imagen = this.image;

        contenedor.appendChild(
            addAttrs(TrimImage.trim(imagen), 'ALL', 'TrimImage.trim()')
        );
        contenedor.appendChild(
            addAttrs(TrimImage.trimLeft(imagen), 'LEFT', 'TrimImage.trimLeft()')
        );
        contenedor.appendChild(
            addAttrs(
                TrimImage.trimRight(imagen),
                'RIGHT',
                'TrimImage.trimRight()'
            )
        );
        contenedor.appendChild(
            addAttrs(TrimImage.trimTop(imagen), 'TOP', 'TrimImage.trimTop()')
        );
        contenedor.appendChild(
            addAttrs(
                TrimImage.trimBottom(imagen),
                'BOTTOM',
                'TrimImage.trimBottom()'
            )
        );
    });

    function addAttrs(image, title, text) {
        image.className = 'img-class';

        var frameImage = document.createElement('div');
        frameImage.className = 'img-frame';

        var boxImage = document.createElement('div');
        boxImage.className = 'img-box';

        var boxDescription = document.createElement('div');
        boxDescription.className = 'description-box';

        boxImage.appendChild(image);
        frameImage.appendChild(boxImage);

        boxDescription.innerHTML += '<h3>' + title + '</h3>' + text;
        
        frameImage.appendChild(boxDescription);

        return frameImage;
    }
})(window);
