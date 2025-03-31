import type { AppManageData } from "@/lib/schema";
import { useCallback, useState } from "preact/hooks";
import SvgSpinner from "../icons/Spinner";
import type { JSX } from "preact/jsx-runtime";
import SvgCheck from "../icons/Check";
import SvgClose from "../icons/Close";
import { cn, getClientApiKey } from "@/lib/utils";
import SvgSave from "../icons/Save";

type RevisionFormProps = {
  app: AppManageData,
};

type FileState = {
  name: string;
  progress: number;
  error?: string;
  success: boolean;
};

function uploadFile(url: string, fileUploadData: FormData, progressCallback: (progress: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        progressCallback(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        resolve();
      }
      else {
        let errorBody: Record<string, unknown> = {};
        try {
          errorBody = JSON.parse(xhr.responseText);
        }
        catch (e) {}
        console.log(xhr.responseText, errorBody);

        let message = 'An unknown error has occurred';
        if (errorBody && typeof errorBody.message === 'string') {
          message = errorBody.message;
        }

        reject(message);
      }
    });

    xhr.addEventListener('error', () => reject('Network Error'));
    xhr.addEventListener('abort', () => reject('Upload Aborted'));

    xhr.open('POST', url);
    xhr.send(fileUploadData);
  });
}

const RevisionForm = ({ app }: RevisionFormProps) => {
  const [processing, setProcessing] = useState(false);
  const [files, setFiles] = useState<FileState[]>([]);

  const save = useCallback(async (e: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.currentTarget.reportValidity()) {
      setProcessing(true);

      const formData = new FormData(e.currentTarget);
      const changelog = formData.get('changelog');
      const formFiles = formData.getAll('files') as File[];

      setFiles(formFiles.map((formFile) => ({
        name: formFile.name,
        progress: 0,
        success: false,
      })));

      const url = `${import.meta.env.PUBLIC_API_URL}api/v3/manage/${app.id}/revision?apikey=${getClientApiKey()}`;
      let uploadedChangelog = false;
      for (const formFile of formFiles) {
        const fileUploadData = new FormData();
        fileUploadData.append('file', formFile, formFile.name);
        if (!uploadedChangelog && changelog) {
          fileUploadData.append('changelog', changelog);
          uploadedChangelog = true;
        }

        await uploadFile(url, fileUploadData, (progress) => {
          setFiles((files) => {
            return files.map((file) => {
              if (file.name === formFile.name) {
                return { ...file, progress }
              }

              return file;
            });
          });
        }).then(() => {
          setFiles((files) => {
            return files.map((file) => {
              if (file.name === formFile.name) {
                return { ...file, success: true }
              }

              return file;
            });
          });
        }).catch((error: string) => {
          setFiles((files) => {
            return files.map((file) => {
              if (file.name === formFile.name) {
                return { ...file, error }
              }

              return file;
            });
          });
        })
      }
    }
  }, []);

  if (processing) {
    const allFinished = files.every((file) => file.success || file.error);

    return (
      <section class="section space-y-4 h-full">
        {files.map((file) => (
            <div class={cn(
              'border-2 rounded flex px-6 py-4 gap-4',
              file.progress === 0 && 'bg-gray-400 border-gray-500',
              file.progress > 0 && !file.success && !file.error && 'bg-blue-400 border-blue-500',
              file.success && 'bg-green-400 border-green-500',
              file.error && 'bg-red-400 border-red-500',
            )}>
              {file.progress === 0 && <SvgSave class="rotate-180" />}
              {file.progress > 0 && !file.success && !file.error && <SvgSpinner class="animate-spin text-blue-600" />}
              {file.success && <SvgCheck class="text-green-600" />}
              {file.error && <SvgClose class="text-red-600" />}

              <div>
                <p>
                  {file.name}
                </p>
                {file.error && <p>{file.error}</p>}
              </div>
            </div>
        ))}

        {allFinished && (
          <button class="btn bg-ubuntu-orange text-white font-bold cursor-pointer" onClick={() => setProcessing(false)}>
            Return
          </button>
        )}
      </section>
    );
  }

  return (
    <form class="space-y-4 h-full" onSubmit={save}>
      <section class="section space-y-4">
        <div class="form-group">
          <label for="files" class="form-label">Click Files</label>
          <div class="w-full">
            <input
              type="file"
              id="files"
              name="files"
              accept=".click"
              required
              multiple
              class="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 file:cursor-pointer border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <p class="text-xs text-gray-500 text-right">
          More than one file can be uploaded at a time
        </p>
      </section>

      <div class="w-full h-[1px] bg-ubuntu-gradient rounded-full mx-auto max-w-6xl"></div>

      <section class="section space-y-4">
        <div class="form-group">
          <label for="changelog" class="form-label">Changelog</label>
          <textarea id="changelog" name="changelog" class="form-input" rows={4}></textarea>
        </div>

        <p class="text-xs text-gray-500 text-right">
          This will be added to the beginning of your current changelog
        </p>
      </section>

      <div class="w-full h-[1px] bg-ubuntu-gradient rounded-full mx-auto max-w-6xl"></div>

      <section class="section flex gap-4 items-center">
        <button type="submit" class="btn bg-ubuntu-orange text-white font-bold cursor-pointer">
          Upload
        </button>
      </section>
    </form>
  );
}

export default RevisionForm;
