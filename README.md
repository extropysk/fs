# fs

## Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicListGet",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:List*", "s3:Get*"],
      "Resource": "arn:aws:s3:::bucket.extropy.sk"
    },
    {
      "Sid": "PutFiles",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::bucket.extropy.sk/*"
    }
  ]
}
```

## CORS

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["HEAD", "PUT", "POST", "GET"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag", "x-amz-meta-custom-header"]
  }
]
```

## Client

```ts
const TOKEN

const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  const data = {
    name: file?.name,
    lastModified: file?.lastModified,
    size: file?.size,
    type: file?.type,
  }

  const response = await fetch('http://localhost:3000/files/sign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    console.error(response)
    return
  }

  const { url, fields } = await response.json()
  const formData = new FormData()
  Object.entries({ ...fields, file }).forEach(([key, value]) => {
    formData.append(key, value as string)
  })

  const uploadResponse = await fetch(url, {
    method: 'POST',
    body: formData,
  })

  if (uploadResponse.ok) {
    console.log(`${url}/${fields.key}`)
  }
}
```
