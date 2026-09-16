/**
 * Broccoli Buster - Weapon & Projectile Engine
 */
import { AudioSystem } from './audio.js';

export class WeaponSystem {
    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.projectiles = [];
    }

    fire(weaponType, isPlayer, origin, direction) {
        AudioSystem.playShootSound(weaponType === 'rpg');

        if (weaponType === 'rifle') {
            this.spawnRifleBullet(isPlayer, origin, direction);
        } else if (weaponType === 'rpg') {
            this.spawnBroccoliRpg(isPlayer, origin, direction);
        }
    }

    spawnRifleBullet(isPlayer, origin, direction) {
        const bullet = new THREE.Mesh(
            new THREE.SphereGeometry(0.15, 8, 8),
            new THREE.MeshBasicMaterial({ color: isPlayer ? 0x51cf66 : 0xff4444 })
        );
        bullet.position.copy(origin);
        this.scene.add(bullet);

        const body = new CANNON.Body({ mass: 0.1, shape: new CANNON.Sphere(0.15) });
        body.position.copy(bullet.position);
        body.velocity.copy(direction.multiplyScalar(80));
        this.world.addBody(body);

        this.projectiles.push({ mesh: bullet, body: body, isPlayer, type: 'bullet', ttl: 90 });
    }

    spawnBroccoliRpg(isPlayer, origin, direction) {
        const broccoli = new THREE.Group();
        
        // Stem
        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.12, 0.5),
            new THREE.MeshStandardMaterial({ color: 0x8ce99a })
        );
        stem.position.y = -0.2;
        broccoli.add(stem);

        // Floret Head
        const head = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.35),
            new THREE.MeshStandardMaterial({ color: 0x2f9e44, roughness: 0.8 })
        );
        head.position.y = 0.15;
        broccoli.add(head);

        broccoli.position.copy(origin);
        this.scene.add(broccoli);

        const body = new CANNON.Body({ mass: 1.0, shape: new CANNON.Sphere(0.35) });
        body.position.copy(broccoli.position);
        body.velocity.copy(direction.multiplyScalar(35));
        this.world.addBody(body);

        this.projectiles.push({ mesh: broccoli, body: body, isPlayer, type: 'rpg', ttl: 150 });
    }

    update() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.mesh.position.copy(p.body.position);

            if (p.type === 'rpg') {
                p.mesh.rotation.y += 0.15;
            }

            p.ttl--;
            if (p.ttl <= 0) {
                if (p.type === 'rpg') AudioSystem.playExplosion();
                this.scene.remove(p.mesh);
                this.world.remove(p.body);
                this.projectiles.splice(i, 1);
            }
        }
    }
}
