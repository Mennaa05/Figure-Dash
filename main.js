const config = {
    type: Phaser.AUTO,
    width: 1100,
    height: 720,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false //apaga y prende las colisiones
        }
    },
    scene: [Boot, Carga, Inicio, SeleccionColor, Juego]
};

window.onload = function(){ // Funciona como un evento 
    new Phaser.Game(config); //Cuando la pagina termine de cagar completamente inicia el juego, aranca phaser y carga el sistema de escenas
}