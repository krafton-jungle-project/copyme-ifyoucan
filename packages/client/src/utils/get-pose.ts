import type * as poseDetection from '@tensorflow-models/pose-detection';
import * as movenet from './tfjs-movenet';

//todo: my peer 구분
async function getPose(): Promise<poseDetection.Pose> {
  let pose: poseDetection.Pose;
  const poses = await movenet.detector.estimatePoses(movenet.myCamera.video);
  pose = poses[0];
  return pose;
}

export default getPose;
