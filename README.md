# jimaku

- `youtube-dl` で動画と字幕をダウンロードする
- `ffmpeg` で字幕を焼く
- `youtube-dl` で得た字幕データをもとに任意のフレームの画像を生成

## npm scripts

### youtube-dl-with-subtitle

.ass 形式の日本語字幕を動画付きでダウンロードする

```shell
npm script youtube-dl-with-subtitle 'URL'

# or

yarn youtube-dl-with-subtitle 'URL'
```