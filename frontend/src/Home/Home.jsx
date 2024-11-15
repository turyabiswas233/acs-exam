import { useEffect } from "react"; 
import Banner from "../components/Banner";
import StaticData from "../partial/StaticData";

function App() {
  const checkApi = async () => {
    const url = import.meta.env.APP_URL;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    return () => checkApi();
  }, []);
  return (
    <div className="min-h-screen py-20 px-2">
      <div className="flex flex-col gap-4 md:flex-row items-start mb-20">
        <Banner />
        <StaticData />
      </div>
      {/* <Transaction /> */}
    </div>
  );
}

export default App;
