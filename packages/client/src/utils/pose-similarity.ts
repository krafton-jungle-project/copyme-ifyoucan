import type * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

const stdPose: poseDetection.Pose = {
  keypoints: [
    {
      y: 15.844368528726578,
      x: 165.7098786733583,
      score: 0.777631938457489,
      name: 'nose',
    },
    {
      y: 12.5437938066986,
      x: 171.01245007422483,
      score: 0.7810917496681213,
      name: 'left_eye',
    },
    {
      y: 12.056964653149468,
      x: 160.92977366246987,
      score: 0.8350298404693604,
      name: 'right_eye',
    },
    {
      y: 19.608600210213105,
      x: 177.18774016583694,
      score: 0.7721454501152039,
      name: 'left_ear',
    },
    {
      y: 19.224320593014802,
      x: 154.5143924134911,
      score: 0.6346286535263062,
      name: 'right_ear',
    },
    {
      y: 49.80612215141936,
      x: 191.4848714620821,
      score: 0.8914048671722412,
      name: 'left_shoulder',
    },
    {
      y: 50.255960630894045,
      x: 141.405863473505,
      score: 0.8338426351547241,
      name: 'right_shoulder',
    },
    {
      y: 65.58269100828977,
      x: 223.37945426718892,
      score: 0.8739467859268188,
      name: 'left_elbow',
    },
    {
      y: 64.71406025165709,
      x: 105.73902503515632,
      score: 0.739861249923706,
      name: 'right_elbow',
    },
    {
      y: 70.36016806153422,
      x: 258.2772639111415,
      score: 0.7727532982826233,
      name: 'left_wrist',
    },
    {
      y: 68.40301830852565,
      x: 68.37802201055078,
      score: 0.4832562804222107,
      name: 'right_wrist',
    },
    {
      y: 119.33645187728143,
      x: 179.009017406063,
      score: 0.856987714767456,
      name: 'left_hip',
    },
    {
      y: 119.13639564222093,
      x: 150.49688440877094,
      score: 0.7852920889854431,
      name: 'right_hip',
    },
    {
      y: 176.3822544977228,
      x: 177.5845696618441,
      score: 0.8080315589904785,
      name: 'left_knee',
    },
    {
      y: 178.26349336611415,
      x: 158.68104687921357,
      score: 0.7015287280082703,
      name: 'right_knee',
    },
    {
      y: 216.05530782551068,
      x: 169.63797298406524,
      score: 0.32375526428222656,
      name: 'left_ankle',
    },
    {
      y: 215.1502328995088,
      x: 157.35223153958887,
      score: 0.34621304273605347,
      name: 'right_ankle',
    },
  ],
  score: 0.7186706556993372,
};

// euclideanDistance 함수
const euclideanDistance = (kp1: poseDetection.Keypoint, kp2: poseDetection.Keypoint): number =>
  Math.sqrt(Math.pow(kp1.x - kp2.x, 2) + Math.pow(kp1.y - kp2.y, 2));

// scaling 함수
const resizePose = (pose: poseDetection.Pose) => {
  // 양쪽 어깨 좌표 받아옴, 어깨가 가장 인식이 잘 되므로 어깨로 선정하겠슴다
  const leftShoulder = pose.keypoints[5];
  const rightShoulder = pose.keypoints[6];

  // 어깨 간의 유클리디안 거리 계산
  // 직각 삼각형에서 빗변 구하는 공식이라고 보면 됨
  const shoulderDist: number = euclideanDistance(leftShoulder, rightShoulder);

  // 어깨 거리에 따라 이미지의 스케일 계수를 결정
  // 기준이 되는(우리에게는 공격자) 사람의 키포인트를 스케일링 함수에 넣어 스케일 계수 설정 후 아래 진행
  const scaleFactor: number = 1 / shoulderDist;

  // 키포인트의 좌표 값을 스케일 계수에 따라 보정
  for (const keypoint of pose.keypoints) {
    keypoint.x *= scaleFactor;
    keypoint.y *= scaleFactor;
  }
};

/**
 *
 * @param {*} pose1 : 공격자 (채점 기준)
 * @param {*} pose2 : 수비자 (채점)
 * @returns 공격자 기준에 맞춘 수비자의 pose2
 */
// 사각형 산술평균 중심
function squareCenter(
  a: poseDetection.Keypoint,
  b: poseDetection.Keypoint,
  c: poseDetection.Keypoint,
  d: poseDetection.Keypoint,
): number[] {
  return [(a.x + b.x + c.x + d.x) / 4, (a.y + b.y + c.y + d.y) / 4];
}
/**
 *
 * @param {*} pose1 : 공격자 (채점 기준)
 * @param {*} pose2 : 수비자 (채점)
 * @returns 공격자 기준에 맞춘 수비자의 pose2
 */
