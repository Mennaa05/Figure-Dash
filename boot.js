class Boot extends Phaser.Scene {

    constructor(){
        super("Boot");
    }

    preload(){
        // Solo cargamos el logo
        this.load.image("logo", "logo.png");


        //Solo lo utilizamos si queremos otro tipo de fuente en nuestros textos, sino es necesario puedes eliminar esta parte
        let textoPrueba = this.add.text(0, 0, '.', {
        fontFamily: 'MiFuente',
        fontSize: '1px'
        });
        textoPrueba.setVisible(false); 
        //Utilizado para forzar la carga de la fuente al menos una vez, para que el navegador la reconozca

    }

    create(){
        this.scene.start("Carga");
    }
}