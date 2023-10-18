import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

type LoadingProps = {
  className?: string;
  full?: boolean;
  screen?: boolean;
};

export function Loading({ className, full, screen }: LoadingProps) {
  return (
    <>
      {full ? (
        <div className="flex justify-center items-center w-full h-full">
          <Loader2Icon className={cn("animate-spin", className)}></Loader2Icon>
        </div>
      ) : screen ? (
        <div className="flex justify-center items-center min-w-screen min-h-screen">
          <Loader2Icon className={cn("animate-spin", className)}></Loader2Icon>
        </div>
      ) : (
        <Loader2Icon className={cn("animate-spin", className)}></Loader2Icon>
      )}
      <span className="sr-only">Loading</span>
    </>
  );
}
