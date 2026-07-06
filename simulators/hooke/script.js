(async function () {
  const state = { t: null };
  await window.PhysicsI18n.init({
    basePath: "../../",
    titlePath: "simulators.hooke.title",
    onReady(dictionary) {
      state.t = dictionary;
      initHooke();
    }
  });

  function initHooke() {
    const cv = document.getElementById("cv");
    const ctx = cv.getContext("2d");
    const masa = document.getElementById("masa");
    const k = document.getElementById("k");
    const g = document.getElementById("g");
    const masaNum = document.getElementById("masaNum");
    const kNum = document.getElementById("kNum");
    const mVal = document.getElementById("mVal");
    const kVal = document.getElementById("kVal");
    const gVal = document.getElementById("gVal");
    const tabla = document.getElementById("tabla");

    let datos = [];
    let animando = false;
    let xActual = 0;
    let xFinal = 0;
    let FFinal = 0;

    function actualizar() {
      mVal.textContent = `m = ${masa.value} kg`;
      kVal.textContent = `k = ${k.value} N/m`;
      gVal.textContent = `g = ${g.value} m/s²`;
    }

    function syncRangeAndNumber(range, number) {
      range.addEventListener("input", () => {
        number.value = range.value;
        actualizar();
      });
      number.addEventListener("input", () => {
        range.value = number.value;
        actualizar();
      });
    }

    syncRangeAndNumber(masa, masaNum);
    syncRangeAndNumber(k, kNum);
    g.addEventListener("input", actualizar);

    function simular() {
      const m = parseFloat(masa.value);
      const kValNum = parseFloat(k.value);
      const gValNum = parseFloat(g.value);
      FFinal = m * gValNum;
      xFinal = FFinal / kValNum;
      xActual = 0;
      animando = true;
      animar();
      datos.push({ m, k: kValNum, F: FFinal, x: xFinal });
      actualizarTabla();
    }

    function animar() {
      if (!animando) return;
      xActual += (xFinal - xActual) * 0.05;
      dibujar(xActual, FFinal);
      if (Math.abs(xFinal - xActual) > 0.001) {
        requestAnimationFrame(animar);
      } else {
        animando = false;
      }
    }

    function dibujar(x, F) {
      ctx.clearRect(0, 0, 420, 620);
      ctx.font = "13px Arial";

      ctx.fillStyle = "#374151";
      ctx.fillRect(155, 18, 110, 12);
      ctx.fillStyle = "#e8eef7";
      ctx.fillRect(155, 34, 110, 410);
      ctx.strokeStyle = "#111827";
      ctx.strokeRect(155, 34, 110, 410);

      const pasos = 10;
      const maxF = Math.max(FFinal, 10);
      const espacio = 410 / pasos;
      ctx.fillStyle = "#111827";
      ctx.textAlign = "start";
      for (let i = 0; i <= pasos; i += 1) {
        const y = 34 + i * espacio;
        ctx.beginPath();
        ctx.moveTo(155, y);
        ctx.lineTo(172, y);
        ctx.stroke();
        const fValor = Math.round(i * (maxF / pasos));
        ctx.fillText(`${fValor} N`, 88, y + 4);
      }

      const base = 52;
      const largo = 165 + x * 300;
      ctx.strokeStyle = "#4b5563";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(210, base);
      for (let i = 0; i < 16; i += 1) {
        const y = base + i * (largo / 16);
        const dx = i % 2 === 0 ? -14 : 14;
        ctx.lineTo(210 + dx, y);
      }
      ctx.stroke();
      ctx.lineWidth = 1;

      const indicadorY = 34 + F * (x / xFinal || 0);
      ctx.strokeStyle = "#dc2626";
      ctx.beginPath();
      ctx.moveTo(155, indicadorY);
      ctx.lineTo(265, indicadorY);
      ctx.stroke();

      ctx.fillStyle = "#1455d9";
      ctx.fillRect(183, base + largo, 54, 38);
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(`${masa.value} kg`, 210, base + largo + 24);

      ctx.strokeStyle = "#0f8b8d";
      ctx.beginPath();
      ctx.moveTo(210, base);
      ctx.lineTo(210, base + largo);
      ctx.stroke();
      ctx.fillStyle = "#0f8b8d";
      ctx.textAlign = "start";
      ctx.fillText(`${x.toFixed(2)} m`, 232, base + largo / 2);

      ctx.fillStyle = "#111827";
      ctx.fillText(`x = ${x.toFixed(2)} m`, 14, 24);
      ctx.fillText(`F = ${(F * (x / xFinal || 0)).toFixed(2)} N`, 14, 44);
    }

    function actualizarTabla() {
      tabla.innerHTML = "";
      datos.forEach((d, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${i + 1}</td><td>${d.m.toFixed(2)}</td><td>${d.k.toFixed(2)}</td><td>${d.F.toFixed(2)}</td><td>${d.x.toFixed(3)}</td>`;
        tabla.appendChild(row);
      });
    }

    function reset() {
      datos = [];
      xActual = 0;
      animando = false;
      actualizarTabla();
      dibujar(0, 0);
    }

    document.getElementById("applyBtn").addEventListener("click", simular);
    document.getElementById("resetBtn").addEventListener("click", reset);
    actualizar();
    dibujar(0, 0);
  }
})();
