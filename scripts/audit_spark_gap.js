const C0 = 0.00280;
const K_ELEC = 0.00100;
const DELTA_LOW = 0.00450;
const K_SLAG = 0.02300;
const K_VIBR = 0.00390;
const K_RZ = 0.00120;

function calc_gap(H, Ton, IP, Volt) {
    const u_ratio = Volt === 'High' ? 1.0 : (22.0 / 27.0);
    const d_elec = K_ELEC * Math.sqrt(Ton * IP) * u_ratio;
    const d_low = Volt === 'Low' ? DELTA_LOW : 0.0;
    const ip_fac = Math.max(1.0, IP / 4.0);
    const d_slag = - K_SLAG * (H / 100.0) / ip_fac;
    const d_vibr = K_VIBR * Math.pow(H / 100.0, 2) * (IP / 5.0);
    return C0 + d_elec + d_low + d_slag + d_vibr;
}

const dataset = [
    // 1-Pass Active Benchmark cuts (H <= 170mm)
    ['1P-5P01', '1 Pass (Quy đổi 5P-01)', 12, 20, 3, 'High', 0.0110, 0.1010],
    ['STT 1',   '1 Pass (Chuẩn gốc)',      30, 32, 4, 'High', 0.0080, 0.0980],
    ['STT 2',   '1 Pass (Chuẩn gốc)',      40, 36, 4, 'High', 0.0080, 0.0980],
    ['STT 18',  '1 Pass (SCM420 chày)',    63, 44, 4, 'High', 0.0080, 0.0980],
    ['STT 3',   '1 Pass (Chuẩn gốc)',      63, 44, 5, 'High', 0.0050, 0.0950],
    ['STT 6',   '1 Pass (Chuẩn gốc)',      68, 70, 3, 'Low',  0.0070, 0.0970],
    ['STT 16',  '1 Pass (SCM420 cối)',     75, 55, 4, 'High', 0.0220, 0.1120],
    ['1P-2P14', '1 Pass (Quy đổi 2P-14)', 75, 55, 4, 'High', 0.0225, 0.1125],
    ['1P-2P10', '1 Pass (Quy đổi 2P-10)', 85, 70, 5, 'High', 0.0125, 0.1025],
    ['STT 17',  '1 Pass (SCM440 cối)',     95, 82, 4, 'High', 0.0235, 0.1135],
    ['STT 19',  '1 Pass (SCM420 chày)',   110, 100, 5, 'High', 0.0150, 0.1050],
    ['STT 7',   '1 Pass (Chuẩn gốc)',     140, 120, 5, 'High', 0.0050, 0.0950],
    ['STT 12',  '1 Pass (Chuẩn gốc)',     140, 100, 6, 'High', 0.0120, 0.1020],
    ['STT 15',  '1 Pass (SCM420 cối)',    160, 120, 6, 'High', 0.0300, 0.1200],
    ['1P-2P12', '1 Pass (Quy đổi 2P-12)', 165, 135, 6, 'High', 0.0225, 0.1125],

    // 2-Pass Pass 1 cuts (H <= 170mm)
    ['2P-02', '2 Pass P1', 63, 44, 5, 'High', 0.0030, 0.0930],
    ['2P-03', '2 Pass P1', 30, 28, 4, 'High', 0.0175, 0.1075],
    ['2P-04', '2 Pass P1', 12, 20, 2, 'Low',  0.0080, 0.0980],
    ['2P-05', '2 Pass P1', 32, 30, 3, 'Low',  0.0010, 0.0910],
    ['2P-06', '2 Pass P1', 62, 70, 4, 'High', 0.0020, 0.0920],
    ['2P-09', '2 Pass P1', 140, 120, 5, 'High', 0.0080, 0.0980],
    ['2P-10', '2 Pass P1 (thép đặc)', 85, 70, 5, 'High', 0.0125, 0.1025],
    ['2P-12', '2 Pass P1 (thép đặc)', 165, 135, 6, 'High', 0.0225, 0.1125],
    ['2P-13', '2 Pass P1 (cắt cối)', 60, 50, 4, 'High', 0.0090, 0.0990],
    ['2P-14', '2 Pass P1 (thép mềm)', 75, 55, 4, 'High', 0.0225, 0.1125],

    // 5-Pass Pass 1 cut
    ['5P-01', '5 Pass P1 (thép đặc)', 12, 20, 3, 'High', 0.0110, 0.1010]
];

