# PromptLab TWA / Bubblewrap 준비 문서

이 문서는 PromptLab을 Google Play Store에 모바일 앱 형태로 출시하기 전에, PWA와 Trusted Web Activity, Bubblewrap 준비사항을 정리한 문서입니다.

현재 목표는 기존 PromptLab 웹앱을 새로 Flutter나 React Native로 다시 만드는 것이 아니라, 운영 중인 웹앱 `https://promptlab.io.kr`을 PWA로 정리하고 TWA 방식으로 Android 앱에 포장하는 것입니다.

## 1. 현재 방향

PromptLab은 이미 Next.js 기반 웹앱으로 운영되고 있습니다.

운영 URL:

```text
https://promptlab.io.kr