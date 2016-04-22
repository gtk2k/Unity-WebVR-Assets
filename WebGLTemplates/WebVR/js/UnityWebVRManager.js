var vrHMD, vrSensor;
var fullscreenchange = canvas.requestFullscreen ? 'fullscreenchange' : 'webkitfullscreenchange';

function vrFullScreen() {
  if (!vrHMD) {
    alert('Not ready VRDevice');
    return;
  }
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen({ vrDisplay: vrHMD });
  } else if (canvas.webkitRequestFullscreen) {
    canvas.webkitRequestFullscreen({ vrDisplay: vrHMD });
  }
}

document.addEventListener(fullscreenchange, function (event) {
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    SendMessage('WebVRCameraSet', 'changeMode', 'vr');
  } else {
    SendMessage('WebVRCameraSet', 'changeMode', 'normal');
  }
}, false);

function getVRDevices() {
  if (navigator.getVRDevices) {
    navigator.getVRDevices().then(function (devices) {
      for (var i = 0; i < devices.length; i++) {
        if (devices[i] instanceof HMDVRDevice) {
          vrHMD = devices[i];
          getEyeParameters();
          break;
        }
      }
      for (var i = 0; i < devices.length; i++) {
        if (devices[i] instanceof PositionSensorVRDevice &&
          vrHMD.hardwareUnitId == devices[i].hardwareUnitId) {
          vrSensor = devices[i];
          getVRSensorState();
          break;
        }
      }
    });
  }
}

function getEyeParameters() {
  var eyeParamsL = vrHMD.getEyeParameters('left');
  var eyeParamsR = vrHMD.getEyeParameters('right');

  var eyeTranslationL = eyeParamsL.eyeTranslation;
  var eyeTranslationR = eyeParamsR.eyeTranslation;
  var eyeFOVL = eyeParamsL.recommendedFieldOfView;
  var eyeFOVR = eyeParamsR.recommendedFieldOfView;

  SendMessage('WebVRCameraSet', 'eyeL_translation_x', eyeTranslationL.x);
  SendMessage('WebVRCameraSet', 'eyeR_translation_x', eyeTranslationR.x);
  SendMessage('WebVRCameraSet', 'eyeL_fovUpDegrees', eyeFOVL.upDegrees);
  SendMessage('WebVRCameraSet', 'eyeL_fovDownDegrees', eyeFOVL.downDegrees);
  SendMessage('WebVRCameraSet', 'eyeL_fovLeftDegrees', eyeFOVL.leftDegrees);
  SendMessage('WebVRCameraSet', 'eyeL_fovRightDegrees', eyeFOVL.rightDegrees);
  SendMessage('WebVRCameraSet', 'eyeR_fovUpDegrees', eyeFOVR.upDegrees);
  SendMessage('WebVRCameraSet', 'eyeR_fovDownDegrees', eyeFOVR.downDegrees);
  SendMessage('WebVRCameraSet', 'eyeR_fovLeftDegrees', eyeFOVR.leftDegrees);
  SendMessage('WebVRCameraSet', 'eyeR_fovRightDegrees', eyeFOVR.rightDegrees);
}

function getVRSensorState() {
  requestAnimationFrame(getVRSensorState);
  var state = vrSensor.getState();
  var euler = new THREE.Euler().setFromQuaternion(state.orientation);
  SendMessage('WebVRCameraSet', 'euler_x', euler.x);
  SendMessage('WebVRCameraSet', 'euler_y', euler.y);
  SendMessage('WebVRCameraSet', 'euler_z', euler.z);
  if (state.position != null) {
    SendMessage('WebVRCameraSet', 'position_x', state.position.x);
    SendMessage('WebVRCameraSet', 'position_y', state.position.y);
    SendMessage('WebVRCameraSet', 'position_z', state.position.z);
  }
}

function update() {
  rafId = requestAnimationFrame(getVRSensorState);
  var state = vrSensor.getState();
  var euler = new THREE.Euler().setFromQuaternion(state.orientation);
  SendMessage('WebVRCameraSet', 'euler_x', euler.x);
  SendMessage('WebVRCameraSet', 'euler_y', euler.y);
  SendMessage('WebVRCameraSet', 'euler_z', euler.z);
  if (state.position != null) {
    SendMessage('WebVRCameraSet', 'position_x', state.position.x);
    SendMessage('WebVRCameraSet', 'position_y', state.position.y);
    SendMessage('WebVRCameraSet', 'position_z', state.position.z);
  }
}