# template

## client

```
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
        Authorization:
          "Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMzE2NmE2MWZkOTU2OTExY2RjOTBiY2RmZWVmZWQ5MjNhZWZhODgwZTQ5MTJiNmI1MDgzZjA1ZTNhZjZhN2U1NWIiLCJyb2xlcyI6W10sImlhdCI6MTY4ODUzNjc0MywiZXhwIjoxNjg4NTQwMzQzfQ.d2vT_bnFuFQ9DgU4s-6HDwya0YnY0swrQkiyVMHKpx_pOvE-KHOgQyhYl1PDcCJ1dR0W0lFrzExhquKQHD0Dvg",
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
    } else {
      console.error(uploadResponse);
    }
  };
```
