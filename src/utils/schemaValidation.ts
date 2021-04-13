import * as yup from 'yup'

export const userSchema = yup.object().shape({
  name: yup.string().required(),
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  biography: yup.string(),
})