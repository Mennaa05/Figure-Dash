class SeleccionColor extends Phaser.Scene {
    constructor() {
        super("SeleccionColor");
    }

    create() {
        let ancho = this.scale.width;
        let alto = this.scale.height;

        this.add.text(ancho / 2, 80, "PERSONALIZA TU FIGURA", {
            fontSize: "40px",
            fill: "#ffffff",
            fontFamily: "MiFuente"
        }).setOrigin(0.5);

        // Definimos las opciones apuntando a las KEYS de las imágenes cargadas
        const opciones = [
            { nombre: "Cian", skin: "cubo_cian", colorMuestra: 0x00ffff },
            { nombre: "Rosa", skin: "cubo_rosa", colorMuestra: 0xff00ff },
            { nombre: "Lila", skin: "cubo_lila", colorMuestra: 0x9370db },
            { nombre: "Amarillo", skin: "cubo_amarillo", colorMuestra: 0xffff00 }
        ];

        opciones.forEach((opt, index) => {
            let x = (ancho / 2) - 150 + (index * 100);
            
            // La muestra sigue siendo un rectángulo para el menú
            let muestra = this.add.rectangle(x, alto / 2, 70, 70, opt.colorMuestra).setInteractive();
            
            muestra.on("pointerdown", () => {
                // GUARDAMOS EL NOMBRE DE LA IMAGEN
                this.registry.set("skinSeleccionada", opt.skin);
                this.scene.start("Inicio");
            });

            muestra.on("pointerover", () => muestra.setStrokeStyle(4, 0xffffff));
            muestra.on("pointerout", () => muestra.setStrokeStyle(0));
        });

        let btnVolver = this.add.text(ancho / 2, alto - 100, "VOLVER", {
            fontSize: "25px",
            fill: "#ffffff",
            backgroundColor: "#7600fc"
        }).setOrigin(0.5).setInteractive().setPadding(10);

        btnVolver.on("pointerdown", () => this.scene.start("Inicio"));
    }
}