console.log("=".repeat(105));
console.log("BẢNG KIỂM ĐỊNH LƯỢNG CÀO PHÔI: CÔNG THỨC TOÁN - VẬT LÝ VS THỰC NGHIỆM XƯỞNG");
console.log("=".repeat(105));
console.log(`| ${'STT'.padEnd(8)} | ${'Nhóm'.padEnd(20)} | ${'H'.padStart(3)} | ${'Ton'.padStart(3)} | ${'IP'.padStart(2)} | ${'Volt'.padStart(4)} | ${'delta_thực'.padStart(10)} | ${'delta_tính'.padStart(10)} | ${'Sai lệch'.padStart(12)} | ${'Offset chuẩn'.padStart(12)} |`);
console.log("|" + "-".repeat(10) + "|" + "-".repeat(22) + "|" + "-".repeat(5) + "|" + "-".repeat(5) + "|" + "-".repeat(4) + "|" + "-".repeat(6) + "|" + "-".repeat(12) + "|" + "-".repeat(12) + "|" + "-".repeat(14) + "|" + "-".repeat(14) + "|");

const errors = [];
for (const [name, grp, H, Ton, IP, Volt, actual_gap, actual_O1] of dataset) {
    const calc = calc_gap(H, Ton, IP, Volt);
    const diff = (actual_gap - calc) * 1000;
    errors.push(Math.abs(diff));
    const sign = diff >= 0 ? '+' : '';
    console.log(`| ${name.padEnd(8)} | ${grp.padEnd(20)} | ${String(H).padStart(3)} | ${String(Ton).padStart(3)} | ${String(IP).padStart(2)} | ${Volt.padStart(4)} | ${(actual_gap*1000).toFixed(2).padStart(8)} um | ${(calc*1000).toFixed(2).padStart(8)} um | ${(sign + diff.toFixed(2)).padStart(10)} um | ${actual_O1.toFixed(4).padStart(10)} mm |`);
}

const mae = errors.reduce((a, b) => a + b, 0) / errors.length;
const rmse = Math.sqrt(errors.reduce((a, b) => a + b*b, 0) / errors.length);
const max_err = Math.max(...errors);

console.log("=".repeat(105));
console.log(`TỔNG KẾT THỐNG KÊ TOÀN DIỆN (${dataset.length} bài cắt thực nghiệm hợp lệ):`);
console.log(`  * Sai số trung bình tuyệt đối (MAE): ${mae.toFixed(2)} um (${(mae/1000).toFixed(4)} mm)`);
console.log(`  * Sai số hiệu dụng toàn cục (RMSE): ${rmse.toFixed(2)} um (${(rmse/1000).toFixed(4)} mm)`);
console.log(`  * Sai số cực đại (Max Error): ${max_err.toFixed(2)} um (${(max_err/1000).toFixed(4)} mm)`);

const thin_errors = dataset.filter(d => d[2] <= 40).map(d => Math.abs((d[6] - calc_gap(d[2], d[3], d[4], d[5]))*1000));
const mid_errors = dataset.filter(d => d[2] > 40 && d[2] <= 100).map(d => Math.abs((d[6] - calc_gap(d[2], d[3], d[4], d[5]))*1000));
const thick_errors = dataset.filter(d => d[2] > 100).map(d => Math.abs((d[6] - calc_gap(d[2], d[3], d[4], d[5]))*1000));

console.log(`  * Dải phôi mỏng  (H <= 40mm): MAE = ${(thin_errors.reduce((a,b)=>a+b,0)/thin_errors.length).toFixed(2)} um`);
console.log(`  * Dải phôi trung (40 < H <= 100mm): MAE = ${(mid_errors.reduce((a,b)=>a+b,0)/mid_errors.length).toFixed(2)} um`);
console.log(`  * Dải phôi dày   (100 < H <= 170mm): MAE = ${(thick_errors.reduce((a,b)=>a+b,0)/thick_errors.length).toFixed(2)} um`);
console.log("=".repeat(105));
