import { useState, useEffect, useCallback } from "preact/hooks";
import { type AppManageData, AppManageSchema } from "./schema";
import { getClientApiKey } from "./utils";

export const useManageApp = (id: string): [AppManageData | undefined, boolean, number, () => void] => {
  const [app, setApp] = useState<AppManageData | undefined>();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(200);

  const refreshApp = useCallback(() => {
    setLoading(true);

    const apikey = getClientApiKey();
    fetch(`${import.meta.env.PUBLIC_API_URL}api/v3/manage/${id}?apikey=${apikey}`, { headers: { 'X-Source': 'openstore-web-next' } }).then((res) => {
      setStatus(res.status);
      return res.status === 200 ? res.json() : undefined;
    }).then((data) => {
      setApp(data ? AppManageSchema.parse(data.data) : undefined);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    refreshApp();
  }, []);

  return [app, loading, status, refreshApp];
}
