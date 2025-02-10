import { FC } from "react";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
} from "@/components/ui/command";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";

interface ComboBoxProps<T> {
	open: boolean;
	setOpen: (open: boolean) => void;
	selectedItem: T | null;
	setSelectedItem: (item: T | null) => void;
	items: T[];
	displayValue: (item: T) => string;
	displayLabel: (item: T) => string;
	buttonLabel: string;
}

export const StatusList = <T,>({
	setOpen,
	setSelectedItem,
	items,
	displayValue,
	displayLabel,
}: {
	setOpen: (open: boolean) => void;
	setSelectedItem: (item: T | null) => void;
	items: T[];
	displayValue: (item: T) => string;
	displayLabel: (item: T) => string;
}) => {
	return (
		<Command>
			<CommandInput placeholder="Nro de resultados..." />
			<CommandList>
				<CommandEmpty>No se encontraron resultados</CommandEmpty>
				<CommandGroup>
					{items.map((item) => (
						<CommandItem
							className="text-sm text-secondary-foreground"
							key={displayValue(item)}
							value={displayValue(item)}
							onSelect={() => {
								setSelectedItem(item);
								setOpen(false);
							}}
						>
							{displayLabel(item)}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
};

export const ComboBox: FC<ComboBoxProps<any>> = ({
	open,
	setOpen,
	selectedItem,
	setSelectedItem,
	items,
	displayValue,
	displayLabel,
	buttonLabel,
}) => {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	return (
		<>
			{isDesktop ? (
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="secondary"
							role="combobox"
							aria-expanded={open}
							className={cn(
								"w-auto justify-between bg-accent",
								!selectedItem && "text-muted-foreground"
							)}
						>
							{selectedItem ? displayLabel(selectedItem) : buttonLabel}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[300px] p-0" align="start">
						<StatusList
							setOpen={setOpen}
							setSelectedItem={setSelectedItem}
							items={items}
							displayValue={displayValue}
							displayLabel={displayLabel}
						/>
					</PopoverContent>
				</Popover>
			) : (
				<Drawer open={open} onOpenChange={setOpen}>
					<DrawerTrigger asChild>
						<Button variant="secondary" className={cn(
								"w-auto justify-between bg-accent",
								!selectedItem && "text-muted-foreground"
							)}>
							{selectedItem ? displayLabel(selectedItem) : buttonLabel}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<div className="mt-4 border-t">
							<StatusList
								setOpen={setOpen}
								setSelectedItem={setSelectedItem}
								items={items}
								displayValue={displayValue}
								displayLabel={displayLabel}
							/>
						</div>
					</DrawerContent>
				</Drawer>
			)}
		</>
	);
};
