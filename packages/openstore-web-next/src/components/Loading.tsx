import SvgSpinner from "./icons/Spinner";

const Loading = () => {
  return (
    <div class="h-full flex flex-col justify-center">
      <SvgSpinner class="animate-spin w-12 h-12 text-ubuntu-purple mx-auto" />
    </div>
  );
}

export default Loading;
