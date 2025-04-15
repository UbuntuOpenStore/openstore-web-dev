import ManageHeader from "@/components/manage/ManageHeader";
import ManageError from "./ManageError";
import Loading from "../Loading";
import { useManageApp } from "@/lib/use-manage-app";
import RevisionForm from "./RevisionForm";

const RevisionPage = ({ id }: { id: string}) => {
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
      <ManageHeader app={app} breadcrumb="Revision" />

      <div class="grow">
        <RevisionForm app={app} />
      </div>
    </>
  );
}

export default RevisionPage;
