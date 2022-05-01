export default () => (
  <div
    className={
      "w-full h-full flex rounded-xl " +
      "bg-gradient-to-tr from-red-700 via-green-400 to-purple-700"
    }
  >
    <div className="m-auto p-4 hover:hidden">
      <h1 className="font-bold text-white text-8xl select-none">HOVER ME</h1>
    </div>
  </div>
);
