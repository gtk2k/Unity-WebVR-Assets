# Unity-WebVR-Test-Assets
UnityでWebVRに対応したWebGLビルドを行うテンプレートおよびアセット

##使い方
WebGLTemplatesフォルダーを、
* Windowsの場合  
  C:\Program Files\Unity\Editor\Data\PlaybackEngines\webglsupport\BuildToolsのフォルダーに上書きします。
* Macの場合  
  プロジェクト内のAssetsフォルダーにコピーします。
これで、Build Settings > WebGL > Player Settings > Publishing Settings > WebGL Template にWebVRというテンプレートが追加されます。  

次にWebVR Assetsフォルダー内のPrefabフォルダーとScriptsフォルダーをプロジェクトのAssetsフォルダにコピーします。
PrefabsフォルダーにはWebVRCameraSetというPrefabがありますので、このカメラを適当に配置します。

あとは、WebGLでWebVRテンプレートを使ってビルドを行い、出力されたinde.htmlにアクセスすればできます。



