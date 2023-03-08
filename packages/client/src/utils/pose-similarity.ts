import type { Keypoint, Pose } from '@tensorflow-models/pose-detection';

// Usage Usage Usage Usage Usage Usage Usage Usage

// comparePoses(채점기준포즈, 수비자);
// vectorComparePoses(채점기준포즈, 수비자);
// cosineSimilarity(채점기준포즈, 수비자);

// euclideanDistance 함수
function euclideanDistance(kp1: Keypoint, kp2: Keypoint): number {
  return Math.sqrt(Math.pow(kp1.x - kp2.x, 2) + Math.pow(kp1.y - kp2.y, 2));
}

// 사각형 산술평균 중심
function squareCenter(a: Keypoint, b: Keypoint, c: Keypoint, d: Keypoint): number[] {
  return [(a.x + b.x + c.x + d.x) / 4, (a.y + b.y + c.y + d.y) / 4];
}

// // 다각형 무게중심 코드
// function getCentroid(points: Keypoint[]) {
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

/**
 * @param {*} pose1 : 공격자 (채점 기준)
 * @param {*} pose2 : 수비자 (채점)
 * @returns 공격자 기준에 맞춘 수비자의 pose2
 */
function alignPose(pose1: Pose, pose2: Pose): Pose {
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
// 여기까지 공통 사용 함수
// -----------------------------------------------

// -----------------------------------------------
// 공격자의 어깨 거리를 scaling factor로 이용한 계산 방법
function resizePose(pose: Pose): void {
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
}

function comparePoses(pose1: Pose, pose2: Pose): number {
  // Deep copy 후 cmpPose 진행, shallow copy 진행 시, 캔버스에 skeleton을 그릴 때
  // resizing된 점들을 토대로 그리기 때문에 제대로 그려지지 않음

  // 일단 기준 포즈와 채점
  // pose1 = stdPose;
  let myPose = JSON.parse(JSON.stringify(pose1));
  let peerPose = JSON.parse(JSON.stringify(pose2));
  resizePose(myPose);
  resizePose(peerPose);

  // 어깨와 골반 총 4개의 점을 이용하여 몸통의 중심을 기준으로 pose를 align함
  let alignedPose1 = alignPose(myPose, myPose);
  let alignedPose2 = alignPose(myPose, peerPose);

  // align 후에 같은 신체 부위의 점들의 차의 평균 거리를 구함
  // 포즈 1의 한 점과 포즈 2의 한 점의 유클리디안 거리를 구해서 totalDistance 합함
  let totalDistance = 0;
  for (let i = 5; i < alignedPose1.keypoints.length; i++) {
    let joint1 = alignedPose1.keypoints[i];
    let joint2 = alignedPose2.keypoints[i];
    let distance = euclideanDistance(joint1, joint2);
    totalDistance += distance;
  }

  // (점들의 차의 합) / (점의 개수)
  // totalDistance / 17
  let averageDistance = totalDistance / (alignedPose1.keypoints.length - 5);
  let score = Math.ceil(100 - 100 * averageDistance);
  // console.log('temp: ', averageDistance);
  return score > 0 ? score : 0;
}

// -----------------------------------------------
// vector vector vector vector vector vector vector
// 34차원 벡터 이용한 scaling factor 구하는 함수
function vectorScalingFactor(pose: Pose): number {
  const initCoordinate = {
    x: 0,
    y: 0,
  };
  let sum: number = 0;
  let keypoint: Keypoint;

  // 얼굴 키포인트 제외하고 scalingFactor 계산
  // for (let i = 0; i < pose.keypoints.length; i++) {
  for (let i = 5; i < pose.keypoints.length; i++) {
    keypoint = pose.keypoints[i];
    // (0, 0)과 모든 신체 키포인트에 대한 거리의 제곱들을 모두 더함
    sum += euclideanDistance(keypoint, initCoordinate) ** 2;
  }
  // 다 더한 값에 제곱근을 씌우고 계산한 키포인트 개수만큼 나눔
  // const scalingFactor: number = sum ** 0.5 / (pose.keypoints.length - 5);
  const scalingFactor: number = sum ** 0.5;

  return scalingFactor;
}

// vector scaling 함수
function vectorResizePose(pose: Pose, scalingFactor: number): void {
  // 키포인트의 좌표 값을 스케일 계수에 따라 보정
  for (const keypoint of pose.keypoints) {
    keypoint.x /= scalingFactor;
    keypoint.y /= scalingFactor;
  }
}

function vectorComparePoses(pose1: Pose, pose2: Pose): number {
  // Deep copy 후 cmpPose 진행, shallow copy 진행 시, 캔버스에 skeleton을 그릴 때
  // resizing된 점들을 토대로 그리기 때문에 제대로 그려지지 않음

  const scalingFactor1 = vectorScalingFactor(pose1);
  const scalingFactor2 = vectorScalingFactor(pose2);

  let myPose = JSON.parse(JSON.stringify(pose1));
  let peerPose = JSON.parse(JSON.stringify(pose2));

  // 모든 좌표의 제곱의 합을 1로 만듦
  vectorResizePose(myPose, scalingFactor1);
  vectorResizePose(peerPose, scalingFactor2);

  // 어깨와 골반 총 4개의 점을 이용하여 몸통의 중심을 기준으로 pose를 align함
  let alignedPose1 = alignPose(myPose, myPose);
  let alignedPose2 = alignPose(myPose, peerPose);

  // align 후에 같은 신체 부위의 점들의 차의 평균 거리를 구함
  // 포즈 1의 한 점과 포즈 2의 한 점의 유클리디안 거리를 구해서 totalDistance 합함
  let totalDistance = 0;
  for (let i = 5; i < alignedPose1.keypoints.length; i++) {
    let joint1 = alignedPose1.keypoints[i];
    let joint2 = alignedPose2.keypoints[i];
    let distance = euclideanDistance(joint1, joint2);
    totalDistance += distance;
  }

  // (점들의 차의 합) / (점의 개수)
  // totalDistance / 17
  let averageDistance = totalDistance / (alignedPose1.keypoints.length - 5);
  let score = Math.ceil(100 - 1000 * averageDistance);
  // console.log('vector: ', averageDistance);
  return score;
}

function cosineSimilarity(pose1: Pose, pose2: Pose): number {
  resizePose(pose1);
  resizePose(pose2);
  const keypoints1 = pose1.keypoints;
  const keypoints2 = pose2.keypoints;

  const xCoords1 = keypoints1.map((keypoint) => keypoint.x);
  const yCoords1 = keypoints1.map((keypoint) => keypoint.y);
  const xCoords2 = keypoints2.map((keypoint) => keypoint.x);
  const yCoords2 = keypoints2.map((keypoint) => keypoint.y);

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  for (let i = 0; i < xCoords1.length; i++) {
    dotProduct += xCoords1[i] * xCoords2[i] + yCoords1[i] * yCoords2[i];
    mag1 += xCoords1[i] ** 2 + yCoords1[i] ** 2;
    mag2 += xCoords2[i] ** 2 + yCoords2[i] ** 2;
  }

  const similarity = dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
  return (similarity + 1) * 50;
}

export { comparePoses, vectorComparePoses, cosineSimilarity };
