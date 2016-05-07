/* global HMDVRDevice, PositionSensorVRDevice, SendMessage, THREE, VRDisplay */
// (function () {
  // window.addEventListener('load', function () {

  // });

  var btnToggleVr = document.querySelector('#btnToggleVr');
  var btnResetSensor = document.querySelector('#btnResetSensor');
  var canvas = document.querySelector('#canvas');
  var eyeParamsL;
  var eyeParamsR;
  var fullscreen;
  var isDeprecatedAPI = false;
  var vrDisplay;
  var vrSensor;
  var vrPose;

  btnToggleVr.addEventListener('click', vrToggleVr);
  btnResetSensor.addEventListener('click', vrResetSensor);

  function vrToggleVr () {
    btnToggleVr.blur();
    if (!vrDisplay) {
      console.error('[vrToggleVr] No VR device was detected');
    }
    if (isPresenting()) {
      exitPresent();
    } else {
      requestPresent();
    }
  }

  function vrResetSensor () {
    btnResetSensor.blur();
    if (!vrDisplay) {
      console.error('[vrResetSensor] No VR device was detected');
    }
    return resetSensor();
  }

  function Fullscreen (element) {
    element = element || document.body;
    this.isSupported = true;
    if (element.requestFullscreen) {
      this.element = 'fullscreenElement';
      this.eventChange = 'fullscreenchange';
      this.methodEnter = 'requestFullscreen';
      this.methodExit = 'exitFullscreen';
    } else if (element.mozRequestFullScreen) {
      this.element = 'mozFullScreenElement';
      this.eventChange = 'mozfullscreenchange';
      this.methodEnter = 'mozRequestFullScreen';
      this.methodExit = 'mozCancelFullScreen';
    } else if (element.webkitRequestFullscreen) {
      this.element = 'webkitFullscreenElement';
      this.eventChange = 'webkitfullscreenchange';
      this.methodEnter = 'webkitRequestFullscreen';
      this.methodExit = 'webkitExitFullscreen';
    } else if (element.msRequestFullscreen) {
      this.element = 'msFullscreenElement';
      this.eventChange = 'MSFullscreenChange';
      this.methodEnter = 'msRequestFullscreen';
      this.methodExit = 'msExitFullscreen';
    } else {
      this.isSupported = false;
    }
    this.isPresenting = function () {
      return !!document[this.element];
    }.bind(this);
    this.enter = function (element, options) {
      return element[this.methodEnter](options);
    }.bind(this);
    this.exit = function () {
      return document[this.methodExit]();
    }.bind(this);
  }

  function raf (cb) {
    // console.log('raf', cb);
    if (!vrDisplay) {
      return;
    }
    if (vrDisplay.requestAnimationFrame) {
      // console.log('vrDisplay.requestAnimationFrame', cb);
      return vrDisplay.requestAnimationFrame(cb);
    } else {
      // console.log('window.requestAnimationFrame', cb);
      return window.requestAnimationFrame(cb);
    }
  }

  function getVRDisplays () {
    // console.log('getVRDisplays');

    var filterDevices = function (devices) {
      // console.log('filterDevices', devices);
      var device;
      for (var i = 0; i < devices.length; i++) {
        device = devices[i];
        // console.log('… device', device);
        if (!vrDisplay && 'VRDisplay' in window && device instanceof VRDisplay) {
          vrDisplay = vrSensor = device;
          // console.log('got new vrDisplay', device);
          break;  // We keep the first we encounter.
        } else if (!vrDisplay && 'HMDVRDevice' in window && device instanceof HMDVRDevice) {
          vrDisplay = device;
          // console.log('got old vrDisplay', device);
          if (vrSensor) {
            break;
          }
        } else if (!vrSensor && 'PositionSensorVRDevice' in window && device instanceof PositionSensorVRDevice) {
          // console.log('got old vrSensor', device);
          vrSensor = device;
          if (vrDisplay) {
            break;
          }
        }
      }

      // console.log('filtered devices');

      return vrDisplay;
    };

    if (navigator.getVRDisplays) {
      // console.log('using navigator.getVRDisplays');
      return navigator.getVRDisplays().then(filterDevices);
    } else if (navigator.getVRDevices) {
      // console.log('using navigator.getVRDevices');
      isDeprecatedAPI = true;
      fullscreen = new Fullscreen();
      return navigator.getVRDevices().then(filterDevices);
    } else {
      // console.log('could not use navigator.getVRDevices nor navigator.getVRDisplays');
      throw 'Your browser is not VR ready';
    }
  }

  function getEyeParameters () {
    // console.log('getEyeParameters', vrDisplay);
    eyeParamsL = vrDisplay.getEyeParameters('left');
    eyeParamsR = vrDisplay.getEyeParameters('right');

    var eyeTranslationL = isDeprecatedAPI ? eyeParamsL.eyeTranslation.x : eyeParamsL.offset[0];
    var eyeTranslationR = isDeprecatedAPI ? eyeParamsR.eyeTranslation.x : eyeParamsR.offset[0];
    var eyeFOVL = isDeprecatedAPI ? eyeParamsL.recommendedFieldOfView : eyeParamsL.fieldOfView;
    var eyeFOVR = isDeprecatedAPI ? eyeParamsR.recommendedFieldOfView : eyeParamsR.fieldOfView;

    SendMessage('WebVRCameraSet', 'eyeL_translation_x', eyeTranslationL);
    SendMessage('WebVRCameraSet', 'eyeR_translation_x', eyeTranslationR);
    SendMessage('WebVRCameraSet', 'eyeL_fovUpDegrees', eyeFOVL.upDegrees);
    SendMessage('WebVRCameraSet', 'eyeL_fovDownDegrees', eyeFOVL.downDegrees);
    SendMessage('WebVRCameraSet', 'eyeL_fovLeftDegrees', eyeFOVL.leftDegrees);
    SendMessage('WebVRCameraSet', 'eyeL_fovRightDegrees', eyeFOVL.rightDegrees);
    SendMessage('WebVRCameraSet', 'eyeR_fovUpDegrees', eyeFOVR.upDegrees);
    SendMessage('WebVRCameraSet', 'eyeR_fovDownDegrees', eyeFOVR.downDegrees);
    SendMessage('WebVRCameraSet', 'eyeR_fovLeftDegrees', eyeFOVR.leftDegrees);
    SendMessage('WebVRCameraSet', 'eyeR_fovRightDegrees', eyeFOVR.rightDegrees);
  }

  function resetSensor () {
    // console.log('resetSensor', vrDisplay, vrSensor);
    if (isDeprecatedAPI) {
      return vrSensor.resetSensor();
    } else {
      return vrDisplay.resetSensor();
    }
  }

  function getPose () {
    // console.log('getPose', vrDisplay, vrSensor);
    if (isDeprecatedAPI) {
      return vrSensor.getState();
    } else {
      return vrDisplay.getPose();
    }
  }

  function requestPresent () {
    // console.log('requestPresent', vrDisplay, canvas, fsMethod, isDeprecatedAPI);
    if (isDeprecatedAPI) {
      return fullscreen.enter(canvas, {vrDisplay: vrDisplay});
    } else {
      return vrDisplay.requestPresent([{source: canvas}]);
    }
  }

  function exitPresent () {
    if (isDeprecatedAPI) {
      return fullscreen.exit();
    } else {
      return vrDisplay.exitPresent();
    }
  }

  function isPresenting () {
    // console.log('isPresenting', canvas);
    if (!vrDisplay) {
      return false;
    }
    if (isDeprecatedAPI) {
      return fullscreen.isPresenting();
    } else {
      return vrDisplay && vrDisplay.isPresenting;
    }
  }

  function getVRSensorState () {
    // console.log('getVRSensorState', vrDisplay);
    vrPose = getPose();
    var quaternion = isDeprecatedAPI ? vrPose.orientation : new THREE.Quaternion().fromArray(pose.orientation);
    var euler = new THREE.Euler().setFromQuaternion(quaternion);
    SendMessage('WebVRCameraSet', 'euler_x', euler.x);
    SendMessage('WebVRCameraSet', 'euler_y', euler.y);
    SendMessage('WebVRCameraSet', 'euler_z', euler.z);
    if (vrPose.position !== null) {
      var positionX = isDeprecatedAPI ? vrPose.position.x : vrPose.position[0];
      var positionY = isDeprecatedAPI ? vrPose.position.y : vrPose.position[1];
      var positionZ = isDeprecatedAPI ? vrPose.position.z : vrPose.position[2];
      SendMessage('WebVRCameraSet', 'position_x', positionX);
      SendMessage('WebVRCameraSet', 'position_y', positionY);
      SendMessage('WebVRCameraSet', 'position_z', positionZ);
    }
  }

  function resizeCanvas () {
    canvas.width = Math.max(eyeParamsL.renderWidth, eyeParamsR.renderWidth) * 2;
    canvas.height = Math.max(eyeParamsL.renderHeight, eyeParamsR.renderHeight);
  }

  function modeChange () {
    if (isPresenting()) {
      SendMessage('WebVRCameraSet', 'changeMode', 'vr');
      vrToggleVr.textContent = vrToggleVr.title = vrToggleVr.dataset.exitVrTitle;
    } else {
      SendMessage('WebVRCameraSet', 'changeMode', 'normal');
      vrToggleVr.textContent = vrToggleVr.title = vrToggleVr.dataset.exitVrTitle;
    }
    resizeCanvas();
  }

  function initEventListeners () {
    // console.log('initEventListeners');
    if (isDeprecatedAPI) {
      document.addEventListener(fullscreen.eventChange, modeChange);
    } else {
      window.addEventListener('vrdisplaypresentchange', modeChange);
    }
  }

  // Post render callback from Unity.
  window.postRender = function () {
    if (!isDeprecatedAPI && isPresenting()) {
      vrDisplay.submitFrame(vrPose);
    }
  };

  // Initialization callback from Unity (called by `StereoCamera.cs`).
  window.vrInit = function () {
    // console.log('… vrInit called');
    return getVRDisplays().then(function () {

      initEventListeners();
      getEyeParameters();
      // getVRSensorState();
      update();
    });
  };

  var update = window.update = function () {
    // console.log('update');
    getVRSensorState();
    raf(update);
  };
// })();
