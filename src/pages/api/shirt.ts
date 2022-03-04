import type { NextApiHandler } from "next";
// import shirts from "./../../../public/data/mytra_minified.json";
// import shirts from "./../../../public/data/men_shirt.json";
import shirts from "../../../public/data/pink_shirts.json";
const shirtsHandler: NextApiHandler = async (request, response) => {
  const { filter, from, sorting } = JSON.parse(request.body);
  const count = 9;
  let sorted = shirts;
  if (filter !== "All") {
    sorted = shirts.filter((shirt) => shirt.gender === filter);
  }
  if (sorting !== "default") {
    sorted = sorted.sort((a, b) => a.price - b.price);
    if (sorting === "high") {
      sorted = sorted.reverse();
    }
  }

  response.json(JSON.stringify(sorted.slice(from, from + count)));
};
export default shirtsHandler;
