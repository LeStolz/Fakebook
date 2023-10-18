import { useState } from "react";
import { Input } from "./Input";

export function InputPlaceholder({ ...props }) {
  const [focused, setFocused] = useState(false);
  const type = props.type || "text";

  return (
    <Input
      {...props}
      type={focused ? type : "text"}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}
