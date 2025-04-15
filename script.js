document.addEventListener('DOMContentLoaded', () => {
    const svg = document.getElementById('dental-chart');
    const teeth = [];
    const states = ['normal', 'missing', 'crown', 'bridge', 'implant'];
    const toothState = Array(32).fill('normal');

    // 牙齒坐標和形狀參數
    const toothWidth = 20;
    const toothHeight = 50;
    const rootHeight = 30;
    const gap = 5;
    const startX = 50;
    const upperY = 100;
    const lowerY = 400;

    // 繪製32顆牙齒
    for (let i = 0; i < 32; i++) {
        const toothNum = i + 1;
        const isUpper = toothNum <= 16;
        const x = startX + (isUpper ? (toothNum - 1) : (toothNum - 17)) * (toothWidth + gap);
        const y = isUpper ? upperY : lowerY;
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.classList.add('tooth');
        group.dataset.index = i;

        // 牙冠（矩形）
        const crown = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        crown.setAttribute('x', x);
        crown.setAttribute('y', y);
        crown.setAttribute('width', toothWidth);
        crown.setAttribute('height', toothHeight);
        crown.classList.add('tooth-crown');

        // 牙根（梯形）
        const root = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const rootY = y + toothHeight;
        root.setAttribute('points', `
            ${x},${rootY}
            ${x + toothWidth},${rootY}
            ${x + toothWidth * 0.8},${rootY + rootHeight}
            ${x + toothWidth * 0.2},${rootY + rootHeight}
        `);
        root.classList.add('tooth-root');

        // 牙齒編號
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x + toothWidth / 2);
        label.setAttribute('y', isUpper ? y - 10 : y + toothHeight + rootHeight + 20);
        label.setAttribute('text-anchor', 'middle');
        label.textContent = toothNum;

        group.appendChild(crown);
        group.appendChild(root);
        group.appendChild(label);
        svg.appendChild(group);
        teeth.push(group);
    }

    // 點擊切換狀態
    teeth.forEach((tooth, index) => {
        tooth.addEventListener('click', () => {
            let currentStateIndex = states.indexOf(toothState[index]);
            currentStateIndex = (currentStateIndex + 1) % states.length;
            toothState[index] = states[currentStateIndex];

            const crown = tooth.querySelector('.tooth-crown');
            const root = tooth.querySelector('.tooth-root');

            // 重置樣式
            tooth.classList.remove('missing');
            crown.classList.remove('crown-gray');
            root.classList.remove('crown-gray', 'implant-root');
            root.style.display = 'block';

            // 應用新狀態
            switch (toothState[index]) {
                case 'missing':
                    tooth.classList.add('missing');
                    break;
                case 'crown':
                    crown.classList.add('crown-gray');
                    break;
                case 'bridge':
                    crown.classList.add('crown-gray');
                    root.style.display = 'none';
                    break;
                case 'implant':
                    crown.classList.add('crown-gray');
                    root.classList.add('implant-root');
                    break;
            }
        });
    });
});
