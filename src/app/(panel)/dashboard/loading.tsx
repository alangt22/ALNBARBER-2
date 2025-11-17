
import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader className="animate-spin text-blue-700" size={48} />
    </div>
  );
}
