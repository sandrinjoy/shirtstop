import type { NextApiHandler } from "next";
// import shirts from "./../../../public/data/mytra_minified.json";
// import shirts from "./../../../public/data/men_shirt.json";
import shirts from "./../../../public/data/pink_shirts.json";
const shirtsHandler: NextApiHandler = async (request, response) => {
  const { from } = JSON.parse(request.body);
  const count = 9;
  response.json(JSON.stringify(shirts.slice(from, from + count)));
};
export default shirtsHandler;
