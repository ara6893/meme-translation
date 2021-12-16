export function toApiUrl(url: string): string {
  return true
    ? `http://localhost:3000${url}`
    : `https://github-ara6893-meme-translation-tgzai6eqnq-uc.a.run.app${url}`;
}

export function get(url: string) {
  return new Promise((res, rej) =>
    fetch(toApiUrl(url))
      .then((data) => data.json())
      .then((data) => res(data))
      .catch((err) => rej(err))
  );
}

export function post(url: string, body: string): Promise<object> {
  const params: RequestInit = {
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body,
  };
  return new Promise((res, rej) =>
    fetch(toApiUrl(url), params)
      .then((data: Response) => data.json())
      .then((data: any) => res(data))
      .catch((err) => rej(err))
  );
}

export function form(url: string, body: FormData): Promise<string> {
  return new Promise((res, rej) => {
    const request = new XMLHttpRequest();
    request.open("POST", toApiUrl(url));
    request.onload = function () {
      // do something to response
      console.log(this.responseText);
      res(this.responseText);
    };
    request.onerror = function () {
      // do something to response
      console.log(this.responseText);
      rej(this.responseText);
    };
    request.send(body);
  });
}
