import type { AppManageData, UserData } from "@/lib/schema";
import { Switch } from "../ui/switch";
import { APP_TYPE_OPTIONS, CATEGORIES, LICENSES } from "@/lib/constants";
import SortableScreenshots from "../SortableScreenshots";
import { useCallback, useState } from "preact/hooks";
import SvgSpinner from "../icons/Spinner";
import type { JSX } from "preact/jsx-runtime";
import SvgCheck from "../icons/Check";
import SvgClose from "../icons/Close";
import { getClientApiKey } from "@/lib/utils";

type ManageAppFormProps = {
  user: UserData,
  app: AppManageData,
  maintainers: (UserData & { display_name: string })[],
};

const ManageAppForm = ({ user, app, maintainers }: ManageAppFormProps) => {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const save = useCallback(async (e: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.currentTarget.reportValidity()) {
      setSaving(true);
      setSuccess(false);
      setError('');

      const formData = new FormData(e.currentTarget);
      const entries = Array.from(formData.entries());

      const newFormData = new FormData();
      let screenshotFileCount = 0;
      for (const [key, value] of entries) {
        if (key === 'screenshot_files') {
          if (screenshotFileCount < 5) {
            screenshotFileCount++;
            newFormData.append(key, value);
          }
        }
        else {
          newFormData.append(key, value);
        }
      }

      const response = await fetch(`${import.meta.env.PUBLIC_API_URL}api/v3/manage/${app.id}?apikey=${getClientApiKey()}`, {
        method: "PUT",
        body: newFormData,
      });

      if (response.ok) {
        setSuccess(true);

        // Refresh the page to update everything. Since some of the state is outside of this component, this is just simplest
        location.reload();

        // TODO make sure the let the user know that it was successful (maybe via a toast message? use a query param for this)
      }
      else {
        const errorBody = await response.json()
        let message = 'An unknown error has occurred';
        if (errorBody && typeof errorBody.message === 'string') {
          message = errorBody.message;
        }

        setError(message);
      }

      setSaving(false);
    }
  }, []);

  return (
    <form class="space-y-4" onSubmit={save}>
      <section class="section space-y-4">
        <div class="form-group">
          <label for="published" class="form-label">Published</label>
          <Switch id="published" name="published" defaultChecked={app.published} />
        </div>
      </section>

      <div class="w-full h-[1px] bg-ubuntu-gradient rounded-full mx-auto max-w-6xl"></div>

      <section class="section space-y-4">
        <h2 class="text-2xl">Presentation</h2>

        <div class="form-group">
          <label for="name" class="form-label">Title</label>
          <input id="name" name="name" type="text" value={app.name} required class="form-input" />
        </div>

        <div class="form-group">
          <label for="license" class="form-label">License</label>
          <select id="license" name="license" class="form-input">
            <option value="">License</option>
            {LICENSES.map((license) => (
              <option value={license} selected={app.license === license}>{license}</option>
            ))}
          </select>
        </div>

        <div class="form-group">
          <label for="tagline" class="form-label">Tag Line</label>
          <input id="tagline" name="tagline" type="text" value={app.tagline} required class="form-input" />
        </div>

        <div class="form-group">
          <label for="description" class="form-label">Description</label>
          <textarea id="description" name="description" required class="form-input" rows={4}>{app.description}</textarea>
        </div>

        <div class="form-group">
          <label for="changelog" class="form-label">Changelog</label>
          <textarea id="changelog" name="changelog" class="form-input" rows={4}>{app.changelog}</textarea>
        </div>

        <div class="form-group">
          <label for="screenshot_files" class="form-label">Screenshots (Limit 5)</label>
          <div class="w-full">
            <input
              type="file"
              id="screenshot_files"
              name="screenshot_files"
              accept="image/*"
              multiple
              disabled={app.screenshots.length >= 5}
              class="mb-4 w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 file:cursor-pointer border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <SortableScreenshots screenshots={app.screenshots} />
          </div>
        </div>
      </section>

      <div class="w-full h-[1px] bg-ubuntu-gradient rounded-full mx-auto max-w-6xl"></div>

      <section class="section space-y-2">
        <h2 class="text-2xl">Discovery</h2>

        <div class="form-group">
          <label for="category" class="form-label">Category</label>
          <select id="category" name="category" class="form-input">
            <option value="">Category</option>
            {CATEGORIES.map((category) => (
              <option value={category} selected={app.category === category}>{category}</option>
            ))}
          </select>
        </div>

        <div class="form-group">
          <label for="keywords" class="form-label">Keywords</label>
          <input id="keywords" name="keywords" type="text" value={app.keywords.join(", ")} class="form-input" />
        </div>

        <div class="form-group">
          <label for="nsfw" class="form-label">NSFW</label>
          <input id="nsfw" name="nsfw" type="checkbox" checked={app.nsfw} class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500" />
          <p class="mt-1 text-xs text-gray-500">
            This app contains NSFW (Not Safe For Work) material
          </p>
        </div>
      </section>

      <div class="w-full h-[1px] bg-ubuntu-gradient rounded-full mx-auto max-w-6xl"></div>

      <section class="section space-y-2">
        <h2 class="text-2xl">Links</h2>

        <div class="form-group">
          <label for="source" class="form-label">Source URL</label>
          <input id="source" name="source" type="text" value={app.source} class="form-input" />
        </div>

        <div class="form-group">
          <label for="support_url" class="form-label">Support URL</label>
          <input id="support_url" name="support_url" type="text" value={app.support_url} class="form-input" />
        </div>

        <div class="form-group">
          <label for="donate_url" class="form-label">Donate URL</label>
          <input id="donate_url" name="donate_url" type="text" value={app.donate_url} class="form-input" />
        </div>

        <div class="form-group">
          <label for="video_url" class="form-label">Video URL</label>
          <input id="video_url" name="video_url" type="text" value={app.video_url} class="form-input" />
        </div>

        <p class="mt-1 text-xs text-gray-500 text-right">
          Only YouTube videos are supported at this time. Make sure the url is for the embedded video!
        </p>

        <div class="form-group">
          <label for="translation_url" class="form-label">Translation URL</label>
          <input id="translation_url" name="translation_url" type="text" value={app.translation_url} class="form-input" />
        </div>
      </section>

      <div class="w-full h-[1px] bg-ubuntu-gradient rounded-full mx-auto max-w-6xl"></div>

      {user.role === 'admin' && (
        <>
          <section class="section space-y-2">
            <h2 class="text-2xl">Admin</h2>

            <div class="form-group">
              <label for="locked" class="form-label">Locked</label>
              <Switch id="locked" name="locked" defaultChecked={app.locked} />
            </div>

            <div class="form-group">
              <label for="maintainer" class="form-label">Maintainer</label>
              <select id="maintainer" name="maintainer" class="form-input">
                <option value="">Maintainer</option>
                {maintainers.map((maintainer) => (
                  <option value={maintainer._id} selected={app.maintainer === maintainer._id}>{maintainer.display_name}</option>
                ))}
              </select>
            </div>

            <div class="form-group">
              <label for="type_override" class="form-label">Type Override</label>
              <select id="type_override" name="type_override" class="form-input">
                <option value="">None</option>
                {APP_TYPE_OPTIONS.map((type) => (
                  <option value={type.value} selected={app.type_override === type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Review Exceptions</label>

              {app.review_exceptions.length > 0 ? (
                <ul class="list-disc list-inside">
                  {app.review_exceptions.map((exception) => (
                    <li>{exception}</li>
                  ))}
                </ul>
              ) : (
                <span>None</span>
              )}
            </div>
          </section>

          <div class="w-full h-[1px] bg-ubuntu-gradient rounded-full mx-auto max-w-6xl"></div>
        </>
      )}

      <section class="section flex gap-4 items-center">
        <button type="submit" class="btn bg-ubuntu-orange text-white font-bold cursor-pointer" disabled={saving}>
          Save

          {saving && <SvgSpinner class="animate-spin ml-2" />}
        </button>

        {success && <SvgCheck class="text-green-500" />}

        {error && (
          <>
            <div class="bg-red-400 border-2 border-red-500 rounded flex px-6 py-4 gap-4">
              <SvgClose class="text-red-600" />
              <div>
                Failed to update your app:
                <p>
                  {error}
                </p>
              </div>
            </div>
          </>
        )}
      </section>
    </form>
  );
}

export default ManageAppForm;
