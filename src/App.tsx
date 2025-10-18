import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";

export const App = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-gray-100">
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <Textarea placeholder="Type your message here." className="bg-white" />
        <div className="flex justify-end">
          <Button variant="outline">Send</Button>
        </div>
      </div>
    </div>
  );
};
