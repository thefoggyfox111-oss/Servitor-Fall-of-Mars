package com.example.servitormars;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
public class MainActivity extends Activity {
 @Override public void onCreate(Bundle state) {
  super.onCreate(state);
  getWindow().getDecorView().setSystemUiVisibility(5894 | 1024 | 512);
  WebView web = new WebView(this);
  web.getSettings().setJavaScriptEnabled(true);
  setContentView(web);
  web.loadUrl("file:///android_asset/index.html");
 }
}
