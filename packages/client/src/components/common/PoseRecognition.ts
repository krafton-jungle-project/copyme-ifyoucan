import type { Pose } from '@tensorflow-models/pose-detection';
import { SCORE_THRESSHOLD } from '../../utils/tfjs-movenet';

function getAngle(p1: any, p2: any, p3: any) {
  const dx1 = p2.x - p1.x;
  const dy1 = p2.y - p1.y;
  const dx2 = p2.x - p3.x;
  const dy2 = p2.y - p3.y;

  const abs1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  const abs2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

  const dp = dx1 * dx2 + dy1 * dy2;
  return Math.acos(dp / (abs1 * abs2)) * (180 / Math.PI);
}

// 모든 신체 키포인트가 잘 나오는지 확인
export function isValidBody(pose: Pose): boolean {
  for (let i = 5; i < pose.keypoints.length; i++) {
    if ((pose.keypoints[i].score as number) < SCORE_THRESSHOLD) {
      return false;
    }
  }
  return true;
}

export function isLeftHandUp(pose: Pose, minAngle: number = 0): boolean {
  const leftHip = pose.keypoints[11];
  const leftShoulder = pose.keypoints[5];
  const leftElbow = pose.keypoints[7];
  const leftWrist = pose.keypoints[9];

  // 손목이 팔꿈치와 어깨 위에 있을 때 && 왼쪽 골반, 어깨, 팔꿈치가 이루는 각이 0도 보다 커야함
  // 근데 얘는 왜 손목보다 팔꿈치가 아래 있을 때를 게산할까?? -> y 좌표 위에서부터 내려옴

  // 빡센 조건
  // const isHandUp = leftWrist.y - leftElbow.y < 0 && leftWrist.y - leftShoulder.y < 0;
  const isHandUp = leftWrist.y - leftShoulder.y < 0;
  const angle = getAngle(leftElbow, leftShoulder, leftHip);

  if (isHandUp && angle >= minAngle) {
    return true;
  }
  return false;
}

export function isRightHandUp(pose: Pose, minAngle: number = 0): boolean {
  const rightHip = pose.keypoints[12];
  const rightShoulder = pose.keypoints[6];
  const rightElbow = pose.keypoints[8];
  const rightWrist = pose.keypoints[10];

  const isHandUp = rightWrist.y - rightElbow.y < 0;
  const angle = getAngle(rightElbow, rightShoulder, rightHip);

  if (isHandUp && angle >= minAngle) {
    return true;
  }
  return false;
}

export function isTPose(pose: Pose, minAngle: number): boolean {
  const rightShoulder = pose.keypoints[6];
  const rightElbow = pose.keypoints[8];
  const rightWrist = pose.keypoints[10];
  const rightHip = pose.keypoints[12];

  const leftShoulder = pose.keypoints[5];
  const leftElbow = pose.keypoints[7];
  const leftWrist = pose.keypoints[9];
  const leftHip = pose.keypoints[11];

  const isAlignedArm =
    leftWrist.x > leftElbow.x &&
    leftElbow.x > leftShoulder.x &&
    leftShoulder.x > rightShoulder.x &&
    rightShoulder.x > rightElbow.x &&
    rightElbow.x > rightWrist.x;

  const leftAngle = getAngle(leftHip, leftShoulder, leftElbow);
  const rightAngle = getAngle(rightHip, rightShoulder, rightElbow);

  if (isAlignedArm && leftAngle >= minAngle && rightAngle >= minAngle) {
    return true;
  }
  return false;
}

export function isSDRPose(pose: Pose, minAngle: number = 0): boolean {
  const leftShoulder = pose.keypoints[5];
  const leftElbow = pose.keypoints[7];
  const leftWrist = pose.keypoints[9];

  const rightShoulder = pose.keypoints[6];
  const rightElbow = pose.keypoints[8];
  const rightWrist = pose.keypoints[10];

  const leftAngle = getAngle(leftWrist, leftElbow, leftShoulder);
  const rightAngle = getAngle(rightWrist, rightElbow, rightShoulder);

  if (
    leftAngle > minAngle &&
    rightAngle > minAngle &&
    leftElbow.y - leftWrist.y < 0 &&
    rightElbow.y - rightWrist.y > 0
  ) {
    return true;
  }
  return false;
}
