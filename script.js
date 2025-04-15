document.addEventListener('DOMContentLoaded', () => {
    const svg = document.getElementById('dental-chart');
    const teeth = [];
    const states = ['normal', 'missing', 'crown', 'bridge', 'implant'];
    const toothState = Array(32).fill('normal');

    // FDI編號
    const fdiNumbers = [
        // 右上：11-18
        11, 12, 13, 14, 15, 16, 17, 18,
        // 左上：21-28
        21, 22, 23, 24, 25, 26, 27, 28,
        // 左下：31-38
        31, 32, 33, 34, 35, 36, 37, 38,
        // 右下：41-48
        41, 42, 43, 44, 45, 46, 47, 48
    ];

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
        const toothNum = fdiNumbers[i];
        const isUpper = i < 16; // 上排：0-15（11-18, 21-28）
        // 排列順序：右上 -> 左上 -> 左下 -> 右下
        let x;
        if (i < 8) {
            x = startX + (7 - i) * (toothWidth + gap); // 右上：18-11
        } else if (i < 16) {
            x = startX + (i - 8) * (toothWidth + gap); // 左上：21-28
        } else if (i < 24) {
            x = startX + (i - 16) * (toothWidth + gap); // 左下：31-38
        } else {
            x = startX + (31 - i) * (toothWidth + gap); // 右下：48-41
        }
        const y = isUpper ? upperY : lowerY;

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.classList.add('tooth');
        group.dataset.index = i;

        // 增加一個透明矩形作為點擊區域，確保隱藏時仍可點擊
        const hitArea = document.createElementNS('http://www.w3
