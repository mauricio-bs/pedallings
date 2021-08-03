import * as yup from 'yup'

const schema = yup.object().shape({
  name: yup.string().required(),
  age: yup.number().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
})

export default schema
