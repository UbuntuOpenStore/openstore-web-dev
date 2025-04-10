import SvgGoNext from "./icons/GoNext";
import SvgGoPrevious from "./icons/GoPrevious";

function formatPage(page: number) {
  return page + 1;
}

function buttonTitle(page: number) {
  return `Go to page ${formatPage(page)}`;
}

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChanged: (page: number) => void;
  messages: {
    previous: string,
    next: string,
  }
};

const Pagination = ({ currentPage, totalPages, onPageChanged, messages }: Props) => {
  return (
    <div class="flex gap-4 justify-center">
      <button disabled={currentPage <= 0} class={`${currentPage <= 0 ? 'text-gray-400' : 'cursor-pointer'}`} onClick={() => onPageChanged(currentPage - 1)} title={messages.previous}>
        <SvgGoPrevious />
      </button>

      {currentPage >= 3 && (<span class="text-gray-600 mt-1">...</span>)}

      {currentPage >= 2 && (<button class="pagination-btn" title={buttonTitle(currentPage - 2)} onClick={() => onPageChanged(currentPage - 2)}>{formatPage(currentPage - 2)}</button>)}
      {currentPage >= 1 && (<button class="pagination-btn" title={buttonTitle(currentPage - 1)} onClick={() => onPageChanged(currentPage - 1)}>{formatPage(currentPage - 1)}</button>)}
      <button class="pagination-btn bg-white text-black" title={buttonTitle(currentPage)} onClick={() => onPageChanged(currentPage)}>{formatPage(currentPage)}</button>
      {currentPage >= 0 && (totalPages - currentPage) >= 1 && (<button class="pagination-btn" title={buttonTitle(currentPage + 1)} onClick={() => onPageChanged(currentPage + 1)}>{formatPage(currentPage + 1)}</button>)}
      {currentPage >= 0 && (totalPages - currentPage) >= 2 && (<button class="pagination-btn" title={buttonTitle(currentPage + 2)} onClick={() => onPageChanged(currentPage + 2)}>{formatPage(currentPage + 2)}</button>)}

      {currentPage >= 0 && (totalPages - currentPage) >= 3 && (<span class="text-gray-600 mt-1">...</span>)}

      <button disabled={currentPage >= totalPages} class={`${currentPage >= totalPages ? 'text-gray-400' : 'cursor-pointer'}`} onClick={() => onPageChanged(currentPage + 1)} title={messages.next}>
        <SvgGoNext />
      </button>
    </div>
  );
};

export default Pagination;
