class Juego extends Phaser.Scene {
    constructor() {
        super("Juego");
    }

    init(data) {
        this.intentos = data.intentos || 1;
    }

    create() {
        let ancho = this.scale.width;
        let alto = this.scale.height;

        // ===== 1. VARIABLES DE CONTROL =====
        this.velocidad = 450;
        this.proximoObstaculo = 0;
        this.gravedadBase = 1600;
        this.esMini = false;
        this.gravedadInvertida = false;

        // ===== 2. FONDO =====
        this.fondo = this.add.tileSprite(0, 0, ancho, alto, "fondo").setOrigin(0, 0);

        // ===== 3. AUDIO =====
        if (this.cache.audio.exists("musica")) {
            let musicaExistente = this.sound.get("musica");
            if (!musicaExistente) {
                this.musica = this.sound.add("musica", { loop: true, volume: 0.5 });
                this.musica.play();
            } else if (!musicaExistente.isPlaying) {
                musicaExistente.play();
            }
        }

        // ===== 4. SUELO Y TECHO =====
        this.suelo = this.physics.add.staticGroup();
        this.suelo.create(ancho / 2, alto - 20, "suelo").setDisplaySize(ancho, 40).refreshBody();
        this.techo = this.suelo.create(ancho / 2, 20, "suelo").setDisplaySize(ancho, 40).refreshBody();

        // ===== 5. GRUPOS =====
        this.obstaculos = this.physics.add.group({ allowGravity: false });
        this.plataformas = this.physics.add.group({ allowGravity: false });

        // ===== 6. JUGADOR =====
        let skinParaUsar = this.registry.get("skinSeleccionada") || "cubo";
        this.jugador = this.physics.add.sprite(150, alto - 100, skinParaUsar);
        
        this.actualizarTamanoJugador();
        this.jugador.setGravityY(this.gravedadBase);
        this.jugador.setCollideWorldBounds(true);

        // ===== 7. COLISIONES =====
        this.physics.add.collider(this.jugador, this.suelo);
        
        // Colisión con plataformas (permite saltar desde ellas)
        this.physics.add.collider(this.jugador, this.plataformas, (jugador, plataforma) => {
            // Si el jugador choca por los lados con la plataforma, muere
            if (jugador.body.touching.right || jugador.body.blocked.right) {
                this.morir();
            }
        });

        this.physics.add.collider(this.jugador, this.obstaculos, (jugador, obj) => {
            this.morir();
        }, null, this);

        // ===== 8. CONTROLES =====
        this.input.keyboard.on("keydown-SPACE", this.saltar, this);
        this.input.on("pointerdown", this.saltar, this);
        
        this.add.text(20, 40, "INTENTO: " + this.intentos, { 
            fontSize: "24px", fill: "#000000", fontFamily: "Arial", fontWeight: "bold" 
        });
    }

    update(time, delta) {
        if (this.fondo) {
            this.fondo.tilePositionX += this.velocidad * (delta / 1000);
        }

        if (time > this.proximoObstaculo) {
            this.generarMundo();
            // Intervalo más corto para que el mapa esté más lleno de cosas
            this.proximoObstaculo = time + Phaser.Math.Between(600, 1200);
        }

        this.obstaculos.children.each(obj => { if (obj.x < -100) obj.destroy(); });
        this.plataformas.children.each(obj => { if (obj.x < -100) obj.destroy(); });

        // Rotación dinámica
        if (!this.jugador.body.blocked.down && !this.jugador.body.blocked.up && 
            !this.jugador.body.touching.down && !this.jugador.body.touching.up) {
            this.jugador.angle += this.gravedadInvertida ? -5 : 5;
        } else {
            this.jugador.setAngle(0);
        }
    }

    generarMundo() {
        let ancho = this.scale.width;
        let alto = this.scale.height;
        let random = Phaser.Math.Between(0, 100);

        if (random < 30) {
            // --- OBSTÁCULO DE SUELO ---
            this.crearSpike(ancho + 50, this.gravedadInvertida ? 60 : alto - 60);
        } 
        else if (random < 80) {
            // --- FORMACIÓN DE PLATAFORMAS (ZIG-ZAG) ---
            // Creamos un pequeño "camino" aéreo
            let baseYa = this.gravedadInvertida ? 150 : alto - 150;
            let numPlat = Phaser.Math.Between(1, 3);
            
            for (let i = 0; i < numPlat; i++) {
                let xPos = ancho + 50 + (i * 180);
                let yPos = baseYa - (i * 60 * (this.gravedadInvertida ? -1 : 1));
                
                let p = this.plataformas.create(xPos, yPos, "bloque");
                p.setDisplaySize(120, 30);
                p.setVelocityX(-this.velocidad);
                p.setImmovable(true);

                // A veces ponemos un pincho sobre la plataforma para obligar a saltar de nuevo
                if (Phaser.Math.Between(0, 1) > 0.5) {
                    this.crearSpike(xPos, yPos - (35 * (this.gravedadInvertida ? -1 : 1)), true);
                }
            }
        }
        else {
            // --- CAMBIO DE ESTADO (MECÁNICA) ---
            this.aplicarModificadorAleatorio();
            // Visualmente avisamos con un bloque brillante
            let aviso = this.plataformas.create(ancho + 50, alto / 2, "bloque");
            aviso.setTint(0x00ffff);
            aviso.setVelocityX(-this.velocidad);
        }
    }

    crearSpike(x, y, sobrePlataforma = false) {
        let spike = this.obstaculos.create(x, y, "spike");
        let escala = this.esMini ? 20 : 40;
        spike.setDisplaySize(escala, escala);
        spike.setVelocityX(-this.velocidad);
        if (this.gravedadInvertida) spike.setFlipY(true);
    }

    aplicarModificadorAleatorio() {
        let r = Phaser.Math.Between(0, 1);
        if (r === 0) {
            this.esMini = !this.esMini;
            this.actualizarTamanoJugador();
        } else {
            this.gravedadInvertida = !this.gravedadInvertida;
            this.jugador.setGravityY(this.gravedadInvertida ? -this.gravedadBase : this.gravedadBase);
        }
    }

    actualizarTamanoJugador() {
        let size = this.esMini ? 20 : 40;
        this.jugador.setDisplaySize(size, size);
        this.jugador.body.setSize(size, size);
    }

    saltar() {
        // Puede saltar desde el suelo, el techo o desde encima de una plataforma
        let tocandoSuperficie = this.jugador.body.blocked.down || this.jugador.body.touching.down ||
                               this.jugador.body.blocked.up || this.jugador.body.touching.up;

        if (tocandoSuperficie) {
            let fuerza = this.gravedadInvertida ? 550 : -550;
            this.jugador.setVelocityY(fuerza);
        }
    }

    morir() {
        this.scene.restart({ intentos: this.intentos + 1 });
    }
}