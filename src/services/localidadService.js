import { getGeneric } from "./genericService";

export const getLocalidades = async () => {
  return await getGeneric("/localidades");
};
