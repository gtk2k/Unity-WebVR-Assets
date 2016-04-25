# Unity-WebVR-Test-Assets

WebVR template and assets for creating WebVR enabled Unity projects.


## How to Use

### Copy WebGL template

* PC users: Overwrite `C:\Program Files\Unity\Editor\Data\PlaybackEngines\webglsupport\BuildTools` with `WebGLTemplates`.

* Mac users: Copy the `WebGLTemplates` into your _Assets_ folder.


### Set build platform to WebGL

* File > Build Settings and set _WebGL_ as your platform.

![WebGL!](http://i.imgur.com/91TzPWC.png)

### Set WebGL template

* Edit > Project Settings > Player

* Under _Resolution and Presentation_, select _WebVR_ as your WebGL template.

![Template!](http://i.imgur.com/YemCgpB.png)

### Setup WebVR camera

* Copy `WebVRCameraSet.prefab` from the `WebVR Assets/prefabs` folder into your _Assets_.

* Replace your default _Main Camera_ with the _WebVRCameraSet_ prefab.

* Copy `StereoCamera.cs` from the `WebVR Assets/Scripts` folder into your _Assets_, and ensure that it is attatched to the parent node of the prefab.

![Camera!](http://i.imgur.com/hE3wLJV.png)

### Build and run

Once your project builds, open the `index.html` in a WebVR enabled browser.

* [Instructions to setup Firefox Nightly with WebVR](http://mozvr.com/#start)



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
