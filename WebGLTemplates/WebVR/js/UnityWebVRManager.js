/* global HMDVRDevice, PositionSensorVRDevice, SendMessage, THREE, VRDisplay */
// (function () {
  // window.addEventListener('load', function () {

  // });

  var btnEnterVr = document.querySelector('#btnEnterVr');
  var btnResetSensor = document.querySelector('#btnResetSensor');
  var canvas = document.querySelector('#canvas');
  var fsChangeEvent;
  var fsMethod;
  var isDeprecatedAPI = false;
  var vrDisplay;
  var vrSensor;

  btnEnterVr.addEventListener('click', vrEnterVr);
  btnResetSensor.addEventListener('click', vrResetSensor);

  function vrEnterVr () {
    btnEnterVr.blur();
    if (!vrDisplay) {
      throw '[vrEnterVr] No VR device was detected';
    }
    return requestPresent();
  }

  function vrResetSensor () {
    btnResetSensor.blur();
    if (!vrDisplay) {
      throw '[vrResetSensor] No VR device was detected';
    }
    return resetSensor();
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
      return navigator.getVRDevices().then(filterDevices);
    } else {
      // console.log('could not use navigator.getVRDevices nor navigator.getVRDisplays');
      throw 'Your browser is not VR ready';
    }
  }

  function getEyeParameters () {
    // console.log('getEyeParameters', vrDisplay);
    var eyeParamsL = vrDisplay.getEyeParameters('left');
    var eyeParamsR = vrDisplay.getEyeParameters('right');

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
      return canvas[fsMethod]({vrDisplay: vrDisplay});
    } else {
      return vrDisplay.requestPresent([{source: canvas}]);
    }
  }

  function isPresenting () {
    // console.log('isPresenting', canvas);
    if (!vrDisplay) {
      return false;
    }
    if (isDeprecatedAPI) {
      return !!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement);
    } else {
      return vrDisplay && vrDisplay.isPresenting;
    }
  }

  function getVRSensorState () {
    // console.log('getVRSensorState', vrDisplay);
    var state = getPose();
    var quaternion = isDeprecatedAPI ? state.orientation : new THREE.Quaternion().fromArray(state.orientation);
    var euler = new THREE.Euler().setFromQuaternion(quaternion);
    SendMessage('WebVRCameraSet', 'euler_x', euler.x);
    SendMessage('WebVRCameraSet', 'euler_y', euler.y);
    SendMessage('WebVRCameraSet', 'euler_z', euler.z);
    if (state.position !== null) {
      var positionX = isDeprecatedAPI ? state.position.x : state.position[0];
      var positionY = isDeprecatedAPI ? state.position.y : state.position[1];
      var positionZ = isDeprecatedAPI ? state.position.z : state.position[2];
      SendMessage('WebVRCameraSet', 'position_x', positionX);
      SendMessage('WebVRCameraSet', 'position_y', positionY);
      SendMessage('WebVRCameraSet', 'position_z', positionZ);
    }
  }

  function initEventListeners () {
    // console.log('initEventListeners');
    if (isDeprecatedAPI) {
      document.addEventListener(fsChangeEvent, function () {
        if (isPresenting()) {
          SendMessage('WebVRCameraSet', 'changeMode', 'vr');
        } else {
          SendMessage('WebVRCameraSet', 'changeMode', 'normal');
        }
      });
    } else {
      window.addEventListener('vrdisplaypresentchange', function () {
        if (isPresenting()) {
          SendMessage('WebVRCameraSet', 'changeMode', 'vr');
        } else {
          SendMessage('WebVRCameraSet', 'changeMode', 'normal');
        }
      });
    }
  }

  window.vrInit = function () {
    // console.log('… vrInit called');
    return getVRDisplays().then(function () {
      if (canvas.requestFullscreen) {
        // console.log('using requestFullscreen');
        fsMethod = 'requestFullscreen';
        fsChangeEvent = 'fullscreenchange';
      } else if (canvas.mozRequestFullscreen) {
        // console.log('using mozRequestFullScreen');
        fsMethod = 'mozRequestFullScreen';
        fsChangeEvent = 'mozfullscreenchange';
      } else if (canvas.webkitRequestFullscreen) {
        // console.log('using webkitRequestFullScreen');
        fsMethod = 'webkitRequestFullscreen';
        fsChangeEvent = 'webkitfullscreenchange';
      }
      initEventListeners();
      getEyeParameters();
      // getVRSensorState();
      update();
    });
  };

  var update = function () {
    // console.log('update');
    getVRSensorState();
    raf(update);
  };

  window.update = update;
// })();
