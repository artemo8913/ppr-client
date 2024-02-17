"use server";

export async function authenticate(
  previousState?: "Invalid credentials." | "Something went wrong.",
  formData?: FormData
) {
  try {
    console.log(formData)
  } catch (error) {
    if (error) {
      switch (error) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
