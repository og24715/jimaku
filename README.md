# jimaku

- `youtube-dl` で動画と字幕をダウンロードする
- `ffmpeg` で字幕を焼く
- `youtube-dl` で得た字幕データをもとに任意のフレームの画像を生成

## youtube-dl（brew install youtube-dl）

- YouTubeの動画をローカルにダウンロードする
- 字幕ファイル（”ass”形式）をダウンロードする

- 成果物：x.mp4 x.ja.ass

```shell
$ youtube-dl --write-auto-sub --sub-lang ja --convert-subs ass -f "mp4" -o x.mp4 URL
```
|オプション|目的|
|:--|:-|
|--write-auto-sub|字幕ファイルを自動生成|
|--sub-lang ja|日本語の字幕ファイルを指定|
|--convert-subs ass|字幕ファイルを"ass"形式に指定|
|-f "mp4"|動画ファイルを"mp4"形式に指定|
|-o x.mp4|出力後の動画ファイル名を指定|

## ffmpeg（brew reinstall ffmpeg --with-libass）

- ローカルの動画（"mp4"形式）に字幕（"ass"形式）を焼く

- 成果物：x2.mp4

```shell
$ ffmpeg -i x.mp4 -vf ass=x.ja.ass x2.mp4
```

|オプション|目的|
|:-|:-|
|-i x.mp4|字幕を焼く動画ファイルの指定|
|-vf ass=x.ja.ass|字幕ファイルの型とファイルを指定|
