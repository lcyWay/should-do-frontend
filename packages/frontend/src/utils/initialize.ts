import cookies from "nookies";
import jwtDecode from "jwt-decode";
import { GetServerSidePropsContext } from "next";

import { apiBeba } from "api";

import { UserType } from "types";

interface initializeInterface {
  user: null | UserType;
}

export async function initialize(context: GetServerSidePropsContext): Promise<initializeInterface> {
  const { userdata } = cookies.get(context);
  if (!userdata) return { user: null };

  const state: { email: string; password: string } = jwtDecode(userdata);
  if (typeof state !== "object" || state === null || !state.email || !state.password) {
    cookies.destroy(context, "userdate");
    return { user: null };
  }

  const user = await apiBeba("login", state);
  return { user: user || null };
}
