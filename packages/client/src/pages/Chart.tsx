import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useInterval } from '../components/inGame/hooks/useInterval';
import { gVideoRefAtom } from '../types/graph';
import { compareBeforeAfter } from '../utils/forTechChallenge';
import { detector } from '../utils/tfjs-movenet';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

function Chart({ start }: { start: boolean }) {
  const videoCurrent = useAtomValue(gVideoRefAtom);
  const [delay, setDelay] = useState<number | null>(null);

  const [data, setData] = useState({
    type: 'line',
    labels: [''],
    datasets: [
      {
        label: 'Before',
        data: [100],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'After',
        data: [50],
        borderColor: 'rgb(99, 164, 255)',
        backgroundColor: 'rgba(163, 206, 234, 0.5)',
        tension: 0.4,
        fill: true,
      },
    ],
  });

  useEffect(() => {
    if (start) {
      setDelay(1000);
    } else {
      setDelay(null);
    }
  }, [start]);

  useInterval(async () => {
    const getMyPose = async () => {
      if (videoCurrent) {
        const poses = await detector.estimatePoses(videoCurrent);
        if (poses && poses.length) {
          return poses[0];
        }
      }
    };

    const pose = await getMyPose();
    console.log(pose);

    if (pose) {
      const asdf = compareBeforeAfter(pose);
      setData({
        ...data,
        labels: [...data.labels, ''],
        datasets: [
          {
            label: 'Before',
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            data: [...data.datasets[0].data, asdf[0]],
            tension: 0.4,
            fill: true,
          },
          {
            label: 'After',
            borderColor: 'rgb(99, 164, 255)',
            backgroundColor: 'rgba(163, 206, 234, 0.5)',
            data: [...data.datasets[1].data, asdf[1]],
            tension: 0.4,
            fill: true,
          },
        ],
      });
    }
  }, delay);

  return (
    <>
      <Line options={options} data={data} />
    </>
  );
}

export default Chart;
