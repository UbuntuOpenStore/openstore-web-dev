import SvgGoNext from "./icons/GoNext";
import SvgGoPrevious from "./icons/GoPrevious";

function formatPage(page: number) {
  return page + 1;
}

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChanged: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChanged }: Props) => {
  return (
    <div class="flex gap-4 justify-center">
      {/* TODO styling */}
      <button disabled={currentPage <= 0} onClick={() => onPageChanged(currentPage - 1)} title="Go back a page">
        <SvgGoPrevious />
      </button>

      {currentPage >= 3 && (<>...</>)}

      {currentPage >= 2 && (<button onClick={() => onPageChanged(currentPage - 2)}>{formatPage(currentPage - 2)}</button>)}
      {currentPage >= 1 && (<button onClick={() => onPageChanged(currentPage - 1)}>{formatPage(currentPage - 1)}</button>)}
      <button onClick={() => onPageChanged(currentPage)}>{formatPage(currentPage)}</button>
      {currentPage >= 0 && (totalPages - currentPage) >= 1 && (<button onClick={() => onPageChanged(currentPage + 1)}>{formatPage(currentPage + 1)}</button>)}
      {currentPage >= 0 && (totalPages - currentPage) >= 2 && (<button onClick={() => onPageChanged(currentPage + 2)}>{formatPage(currentPage + 2)}</button>)}

      {currentPage >= 0 && (totalPages - currentPage) >= 3 && (<>...</>)}

      <button disabled={currentPage >= totalPages} onClick={() => onPageChanged(currentPage + 1)} title="Go to the next page">
        <SvgGoNext />
      </button>
    </div>
  );
};

export default Pagination;
