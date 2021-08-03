import * as yup from 'yup'

const schema = yup.object().shape({
  name: yup.string().required(),
  start_date: yup.date().required(),
  registration_start_date: yup.date().required(),
  registration_end_date: yup.date().required(),
  additional_information: yup.string(),
  start_place: yup.string().required(),
  participants_limit: yup.number(),
})

export default schema