function alignPose(pose1: poseDetection.Pose, pose2: poseDetection.Pose): poseDetection.Pose {
  // 5번: 왼쪽 어깨
  // 6번: 오른쪽 어깨
  // 11번: 왼쪽 골반
  // 12번: 오른쪽 골반

  // 공격자 몸통 (평가 기준)
  let leftHip1 = pose1.keypoints[11];
  let rightHip1 = pose1.keypoints[12];
  let leftShoulder1 = pose1.keypoints[5];
  let rightShoulder1 = pose1.keypoints[6];

  // 수비자 몸통 (채점 해야함)
  let leftHip2 = pose2.keypoints[11];
  let rightHip2 = pose2.keypoints[12];
  let leftShoulder2 = pose2.keypoints[5];
  let rightShoulder2 = pose2.keypoints[6];

  // 몸통의 산술 평균 중심으로 pose2를 pose1의 몸통 중심으로 옮기기 위한 substract factor 설정
  let center1 = squareCenter(leftHip1, rightHip1, leftShoulder1, rightShoulder1);
  let center2 = squareCenter(leftHip2, rightHip2, leftShoulder2, rightShoulder2);

  // 2번 포즈의 중심을 1번 포즈의 중심으로 옮기는 translation factor
  let translation = {
    x: center1[0] - center2[0],
    y: center1[1] - center2[1],
  };

  // 2번 포즈의 모든 점들을 translation factor에 따라 평행 이동 시킴
  for (const keypoint of pose2.keypoints) {
    keypoint.x += translation.x;
    keypoint.y += translation.y;
  }

  return pose2;
}

export function comparePoses(pose1: poseDetection.Pose, pose3: poseDetection.Pose): number {
  // Deep copy 후 cmpPose 진행, shallow copy 진행 시, 캔버스에 skelton을 그릴 때
  // resizing된 점들을 토대로 그리기 때문에 제대로 그려지지 않음

  // 일단 기준 포즈와 채점
  pose1 = stdPose;
  let pose2 = JSON.parse(JSON.stringify(pose3));
  resizePose(pose1);
  resizePose(pose2);

  // 어깨와 골반 총 4개의 점을 이용하여 몸통의 중심을 기준으로 pose를 align함
  let alignedPose1 = alignPose(pose1, pose1);
  let alignedPose2 = alignPose(pose1, pose2);

  // align 후에 같은 신체 부위의 점들의 차의 평균 거리를 구함
  // 포즈 1의 한 점과 포즈 2의 한 점의 유클리디안 거리를 구해서 totalDistance 합함
  let totalDistance = 0;
  for (let i = 0; i < alignedPose1.keypoints.length; i++) {
    let joint1 = alignedPose1.keypoints[i];
    let joint2 = alignedPose2.keypoints[i];
    let distance = euclideanDistance(joint1, joint2);
    totalDistance += distance;
  }

  // (점들의 차의 합) / (점의 개수)
  // totalDistance / 17
  let averageDistance = totalDistance / alignedPose1.keypoints.length;

  return Math.ceil(averageDistance >= 1 ? 0 : 100 - 100 * averageDistance);
}

// 각 스트림에서 추출한 pose object 넣으시면 됩니다 ㅎㅎ;
// Usage: comparePoses(공격자, 수비자)
// comparePoses(stdPose, pose4);

// // 다각형 무게중심 코드
// function getCentroid(points: poseDetection.Keypoint[]) {
//   let area = 0,
//     cx = 0,
//     cy = 0;

//   for (let i = 0; i < points.length; i++) {
//     let j = (i + 1) % points.length;

//     let pt1 = points[i];
//     let pt2 = points[j];

//     let x1 = pt1[0];
//     let x2 = pt2[0];
//     let y1 = pt1[1];
//     let y2 = pt2[1];

//     area += x1 * y2;
//     area -= y1 * x2;

//     cx += (x1 + x2) * (x1 * y2 - x2 * y1);
//     cy += (y1 + y2) * (x1 * y2 - x2 * y1);
//   }

//   area /= 2;
//   area = Math.abs(area);

//   cx = cx / (6.0 * area);
//   cy = cy / (6.0 * area);

//   return {
//     x: Math.abs(cx),
//     y: Math.abs(cy),
//   };
// }
