class Inicio extends Phaser.Scene {
    constructor() {
        super("Inicio");
    }

    create() {
        let ancho = this.scale.width;
        let alto = this.scale.height;

        // Fondo con imagen
        let fondo = this.add.image(ancho / 2, alto / 2, "fondo_inicio");
        fondo.setDisplaySize(ancho, alto);

        // Título con animación
        let titulo = this.add.text(ancho / 2, alto / 2.3 - 100, "Figure Dash", {
            fontSize: "70px",
            fill: "#860ccc",
            fontFamily: "MiFuente",
        }).setOrigin(0.5);

        this.tweens.add({
            targets: titulo,
            scale: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // ===== BOTÓN JUGAR =====
        let botonJugar = this.add.text(ancho / 2, alto / 2, "▶ JUGAR", {
            fontSize: "45px",
            fill: "#ffffff",
            fontFamily: "MiFuente",
            backgroundColor: "#7600fcd2",
            padding: { x: 40, y: 20 }
        }).setOrigin(0.5).setInteractive();

        // ===== BOTÓN SKINS (NUEVO) =====
        let botonSkins = this.add.text(ancho / 2, alto / 2 + 100, "🎨 SKINS", {
            fontSize: "30px",
            fill: "#ffffff",
            fontFamily: "MiFuente",
            backgroundColor: "#4a0099d2",
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5).setInteractive();

        // Efectos de Hover para ambos
        [botonJugar, botonSkins].forEach(btn => {
            btn.on("pointerover", () => btn.setScale(1.1));
            btn.on("pointerout", () => btn.setScale(1));
        });

        // Música
        if (!this.musica) {
            this.musica = this.sound.add('musica', { loop: true });
            this.musica.play();
        }

        // Lógica de navegación
        botonJugar.on("pointerdown", () => {
            this.scene.start("Juego");
        });

        botonSkins.on("pointerdown", () => {
            // No detenemos la música aquí si quieres que siga sonando en el menú de skins
            this.scene.start("SeleccionColor");
        });

        // Detener música solo si sales del ecosistema de menús (opcional)
        this.events.on('shutdown', () => {
            // Si vas al Juego, quizás quieras detenerla, pero si vas a Skins, no.
            // Por ahora lo dejamos así para que el usuario decida.
        });
    }
}