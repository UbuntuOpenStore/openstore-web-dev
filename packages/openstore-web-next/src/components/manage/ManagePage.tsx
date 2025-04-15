import ManageHeader from "@/components/manage/ManageHeader";
import ManageError from "./ManageError";
import Loading from "../Loading";
import { useManageApp } from "@/lib/use-manage-app";
import ManageAppForm from "./ManageAppForm";
import type { UserData } from "@/lib/schema";
import { useManageMaintainers } from "@/lib/use-manage-maintainers";

const ManagePage = ({ id, user }: { id: string, user: UserData }) => {
  const [app, loading, status, refreshApp] = useManageApp(id);
  const maintainers = useManageMaintainers(user.role === 'admin');

  if (!app && loading) {
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
      <ManageHeader app={app} breadcrumb="Edit" />

      <div class="grow">
        <ManageAppForm user={user} app={app} maintainers={maintainers} onSave={refreshApp} />

        <div class="w-full h-[1px] bg-ubuntu-gradient rounded-full mx-auto max-w-6xl"></div>

        <section class="section space-y-2">
          <h2 class="text-2xl">Package Details</h2>

          <table>
            <tbody>
              <tr class="border-b-1 border-b-gray-300">
                <td class="p-2 font-bold">ID</td>
                <td>{app.id}</td>
              </tr>

              <tr class="border-b-1 border-b-gray-300">
                <td class="p-2 font-bold">Publisher</td>
                <td>{app.publisher || "None"}</td>
              </tr>

              {
                app.published_date && (
                  <tr class="border-b-1 border-b-gray-300">
                    <td class="p-2 font-bold">Published Date</td>
                    <td>{new Date(app.published_date).toLocaleString()}</td>
                  </tr>
                )
              }

              {
                app.updated_date && (
                  <tr class="border-b-1 border-b-gray-300">
                    <td class="p-2 font-bold">Updated Date</td>
                    <td>{new Date(app.updated_date).toLocaleString()}</td>
                  </tr>
                )
              }

              <tr class="border-b-1 border-b-gray-300">
                <td class="p-2 font-bold">{app.architectures.length > 1 ? "Architectures" : "Architecture"}</td>
                <td>{app.architectures.length > 0 ? app.architectures.join(", ") : "None"}</td>
              </tr>

              <tr class="border-b-1 border-b-gray-300">
                <td class="p-2 pr-4 font-bold whitespace-nowrap">Translation Languages</td>
                <td>{app.languages.length > 0 ? app.languages.join(", ") : "None"}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}

export default ManagePage;
