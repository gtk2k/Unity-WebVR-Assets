/* global HMDVRDevice, PositionSensorVRDevice, SendMessage, THREE, VRDisplay */
// (function () {
  // window.addEventListener('load', function () {
  // });

  // $('.canvas-wrapper')

  // change waiting
  // queue events

  var btnVrToggle = document.querySelector('#btnVrToggle');
  var btnVrReset = document.querySelector('#btnVrReset');
  var canvas = document.querySelector('#canvas');
  var eyeParamsL;
  var eyeParamsR;
  var fullscreen;
  var isDeprecatedAPI = 'getVRDevices' in navigator;
  var isSupported = 'getVRDisplays' in navigator || isDeprecatedAPI;
  var vrDisplay;
  var vrReady = getDisplays().catch(function (err) {
    // console.error.bind(console)
  });
  var vrSensor;
  var vrPose;

  if (isSupported) {
    document.body.dataset.supportsVr = 'true';
  }

  // var btnTest = document.querySelector('#btnTest');
  // btnTest.addEventListener('click', function () {
  //   SendMessage('WebVRCameraSet', 'changeMode', 'vr');
  //   document.querySelector('#canvas').mozRequestFullScreen({vrDisplay: vrDisplay});
  // });

  // window.addEventListener('fullscreenchange', e => { console.log(e); }, true);
  // window.addEventListener('mozfullscreenchange', e => { console.log(e); }, true);

  btnVrToggle.addEventListener('click', btnVrToggleOnClick);
  btnVrReset.addEventListener('click', btnVrResetOnClick);

  function btnVrToggleOnClick () {
    btnVrToggle.blur();
    if (!vrDisplay) {
      console.error('[vrToggle] No VR device was detected');
    }
    vrReady.then(togglePresent);
  }

  function btnVrResetOnClick () {
    btnVrReset.blur();
    if (!vrDisplay) {
      console.error('[btnVrResetOnClick] No VR device was detected');
    }
    vrReady.then(resetSensor);
  }

  function initVrButtons () {
    btnFsEnter.classList.remove('waiting');
    btnVrToggle.classList.remove('waiting');
    btnVrReset.classList.remove('waiting');
    btnVrToggle.addEventListener('click', vrToggle);
    btnVrReset.addEventListener('click', vrResetSensor);
  }

  function vrToggle () {
    btnVrToggle.blur();
    if (!vrDisplay) {
      console.error('[vrToggle] No VR device was detected');
      return;
    }
    return togglePresent();
  }

  function vrResetSensor () {
    btnVrReset.blur();
    if (!vrDisplay) {
      console.error('[vrResetSensor] No VR device was detected');
      return;
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
      console.log('entering %s fullscreen', this.methodEnter, element, options);
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

  function getDisplays () {
    // console.log('getDisplays');
    var filterDevices = function (devices) {
      // console.log('filterDevices', devices);
      var device;
      for (var i = 0; i < devices.length; i++) {
        device = devices[i];
        // console.log('… device', device);
        if (!vrDisplay && 'VRDisplay' in window && device instanceof VRDisplay) {
          vrDisplay = vrSensor = device;
          // console.log('got new vrDisplay', device);
          break;  // Use the first display we encounter.
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
      isSupported = true;
      return navigator.getVRDisplays().then(filterDevices);
    } else if (navigator.getVRDevices) {
      // console.log('using navigator.getVRDevices');
      isSupported = true;
      isDeprecatedAPI = true;
      fullscreen = new Fullscreen();
      return navigator.getVRDevices().then(filterDevices);
    } else {
      throw 'Your browser is not VR ready';
    }
  }

  function getEyeParameters () {
    if (!vrDisplay) {
      console.error('[getEyeParameters] No VR device was detected');
      return;
    }
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

  function togglePresent () {
    if (isPresenting()) {
      console.log('IS PRESENTING');
      return exitPresent();
    } else {
      console.log('IS NOT PRESENTING');
      return requestPresent();
    }
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
    console.log('requestPresent', vrDisplay, canvas, isDeprecatedAPI);
    if (isDeprecatedAPI) {
      // canvas.requestFullscreen({vrDisplay: vrDisplay});
      return fullscreen.enter(canvas, {vrDisplay: vrDisplay});
    } else {
      return vrDisplay.requestPresent([{source: canvas}]);
    }
  }

  function exitPresent () {
    console.log('exitPresent');
    if (isDeprecatedAPI) {
      return fullscreen.exit();
    } else {
      return vrDisplay.exitPresent().then(function () {

      });
    }
  }

  function isPresenting () {
    if (!vrDisplay) {
      return false;
    }
    if (isDeprecatedAPI) {
      return fullscreen.isPresenting();
    } else {
      console.log('vrDisplay.isPresenting', vrDisplay.isPresenting);
      return vrDisplay.isPresenting;
    }
  }

  function getVRSensorState () {
    // console.log('getVRSensorState', vrDisplay);
    vrPose = getPose();
    if (!vrPose) {
      return;
    }
    var quaternion = isDeprecatedAPI ? vrPose.orientation : new THREE.Quaternion().fromArray(vrPose.orientation);
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
    if (!canvas.dataset.oldWidth) {
      canvas.dataset.oldWidth = canvas.width;
    }
    if (!canvas.dataset.oldHeight) {
      canvas.dataset.oldHeight = canvas.height;
    }
    canvas.width = Math.max(eyeParamsL.renderWidth, eyeParamsR.renderWidth) * 2;
    canvas.height = Math.max(eyeParamsL.renderHeight, eyeParamsR.renderHeight);
  }

  function revertCanvas () {
    if (canvas.dataset.oldWidth) {
      canvas.width = canvas.dataset.oldWidth;
    }
    if (canvas.dataset.oldHeight) {
      canvas.height = canvas.dataset.oldHeight;
    }
  }

  function modeChange (e) {
    console.log('>>>>', e.type, 'mode change', isPresenting());
    if (isPresenting()) {
      SendMessage('WebVRCameraSet', 'changeMode', 'vr');
      btnVrToggle.textContent = btnVrToggle.title = btnVrToggle.dataset.exitVrTitle;
      resizeCanvas();
    } else {
      SendMessage('WebVRCameraSet', 'changeMode', 'normal');
      btnVrToggle.textContent = btnVrToggle.title = btnVrToggle.dataset.enterVrTitle;
      revertCanvas();  // Or we can just call `resizeCanvas` in `vrInit` (see below).
    }
  }

  function initEventListeners () {
    console.error('initEventListeners');
    if (isDeprecatedAPI) {
      document.addEventListener('fullscreenchange', modeChange);
      document.addEventListener('mozfullscreenchange', modeChange);
    } else {
      window.addEventListener('vrdisplaypresentchange', modeChange);
    }
  }

  // Post-render callback from Unity.
  window.postRender = function () {
    if (!isDeprecatedAPI && isPresenting()) {
      vrDisplay.submitFrame(vrPose);
    }
  };

  // Initialization callback from Unity (called by `StereoCamera.cs`).
  window.vrInit = function () {
    // console.log('… vrInit called');
    if (!isSupported) {
      console.error('is not supported');
      return;
    }
    vrReady.then(function () {
      initVrButtons();
      initEventListeners();
      getEyeParameters();
      update();
    });
  };

  var update = window.update = function () {
    // console.log('update');
    getVRSensorState();
    raf(update);
  };
// })();
