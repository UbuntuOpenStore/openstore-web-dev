import { useCallback, useState } from "preact/hooks";
import SvgSpinner from "../icons/Spinner";
import type { JSX } from "preact/jsx-runtime";
import SvgCheck from "../icons/Check";
import SvgClose from "../icons/Close";
import { getClientApiKey, getRelativeLocaleUrl } from "@/lib/utils";

const SubmitAppForm = ({ currentLocale }: { currentLocale: string | undefined }) => {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const apikey = getClientApiKey();
  const save = useCallback(async (e: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.currentTarget.reportValidity()) {
      setSaving(true);
      setSuccess(false);
      setError('');

      const formData = new FormData(e.currentTarget);
      const response = await fetch(`${import.meta.env.PUBLIC_API_URL}api/v3/manage/?apikey=${apikey}`, {
        method: "POST",
        body: JSON.stringify({
          id: formData.get('id'),
          name: formData.get('name'),
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setSuccess(true);

        location.pathname = `/manage/${formData.get('id')}`;
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

  if (!apikey) {
    return (
      <p>
        <a href={getRelativeLocaleUrl(currentLocale, "/login/")} class="underline">You must be logged in to submit your app.</a>
      </p>
    );
  }

  return (
    <form class="space-y-4" onSubmit={save}>
      <h2 class="text-2xl">Submit App</h2>

      <section class="section space-y-4">
        <div class="form-group">
          <label for="id" class="form-label">App Name</label>
          <input id="id" name="id" type="text" required class="form-input" />
        </div>

        <div class="flex flex-row-reverse">
          <p class="text-xs text-gray-500 text-right max-w-3/4">
            This is the unique identifier for your app. It must match exactly the "name" field in your click's manifest.json and must be all
            lowercase letters. For example: "openstore.openstore-team", where "openstore" is the app and "openstore-team" is the group or
            individual authoring the app.
          </p>
        </div>

        <div class="form-group">
          <label for="name" class="form-label">App Title</label>
          <input id="name" name="name" type="text" required class="form-input" />
        </div>
      </section>

      <div class="w-full h-[1px] bg-ubuntu-gradient rounded-full mx-auto max-w-6xl"></div>

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

export default SubmitAppForm;
