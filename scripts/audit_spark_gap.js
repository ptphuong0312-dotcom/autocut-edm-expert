// ==============================================================================
// AUDIT SPARK GAP & OFFSET BENCHMARK (RULE 17 & RULE 19)
// DỰ ÁN: AUTOCUT SERVO EDM EXPERT (DK77 WIRE EDM)
// ==============================================================================

const C0 = 0.00360;
const K_ELEC = 0.00092;
const DELTA_LOW = 0.00450;
const K_SLAG = 0.02000;
const K_VIBR = 0.00390;
const K_VF = 0.00210;
const K_PO = 0.00120;

function calc_gap(H, Ton, Po, IP, Volt, VF, mat = 'SCM440') {
    const isHard = (mat === 'SCM440' || mat === '30HRC');
    const sm = isHard ? 1.0 : 0.80;
    if (H <= 170) {
        const u_ratio = (Volt === 'High' || Volt === 'H') ? 1.0 : (22.0 / 27.0);
        const d_elec = K_ELEC * Math.sqrt(Ton * IP) * u_ratio;
        const d_low = (Volt === 'Low' || Volt === 'L') ? DELTA_LOW : 0.0;
        const ip_fac = Math.max(1.0, IP / 4.0);
        const d_slag = - K_SLAG * (H / 100.0) * sm / ip_fac;
        const d_vibr = K_VIBR * Math.pow(H / 100.0, 2) * (IP / 5.0);
        const d_vf = K_VF * ((VF - 55.0) / 10.0);
        const d_po = - K_PO * ((Po - 5.0) / 10.0);
        return C0 + d_elec + d_low + d_slag + d_vibr + d_vf + d_po;
    } else {
        const gap170 = C0 + (K_ELEC * Math.sqrt(Ton * IP) * 1.0) + (- K_SLAG * 1.70 * sm / Math.max(1.0, IP / 4.0)) + (K_VIBR * Math.pow(1.70, 2) * (IP / 5.0));
        const gapBase = gap170 + (H - 170) * (0.0250 - gap170) / (300 - 170);
        const d_vf = K_VF * 0.5 * ((VF - 65.0) / 10.0);
        const d_po = - K_PO * 0.5 * ((Po - 9.0) / 10.0);
        return gapBase + d_vf + d_po;
    }
}

const dataset = [
    // 1-Pass Benchmark cuts
    ['1P-5P01', '1P (Quy đổi 5P-01)', 12, 20, 5, 3, 'High', 65, 'SCM440', 0.0110, 0.1010],
    ['STT 22',  '1P (SCM420 chày L)',  12, 16, 6, 3, 'Low',  60, 'SCM420', 0.0050, 0.0950],
    ['STT 1',   '1P (Chuẩn gốc)',      30, 32, 5, 4, 'High', 65, 'SCM440', 0.0080, 0.0980],
    ['STT 2',   '1P (Chuẩn gốc)',      40, 36, 5, 4, 'High', 65, 'SCM440', 0.0080, 0.0980],
    ['STT 3',   '1P (SCM420 chày)',    63, 44, 7, 5, 'High', 55, 'SCM420', 0.0050, 0.0950],
    ['STT 18',  '1P (SCM420 chày)',    63, 44, 8, 4, 'High', 57, 'SCM420', 0.0080, 0.0980],
    ['STT 6',   '1P (SCM440 chày L)',  68, 70, 7, 3, 'Low',  50, 'SCM440', 0.0070, 0.0970],
    ['STT 16',  '1P (SCM420 cối)',     75, 55, 7, 4, 'High', 54, 'SCM420', 0.0220, 0.1120],
    ['1P-2P10', '1P (Quy đổi 2P-10)',  85, 70, 8, 5, 'High', 61, 'SCM440', 0.0125, 0.1025],
    ['STT 21',  '1P (SCM420 cối)',     90, 80, 7, 4, 'High', 54, 'SCM420', 0.0280, 0.1180],
    ['STT 17',  '1P (SCM440 cối)',     95, 82, 7, 4, 'High', 55, 'SCM440', 0.0235, 0.1135],
    ['STT 19',  '1P (SCM420 chày)',   110, 100, 10, 5, 'High', 65, 'SCM420', 0.0150, 0.1050],
    ['STT 7',   '1P (SCM420 chày)',   140, 120, 8, 5, 'High', 55, 'SCM420', 0.0050, 0.0950],
    ['STT 12',  '1P (SCM420 chày)',   140, 100, 9, 6, 'High', 60, 'SCM420', 0.0120, 0.1020],
    ['STT 15',  '1P (SCM420 cối)',    160, 120, 11, 6, 'High', 70, 'SCM420', 0.0300, 0.1200],
    ['1P-2P12', '1P (Quy đổi 2P-12)', 165, 135, 11, 6, 'High', 70, 'SCM440', 0.0225, 0.1125],
    ['STT 23',  '1P (SCM420 siêu dày)', 200, 120, 10, 6, 'High', 65, 'SCM420', 0.0180, 0.1080],
    ['STT 20',  '1P (SCM440 siêu dày)', 290, 135, 10, 6, 'High', 75, 'SCM440', 0.0200, 0.1100],
    ['STT 14',  '1P (SCM440 mốc 300)', 300, 120, 9, 6, 'High', 65, 'SCM440', 0.0250, 0.1150]
];

