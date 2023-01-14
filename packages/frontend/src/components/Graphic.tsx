import dayjs from "dayjs";
import React from "react";

import styles from "../styles/pages/Profile.module.scss";

function Graphic({ graphData, theme }) {
  const canvas = React.useRef<HTMLCanvasElement>();

  const run = React.useCallback(() => {
    if (!canvas.current) return;
    const data = [];
    for (const key in graphData) {
      data.push(graphData[key]);
    }
    const ctx: CanvasRenderingContext2D = canvas.current.getContext("2d");
    const width = canvas.current.clientWidth;
    const height = canvas.current.clientHeight;
    const viewWidth = width * 2;
    const viewHeight = height * 2;
    const paddingYbottom = 60;
    const paddingYsum = 100;
    const paddingX = 60;
    canvas.current.width = viewWidth;
    canvas.current.height = viewHeight;

    const [yMax] = getMaxMin();
    const yRatio = (viewHeight - paddingYsum) / (yMax || 1);
    const xRatio = (viewWidth - 2 * paddingX) / (data.length - 1);

    const dateMas = [];
    for (let i = 0; i < 7; i++) {
      dateMas.unshift(dayjs.unix(dayjs(new Date()).unix() - 86400 * i).format("DD.MM"));
    }

    drawRows();
    drawColumns();
    drawData();

    function getMaxMin() {
      const mas = [];
      data.forEach((e) => {
        mas.push(e);
      });
      const max = Math.max(...mas);
      const min = Math.min(...mas);
      return [max, min];
    }

    function drawRows() {
      const step = (viewHeight - paddingYsum) / 4;
      const ifNullYmax = [0, 1, 2, 3, 4];
      ctx.beginPath();
      ctx.strokeStyle = theme === "dark" ? "#68676f" : "#e4e4e4";
      ctx.textAlign = "end";
      ctx.fillStyle = theme === "dark" ? "#e6e6e6" : "#3c3c3c";
      ctx.font = "normal 20px Inter";
      for (let i = 0; i < 5; i++) {
        const y = viewHeight - paddingYbottom - step * i;
        const num = i * step * (yMax / (viewHeight - paddingYsum));
        const text = yMax === 0 ? ifNullYmax[i] : +num.toFixed(4) % 1 == 0 ? num.toFixed(0) : num.toFixed(2);
        ctx.fillText(`${text}`, paddingX - 8, y + 8);
        ctx.moveTo(paddingX, y);
        ctx.lineTo(viewWidth - paddingX, y);
      }
      ctx.stroke();
      ctx.closePath();
    }

    function drawColumns() {
      const step = (viewWidth - paddingX * 2) / 6;
      ctx.beginPath();
      ctx.font = "normal 20px Inter";
      ctx.textAlign = "center";
      for (let i = 0; i < 7; i++) {
        const x = paddingX + step * i;
        ctx.fillText(dateMas[i], x, viewHeight - 25);
      }
      ctx.stroke();
      ctx.closePath();
    }

    function drawData() {
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#7c7ce4";
      data.forEach((y, i) => {
        ctx.lineTo(paddingX + i * xRatio, viewHeight - paddingYbottom - y * yRatio);
      });
      ctx.stroke();
      ctx.closePath();
    }
  }, [graphData, theme]);

  React.useEffect(() => {
    run();
    window.addEventListener("resize", run);
    return () => window.removeEventListener("resize", run);
  }, [run]);

  return (
    <div className={styles.canvas_container}>
      <canvas ref={canvas}></canvas>
    </div>
  );
}

export default Graphic;
