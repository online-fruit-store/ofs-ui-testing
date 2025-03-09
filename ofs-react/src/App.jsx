import Header from "./Header/Header";
import Main from "./Main/Main";
import Footer from "./Footer/Footer";
function App() {
  return (
    <div className="flex flex-col grow">
      <Header className="flex gap-10 p-5 shadow-md" />
      <Main className="grow " />
      <Footer className="" />
    </div>
  );
}

export default App;
