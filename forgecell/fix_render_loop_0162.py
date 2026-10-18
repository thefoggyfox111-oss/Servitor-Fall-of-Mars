from pathlib import Path
root=Path('ForgeCell_Engine')
main=root/'android/app/src/main/cpp/android_main.cpp'
s=main.read_text()
old='''    while (!app->destroyRequested) {
        int fd=0;
        android_poll_source* source=nullptr;
        const int timeout=(native.ready && native.resumed) ? 0 : -1;
        while (ALooper_pollOnce(timeout,nullptr,&fd,reinterpret_cast<void**>(&source))>=0) {
            if(source) source->process(app,source);
            if(app->destroyRequested) break;
        }
        if(app->destroyRequested) break;
        native.handleInputs();
        native.frame();
    }
'''
new='''    while (!app->destroyRequested) {
        // Bound event processing to prevent looper starvation of rendered frames.
        int timeout=(native.ready && native.resumed) ? 0 : -1;
        for (int eventsHandled=0;eventsHandled<32;++eventsHandled) {
            int fd=0;
            android_poll_source* source=nullptr;
            const int event=ALooper_pollOnce(timeout,nullptr,&fd,reinterpret_cast<void**>(&source));
            if(event<0)break;
            if(source)source->process(app,source);
            if(app->destroyRequested)break;
            timeout=0;
        }
        if(app->destroyRequested)break;
        static bool firstLoop=true;
        if(firstLoop)__android_log_print(ANDROID_LOG_INFO,"ForgeCell","Main loop drained events; handling inputs");
        native.handleInputs();
        if(firstLoop)__android_log_print(ANDROID_LOG_INFO,"ForgeCell","Main loop passed input; rendering");
        firstLoop=false;
        native.frame();
    }
'''
assert old in s
main.write_text(s.replace(old,new))
gradle=root/'android/app/build.gradle.kts'
s=gradle.read_text()
assert 'versionCode = 18' in s
gradle.write_text(s.replace('versionCode = 18','versionCode = 19').replace('versionName = "0.16.1"','versionName = "0.16.2"'))
test=root/'tests/android_project_structure.py'
test.write_text(test.read_text().replace('versionName = "0.16.1"','versionName = "0.16.2"'))
print("Bounded native looper installed; version 0.16.2")
