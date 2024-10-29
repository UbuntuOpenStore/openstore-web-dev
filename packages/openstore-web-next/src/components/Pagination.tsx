import goNext from "@/assets/icons/go-next.svg?raw";
import goPrevious from "@/assets/icons/go-previous.svg?raw";

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
      <button disabled={currentPage <= 0} onClick={() => onPageChanged(currentPage - 1)} dangerouslySetInnerHTML={{ __html: goPrevious }} title="Go back a page"></button>

      {currentPage >= 3 && (<>...</>)}

      {currentPage >= 2 && (<button onClick={() => onPageChanged(currentPage - 2)}>{formatPage(currentPage - 2)}</button>)}
      {currentPage >= 1 && (<button onClick={() => onPageChanged(currentPage - 1)}>{formatPage(currentPage - 1)}</button>)}
      <button onClick={() => onPageChanged(currentPage)}>{formatPage(currentPage)}</button>
      {currentPage >= 0 && (totalPages - currentPage) >= 1 && (<button onClick={() => onPageChanged(currentPage + 1)}>{formatPage(currentPage + 1)}</button>)}
      {currentPage >= 0 && (totalPages - currentPage) >= 2 && (<button onClick={() => onPageChanged(currentPage + 2)}>{formatPage(currentPage + 2)}</button>)}

      {currentPage >= 0 && (totalPages - currentPage) >= 3 && (<>...</>)}

      <button disabled={currentPage >= totalPages} onClick={() => onPageChanged(currentPage + 1)} dangerouslySetInnerHTML={{ __html: goNext }} title="Go to the next page"></button>
    </div>
  );
};

export default Pagination;
