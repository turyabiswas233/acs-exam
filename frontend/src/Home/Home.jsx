import Transaction from "../Transaction";
import Banner from "../components/Banner";
import StaticData from "../partial/StaticData";

function App() {
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
