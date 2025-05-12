import { useCallback, useEffect, useState } from "react";

async function sendHttpRequest(url, config) {
  const response = await fetch(url, {
    ...config,
    headers: {
      "Content-Type": "application/json",
      ...(config?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({}));
    throw new Error(
      errorData.message || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}
export default function useHttp(url, config, initialData) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const sendRequest = useCallback(
    async (requestData) => {
      setIsLoading(true);
      setError(null);

      try {
        const resData = await sendHttpRequest(url, {
          ...config,
          body: requestData
            ? JSON.stringify(requestData)
            : undefined,
        });
        setData(resData);
        return resData;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [url, config]
  );

  useEffect(() => {
    if (config?.method === "GET" || !config?.method) {
      sendRequest().catch(() => {});
    }
  }, [sendRequest, config]);

  return { data, isLoading, error, sendRequest };
}