import BadgeSelect from "@/components/BadgeSelect";
import ManageHeader from "@/components/manage/ManageHeader";
import ManageError from "./ManageError";
import Loading from "../Loading";
import { useManageApp } from "@/lib/use-manage-app";

const BadgePage = ({ id }: { id: string}) => {
  const [app, loading, status] = useManageApp(id);

  if (loading) {
    return (
      <Loading />
    )
  }

  if (!app) {
    return (
      <ManageError status={status} />
    )
  }

  return (
    <>
      <ManageHeader app={app} breadcrumb="Badge" />

      <section class="section mb-8 grow">
        <h2 class="text-2xl">Badge</h2>

        <div class="w-full mt-4">
          <BadgeSelect appId={app.id} />
        </div>
      </section>
    </>
  );
}

export default BadgePage;
