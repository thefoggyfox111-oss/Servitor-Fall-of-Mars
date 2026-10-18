from pathlib import Path

root = Path("ForgeCell_Engine/android/app")
cmake = root / "src/main/cpp/CMakeLists.txt"
s = cmake.read_text()
symbol = "Java_com_google_androidgamesdk_GameActivity_initializeNativeCode"
if symbol not in s:
    assert "game-activity::game-activity_static" in s
    s += """
# The static archive's JNI bridge can be removed by the linker's dead-strip.
# Without it GameActivity throws UnsatisfiedLinkError in onCreate().
target_link_options(forgecell PRIVATE
    "-Wl,-u,Java_com_google_androidgamesdk_GameActivity_initializeNativeCode")
"""
    cmake.write_text(s)

gradle = root / "build.gradle.kts"
s = gradle.read_text()
assert "versionCode = 15" in s
gradle.write_text(s.replace("versionCode = 15", "versionCode = 16")
                   .replace('versionName = "0.15.0"', 'versionName = "0.15.2"'))

# GameActivity loads libforgecell.so by reading android.app.lib_name from the manifest.
activity = root / "src/main/kotlin/com/forgecell/engine/MainActivity.kt"
s = activity.read_text()
old = '    companion object {\n        init { System.loadLibrary("forgecell") }\n    }\n\n'
assert old in s
activity.write_text(s.replace(old, ""))
print("GameActivity JNI startup fix for ForgeCell 0.15.2 applied")
