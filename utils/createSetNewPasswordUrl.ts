import config from "../config";

export const createSetNewPasswordUrl = (email: string, token: string) => {
  return `${config.get(
    "WEBSITE_URL"
  )}/user/setNewPassword?email=${email}&token=${token}`;
};
