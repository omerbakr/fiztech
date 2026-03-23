"use client";

import { ComponentProps } from "react";
import { ActionButton } from "../ui/action-button";

type BetterAuthActionButtonProps = Omit<
  ComponentProps<typeof ActionButton>,
  "action"
> & {
  action: () => Promise<{ error: null | { message?: string } }>;
  successMessage?: string;
};

const BetterAuthActionButton = ({
  action,
  successMessage,
  ...props
}: BetterAuthActionButtonProps) => {
  return (
    <ActionButton
      {...props}
      action={async () => {
        const res = await action();

        if (res.error) {
          return { error: true, message: res.error.message || "Action Failed" };
        } else {
          return { error: false, message: successMessage };
        }
      }}
    />
  );
};

export default BetterAuthActionButton;
