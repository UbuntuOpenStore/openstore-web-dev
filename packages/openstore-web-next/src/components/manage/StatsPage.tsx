import ManageHeader from "@/components/manage/ManageHeader";
import ManageError from "./ManageError";
import Loading from "../Loading";
import { useManageApp } from "@/lib/use-manage-app";

const StatsPage = ({ id }: { id: string}) => {
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

  const revisions = app.revisions.toSorted((a, b) => {
    return b.revision - a.revision;
  });

  return (
    <>
      <ManageHeader app={app} breadcrumb="Stats" />

      <section class="section space-y-2 grow mb-8">
        <h2 class="text-2xl">Download Stats</h2>

        <table class="w-full md:w-1/2">
          <thead>
            <tr>
              <th class="text-left">Revision</th>
              <th>Channel</th>
              <th>Arch</th>
              <th>Version</th>
              <th class="text-right">Downloads</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b-1 border-b-gray-300 font-extrabold">
              <td colspan={4} class="p-1"> Total </td>
              <td class="text-right p-1">{app.totalDownloads.toLocaleString()}</td>
            </tr>

            {
              revisions.map((revision) => {
                const isCurrent = app.downloads.some((download) => download.revision === revision.revision);
                return (
                  <tr class={`border-b-1 border-b-gray-300 text-center ${isCurrent ? "font-extrabold" : ""}`}>
                    <td class="text-left p-1">
                      {revision.revision} {isCurrent ? "*" : ""}
                    </td>
                    <td>{revision.channel}</td>
                    <td>{revision.architecture}</td>
                    <td>{revision.version}</td>
                    <td class="text-right p-1">{revision.downloads.toLocaleString()}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </section>
    </>
  );
}

export default StatsPage;
