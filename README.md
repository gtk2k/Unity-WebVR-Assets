# Unity-WebVR-Test-Assets

WebVR template and assets for creating WebVR-enabled Unity projects.


## How to Use

### Copy WebGL template

* __Windows__ users: Overwrite `C:\Program Files\Unity\Editor\Data\PlaybackEngines\webglsupport\BuildTools` with [`WebGLTemplates`](WebGLTemplates).
* __Mac__ users: Copy the [`WebGLTemplates`](WebGLTemplates) into your `Assets` folder.

### Set build platform to WebGL

From `File > Build Settings`, select `WebGL` as the platform.

![WebGL!](http://i.imgur.com/91TzPWC.png)

### Set WebGL template

1. Open `Edit > Project Settings > Player` to access the `Player` settings.
2. Under `Resolution and Presentation`, select `WebVR` as your WebGL template.

![Template!](http://i.imgur.com/YemCgpB.png)

### Set up WebVR camera

1. Copy `WebVRCameraSet.prefab` from the `WebVR Assets/prefabs` folder into your `Assets`.
2. Replace your default `Main Camera` with the `WebVRCameraSet` prefab.
3. Copy `WebVR Assets/Scripts/StereoCamera.cs` into your `Assets`, and ensure that it is attached to the parent node of the prefab.

![Camera!](http://i.imgur.com/hE3wLJV.png)

### Build and run

Once your project finishes building, open the generated `index.html` in a [WebVR-enabled browser](https://webvr.info/#how-can-i-try-it).

* [Instructions to set up Firefox Nightly with WebVR](http://mozvr.com/#start)



----



## Japanese Instructions

UnityでWebVRに対応したWebGLビルドを行うテスト用のテンプレートおよびアセット

###使い方
WebGLTemplatesフォルダーを、
* Windowsの場合  
  C:\Program Files\Unity\Editor\Data\PlaybackEngines\webglsupport\BuildToolsのフォルダーに上書きします。
* Macの場合  
  Assetsフォルダーにコピーします。  

これで、Build Settings > WebGL > Player Settings > Publishing Settings > WebGL Template にWebVRというテンプレートが追加されます。  

次にWebVR Assetsフォルダー内のPrefabフォルダーとScriptsフォルダーをAssetsフォルダにコピーします。
PrefabsフォルダーにはWebVRCameraSetというPrefabがありますので、このカメラを適当に配置し、WebVRCameraSetにScriptsフォルダー内にあるStereoCamera.csをアタッチします。

あとは、WebGLでWebVRテンプレートを使ってビルドを行い、出力されたindex.htmlにアクセスすればできます。


ライセンスはフリーです。自由に使ってください。
