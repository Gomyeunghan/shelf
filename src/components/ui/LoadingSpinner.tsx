"use client";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[50vh]">
      <div className="size-8 rounded-full border-2 border-muted border-t-foreground animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
