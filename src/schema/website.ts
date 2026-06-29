import * as yup from "yup";

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const websiteCustomizationSchema = yup.object().shape({
  schoolIdentity: yup.object().shape({
    name: yup.string().trim().required("School name is required!"),
  }),
  theme: yup.object().shape({
    primaryColor: yup.string().trim().required("Primary colour is required!").matches(HEX_COLOR, "Enter a valid hex colour (e.g. #437dfc)"),
  }),
  hero: yup.object().shape({
    visible: yup.boolean(),
    headline: yup
      .string()
      .trim()
      .when("visible", {
        is: true,
        then: schema => schema.required("Headline is required when the hero is visible!"),
      }),
  }),
  contact: yup.object().shape({
    email: yup.string().trim().email("Enter a valid email address"),
  }),
});
