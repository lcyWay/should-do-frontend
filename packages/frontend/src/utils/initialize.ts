import cookies from "nookies";
import jsonwebtoken from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";

import { apiNextServer } from "api";

import { UserType } from "types";

const NULLABLE_USER = { user: null };

interface initializeInterface {
  user: null | UserType;
}

export async function initialize(context: GetServerSidePropsContext): Promise<initializeInterface> {
  const { userdata } = cookies.get(context);
  if (!userdata) return NULLABLE_USER;

  const decodeData = jsonwebtoken.decode(userdata);
  if (!decodeData) return NULLABLE_USER;

  const state = decodeData as { email: string; password: string };

  if (typeof state !== "object" || !state.email || !state.password) {
    cookies.destroy(context, "userdata");
    return NULLABLE_USER;
  }

  const user = await apiNextServer("login", state);
  if (!user || user.message_code === "001") {
    cookies.destroy(context, "userdata");
    return NULLABLE_USER;
  }

  return { user };
}
