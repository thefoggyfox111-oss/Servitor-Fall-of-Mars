# ForgeCell Engine 0.15.0

The complete standalone Android Studio source is preserved as [ForgeCell_Engine_0.15.0_source.zip](./ForgeCell_Engine_0.15.0_source.zip) (SHA-256 `6b53c04f687b6a6d41c5f848c5890c9294ffaaf11293313f45804fb0f711c4c2`).

The workflow at `.github/workflows/forgecell-apk.yml` unpacks that archive, builds an Android arm64 debug APK with Gradle/NDK and checks the resulting APK for native binaries and assets. It uploads the APK as an Actions artifact if successful.

This is a standalone experimental engine. It is kept separate from the existing Servitor-Fall-of-Mars application. The main branch was not changed.

**Status:** Android runtime/performance not validated until a successful on-device test.
