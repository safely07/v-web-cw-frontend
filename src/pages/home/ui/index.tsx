import { ChatList } from "../../../widgets/chat-list";
import { ChatWindow } from "../../../widgets/chat-window";
import { Sidebar } from "../../../widgets/side-bar";

export const Home = () => {
  return (
    <div className="h-screen flex bg-[#1e1e1e] text-gray-100">
      <div className="w-[380px] border-r border-gray-700 flex flex-col bg-[#252526]">
        <Sidebar />
        <ChatList />
      </div>
      <div className="flex-1 flex flex-col">
        <ChatWindow />
      </div>
    </div>
  );
};