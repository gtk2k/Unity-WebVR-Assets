# Unity-WebVR-Test-Assets
UnityでWebVRに対応したWebGLビルドを行うテンプレートおよびアセット

##使い方
WebGLTemplatesフォルダーを、
* Windowsの場合  
  C:\Program Files\Unity\Editor\Data\PlaybackEngines\webglsupport\BuildToolsのフォルダーに上書きします。
* Macの場合  
  Assetsフォルダーにコピーします。  

これで、Build Settings > WebGL > Player Settings > Publishing Settings > WebGL Template にWebVRというテンプレートが追加されます。  

次にWebVR Assetsフォルダー内のPrefabフォルダーとScriptsフォルダーをAssetsフォルダにコピーします。
PrefabsフォルダーにはWebVRCameraSetというPrefabがありますので、このカメラを適当に配置し、WebVRCameraSetにScriptsフォルダー内にあるStereoCamera.csをアタッチします。

あとは、WebGLでWebVRテンプレートを使ってビルドを行い、出力されたindex.htmlにアクセスすればできます。


ライセンスはフリーです。自由に改変したりしてもかまいません。
