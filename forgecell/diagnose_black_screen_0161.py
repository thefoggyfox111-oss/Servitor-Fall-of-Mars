from pathlib import Path
root=Path("ForgeCell_Engine")
main=root/"android/app/src/main/cpp/android_main.cpp"
s=main.read_text()
a="    bool ready = false;"
assert a in s
s=s.replace(a,a+"\n    uint64_t renderedFrames = 0;")
a="        renderer.render(game,interpolation,&touch);\n        if(!eglSwapBuffers(display,surface)) {"
b="""        renderer.render(game,interpolation,&touch);
        const bool swapOk = eglSwapBuffers(display,surface) == EGL_TRUE;
        ++renderedFrames;
        if(renderedFrames==1 || renderedFrames==60 || renderedFrames==180) {
            __android_log_print(ANDROID_LOG_INFO,"ForgeCell","Frame %llu, swap=%d, EGL error=0x%x, camera=%.1f/%.1f",
                 static_cast<unsigned long long>(renderedFrames), static_cast<int>(swapOk),
                 static_cast<unsigned>(eglGetError()), static_cast<double>(game.camera.center.x),
                 static_cast<double>(game.camera.center.y));
        }
        if(!swapOk) {"""
assert a in s
s=s.replace(a,b)
a="        auto& native=*static_cast<NativeApp*>(app->userData);\n        switch(cmd) {"
b='''        auto& native=*static_cast<NativeApp*>(app->userData);
        __android_log_print(ANDROID_LOG_INFO,"ForgeCell","Lifecycle cmd=%d ready=%d resumed=%d",cmd,native.ready,native.resumed);
        switch(cmd) {'''
assert a in s
s=s.replace(a,b)
main.write_text(s)
render=root/"android/app/src/main/cpp/GlRenderer.cpp"
s=render.read_text()
a="    drawUi(simulation,touch);\n    flush();\n}\n}"
b='''    drawUi(simulation,touch);
    flush();
    static bool first = true;
    if(first) {
        first=false;
        GLubyte p[4]{};
        GLint vp[4]{};
        glGetIntegerv(GL_VIEWPORT,vp);
        glReadPixels(std::max(0,vp[2]/2),std::max(0,vp[3]/2),1,1,GL_RGBA,GL_UNSIGNED_BYTE,p);
        __android_log_print(ANDROID_LOG_INFO,"ForgeCell","First GL frame: vertices=%zu viewport=%d,%d,%d,%d RGBA=%u,%u,%u,%u err=0x%x",
            vertices_.size(),vp[0],vp[1],vp[2],vp[3],p[0],p[1],p[2],p[3],glGetError());
    }
}
}'''
assert a in s
render.write_text(s.replace(a,b))
gradle=root/"android/app/build.gradle.kts"
s=gradle.read_text()
assert 'versionCode = 17' in s
gradle.write_text(s.replace('versionCode = 17','versionCode = 18').replace('versionName = "0.16.0"','versionName = "0.16.1"'))
check=root/"tests/android_project_structure.py"
s=check.read_text()
check.write_text(s.replace('versionName = "0.16.0"','versionName = "0.16.1"'))
print("Frame/GL diagnostics installed, version 0.16.1")
