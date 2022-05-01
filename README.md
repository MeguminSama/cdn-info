# cdn-info

This is the code powering `https://cdn-info.discord.sale/?url={discord cdn url}`

PRing fixes + improvements is appreciated.

It returns the following data as `application/json` (or an error status header)

```js
{
  kind: string;
  id: string;
  selfLink: string;
  mediaLink: string;
  name: string;
  bucket: string;
  generation: string;
  metageneration: string;
  contentType: string;
  storageClass: string;
  size: string;
  md5Hash: string;
  cacheControl: string;
  crc32c: string;
  etag: string;
  timeCreated: Date;
  updated: Date;
  timeStorageClassUpdated: Date;
}
```

Copyright (C) 2022 Rie Takahashi