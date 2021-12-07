function toApiUrl(url: string): string {
  return `http://localhost:3000${url}`;
}

export function get(url: string) {}

export function post(url: string, body: string) {
  const params: RequestInit = {
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body,
  };
  return fetch(toApiUrl(url), params);
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
