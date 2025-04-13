import SvgNavigationMenu from "../icons/NavigationMenu";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

const ManageMenu = ({ id }: { id: string }) => {
  const baseUrl = `/manage/${id}/`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" class="py-1 px-2 cursor-pointer">
          <SvgNavigationMenu class="!h-6 !w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild><a href={baseUrl} className="cursor-pointer">Edit</a></DropdownMenuItem>
        <DropdownMenuItem asChild><a href={`${baseUrl}revision/`} className="cursor-pointer">New Revision</a></DropdownMenuItem>
        <DropdownMenuItem asChild><a href={`${baseUrl}stats/`} className="cursor-pointer">Stats</a></DropdownMenuItem>
        <DropdownMenuItem asChild><a href={`${baseUrl}badge/`} className="cursor-pointer">Badge</a></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ManageMenu;
