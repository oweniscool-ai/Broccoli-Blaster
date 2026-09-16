/**
 * Broccoli Buster - UI & Touch Controls System
 */
export class UIManager {
    constructor(onFire, onSwap) {
        this.isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        this.onFire = onFire;
        this.onSwap = onSwap;
    }

    init() {
        if (this.isTouch) {
            document.body.classList.add('is-touch');
            this.bindTouchEvents();
        }
    }

    bindTouchEvents() {
        const fireBtn = document.getElementById('btn-fire');
        const swapBtn = document.getElementById('btn-swap');

        if (fireBtn) {
            fireBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.onFire();
            });
        }

        if (swapBtn) {
            swapBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.onSwap();
            });
        }
    }

    updateHealth(hp) {
        const hpDisplay = document.getElementById('hp-display');
        if (hpDisplay) hpDisplay.innerText = hp;
    }

    updateWeaponLabel(name) {
        const label = document.getElementById('weapon-label');
        if (label) label.innerText = name;
    }
}
