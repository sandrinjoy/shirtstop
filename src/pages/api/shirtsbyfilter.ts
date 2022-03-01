import type { NextApiHandler } from "next";
// import shirts from "./../../../public/data/mytra_minified.json";
// import shirts from "./../../../public/data/men_shirt.json";
import shirts from "./../../../public/data/pink_shirts.json";
const shirtsHandler: NextApiHandler = async (request, response) => {
  const { filter, from, sorting, search } = JSON.parse(request.body);
  const count = 9;
  let sorted = shirts;

  if (filter !== "All") {
    sorted = sorted.filter((x) => x.gender === filter);
  }
  if (sorting === "low") {
    sorted = sorted.sort((a, b) => a.price - b.price);
  } else if (sorting === "high") {
    sorted = sorted.sort((a, b) => a.price - b.price);
    sorted = sorted.reverse();
  } else if (sorting === "default") {
    sorted = sorted.sort((a, b) => a.ratingCount - b.ratingCount);
    sorted = sorted.reverse();
  }
  if (search !== "") {
    sorted = sorted.filter((x) => {
      if (
        x.brand.toLowerCase().includes(search) ||
        x.productName.toLowerCase().includes(search) ||
        x.additionalInfo.toLowerCase().includes(search)
      )
        return true;
    });
  }

  response.json(JSON.stringify(sorted.slice(from, from + count)));
};
export default shirtsHandler;
