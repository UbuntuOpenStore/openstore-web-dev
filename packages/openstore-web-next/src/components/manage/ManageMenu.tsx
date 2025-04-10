import SvgNavigationMenu from "../icons/NavigationMenu";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

const ManageMenu = ({ id }: { id: string }) => {
  const baseUrl = `/manage/${id}/`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" class="py-1 px-2">
          <SvgNavigationMenu class="!h-6 !w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild><a href={baseUrl}>Edit</a></DropdownMenuItem>
        <DropdownMenuItem asChild><a href={`${baseUrl}revision/`}>New Revision</a></DropdownMenuItem>
        <DropdownMenuItem asChild><a href={`${baseUrl}stats/`}>Stats</a></DropdownMenuItem>
        <DropdownMenuItem asChild><a href={`${baseUrl}badge/`}>Badge</a></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ManageMenu;
