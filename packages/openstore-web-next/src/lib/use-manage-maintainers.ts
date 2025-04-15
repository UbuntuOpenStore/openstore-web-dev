import { useEffect, useState } from "preact/hooks";
import { UserListSchema, type UserData } from "./schema";
import { getClientApiKey } from "./utils";

export const useManageMaintainers = (isAdmin: boolean) => {
  const [maintainers, setMaintainers] = useState<(UserData & { display_name: string })[]>([]);

  useEffect(() => {
    const apikey = getClientApiKey();
    fetch(`${import.meta.env.PUBLIC_API_URL}api/users?apikey=${apikey}`).then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    }).then((data) => {
      if (data && data.data) {
        const maintainerList = UserListSchema.parse(data.data).map((maintainer) => {
          let name = "UNKNOWN";
          if (maintainer.name && maintainer.email) {
            name = `${maintainer.name} (${maintainer.email})`;
          } else if (maintainer.name && !maintainer.email) {
            name = maintainer.name;
          } else if (!maintainer.name && maintainer.email) {
            name = maintainer.email;
          }

          return {
            ...maintainer,
            display_name: `${name} - ${maintainer.role ?? "community"}`,
          };
        });

        maintainerList.sort((a, b) => {
          const aname = a.display_name ? a.display_name.toLowerCase() : "";
          const bname = b.display_name ? b.display_name.toLowerCase() : "";

          if (a.role === "admin" && b.role !== "admin") {
            return -1;
          }
          if (a.role !== "admin" && b.role === "admin") {
            return 1;
          }
          if (aname > bname) {
            return 1;
          }
          if (aname < bname) {
            return -1;
          }

          return 0;
        });

        setMaintainers(maintainerList);
      }
    });
  }, []);

  return maintainers;
}
