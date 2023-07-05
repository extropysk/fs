# template

## client

``` ts
  const token = '';

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const data = {
      name: file?.name,
      lastModified: file?.lastModified,
      size: file?.size,
      type: file?.type,
    };

    const response = await fetch("http://localhost:3000/files", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(response);
      return;
    }

    const { url, fields } = await response.json();
    const formData = new FormData();
    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (uploadResponse.ok) {
      console.log(`${url}/${fields.key}`);
    }
  };
```
