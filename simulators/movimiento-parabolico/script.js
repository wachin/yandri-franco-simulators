(async function () {
  const app = { t: null };
  await window.PhysicsI18n.init({
    basePath: "../../",
    titlePath: "simulators.movimiento-parabolico.title",
    onReady(dictionary) {
      app.t = dictionary;
      initProjectile();
    }
  });

  function initProjectile() {
    const canvas = document.getElementById("cv");
    const grafCanvas = document.getElementById("graf");
    const ctx = canvas.getContext("2d");
    const gctx = grafCanvas.getContext("2d");
    const vInput = document.getElementById("v");
    const angInput = document.getElementById("ang");
    const gInput = document.getElementById("g");
    const slowInput = document.getElementById("slow");
    const vVal = document.getElementById("vVal");
    const angVal = document.getElementById("angVal");
    const gVal = document.getElementById("gVal");
    const slowVal = document.getElementById("slowVal");
    const pauseBtn = document.getElementById("btnPause");
    const tabla = document.getElementById("tablaEnsayos");

    let ensayos = [];
    let paused = false;
    let stepMode = false;
    let currentDatos = [];
    let currentTray = [];
    const colores = ["#1455d9", "#dc2626", "#0f8b8d", "#7c3aed", "#f59e0b", "#8b5e34"];
    let colorIndex = 0;
    let currentColor = "#111827";
    let escalaX = 4;
    let escalaY = 4;

    function tr(path) {
      return window.PhysicsI18n.getValue(app.t, path);
    }

    function actualizarValores() {
      vVal.textContent = `v = ${vInput.value} m/s`;
      angVal.textContent = `theta = ${angInput.value}°`;
      gVal.textContent = `g = ${gInput.value} m/s²`;
      slowVal.textContent = `${tr("simulators.movimiento-parabolico.controls.speed")} = ${slowInput.value}x`;
    }

    function renderTableHeader() {
      tabla.innerHTML = `<tr><th>#</th><th>${tr("simulators.movimiento-parabolico.controls.angle")} (°)</th><th>v0 (m/s)</th><th>${tr("simulators.movimiento-parabolico.controls.maxHeight")} (m)</th><th>${tr("simulators.movimiento-parabolico.controls.range")} (m)</th><th>${tr("simulators.movimiento-parabolico.controls.time")} (s)</th></tr>`;
    }

    function disparar() {
      paused = false;
      stepMode = false;
      pauseBtn.textContent = tr("simulators.movimiento-parabolico.controls.pause");
      const v0 = parseFloat(vInput.value);
      const angulo = parseFloat(angInput.value) * Math.PI / 180;
      const gValor = parseFloat(gInput.value);
      const slow = parseFloat(slowInput.value);
      const vx = v0 * Math.cos(angulo);
      const vy0 = v0 * Math.sin(angulo);
      let t = 0;
      const dt = 0.05 * slow;
      const tray = [];
      currentDatos = [];
      currentTray = [];
      currentColor = colores[colorIndex++ % colores.length];

      function anim() {
        if (paused && !stepMode) {
          requestAnimationFrame(anim);
          return;
        }

        const x = vx * t;
        const y = vy0 * t - 0.5 * gValor * t * t;
        const vy = vy0 - gValor * t;
        tray.push({ x, y });
        currentTray.push({ x, y });
        currentDatos.push({ t, x, y });
        dibujar(x, y, vx, vy);
        graficar(vx, vy0);

        if (y >= 0) {
          t += dt;
          stepMode = false;
          requestAnimationFrame(anim);
        } else {
          const tiempoTotal = t;
          const alcance = vx * tiempoTotal;
          const alturaMax = (vy0 * vy0) / (2 * gValor);
          ensayos.push({ tray, datos: [...currentDatos], vx, vy: vy0, color: currentColor });
          currentTray = [];
          const fila = tabla.insertRow();
          const i = tabla.rows.length - 1;
          fila.insertCell(0).innerText = i;
          fila.insertCell(1).innerText = (angulo * 180 / Math.PI).toFixed(1);
          fila.insertCell(2).innerText = v0.toFixed(1);
          fila.insertCell(3).innerText = alturaMax.toFixed(2);
          fila.insertCell(4).innerText = alcance.toFixed(2);
          fila.insertCell(5).innerText = tiempoTotal.toFixed(2);
          currentDatos = [];
        }
      }

      anim();
    }

    function dibujar(xActual, yActual, vxActual = 0, vyActual = 0) {
      let maxX = 200;
      let maxY = 100;
      ensayos.forEach((e) => e.tray.forEach((p) => {
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
      }));
      currentTray.forEach((p) => {
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
      });
      maxX = Math.max(maxX, 10);
      maxY = Math.max(maxY, 10);
      escalaX = 800 / (maxX * 1.1);
      escalaY = 250 / (maxY * 1.1);
      ctx.clearRect(0, 0, 900, 350);
      ctx.font = "12px Arial";

      ctx.strokeStyle = "#dc2626";
      ctx.beginPath();
      ctx.moveTo(50, 300);
      ctx.lineTo(850, 300);
      ctx.stroke();
      ctx.strokeStyle = "#1455d9";
      ctx.beginPath();
      ctx.moveTo(50, 300);
      ctx.lineTo(50, 50);
      ctx.stroke();

      ctx.fillStyle = "#111827";
      const pasoX = maxX > 1000 ? 500 : (maxX > 500 ? 200 : (maxX > 200 ? 50 : 20));
      for (let val = 0; val <= maxX; val += pasoX) {
        const x = 50 + val * escalaX;
        ctx.beginPath();
        ctx.moveTo(x, 295);
        ctx.lineTo(x, 305);
        ctx.strokeStyle = "#dc2626";
        ctx.stroke();
        ctx.fillText(val >= 1000 ? `${(val / 1000).toFixed(1)} km` : `${val.toFixed(0)} m`, x - 15, 320);
      }

      const pasoY = maxY > 200 ? 50 : (maxY > 100 ? 20 : 10);
      for (let val = 0; val <= maxY; val += pasoY) {
        const y = 300 - val * escalaY;
        ctx.beginPath();
        ctx.moveTo(45, y);
        ctx.lineTo(55, y);
        ctx.stroke();
        ctx.fillText(val >= 1000 ? `${(val / 1000).toFixed(1)} km` : `${val.toFixed(0)} m`, 5, y + 4);
      }

      ctx.fillText(`${tr("simulators.movimiento-parabolico.controls.distance")} (m)`, 400, 340);
      ctx.fillText(`${tr("simulators.movimiento-parabolico.controls.height")} (m)`, 5, 40);
      ctx.fillRect(40, 290, 20, 10);
      ctx.save();
      ctx.translate(50, 300);
      ctx.rotate(-parseFloat(angInput.value) * Math.PI / 180);
      ctx.fillRect(0, -5, 30, 10);
      ctx.restore();
      ctx.fillText(`Vx = ${vxActual.toFixed(2)} m/s`, 650, 60);
      ctx.fillText(`Vy = ${vyActual.toFixed(2)} m/s`, 650, 80);

      ensayos.forEach((e) => drawTrajectory(e.tray, e.color, [6, 4]));
      if (currentTray.length > 0) drawTrajectory(currentTray, currentColor, [5, 5]);

      const px0 = 50;
      const py0 = 300;
      ctx.fillStyle = "#0f8b8d";
      ctx.beginPath();
      ctx.arc(px0, py0, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText(`${tr("simulators.movimiento-parabolico.controls.start")} (0,0)`, px0 + 5, py0 - 5);

      if (currentDatos.length > 0) {
        const max = currentDatos.reduce((a, b) => b.y > a.y ? b : a);
        const pxm = 50 + max.x * escalaX;
        const pym = 300 - max.y * escalaY;
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.arc(pxm, pym, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(`${tr("simulators.movimiento-parabolico.controls.maxHeight")} (${max.x.toFixed(1)}, ${max.y.toFixed(1)})`, pxm + 5, pym - 5);
      }

      if (ensayos.length > 0) {
        const last = ensayos[ensayos.length - 1];
        const fin = last.tray[last.tray.length - 1];
        const pxf = 50 + fin.x * escalaX;
        ctx.fillStyle = "#dc2626";
        ctx.beginPath();
        ctx.arc(pxf, 300, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(`${tr("simulators.movimiento-parabolico.controls.range")} (${fin.x.toFixed(1)}, 0)`, pxf + 5, 295);
      }

      const px = 50 + xActual * escalaX;
      const py = 300 - yActual * escalaY;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#111827";
      ctx.fill();
    }

    function drawTrajectory(points, color, dash) {
      ctx.beginPath();
      ctx.setLineDash(dash);
      points.forEach((p, i) => {
        const px = 50 + p.x * escalaX;
        const py = 300 - p.y * escalaY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    function graficar(vx = 0, vy = 0) {
      gctx.clearRect(0, 0, 900, 220);
      gctx.font = "12px Arial";
      gctx.beginPath();
      gctx.moveTo(40, 200);
      gctx.lineTo(850, 200);
      gctx.moveTo(40, 200);
      gctx.lineTo(40, 20);
      gctx.stroke();
      gctx.fillText(`${tr("simulators.movimiento-parabolico.controls.time")} (s)`, 400, 215);
      gctx.fillText(`${tr("simulators.movimiento-parabolico.controls.height")} (m)`, 5, 20);

      ensayos.forEach((e, index) => {
        gctx.beginPath();
        e.datos.forEach((d, i) => {
          const px = 40 + d.t * 40;
          const py = 200 - d.y * 2;
          if (i === 0) gctx.moveTo(px, py);
          else gctx.lineTo(px, py);
        });
        gctx.strokeStyle = e.color;
        gctx.stroke();
        gctx.fillStyle = e.color;
        gctx.fillText(`${tr("simulators.movimiento-parabolico.controls.trial")} ${index + 1}`, 600, 30 + index * 20);
        gctx.fillText(`Vx0=${e.vx.toFixed(1)}`, 700, 30 + index * 20);
        gctx.fillText(`Vy0=${e.vy.toFixed(1)}`, 780, 30 + index * 20);
      });

      if (currentDatos.length > 0) {
        gctx.beginPath();
        currentDatos.forEach((d, i) => {
          const px = 40 + d.t * 40;
          const py = 200 - d.y * 2;
          if (i === 0) gctx.moveTo(px, py);
          else gctx.lineTo(px, py);
        });
        gctx.strokeStyle = currentColor;
        gctx.stroke();
        gctx.fillStyle = currentColor;
        gctx.fillText(tr("simulators.movimiento-parabolico.controls.current"), 60, 40);
        gctx.fillText(`Vx0=${vx.toFixed(1)} m/s`, 60, 60);
        gctx.fillText(`Vy0=${vy.toFixed(1)} m/s`, 60, 80);
      }
    }

    function togglePause() {
      paused = !paused;
      pauseBtn.textContent = paused ? tr("simulators.movimiento-parabolico.controls.resume") : tr("simulators.movimiento-parabolico.controls.pause");
    }

    function paso() {
      paused = true;
      stepMode = true;
      pauseBtn.textContent = tr("simulators.movimiento-parabolico.controls.resume");
    }

    function reset() {
      ensayos = [];
      currentDatos = [];
      currentTray = [];
      paused = false;
      stepMode = false;
      renderTableHeader();
      pauseBtn.textContent = tr("simulators.movimiento-parabolico.controls.pause");
      ctx.clearRect(0, 0, 900, 350);
      gctx.clearRect(0, 0, 900, 220);
      dibujar(0, 0);
      graficar();
    }

    [vInput, angInput, gInput, slowInput].forEach((input) => input.addEventListener("input", actualizarValores));
    document.getElementById("fireBtn").addEventListener("click", disparar);
    pauseBtn.addEventListener("click", togglePause);
    document.getElementById("stepBtn").addEventListener("click", paso);
    document.getElementById("resetBtn").addEventListener("click", reset);
    renderTableHeader();
    actualizarValores();
    dibujar(0, 0);
    graficar();
  }
})();
