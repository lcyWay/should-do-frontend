import React from "react";
import dayjs from "dayjs";
import styled from "styled-components";

import { Theme } from "pages/_app";

interface ChartInterface {
  graphData: Record<string, number>;
  theme: Theme;
}

function Chart({ graphData, theme }: ChartInterface) {
  const canvas = React.useRef<HTMLCanvasElement | null>(null);

  const drawChart = React.useCallback(() => {
    if (!canvas.current) return;
    const ctx = canvas.current.getContext("2d");
    if (ctx === null) return;

    const data: number[] = [];
    Object.keys(graphData).forEach((key) => data.push(graphData[key]));

    const width = canvas.current.clientWidth;
    const height = canvas.current.clientHeight;
    const viewWidth = width * 2;
    const viewHeight = height * 2;
    const paddingYbottom = 60;
    const paddingYsum = 100;
    const paddingX = 60;
    canvas.current.width = viewWidth;
    canvas.current.height = viewHeight;

    const yMax = Math.max(...data);
    const yRatio = (viewHeight - paddingYsum) / (yMax || 1);
    const xRatio = (viewWidth - 2 * paddingX) / (data.length - 1);

    const dateMas: string[] = [];
    for (let i = 0; i < 7; i++) {
      dateMas.unshift(dayjs.unix(dayjs(new Date()).unix() - 86400 * i).format("DD.MM"));
    }

    const rowStep = (viewHeight - paddingYsum) / 4;
    const ifNullYmax = [0, 1, 2, 3, 4];
    ctx.beginPath();
    ctx.strokeStyle = theme === "dark" ? "#68676f" : "#e4e4e4";
    ctx.textAlign = "end";
    ctx.fillStyle = theme === "dark" ? "#e6e6e6" : "#3c3c3c";
    ctx.font = "normal 20px Inter";
    for (let i = 0; i < 5; i++) {
      const y = viewHeight - paddingYbottom - rowStep * i;
      const num = i * rowStep * (yMax / (viewHeight - paddingYsum));
      const text = yMax === 0 ? ifNullYmax[i] : +num.toFixed(4) % 1 == 0 ? num.toFixed(0) : num.toFixed(2);
      ctx.fillText(`${text}`, paddingX - 8, y + 8);
      ctx.moveTo(paddingX, y);
      ctx.lineTo(viewWidth - paddingX, y);
    }
    ctx.stroke();
    ctx.closePath();

    const columnStep = (viewWidth - paddingX * 2) / 6;
    ctx.beginPath();
    ctx.font = "normal 20px Inter";
    ctx.textAlign = "center";
    for (let i = 0; i < 7; i++) {
      const x = paddingX + columnStep * i;
      ctx.fillText(dateMas[i], x, viewHeight - 25);
    }
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#7c7ce4";
    data.forEach((y, i) => {
      ctx.lineTo(paddingX + i * xRatio, viewHeight - paddingYbottom - y * yRatio);
    });
    ctx.stroke();
    ctx.closePath();
  }, [graphData, theme]);

  React.useEffect(() => {
    drawChart();
    window.addEventListener("resize", drawChart);
    return () => window.removeEventListener("resize", drawChart);
  }, [drawChart]);

  return (
    <CanvasContainer>
      <canvas ref={canvas}></canvas>
    </CanvasContainer>
  );
}

const CanvasContainer = styled("div")`
  display: flex;
  width: 100%;

  canvas {
    width: 100%;
  }
`;

export default React.memo(Chart);
