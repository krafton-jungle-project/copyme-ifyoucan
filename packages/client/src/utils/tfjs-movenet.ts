import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

interface MovenetParam {
  size: {
    width: number;
    height: number;
  };
  element: {
    video: HTMLVideoElement;
    canvas: HTMLCanvasElement;
  };
  canvasRender: boolean;
  peerStream?: MediaStream;
}

const POSE_DETECTION_MODEL = poseDetection.SupportedModels.MoveNet; // 이미지로 부터 자세를 추정하는 모델: TensorFlow Movenet
const POSE_DETECTION_MODEL_TYPE = poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING; // 모델 상세 타입: Single Pose(한 명), Lightning(정확도 보단 인식 속도에 중점)
export const SCORE_THRESSHOLD = 0.3; // key point의 score(인식 정확도)의 최소 인정 기준 (score: 0 ~ 1)

const KEYPOINT_COLOR_ROUND = 'white'; // 원으로 표현되는 key point의 둘레 색상
const SKELEOTON_COLOR = 'white'; // 골격의 색상

const KEYPOINT_COLOR_FILL_CENTER = 'Red'; // 신체의 가운데에 해당하는 key point(코가 유일)의 색상
const KEYPOINT_COLOR_FILL_LEFT = 'Green'; // 신체의 왼쪽 부분에 해당하는 key point의 색상
const KEYPOINT_COLOR_FILL_RIGHT = 'Orange'; // 신체의 오른쪽 부분에 해당하는 key point의 색상

const KEYPOINT_RADIUS = 4; // key point의 반지름(원의 크기)
const LINE_WIDTH = 2; // key point의 둘레 및 골격의 두께

export let stream: MediaStream;
export let detector: poseDetection.PoseDetector;

export let myCamera: Camera;
export let peerCamera: Camera;

export let myRafId: number;
export let peerRafId: number;

class Camera {
  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(videoElem: HTMLVideoElement, canvasElem: HTMLCanvasElement) {
    this.video = videoElem;
    this.canvas = canvasElem;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  static async setupCamera(movenetParam: MovenetParam) {
    const camera = new Camera(movenetParam.element.video, movenetParam.element.canvas);

    if (!movenetParam.peerStream) {
      camera.video.srcObject = stream; // webcam live stream
    } else {
      camera.video.srcObject = movenetParam.peerStream;
    }

    await new Promise((resolve) => {
      // video의 metadata가 load 완료되면
      camera.video.onloadedmetadata = () => {
        resolve(camera.video);
      };
    });
    camera.video.play(); // video를 재생

    // 재생하는 video(영상)의 너비와 높이
    const videoWidth: number = movenetParam.size.width;
    const videoHeight: number = movenetParam.size.height;

    // Must set below two lines, otherwise video element doesn't show.
    // html video 요소의 너비와 높이
    camera.video.width = videoWidth;
    camera.video.height = videoHeight;

    // html canvas 요소의 너비와 높이
    camera.canvas.width = videoWidth;
    camera.canvas.height = videoHeight;

    // Because the image from camera is mirrored, need to flip horizontally.
    camera.ctx.translate(camera.video.videoWidth, 0);
    camera.ctx.scale(-1, 1);

    return camera;
  }

  // 캔버스에 비디오에 한 프레임(이미지)을 그리는(덮어씌우는) 함수
  drawCtx() {
    this.ctx.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
  }

  // 캔버스에 그려진 비디오 프레임에 인식된 동작을 그리는 함수
  drawResult(pose: poseDetection.Pose) {
    if (pose.keypoints !== null) {
      this.drawKeypoints(pose.keypoints);
      this.drawSkeleton(pose.keypoints);
    }
  }

  // 캔버스에 인식된 점들을 그리는 함수.
  drawKeypoints(keypoints: poseDetection.Keypoint[]) {
    const keypointInd = poseDetection.util.getKeypointIndexBySide(POSE_DETECTION_MODEL);
    this.ctx.strokeStyle = KEYPOINT_COLOR_ROUND;
    this.ctx.lineWidth = LINE_WIDTH;

    this.ctx.fillStyle = KEYPOINT_COLOR_FILL_CENTER;
    for (const i of keypointInd.middle) {
      if (i > 4) this.drawKeypoint(keypoints[i]);
    }

    this.ctx.fillStyle = KEYPOINT_COLOR_FILL_LEFT;
    for (const i of keypointInd.left) {
      if (i > 4) this.drawKeypoint(keypoints[i]);
    }

    this.ctx.fillStyle = KEYPOINT_COLOR_FILL_RIGHT;
    for (const i of keypointInd.right) {
      if (i > 4) this.drawKeypoint(keypoints[i]);
    }
  }

  // 인식된 점 하나를 캔버스에 그리는 함수.
  drawKeypoint(keypoint: poseDetection.Keypoint) {
    // If score is null, just show the keypoint.
    const score = keypoint.score != null ? keypoint.score : 1;

    // key point score(추정 정확도)가 SCORE_THRESSHOLD 이상일 때, key point를 그린다.
    if (score >= SCORE_THRESSHOLD) {
      const circle = new Path2D();
      circle.arc(keypoint.x, keypoint.y, KEYPOINT_RADIUS, 0, 2 * Math.PI);
      this.ctx.fill(circle);
      this.ctx.stroke(circle);
    }
  }

  // 인식된 key points를 연결하는 골격을 그린다.
  drawSkeleton(keypoints: poseDetection.Keypoint[]) {
    this.ctx.fillStyle = SKELEOTON_COLOR;
    this.ctx.strokeStyle = SKELEOTON_COLOR;
    this.ctx.lineWidth = LINE_WIDTH;

    // 서로 연결된 랜드마크들의 쌍을 얻는다. 두 점을 연결하면 하나의 뼈대가 된다.
    poseDetection.util.getAdjacentPairs(POSE_DETECTION_MODEL).forEach(([i, j]) => {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];

      // If score is null(undefined), just show the keypoint.
      const score1: number = kp1.score !== undefined ? kp1.score : 1;
      const score2: number = kp2.score !== undefined ? kp2.score : 1;

      // 두 key points의 score(추정 정확도)가 모두 SCORE_THRESSHOLD 이상일 때, 두 key points를 선으로 연결한다.
      if (i > 4 && j > 4 && score1 >= SCORE_THRESSHOLD && score2 >= SCORE_THRESSHOLD) {
        this.ctx.beginPath();
        this.ctx.moveTo(kp1.x, kp1.y);
        this.ctx.lineTo(kp2.x, kp2.y);
        this.ctx.stroke();
      }
    });
  }
}

