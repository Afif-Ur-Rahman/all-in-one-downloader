"use client";

import { useState } from "react";
import Link from "next/link";
import * as Popover from "@radix-ui/react-popover";
import { Menu, X } from "lucide-react";
import { Button } from "@/components";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/#home" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
];

export const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          icon={open ? <X /> : <Menu />}
        />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={16}
          aria-label="Main navigation"
          className={cn(
            "z-50 w-[min(16rem,calc(100vw-2rem))] origin-(--radix-popover-content-transform-origin) rounded-2xl border border-border bg-surface p-2 text-foreground shadow-soft outline-none",
            "data-[state=open]:animate-popover-in data-[state=closed]:animate-popover-out motion-reduce:animate-none",
          )}
        >
          <nav aria-label="Main" className="flex flex-col">
            {links.map((link) => (
              <Popover.Close asChild key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-muted transition-colors duration-200 hover:bg-accent-soft hover:text-accent"
                >
                  {link.label}
                </Link>
              </Popover.Close>
            ))}
          </nav>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
