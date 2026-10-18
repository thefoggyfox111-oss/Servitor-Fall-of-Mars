# ForgeCell Engine 0.15.0

Updated for GitHub Android compilation (explicit AppCompat dependency). The complete standalone Android Studio source is preserved as [ForgeCell_Engine_0.15.0_source.zip](./ForgeCell_Engine_0.15.0_source.zip) (SHA-256 `043bfff795aca81305abbe4de66c7bc9d23a83c424d9cfdbfafbc39084983bbc`).

The workflow at `.github/workflows/forgecell-apk.yml` unpacks that archive, builds an Android arm64 debug APK with Gradle/NDK and checks the resulting APK for native binaries and assets. It uploads the APK as an Actions artifact if successful.

This is a standalone experimental engine. It is kept separate from the existing Servitor-Fall-of-Mars application. The main branch was not changed.

**Status:** Android runtime/performance not validated until a successful on-device test.
