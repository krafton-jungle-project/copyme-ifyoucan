import type * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

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

export function comparePoses(pose1: poseDetection.Pose, pose2: poseDetection.Pose): number {
  // Deep copy 후 cmpPose 진행, shallow copy 진행 시, 캔버스에 skelton을 그릴 때
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
