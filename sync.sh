#!/usr/bin/env bash

if [ -z "$UNITY_WEBVR_PROJECT" ]
  then
    echo "'UNITY_WEBVR_PROJECT' environment variable must be set."
    echo "Sample usage:"
    echo
    echo "    UNITY_WEBVR_PROJECT=\$HOME'/myproject/' sync.sh"
    echo
fi

cp -r WebGLTemplates $UNITY_WEBVR_PROJECT/Assets/.
cp -r WebVRAssets/** $UNITY_WEBVR_PROJECT/Assets/.
