/**
 * Broccoli Buster - Enemy Bot Intelligence System
 */
export class BotManager {
    constructor(scene, world, weaponSystem) {
        this.scene = scene;
        this.world = world;
        this.weaponSystem = weaponSystem;
        this.bots = [];
    }

    spawnBot(x, y, z) {
        const botGroup = new THREE.Group();

        // 3D Egg Body
        const egg = new THREE.Mesh(
            new THREE.SphereGeometry(1.2, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xffa826, roughness: 0.4 })
        );
        egg.castShadow = true;
        botGroup.add(egg);

        botGroup.position.set(x, y, z);
        this.scene.add(botGroup);

        const body = new CANNON.Body({ mass: 50, shape: new CANNON.Sphere(1.2) });
        body.position.set(x, y, z);
        body.linearDamping = 0.8;
        this.world.addBody(body);

        this.bots.push({ mesh: botGroup, body: body, hp: 100, lastShot: 0 });
    }

    update(playerPosition, isPlaying) {
        this.bots.forEach(bot => {
            bot.mesh.position.copy(bot.body.position);

            if (!isPlaying) return;

            const dist = bot.body.position.distanceTo(playerPosition);
            if (dist < 28) {
                // Direction vector toward player
                const dir = new CANNON.Vec3();
                playerPosition.vsub(bot.body.position, dir);
                dir.y = 0;
                dir.normalize();

                // Move toward player
                bot.body.velocity.x = dir.x * 6.5;
                bot.body.velocity.z = dir.z * 6.5;

                // Attack logic
                if (Date.now() - bot.lastShot > 1600) {
                    bot.lastShot = Date.now();
                    const shootOrigin = bot.mesh.position.clone().add(new THREE.Vector3(0, 0.8, 0));
                    const shootDir = new THREE.Vector3(dir.x, 0.1, dir.z).normalize();
                    
                    this.weaponSystem.fire('rifle', false, shootOrigin, shootDir);
                }
            }
        });
    }
}
