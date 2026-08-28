import Image from "next/image";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";


export default function Home() {
  return (
    <main>
      <Header/>
      <Sidebar/>

      <h1>MiniPOS</h1>
    </main>
  );
}