console.log("=".repeat(115));
console.log("BẢNG KIỂM ĐỊNH LƯỢNG CÀO PHÔI: CÔNG THỨC TOÁN - VẬT LÝ VS THỰC NGHIỆM XƯỞNG (v3.5.52)");
console.log("=".repeat(115));
console.log(`| ${'STT'.padEnd(8)} | ${'Nhóm'.padEnd(20)} | ${'H'.padStart(3)} | ${'Thép'.padEnd(6)} | ${'Ton'.padStart(3)} | ${'Po'.padStart(2)} | ${'IP'.padStart(2)} | ${'Volt'.padStart(4)} | ${'VF'.padStart(2)} | ${'delta_thực'.padStart(10)} | ${'delta_tính'.padStart(10)} | ${'Sai lệch'.padStart(10)} | ${'O_chuẩn'.padStart(8)} |`);
console.log("|" + "-".repeat(10) + "|" + "-".repeat(22) + "|" + "-".repeat(5) + "|" + "-".repeat(8) + "|" + "-".repeat(5) + "|" + "-".repeat(4) + "|" + "-".repeat(4) + "|" + "-".repeat(6) + "|" + "-".repeat(4) + "|" + "-".repeat(12) + "|" + "-".repeat(12) + "|" + "-".repeat(12) + "|" + "-".repeat(10) + "|");

const errors = [];
const errors440 = [];
const errors420 = [];

for (const [name, grp, H, Ton, Po, IP, Volt, VF, mat, actual_gap, actual_O1] of dataset) {
    const calc = calc_gap(H, Ton, Po, IP, Volt, VF, mat);
    const diff = (calc - actual_gap) * 1000;
    const absErr = Math.abs(diff);
    errors.push(absErr);
    if (mat === 'SCM440') errors440.push(absErr);
    else errors420.push(absErr);
    const sign = diff >= 0 ? '+' : '';
    console.log(`| ${name.padEnd(8)} | ${grp.padEnd(20)} | ${String(H).padStart(3)} | ${mat.padEnd(6)} | ${String(Ton).padStart(3)} | ${String(Po).padStart(2)} | ${String(IP).padStart(2)} | ${Volt.padStart(4)} | ${String(VF).padStart(2)} | ${(actual_gap*1000).toFixed(1).padStart(7)} um | ${(calc*1000).toFixed(1).padStart(7)} um | ${(sign + diff.toFixed(1)).padStart(7)} um | ${actual_O1.toFixed(4).padStart(8)} |`);
}

const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
const mae = avg(errors);
const mae440 = avg(errors440);
const mae420 = avg(errors420);
const rmse = Math.sqrt(errors.reduce((a, b) => a + b*b, 0) / errors.length);
const max_err = Math.max(...errors);

console.log("=".repeat(115));
console.log(`TỔNG KẾT THỐNG KÊ TOÀN DIỆN (${dataset.length} bài cắt thực nghiệm xưởng):`);
console.log(`  * MAE Thép tôi SCM440 (28-32 HRC, n=${errors440.length}): ${mae440.toFixed(2)} um`);
console.log(`  * MAE Thép mềm SCM420 (HB < 200, n=${errors420.length}): ${mae420.toFixed(2)} um`);
console.log(`  * Sai số trung bình tuyệt đối toàn cục (MAE): ${mae.toFixed(2)} um`);
console.log(`  * Sai số hiệu dụng toàn cục (RMSE): ${rmse.toFixed(2)} um`);
console.log(`  * Sai số cực đại (Max Error): ${max_err.toFixed(2)} um`);
