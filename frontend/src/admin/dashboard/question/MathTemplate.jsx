import Latex from "react-latex";
function MathTemplate({ tex, image, options }) {
  return (
    <div className="text-xl border-black border-2 p-2 rounded-md m-2 bangla-font">
      {image && (
        <img
          className="mb-5 object-contain w-auto max-w-48 aspect-auto rounded-md bg-pink-600 overflow-hidden"
          src={URL.createObjectURL(image)}
        />
      )}
      <p className="poppins-medium">
        <Latex
          children={`${tex
            ?.replaceAll("<math>", "$")
            ?.replaceAll("<\\/math>", "$")}`}
        />
      </p>

      <div className="opt-list my-3">
        {/* {options?.map((opt, id) => { 
          return (
            <p
              key={id}
              className="rounded-full px-4 py-2 bg-slate-100 text-slate-950 my-1 hover:bg-slate-200 transition-colors text-base"
            >
              {opt.length > 0 && (
                <Latex children={`$${optionListKey(id)}\\ ${opt?.value}$`} />
              )}
            </p>
          );
        })} */}
      </div>
    </div>
  );
}
function optionListKey(id) {
  let x = "";
  switch (id) {
    case 0:
      x = "a";
      break;
    case 1:
      x = "b";
      break;
    case 2:
      x = "c";
      break;
    case 3:
      x = "d";
      break;
  }
  return `(${x})`;
}
export default MathTemplate;