// 비디오에서 인식된 자세를 바탕으로 캔버스 위에 해당 프레임과 인식된 점 및 골격을 그려주는 함수
async function renderResult(camera: Camera) {
  // readyState가 2 이상이면 현재 한 frame이 재생 가능하다.
  if (camera.video.readyState < 2) {
    // 아직 frame에 대한 data가 도달하지 않았다면
    await new Promise((resolve) => {
      // 현재 frame에 대한 데이터가 로드될 때 onloadeddata 이벤트 발생
      camera.video.onloadeddata = () => {
        resolve(camera.video);
      };
    });
  }

  let pose = null;

  const poses = await detector.estimatePoses(camera.video); // 여러 사람의 포즈들의 배열이 return
  if (poses && poses.length > 0) {
    pose = poses[0]; // 한 비디오에서는 한 사람의 포즈만 인식하도록 설정해놓아서 배열의 0번째 원소가 인식된 pose이다.
  }

  camera.drawCtx(); // video의 한 frame 이미지를 캔버스 위에 그림

  if (pose) {
    camera.drawResult(pose); // video frame 위에 keypoints와 skeleton을 그림
  }
}

async function myRenderDetection() {
  await renderResult(myCamera); // 한 프레임을 캔버스에 그려준다
  myRafId = requestAnimationFrame(myRenderDetection); // 재귀 호출을 통해 실시간으로 renderDetection을 실행
}

async function peerRenderDetection() {
  await renderResult(peerCamera); // 한 프레임을 캔버스에 그려준다
  peerRafId = requestAnimationFrame(peerRenderDetection); // 재귀 호출을 통해 실시간으로 renderDetection을 실행
}

export async function myCanvasRender(movenetParam: MovenetParam) {
  myCamera = await Camera.setupCamera(movenetParam);

  // detector가 생성된 이후에 자세를 추정하여 인식된 랜드마크와 골격을 canvas에 그린다.
  if (movenetParam.canvasRender) {
    myRenderDetection();
  }
}

export async function peerCanvasRender(movenetParam: MovenetParam) {
  peerCamera = await Camera.setupCamera(movenetParam);

  // detector가 생성된 이후에 자세를 추정하여 인식된 랜드마크와 골격을 canvas에 그린다.
  if (movenetParam.canvasRender) {
    peerRenderDetection();
  }
}

// 웹캠 스트림을 생성하여 반환하는 함수
export async function getMyStream(param: { width: number; height: number }) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
  }

  const videoConfig = {
    audio: false,
    video: {
      width: param.width,
      height: param.height,
    },
  };
  stream = await navigator.mediaDevices.getUserMedia(videoConfig);

  return stream;
}

// Pose Detector를 생성하여 반환하는 함수
export async function createDetector() {
  detector = await poseDetection.createDetector(POSE_DETECTION_MODEL, {
    modelType: POSE_DETECTION_MODEL_TYPE,
  });

  return detector;
}
