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

    // 牙齒參數
    const toothWidth = 20;
    const toothHeight = 50;
    const rootHeight = 30;
    const gap = 5;
    const startX = 50;
    const upperY = 150;
    const lowerY = 350;

    // 繪製牙齒
    try {
        for (let i = 0; i < 32; i++) {
            const toothNum = fdiNumbers[i];
            const isUpper = i < 16;
            let x;
            if (i < 8) x = startX + i * (toothWidth + gap); // 右上
            else if (i < 16) x = startX + (i - 8) * (toothWidth + gap); // 左上
            else if (i < 24) x = startX + (23 - i) * (toothWidth + gap); // 左下
            else x = startX + (31 - i) * (toothWidth + gap); // 右下

            const y = isUpper ? upperY : lowerY;
            const rootY = y + toothHeight;

            // 檢查變數
            if (isNaN(x) || isNaN(y) || isNaN(rootY) || isNaN(toothWidth) || isNaN(rootHeight)) {
                console.error(`Invalid values for tooth ${toothNum}: x=${x}, y=${y}, rootY=${rootY}`);
                continue;
            }

            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.classList.add('tooth');
            group.dataset.index = i;

            // 點擊區域
            const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            hitArea.setAttribute('x', x - 2);
            hitArea.setAttribute('y', y - 10);
            hitArea.setAttribute('width', toothWidth + 4);
            hitArea.setAttribute('height', toothHeight + rootHeight + 20);
            hitArea.classList.add('hit-area');

            // 牙冠
            const crown = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            crown.setAttribute('x', x);
            crown.setAttribute('y', y);
            crown.setAttribute('width', toothWidth);
            crown.setAttribute('height', toothHeight);
            crown.classList.add('tooth-crown');

            // 牙根（極簡化 points）
            const root = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            const x1 = x;
            const y1 = rootY;
            const x2 = x + toothWidth;
            const y2 = rootY;
            const x3 = x + toothWidth * 0.8;
            const y3 = rootY + rootHeight;
            const x4 = x + toothWidth * 0.2;
            const y4 = rootY + rootHeight;
            const points = `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`;
            root.setAttribute('points', points);
            root.classList.add('tooth-root');

            // 編號
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', x + toothWidth / 2);
            label.setAttribute('y', isUpper ? y - 10 : y + toothHeight + rootHeight + 20);
            label.setAttribute('text-anchor', 'middle');
            label.textContent = toothNum;

            group.appendChild(hitArea);
            group.appendChild(crown);
            group.appendChild(root);
            group.appendChild(label);
            svg.appendChild(group);
            teeth.push(group);

            console.log(`Tooth ${toothNum} created at x=${x}, y=${y}, points=${points}`);
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
