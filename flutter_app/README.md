# Manifestasia Flutter App

This is a native Flutter implementation of the Manifestasia app shell and
core user journey. It does not use a WebView.

Public Supabase and API config is bundled in `lib/core/app_config.dart`, so
local runs do not need `--dart-define` values:

```bash
flutter run
```

For an iOS release build:

```bash
flutter build ios --release
open ios/Runner.xcworkspace
```

In Xcode, select the `Runner` target, set your Apple Team, confirm the bundle
identifier `ai.manifestasia.app`, then use Product > Archive.

Only public/client-safe values belong in Flutter. Keep server secrets such as
`SUPABASE_SERVICE_ROLE_KEY` and `AI_GATEWAY_API_KEY` in the hosted backend
environment only.
