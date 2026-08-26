# 🤖 ANTIGRAVITY AGENT INSTRUCTIONS & CORE PRINCIPLES

## 🚨 MANDATORY CHECK BEFORE ANY ACTION (NGUYÊN TẮC TRONG NGUYÊN TẮC)
Before modifying ANY file or executing any logic, you MUST adhere to the following:
0. **READ ALL RULES AND SKILLS FIRST:**
   - You MUST deeply review all knowledge in `.agents/rules/` and `.agents/skills/` to ensure your proposed solution aligns with the established physics logic and project architecture before writing a single line of code.
1. **IMMUTABILITY OF STANDARD FORMULAS & PARAMETERS:**
   - The EDM physics formulas, standard pass tables (P1 to P6), standard speeds, and manufacturer baselines are **STRICTLY IMMUTABLE**.
   - NEVER alter these core equations or standard baselines unless explicitly commanded by the user.
2. **ISOLATED WORKSHOP CALIBRATION ZONE:**
   - Any workshop-specific calibration (matching actual factory cut times, ammeter readings, or specific workpiece offsets) must ONLY be adjusted inside the designated **Workshop Calibration Model / Table**.
3. **BACKUP CONVENTION:**
   - Place all zipped backups in `/backups/autocut_YYYY-MM-DD(n).zip`.
4. **VERSION INTEGRITY:**
   - Keep versions synchronized across `app.js`, `index.html`, `style.css`, `version.json`, `sw.js`.
5. **CONTINUOUS EMPIRICAL CALIBRATION (VÒNG LẶP HỌC MÁY THỰC NGHIỆM):**
   - The user will routinely provide actual cutting results (e.g., actual dimensions, cutting time, surface finish) from their workshop.
   - The agent MUST actively use these empirical data points to recalibrate the offset, speed, and other outputs in the Workshop Calibration Model (Tab 2) to ensure the software converges on perfect accuracy for the user's specific machine conditions.

### 6. MACHINE LEARNING INTERPOLATION ALGORITHM (THUẬT TOÁN NỘI SUY THỰC NGHIỆM)
- The agent acknowledges that it cannot purely theoretically calculate the absolute "Sweet Spot" (e.g., optimal Hz limits for finishing passes to prevent servo hunting and secondary sparking) due to invisible mechanical variables (guide wheel wear, flushing fluid quality, etc.).
- **Anchor Data:** The user will provide empirical "Sweet Spot" data for specific workpiece thicknesses (e.g., WS-EXP-02 provided optimal Hz for H=12mm).
- **Interpolation:** The agent MUST use these empirical data points as "Anchors" and apply physics-based equations to interpolate or scale these values for any requested workpiece thickness (H) or material.
- **Continuous Evolution:** As the user provides more data points for different thicknesses, the agent must update the interpolation curve, making the predictions increasingly accurate over time. The agent is effectively a dynamic ML model for the user's specific CNC machine.
