import SvgGoNext from "../icons/GoNext";
import SvgGoPrevious from "../icons/GoPrevious";

function formatPage(page: number) {
  return page + 1;
}

function buttonTitle(page: number) {
  return `Go to page ${formatPage(page)}`;
}

type Props = {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
};

const StaticPagination = ({ currentPage, totalPages, baseUrl }: Props) => {
  function makeUrl(page: number) {
    if (baseUrl.includes('?')) {
      return `${baseUrl}&page=${page}`;
    }

    return `${baseUrl}?page=${page}`;
  }

  return (
    <div class="flex gap-4 justify-center">
      <a class={`${currentPage <= 0 ? 'text-gray-400' : 'cursor-pointer'}`} href={makeUrl(currentPage - 1)} title="Go back a page">
        <SvgGoPrevious />
      </a>

      {currentPage >= 3 && (<span class="text-gray-600 mt-1">...</span>)}

      {currentPage >= 2 && (<a class="pagination-btn" title={buttonTitle(currentPage - 2)} href={makeUrl(currentPage - 2)}>{formatPage(currentPage - 2)}</a>)}
      {currentPage >= 1 && (<a class="pagination-btn" title={buttonTitle(currentPage - 1)} href={makeUrl(currentPage - 1)}>{formatPage(currentPage - 1)}</a>)}
      <a class="pagination-btn bg-white text-black" title={buttonTitle(currentPage)} href={makeUrl(currentPage)}>{formatPage(currentPage)}</a>
      {currentPage >= 0 && (totalPages - currentPage) >= 1 && (<a class="pagination-btn" title={buttonTitle(currentPage + 1)} href={makeUrl(currentPage + 1)}>{formatPage(currentPage + 1)}</a>)}
      {currentPage >= 0 && (totalPages - currentPage) >= 2 && (<a class="pagination-btn" title={buttonTitle(currentPage + 2)} href={makeUrl(currentPage + 2)}>{formatPage(currentPage + 2)}</a>)}

      {currentPage >= 0 && (totalPages - currentPage) >= 3 && (<span class="text-gray-600 mt-1">...</span>)}

      <a class={`${currentPage >= totalPages ? 'text-gray-400' : 'cursor-pointer'}`} href={makeUrl(currentPage + 1)} title="Go to the next page">
        <SvgGoNext />
      </a>
    </div>
  );
};

export default StaticPagination;
