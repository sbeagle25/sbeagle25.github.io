document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded, initializing dental chart...');

    const svg = document.getElementById('dental-chart');
    if (!svg) {
        console.error('SVG element not found!');
        return;
    }

    const teeth = [];
    const states = ['normal', 'missing', 'crown', 'bridge', 'implant'];
    const toothState = Array(32).fill('normal');

    // FDI編號
    const fdiNumbers = [
        18, 17, 16, 15, 14, 13, 12, 11, // 右上
        21, 22, 23, 24, 25, 26, 27, 28, // 左上
        38, 37, 36, 35, 34, 33, 32, 31, // 左下
        41, 42, 43, 44, 45, 46, 47, 48  // 右下
    ];

    // 牙齒類型和寬度
    const toothTypes = [
        'molar', 'molar', 'molar', 'premolar', 'premolar', 'canine', 'incisor', 'incisor', // 右上
        'incisor', 'incisor', 'canine', 'premolar', 'premolar', 'molar', 'molar', 'molar', // 左上
        'molar', 'molar', 'molar', 'premolar', 'premolar', 'canine', 'incisor', 'incisor', // 左下
        'incisor', 'incisor', 'canine', 'premolar', 'premolar', 'molar', 'molar', 'molar'  // 右下
    ];
    const toothWidths = {
        incisor: 8,
        canine: 10,
        premolar: 12,
        molar: 16
    };

    // 佈局參數
    const centerX = 400; // 畫布中心
    const upperRadius = 120; // 上顎半徑
    const lowerRadius = 120; // 下顎半徑
    const upperY = 200; // 上顎中心 y
    const lowerY = 400; // 下顎中心 y
    const toothHeight = 25;
    const rootHeight = 15;

    // 繪製牙齒
    try {
        for (let i = 0; i < 32; i++) {
            const toothNum = fdiNumbers[i];
            const type = toothTypes[i];
            const width = toothWidths[type];
            const isUpper = i < 16;
            const isRight = (i < 8) || (i >= 24);

            // 計算角度（半圓形分佈）
            let angle;
            if (i < 8) angle = -Math.PI / 3 + (i / 7) * (Math.PI / 1.5); // 右上：-π/3 到 π/6
            else if (i < 16) angle = Math.PI / 6 + ((i - 8) / 7) * (Math.PI / 1.5); // 左上：π/6 到 π/2
            else if (i < 24) angle = Math.PI / 2 + ((23 - i) / 7) * (Math.PI / 1.5); // 左下：π/2 到 5π/6
            else angle = -Math.PI * 5 / 6 + ((31 - i) / 7) * (Math.PI / 1.5); // 右下：-5π/6 到 -π/3

            const radius = isUpper ? upperRadius : lowerRadius;
            const centerY = isUpper ? upperY : lowerY;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + (isUpper ? -radius : radius) * Math.sin(angle);
            const rootY = isUpper ? toothHeight : -toothHeight;

            // 旋轉角度（朝向中心）
            const rotation = (angle * 180 / Math.PI) + (isUpper ? 0 : 180);

            // 檢查變數
            if (isNaN(x) || isNaN(y)) {
                console.error(`Invalid values for tooth ${toothNum}: x=${x}, y=${y}`);
                continue;
            }

            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.classList.add('tooth');
            group.dataset.index = i;
            group.setAttribute('transform', `translate(${x}, ${y}) rotate(${rotation})`);

            // 點擊區域
            const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            hitArea.setAttribute('x', -width / 2 - 2);
            hitArea.setAttribute('y', isUpper ? -10 : -toothHeight - 10);
            hitArea.setAttribute('width', width + 4);
            hitArea.setAttribute('height', toothHeight + rootHeight + 20);
            hitArea.classList.add('hit-area');

            // 牙冠（更圓潤）
            const crown = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const crownPath = `
                M ${-width / 2},0
                Q ${-width / 2},-5 ${-width / 3},-5
                L ${-width / 3},${isUpper ? toothHeight : -toothHeight}
                Q ${0},${isUpper ? toothHeight + 3 : -toothHeight - 3} ${width / 3},${isUpper ? toothHeight : -toothHeight}
                L ${width / 3},-5
                Q ${width / 2},-5 ${width / 2},0
                Z
            `;
            crown.setAttribute('d', crownPath);
            crown.classList.add('tooth-crown');

            // 牙根（更細長）
            const root = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            let rootPath;
            if (type === 'molar' && i % 8 >= 3) { // 臼齒雙根
                rootPath = `
                    M ${-width / 3},${isUpper ? toothHeight : -toothHeight}
                    L ${-width / 4},${isUpper ? toothHeight + rootHeight : -toothHeight - rootHeight}
                    L ${-width / 8},${isUpper ? toothHeight + rootHeight : -toothHeight - rootHeight}
                    L ${0},${isUpper ? toothHeight : -toothHeight}
                    L ${width / 8},${isUpper ? toothHeight + rootHeight : -toothHeight - rootHeight}
                    L ${width / 4},${isUpper ? toothHeight + rootHeight : -toothHeight - rootHeight}
                    L ${width / 3},${isUpper ? toothHeight : -toothHeight}
                    Z
                `;
            } else { // 單根
                rootPath = `
                    M ${-width / 3},${isUpper ? toothHeight : -toothHeight}
                    L ${-width / 6},${isUpper ? toothHeight + rootHeight : -toothHeight - rootHeight}
                    L ${width / 6},${isUpper ? toothHeight + rootHeight : -toothHeight - rootHeight}
                    L ${width / 3},${isUpper ? toothHeight : -toothHeight}
                    Z
                `;
            }
            root.setAttribute('d', rootPath);
            root.classList.add('tooth-root');

            // 編號
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', 0);
            label.setAttribute('y', isUpper ? -15 : toothHeight + rootHeight + 15);
            label.setAttribute('text-anchor', 'middle');
            label.textContent = toothNum;

            group.appendChild(hitArea);
            group.appendChild(crown);
            group.appendChild(root);
            group.appendChild(label);
            svg.appendChild(group);
            teeth.push(group);

            console.log(`Tooth ${toothNum} created at x=${x}, y=${y}, type=${type}`);
        }
    } catch (error) {
        console.error('Error creating teeth:', error);
    }

    // 點擊事件
    try {
        teeth.forEach((tooth, index) => {
            tooth.addEventListener('click', () => {
                console.log(`Tooth ${fdiNumbers[index]} clicked, current state: ${toothState[index]}`);
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
                console.log(`Tooth ${fdiNumbers[index]} changed to state: ${toothState[index]}`);
            });
        });
    } catch (error) {
        console.error('Error setting up click events:', error);
    }
});
