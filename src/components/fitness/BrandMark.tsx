import { brand } from "@/lib/brand";
import { Dumbbell } from "lucide-react";

export function BrandMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = { sm: "h-8 w-8", md: "h-12 w-12", lg: "h-16 w-16" };
  const textClasses = { sm: "text-sm", md: "text-lg", lg: "text-2xl" };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${sizeClasses[size]} flex items-center justify-center rounded-xl bg-brand-accent`}>
        <Dumbbell className="h-2/3 w-2/3 text-white" />
      </div>
      <span className={`${textClasses[size]} font-bold text-white`}>
        {brand.productName}
      </span>
    </div>
  );
}
