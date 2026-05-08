class Carga extends Phaser.Scene {
    constructor() {
        super("Carga");
    }

    preload() {
        let ancho = this.scale.width;
        let alto = this.scale.height;

        // ===== AJUSTE DE POSICIÓN EXTREMO =====
        // Con 350px los elementos quedan pegados al borde inferior
        let offsetAbajo = 350;

        if (this.textures.exists("logo")) {
            let logo = this.add.image(ancho / 2, alto / 2, "logo");
            logo.setDisplaySize(ancho, alto);
        }

        // Texto de estado
        let texto = this.add.text(ancho / 2, (alto / 2.1 - 60) + offsetAbajo, "Cargando...", {
            fontSize: "70px",
            fill: "#b33afa",
            fontFamily: "Arial" 
        }).setOrigin(0.5);

        // Barra de fondo
        let barraFondo = this.add.rectangle(ancho / 2, (alto / 2) + offsetAbajo, 300, 30, 0xffffff, 0.3);

        // Barra de progreso
        let barra = this.add.rectangle(ancho / 2 - 150, (alto / 2) + offsetAbajo, 0, 30, 0x800080).setOrigin(0, 0.5);

        // Animación de parpadeo para la barra
        this.tweens.add({
            targets: barra,
            alpha: { from: 1, to: 0.6 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Evento que actualiza el progreso
        this.load.on("progress", (value) => {
            barra.width = 300 * value;
        });

        // --- CARGA DE ASSETS ---
        this.load.image("fondo", "fondo.png");
        this.load.image("cubo", "cubo.png");
        this.load.image("cubo_cian", "cubo_cian.png");
        this.load.image("cubo_rosa", "cubo_rosa.png");
        this.load.image("cubo_lila", "cubo_lila.png");
        this.load.image("cubo_amarillo", "cubo_amarillo.png");
        this.load.image("spike", "spike.png");
        this.load.image("bloque", "bloque.jpg");
        this.load.image("suelo", "suelo.jpeg");
        this.load.image("fondo_inicio", "fondo.png");
        this.load.audio("musica", "audio.mp3");
    
        for (let i = 0; i < 40; i++) {
            this.load.image("fake" + i, "cubo.png");
        }
    }

    create() {
        this.time.delayedCall(1000, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start("Inicio");
            });
        });
    }
}