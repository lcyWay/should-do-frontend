import dayjs from 'dayjs';
import React from 'react'

import styles from '../styles/pages/Profile.module.scss'

function Graphic(graphData, theme) {
  const canvas = React.useRef<HTMLCanvasElement>();

  React.useEffect(() => {
    run();
  }, [])

  function run() {
    const data = [];
    for (const key in graphData) {
      data.push(graphData[key])
    }
    const ctx: CanvasRenderingContext2D = canvas.current.getContext('2d');
    const width = canvas.current.clientWidth;
    const height = canvas.current.clientHeight;
    const viewWidth = width * 2
    const viewHeight = height * 2
    const padding = 60;
    canvas.current.width = viewWidth;
    canvas.current.height = viewHeight;

    const [yMax, yMin] = getMaxMin();
    const yRatio = (viewHeight - 2 * padding) / (yMax || 1);
    const xRatio = (viewWidth - 2 * padding) / (data.length - 1);

    const dateMas = [];
    for (let i = 0; i < 7; i++) {
      dateMas.unshift(dayjs.unix(dayjs(new Date()).unix() - 86400 * i).format('DD.MM'))
    }

    drawText();
    drawRows();
    drawColumns();
    drawData();

    function drawText() {
      ctx.beginPath();
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#3c3c3c';
      ctx.font = 'normal 26px "Open Sans"'
      ctx.fillText(`Weekly progress: complited objectives`, viewWidth / 2, 40);
      ctx.stroke();
      ctx.closePath();
    }

    function getMaxMin() {
      const mas = [];
      data.forEach(e => {
        mas.push(e);
      });
      const max = Math.max(...mas);
      const min = Math.min(...mas);
      return [max, min]
    }

    function drawRows() {
      const step = (viewHeight - padding * 2) / 4;
      const ifNullYmax = [0, 1, 2, 3, 4];
      ctx.beginPath();
      ctx.strokeStyle = 'gray';
      ctx.textAlign = 'end';
      ctx.font = 'normal 24px sans-serif'
      for (let i = 0; i < 5; i++) {
        const y = (viewHeight - padding) - (step * i);
        const num = i * step * (yMax / (viewHeight - 2 * padding))
        const text = yMax === 0 ? ifNullYmax[i] : num % 1 == 0 ? num : num.toFixed(2);
        ctx.fillText(`${text}`, padding - 8, y + 8)
        ctx.moveTo(padding, y)
        ctx.lineTo(viewWidth - padding, y)
      }
      ctx.stroke();
      ctx.closePath();
    }

    function drawColumns() {
      const step = (viewWidth - padding * 2) / 6;
      ctx.beginPath();
      ctx.font = 'normal 24px sans-serif'
      ctx.textAlign = 'center';
      for (let i = 0; i < 7; i++) {
        const x = padding + (step * i);
        ctx.fillText(dateMas[i], x, viewHeight - 25)
      }
      ctx.stroke();
      ctx.closePath();
    }

    function drawData() {
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = theme === 'dark' ? 'rgb(60, 60, 60)' : 'rgb(0, 112, 243)';
      data.forEach((y, i) => {
        ctx.lineTo(padding + i * xRatio, viewHeight - padding - y * yRatio)
      });
      ctx.stroke();
      ctx.closePath();
    }
  }

  return (
    <div className={styles.canvas_container}>
      <canvas className={styles.canvas_container} ref={canvas}></canvas>
    </div>
  )
}

export default Graphic
